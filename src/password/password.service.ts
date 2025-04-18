import { Injectable } from '@nestjs/common';

import { GeneratePasswordDto } from './dto/generate-password.dto';
import { generatePassword } from './utils/password-generator';

@Injectable()
export class PasswordService {
  generate(dto: GeneratePasswordDto): string[] {
    const {
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
      excludeChars,
      quantity = 1,
    } = dto;

    const options = { uppercase, lowercase, numbers, symbols, excludeChars };
    return Array.from({ length: quantity }, () =>
      generatePassword(length, options),
    );
  }
}
