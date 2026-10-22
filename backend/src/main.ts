import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('GaIA-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('GaIA AgroTech API')
    .setDescription('API REST de Automatización Agrícola Inteligente con Agentes de IA y Hardware Integrado')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y Perfil de Agricultor')
    .addTag('products', 'Catálogo de Sensores, Drones y Válvulas')
    .addTag('orders', 'Pedidos y Pasarela de Pagos')
    .addTag('simulator', 'Motor de Simulación de Cultivos Tinkercad')
    .addTag('chat', 'Agente de IA Agronómica Razonador')
    .addTag('blog', 'Artículos, Innovaciones y Casos de Éxito')
    .addTag('contact', 'Contacto y Preguntas Frecuentes')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🌿 GaIA Backend API corriendo en http://localhost:${port}`);
  logger.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api/docs`);
}

bootstrap();
