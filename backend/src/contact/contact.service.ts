import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DataStoreService, ContactMessage } from '../database/data-store.service';
import { FaqItem } from '../database/seed.data';
import { ResendEmailService } from './resend-email.service';

export class CreateContactDto {
  name!: string;
  email!: string;
  phone?: string;
  farmSize?: string;
  cropType?: string;
  message!: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    private readonly resendEmailService: ResendEmailService,
  ) {}

  async saveMessage(dto: CreateContactDto): Promise<ContactMessage & { emailStatus?: any }> {
    if (!dto.name || !dto.email || !dto.message) {
      throw new BadRequestException('Por favor completa todos los campos obligatorios.');
    }

    const message: ContactMessage = {
      id: `contact-${Date.now()}`,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      farmSize: dto.farmSize,
      cropType: dto.cropType,
      message: dto.message,
      createdAt: new Date(),
    };

    const saved = this.dataStore.saveContactMessage(message);

    // Enviar notificación a través de Resend al correo preestablecido
    const emailResult = await this.resendEmailService.sendConsultationNotification(dto, saved.id);

    return {
      ...saved,
      emailStatus: emailResult,
    };
  }

  getFaqs(category?: string): FaqItem[] {
    return this.dataStore.getFaqs(category);
  }
}
