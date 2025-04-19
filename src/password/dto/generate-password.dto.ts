import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GeneratePasswordDto {
  // ✅ Required Fields

  @ApiProperty({
    type: Number,
    example: 16,
    description: 'Length of each password to generate (minimum 1 character).',
  })
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'Length must be an integer number.' })
  @Min(1, { message: 'Minimum length is 1.' })
  length: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Include uppercase letters (A–Z) in the password.',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Uppercase must be true or false.' })
  uppercase: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Include lowercase letters (a–z) in the password.',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Lowercase must be true or false.' })
  lowercase: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Include numeric digits (0–9) in the password.',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Numbers must be true or false.' })
  numbers: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Include special characters (e.g. !@#$%^&*) in the password.',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Symbols must be true or false.' })
  symbols: boolean;

  // ✅ Optional Fields

  @ApiPropertyOptional({
    type: String,
    example: 'lIO0',
    description: 'Characters to explicitly exclude from the password.',
  })
  @IsOptional()
  @IsString({ message: 'excludeChars must be a string.' })
  excludeChars?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 5,
    description: 'Number of passwords to generate (minimum 1).',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'Quantity must be an integer number.' })
  @Min(1, { message: 'Minimum quantity is 1.' })
  quantity?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'json',
    description:
      'Output format: `json`, `text`, `xml`, `csv`, `yaml`, or `html`.',
    enum: ['json', 'text', 'xml', 'csv', 'yaml', 'html'],
    default: 'json',
  })
  @IsOptional()
  @IsIn(['json', 'text', 'xml', 'csv', 'yaml', 'html'], {
    message: 'Format must be one of: json, text, xml, csv, yaml, or html.',
  })
  format?: 'json' | 'text' | 'xml' | 'csv' | 'yaml' | 'html';

  @ApiPropertyOptional({
    type: String,
    example: '\\n',
    description:
      'Separator between passwords when using text or csv format (e.g. newline, comma, semicolon).',
  })
  @IsOptional()
  @IsString({ message: 'Separator must be a string.' })
  separator?: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description:
      'Wrap each password in double quotes. Useful for formats like text, csv, or html.',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Quoted must be true or false.' })
  quoted?: boolean;

  // ✅ Required reCAPTCHA field

  @ApiProperty({
    type: String,
    example: '03AFcWeA5vmz0e...',
    description: 'reCAPTCHA token received from the frontend client.',
    writeOnly: true,
  })
  @IsString({ message: 'recaptchaToken must be a string.' })
  recaptchaToken: string;
}
