import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

@Injectable()
export class RecaptchaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async verifyToken(
    token: string,
    expectedAction = 'submit',
  ): Promise<boolean> {
    const secret = this.config.get<string>('RECAPTCHA_SECRET_KEY') ?? '';
    const url = 'https://www.google.com/recaptcha/api/siteverify';

    const params = new URLSearchParams({
      secret,
      response: token,
    });

    const response$ = this.httpService.post<RecaptchaResponse>(
      url,
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const response =
      await firstValueFrom<AxiosResponse<RecaptchaResponse>>(response$);
    const data = response.data;

    return (
      data.success === true &&
      data.score >= 0.5 &&
      data.action === expectedAction
    );
  }
}
