import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService (Enterprise)', () => {
  let service: RecaptchaService;
  let httpService: HttpService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        RECAPTCHA_SITE_KEY: 'test-site-key',
        RECAPTCHA_API_KEY: 'test-api-key',
        RECAPTCHA_PROJECT_ID: 'test-project-id',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecaptchaService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
      imports: [],
    })
      .useMocker((token) => {
        if (token === HttpService) {
          return {
            post: jest.fn(),
          };
        }
      })
      .compile();

    service = module.get<RecaptchaService>(RecaptchaService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return true for valid token, correct action, and high score', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        tokenProperties: {
          valid: true,
          action: 'submit',
        },
        riskAnalysis: {
          score: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.verifyToken('test-token', 'submit');
    expect(result).toBe(true);
  });

  it('should return false if token is invalid', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        tokenProperties: {
          valid: false,
          action: 'submit',
        },
        riskAnalysis: {
          score: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.verifyToken('invalid-token', 'submit');
    expect(result).toBe(false);
  });

  it('should return false if score is too low', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        tokenProperties: {
          valid: true,
          action: 'submit',
        },
        riskAnalysis: {
          score: 0.1,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.verifyToken('low-score-token', 'submit');
    expect(result).toBe(false);
  });

  it('should return false if action does not match', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        tokenProperties: {
          valid: true,
          action: 'register',
        },
        riskAnalysis: {
          score: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.verifyToken('wrong-action-token', 'submit');
    expect(result).toBe(false);
  });

  it('should return false on API error', async () => {
    (httpService.post as jest.Mock).mockImplementation(() => {
      throw new Error('API error');
    });

    const result = await service.verifyToken('error-token', 'submit');
    expect(result).toBe(false);
  });
});
