import { Controller, Post, Body } from '@nestjs/common';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ChatService, ChatMessage } from './chat.service';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsArray()
  history?: ChatMessage[];
}

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() dto: SendMessageDto): Promise<ChatMessage> {
    return this.chatService.processMessage(dto.message, dto.history || []);
  }
}
