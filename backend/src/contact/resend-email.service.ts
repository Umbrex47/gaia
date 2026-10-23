import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { CreateContactDto } from './contact.service';
import { Order } from '../database/data-store.service';

@Injectable()
export class ResendEmailService {
  private readonly logger = new Logger(ResendEmailService.name);
  private resend: Resend | null = null;
  private apiKey: string | null = null;
  private fromEmail: string;
  private toEmail: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY?.trim() || null;
    this.fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'GaIA AgroTech <notificaciones@perte.design>';
    this.toEmail = process.env.RESEND_TO_EMAIL?.trim() || 'consultas@gaia-agritech.com';

    if (this.apiKey) {
      this.resend = new Resend(this.apiKey);
      this.logger.log(`📧 Resend Email Service inicializado. Remitente: ${this.fromEmail} | Destinatario: ${this.toEmail}`);
    } else {
      this.logger.warn(
        `⚠️ RESEND_API_KEY no detectada en .env. Los correos se registrarán en modo simulación (console log) hasta que configures tu API key de Resend.`
      );
    }
  }

  /**
   * Envía la información de la consulta al correo preestablecido usando Resend.
   */
  async sendConsultationNotification(dto: CreateContactDto, consultationId: string): Promise<{ success: boolean; id?: string; error?: string }> {
    const timestamp = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    const emailSubject = `🌿 Nueva Consulta de Finca: ${dto.name} (${dto.farmSize || 'Predio Agrícola'})`;

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #011d1c; color: #bbc7c6; margin: 0; padding: 24px; }
          .container { max-width: 620px; margin: 0 auto; background-color: #012624; border: 1px solid #003734; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #003734 0%, #011d1c 100%); padding: 32px 28px; text-align: center; border-bottom: 2px solid #00dfa2; }
          .title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.5px; }
          .subtitle { color: #70ffe5; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin: 0; }
          .body { padding: 28px; }
          .badge { display: inline-block; background: rgba(0, 223, 162, 0.15); color: #00dfa2; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 20px; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .data-table tr { border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
          .data-table td { padding: 12px 0; font-size: 14px; }
          .label { color: #889897; font-weight: 600; width: 38%; }
          .val { color: #ffffff; font-weight: 500; }
          .msg-box { background-color: #011d1c; border-left: 3px solid #00dfa2; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .msg-title { color: #70ffe5; font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0; }
          .msg-content { color: #edfffe; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line; }
          .footer { padding: 20px 28px; background-color: #011d1c; text-align: center; font-size: 12px; color: #707777; border-top: 1px solid rgba(255, 255, 255, 0.05); }
          .cta-btn { display: inline-block; background: linear-gradient(135deg, #00dfa2 0%, #70ffe5 100%); color: #012624; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 30px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">GaIA AgroTech — Solicitud de Consulta</h1>
            <p class="subtitle">Automatización Agrícola Inteligente & Agentes de IA</p>
          </div>
          <div class="body">
            <span class="badge">Nueva Solicitud #${consultationId}</span>
            <table class="data-table">
              <tr>
                <td class="label">Productor / Responsable:</td>
                <td class="val"><strong>${dto.name}</strong></td>
              </tr>
              <tr>
                <td class="label">Correo Electrónico:</td>
                <td class="val"><a href="mailto:${dto.email}" style="color: #70ffe5; text-decoration: none;">${dto.email}</a></td>
              </tr>
              <tr>
                <td class="label">Teléfono / WhatsApp:</td>
                <td class="val">${dto.phone || 'No especificado'}</td>
              </tr>
              <tr>
                <td class="label">Extensión del Predio:</td>
                <td class="val">${dto.farmSize || 'No especificado'}</td>
              </tr>
              <tr>
                <td class="label">Tipo de Cultivo / Variedad:</td>
                <td class="val">${dto.cropType || 'No especificado'}</td>
              </tr>
              <tr>
                <td class="label">Fecha y Hora de Recepción:</td>
                <td class="val">${timestamp}</td>
              </tr>
            </table>

            <div class="msg-box">
              <p class="msg-title">Desafíos de Campo y Mensaje del Productor:</p>
              <p class="msg-content">${dto.message}</p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${dto.email}?subject=Respuesta%20GaIA%20AgroTech%20a%20tu%20consulta%20de%20campo&body=Hola%20${encodeURIComponent(dto.name)},%0A%0AGracias%20por%20contactar%20a%20GaIA%20AgroTech.%20Hemos%20revisado%20los%20detalles%20de%20tu%20cultivo..." class="cta-btn">
                Responder al Productor
              </a>
            </div>
          </div>
          <div class="footer">
            Mensaje generado automáticamente por el sistema GaIA AgroTech SAS.<br>
            Notificación enviada a la casilla preestablecida: <strong>${this.toEmail}</strong>
          </div>
        </div>
      </body>
      </html>
    `;

    // Si Resend está configurado con API key
    if (this.resend) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: this.fromEmail,
          to: [this.toEmail],
          replyTo: dto.email,
          subject: emailSubject,
          html: emailHtml,
        });

        if (error) {
          this.logger.error(`❌ Error enviando correo con Resend: ${error.message}`, error);
          return { success: false, error: error.message };
        }

        this.logger.log(`✅ Correo de consulta enviado con éxito vía Resend! ID: ${data?.id} -> Destino: ${this.toEmail}`);
        return { success: true, id: data?.id };
      } catch (err: any) {
        this.logger.error(`❌ Excepción al comunicarse con la API de Resend: ${err.message}`, err);
        return { success: false, error: err.message };
      }
    } else {
      // Modo simulación cuando no se ha provisto RESEND_API_KEY
      this.logger.log(`[SIMULACIÓN RESEND] Consulta de ${dto.name} (${dto.email}) enviada simuladamente a ${this.toEmail}`);
      this.logger.log(`[SIMULACIÓN RESEND] Asunto: ${emailSubject}`);
      this.logger.log(`[SIMULACIÓN RESEND] Para activar envíos reales, define RESEND_API_KEY en backend/.env`);
      return { success: true, id: `sim-${Date.now()}` };
    }
  }

  /**
   * Envía la notificación de compra efectiva a nuestro correo preestablecido usando Resend.
   */
  async sendOrderNotification(order: Order): Promise<{ success: boolean; id?: string; error?: string }> {
    const timestamp = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    const emailSubject = `🛒 ¡Nueva Compra Exitosa en GaIA! Orden #${order.orderNumber} ($${order.total.toFixed(2)} USD)`;

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; color: #ffffff;">
          <strong>${item.name}</strong><br>
          <span style="font-size: 11px; color: #889897;">ID: ${item.productId}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; color: #edfffe; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; color: #edfffe; text-align: right;">
          $${item.price.toFixed(2)} USD
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; color: #70ffe5; font-weight: 600; text-align: right;">
          $${(item.price * item.quantity).toFixed(2)} USD
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #011d1c; color: #bbc7c6; margin: 0; padding: 24px; }
          .container { max-width: 640px; margin: 0 auto; background-color: #012624; border: 1px solid #003734; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #003734 0%, #011d1c 100%); padding: 32px 28px; text-align: center; border-bottom: 2px solid #00dfa2; }
          .title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.5px; }
          .subtitle { color: #70ffe5; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin: 0; }
          .body { padding: 28px; }
          .badge-order { display: inline-block; background: rgba(0, 223, 162, 0.2); color: #00dfa2; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; }
          .section-title { color: #ffffff; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 6px; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .data-table td { padding: 8px 0; font-size: 14px; }
          .label { color: #889897; font-weight: 600; width: 35%; }
          .val { color: #ffffff; font-weight: 500; }
          .items-table { width: 100%; border-collapse: collapse; margin: 12px 0 20px 0; }
          .items-table th { font-size: 11px; text-transform: uppercase; color: #889897; letter-spacing: 1px; padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
          .total-box { background-color: #011d1c; border: 1px solid #003734; border-radius: 12px; padding: 18px; margin-top: 16px; }
          .grand-total { font-size: 18px; font-weight: 700; color: #00dfa2; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 10px; margin-top: 10px; }
          .footer { padding: 20px 28px; background-color: #011d1c; text-align: center; font-size: 12px; color: #707777; border-top: 1px solid rgba(255, 255, 255, 0.05); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">GaIA AgroTech — Compra Exitosa</h1>
            <p class="subtitle">Notificación de Despacho & Pago Efectivo</p>
          </div>
          <div class="body">
            <span class="badge-order">Orden: ${order.orderNumber}</span>

            <p class="section-title">Datos del Productor / Comprador</p>
            <table class="data-table">
              <tr>
                <td class="label">Nombre del Cliente:</td>
                <td class="val"><strong>${order.customer.fullName}</strong></td>
              </tr>
              <tr>
                <td class="label">Correo Electrónico:</td>
                <td class="val"><a href="mailto:${order.customer.email}" style="color: #70ffe5; text-decoration: none;">${order.customer.email}</a></td>
              </tr>
              <tr>
                <td class="label">Teléfono / WhatsApp:</td>
                <td class="val">${order.customer.phone || 'No especificado'}</td>
              </tr>
              <tr>
                <td class="label">Destino de Despacho:</td>
                <td class="val">${order.customer.address}, ${order.customer.city}, ${order.customer.country}</td>
              </tr>
              <tr>
                <td class="label">Fecha y Hora:</td>
                <td class="val">${timestamp}</td>
              </tr>
            </table>

            <p class="section-title">Detalles del Pago & Transacción</p>
            <table class="data-table">
              <tr>
                <td class="label">ID de Transacción:</td>
                <td class="val"><code>${order.paymentDetails?.transactionId || order.id}</code></td>
              </tr>
              <tr>
                <td class="label">Método / Pasarela:</td>
                <td class="val"><strong>${order.paymentDetails?.cardBrand || order.paymentMethod}</strong> (Estado: <span style="color: #00dfa2;">${order.paymentStatus}</span>)</td>
              </tr>
            </table>

            <p class="section-title">Equipos & Soluciones GaIA Adquiridos</p>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Producto</th>
                  <th style="text-align: center;">Cant.</th>
                  <th style="text-align: right;">Unitario</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-box">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #889897; font-size: 13px;">Subtotal:</td>
                  <td style="text-align: right; color: #ffffff; font-size: 13px;">$${order.subtotal.toFixed(2)} USD</td>
                </tr>
                <tr>
                  <td style="color: #889897; font-size: 13px;">Envío & Logística Agrícola:</td>
                  <td style="text-align: right; color: #ffffff; font-size: 13px;">${order.shipping === 0 ? 'Gratis' : '$' + order.shipping.toFixed(2) + ' USD'}</td>
                </tr>
                <tr>
                  <td style="color: #889897; font-size: 13px;">IVA / Impuestos (19%):</td>
                  <td style="text-align: right; color: #ffffff; font-size: 13px;">$${order.tax.toFixed(2)} USD</td>
                </tr>
                <tr style="border-top: 1px dashed rgba(255, 255, 255, 0.15);">
                  <td style="padding-top: 8px; color: #00dfa2; font-weight: 700; font-size: 16px;">TOTAL PAGADO:</td>
                  <td style="padding-top: 8px; text-align: right; color: #00dfa2; font-weight: 700; font-size: 18px;">$${order.total.toFixed(2)} USD</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${order.customer.email}?subject=GaIA%20AgroTech%20-%20Despacho%20Orden%20${order.orderNumber}&body=Hola%20${encodeURIComponent(order.customer.fullName)},%0A%0AConfirmamos%20que%20tu%20pedido%20${order.orderNumber}%20ha%20sido%20procesado%20exitosamente%20y%20preparado%20para%20despacho..." class="cta-btn">
                Contactar al Comprador
              </a>
            </div>
          </div>
          <div class="footer">
            Notificación generada automáticamente por GaIA AgroTech SAS.<br>
            Copia enviada al buzón administrativo preestablecido: <strong>${this.toEmail}</strong>
          </div>
        </div>
      </body>
      </html>
    `;

    if (this.resend) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: this.fromEmail,
          to: [this.toEmail],
          replyTo: order.customer.email,
          subject: emailSubject,
          html: emailHtml,
        });

        if (error) {
          this.logger.error(`❌ Error enviando correo de compra con Resend: ${error.message}`, error);
          return { success: false, error: error.message };
        }

        this.logger.log(`✅ Notificación de compra ${order.orderNumber} enviada vía Resend! ID: ${data?.id} -> ${this.toEmail}`);
        return { success: true, id: data?.id };
      } catch (err: any) {
        this.logger.error(`❌ Excepción Resend al enviar orden: ${err.message}`, err);
        return { success: false, error: err.message };
      }
    } else {
      this.logger.log(`[SIMULACIÓN RESEND] Notificación de compra #${order.orderNumber} ($${order.total.toFixed(2)} USD) de ${order.customer.fullName} enviada simuladamente a ${this.toEmail}`);
      this.logger.log(`[SIMULACIÓN RESEND] Asunto: ${emailSubject}`);
      return { success: true, id: `sim-order-${Date.now()}` };
    }
  }
}
