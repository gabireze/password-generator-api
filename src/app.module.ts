import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [PasswordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
