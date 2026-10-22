import { IsNotEmpty, IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}

export class OrderItemDto {
  productId!: string;
  name!: string;
  price!: number;
  quantity!: number;
  image!: string;
}

export class CreateOrderDto {
  @IsObject()
  customer!: CustomerDto;

  @IsArray()
  items!: OrderItemDto[];

  @IsString()
  paymentMethod!: 'card' | 'mercadopago' | 'stripe' | 'wire_transfer';

  @IsOptional()
  @IsObject()
  paymentCardInfo?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
}
