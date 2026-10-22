import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsNumber()
  hectares?: number;

  @IsOptional()
  @IsString()
  cropType?: string;
}
