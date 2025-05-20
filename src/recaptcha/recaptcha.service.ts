import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

interface RecaptchaEnterpriseAssessment {
  tokenProperties?: {
    valid?: boolean;
    action?: string;
    createTime?: string;
    hostname?: string;
    invalidReason?: string;
  };
  riskAnalysis?: {
    score?: number;
    reasons?: string[];
  };
  name?: string;
}

@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verifyToken(
    token: string,
    expectedAction = 'submit',
  ): Promise<boolean> {
    const siteKey = this.configService.get<string>('RECAPTCHA_SITE_KEY');
    const apiKey = this.configService.get<string>('RECAPTCHA_API_KEY');
    const projectId = this.configService.get<string>('RECAPTCHA_PROJECT_ID');

    if (!siteKey || !apiKey || !projectId) {
      this.logger.error('Missing required reCAPTCHA environment configuration');
      return false;
    }

    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

    const requestBody = {
      event: {
        token,
        siteKey,
        expectedAction,
      },
    };

    try {
      const response: AxiosResponse<RecaptchaEnterpriseAssessment> =
        await firstValueFrom(
          this.httpService.post<RecaptchaEnterpriseAssessment>(
            url,
            requestBody,
          ),
        );

      const assessment = response.data;
      const isValid = assessment.tokenProperties?.valid === true;
      const isExpectedAction =
        assessment.tokenProperties?.action === expectedAction;
      const score = assessment.riskAnalysis?.score ?? 0;

      return isValid && isExpectedAction && score >= 0.5;
    } catch (error) {
      this.logger.error(
        'Failed to verify reCAPTCHA token',
        error?.response?.data || error.message,
      );
      return false;
    }
  }
}
