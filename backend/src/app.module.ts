import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SimulatorModule } from './simulator/simulator.module';
import { ChatModule } from './chat/chat.module';
import { BlogModule } from './blog/blog.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    SimulatorModule,
    ChatModule,
    BlogModule,
    ContactModule,
  ],
})
export class AppModule {}
