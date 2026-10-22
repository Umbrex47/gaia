import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataStoreService } from '../database/data-store.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dataStore: DataStoreService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'gaia_secret_super_secure_key_2026_precision_agritech',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = this.dataStore.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no válido o sesión expirada');
    }
    const { passwordHash, ...result } = user;
    return result;
  }
}
