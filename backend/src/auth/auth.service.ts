import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DataStoreService, User } from '../database/data-store.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataStore: DataStoreService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = this.dataStore.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmName: user.farmName,
        hectares: user.hectares,
        cropType: user.cropType,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = this.dataStore.findUserByEmail(registerDto.email);
    if (existing) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const newUser: User = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
      farmName: registerDto.farmName || 'Mi Finca GaIA',
      hectares: registerDto.hectares || 1,
      cropType: registerDto.cropType || 'Cultivo General',
      role: 'farmer',
      createdAt: new Date(),
    };

    this.dataStore.createUser(newUser);

    const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        farmName: newUser.farmName,
        hectares: newUser.hectares,
        cropType: newUser.cropType,
      },
    };
  }

  async getProfile(userId: string) {
    const user = this.dataStore.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { passwordHash, ...result } = user;
    return result;
  }
}
