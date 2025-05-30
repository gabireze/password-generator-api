import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [HttpModule],
  providers: [RecaptchaService],
  exports: [RecaptchaService],
})
export class RecaptchaModule {}
