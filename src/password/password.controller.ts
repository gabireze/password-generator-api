import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { dump as yamlDump } from 'js-yaml';
import { create } from 'xmlbuilder2';

import { GeneratePasswordDto } from './dto/generate-password.dto';
import { PasswordService } from './password.service';

@ApiTags('Passwords')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('generate')
  @ApiBody({
    description: 'Password generation options',
    type: GeneratePasswordDto,
    examples: {
      json: {
        summary: 'JSON response (default)',
        value: {
          length: 12,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: true,
          quantity: 3,
          format: 'json',
          recaptchaToken: '03AFcWeA5vmz0e...',
        },
      },
      text: {
        summary: 'Plain text response',
        value: {
          length: 16,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: true,
          format: 'text',
          separator: '\n',
          quoted: true,
          recaptchaToken: '03AFcWeA5vmz0e...',
        },
      },
      xml: {
        summary: 'XML response',
        value: {
          length: 10,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: false,
          format: 'xml',
          recaptchaToken: '03AFcWeA5vmz0e...',
        },
      },
      yaml: {
        summary: 'YAML response',
        value: {
          length: 8,
          uppercase: false,
          lowercase: true,
          numbers: true,
          symbols: false,
          format: 'yaml',
          recaptchaToken: '03AFcWeA5vmz0e...',
        },
      },
      csv: {
        summary: 'CSV response',
        value: {
          length: 10,
          uppercase: true,
          lowercase: true,
          numbers: true,
          symbols: false,
          format: 'csv',
          separator: ', ',
          quoted: true,
          recaptchaToken: '03AFcWeA5vmz0e...',
        },
      },
      html: {
        summary: 'HTML response',
        value: {
          length: 12,
          uppercase: true,
          lowercase: true,
          numbers: false,
          symbols: false,
          format: 'html',
          recaptchaToken: '03AFcWeA5vmz0e...',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'List of generated passwords in the requested format.',
    content: {
      'application/json': {
        example: {
          passwords: ['Ab#123xy', 'Gh@45Rt!'],
        },
      },
      'text/plain': {
        example: '"Ab#123xy"\n"Gh@45Rt!"',
      },
      'application/xml': {
        example: `<passwords>\n  <password>Ab#123xy</password>\n  <password>Gh@45Rt!</password>\n</passwords>`,
      },
      'text/csv': {
        example: '"Ab#123xy", "Gh@45Rt!"',
      },
      'text/yaml': {
        example: `passwords:\n  - Ab#123xy\n  - Gh@45Rt!`,
      },
      'text/html': {
        example: `<ul>\n  <li>"Ab#123xy"</li>\n  <li>"Gh@45Rt!"</li>\n</ul>`,
      },
    },
  })
  generate(@Body() dto: GeneratePasswordDto, @Res() res: Response): void {
    const passwords = this.passwordService.generate(dto);
    const format = dto.format ?? 'json';
    const sep = dto.separator ?? '\n';
    const quoted = dto.quoted ?? false;

    switch (format) {
      case 'text': {
        const data = passwords.map((p) => (quoted ? `"${p}"` : p)).join(sep);
        res.status(200).type('text/plain').send(data);
        break;
      }

      case 'xml': {
        const xml = create({ passwords: { password: passwords } }).end({
          prettyPrint: true,
        });
        res.status(200).type('application/xml').send(xml);
        break;
      }

      case 'csv': {
        const data = passwords.map((p) => (quoted ? `"${p}"` : p)).join(sep);
        res.status(200).type('text/csv').send(data);
        break;
      }

      case 'yaml': {
        const yaml = yamlDump({ passwords });
        res.status(200).type('text/yaml').send(yaml);
        break;
      }

      case 'html': {
        const html = `
          <html>
            <body>
              <ul>
                ${passwords
                  .map((p) => `<li>${quoted ? `&quot;${p}&quot;` : p}</li>`)
                  .join('\n')}
              </ul>
            </body>
          </html>
        `;
        res.status(200).type('text/html').send(html);
        break;
      }

      default: {
        res.status(200).json({ passwords });
      }
    }
  }
}
