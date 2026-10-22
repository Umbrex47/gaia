import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ResendEmailService } from './resend-email.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ResendEmailService],
  exports: [ContactService, ResendEmailService],
})
export class ContactModule {}
