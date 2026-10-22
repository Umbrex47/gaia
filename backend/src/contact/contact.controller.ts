import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ContactService, CreateContactDto } from './contact.service';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  sendMessage(@Body() dto: CreateContactDto) {
    return this.contactService.saveMessage(dto);
  }

  @Get('faqs')
  getFaqs(@Query('category') category?: string) {
    return this.contactService.getFaqs(category);
  }
}
