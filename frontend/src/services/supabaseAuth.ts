import { supabase } from './supabase';
import type { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  farmName?: string;
  hectares?: number;
  cropType?: string;
}

export interface RegisterResult {
  success: boolean;
  user: any;
  session: any;
  requiresEmailConfirmation: boolean;
  message?: string;
}

function getRedirectUrl(): string {
  const configuredAppUrl =
    (import.meta as any).env?.VITE_APP_URL ||
    (import.meta as any).env?.NEXT_PUBLIC_APP_URL;

  // Si estamos en el navegador en un dominio público real (Vercel, dominio personalizado)
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return `${origin}/auth/callback`;
    }
  }

  // Si estamos en desarrollo local (localhost), usar siempre la URL de producción
  // para que el enlace enviado por correo sea accesible globalmente y no apunte a localhost
  if (configuredAppUrl) {
    return `${configuredAppUrl.replace(/\/$/, '')}/auth/callback`;
  }

  return 'https://gaia-agrotech.vercel.app/auth/callback';
}

export const supabaseAuthService = {
  /**
   * Registra un nuevo productor agrícola con Supabase Auth y despacha el correo de validación
   */
  async register(payload: RegisterPayload): Promise<RegisterResult> {
    const { email, password, name, farmName, hectares, cropType } = payload;
    const redirectUrl = getRedirectUrl();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          full_name: name,
          farm_name: farmName || 'Finca Agrícola',
          hectares: Number(hectares) || 10,
          crop_type: cropType || 'Cultivo GaIA',
          role: 'farmer',
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Este correo electrónico ya se encuentra registrado. Por favor inicia sesión.');
      }
      if (error.message.includes('Password should be at least')) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }
      throw new Error(error.message || 'Error al procesar el registro en Supabase');
    }

    // Si data.session es null, Supabase ha enviado el correo de confirmación
    const requiresEmailConfirmation = !data.session;

    return {
      success: true,
      user: data.user,
      session: data.session,
      requiresEmailConfirmation,
      message: requiresEmailConfirmation
        ? 'Correo de validación enviado exitosamente.'
        : 'Registro completado y sesión iniciada.',
    };
  },

  /**
   * Inicia sesión con email y contraseña verificando el estado de confirmación
   */
  async login(credentials: { email: string; password: string }): Promise<{ session: any; user: User }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        const err: any = new Error('Tu cuenta aún no ha sido confirmada. Por favor revisa tu bandeja de entrada o solicita un nuevo correo de validación.');
        err.code = 'EMAIL_NOT_CONFIRMED';
        throw err;
      }
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        throw new Error('Correo electrónico o contraseña incorrectos.');
      }
      throw new Error(error.message || 'Error al iniciar sesión con Supabase');
    }

    if (!data.user) {
      throw new Error('No se pudo recuperar la información del usuario');
    }

    const metadata = data.user.user_metadata || {};
    const userProfile: User = {
      id: data.user.id,
      name: metadata.name || metadata.full_name || data.user.email?.split('@')[0].toUpperCase(),
      email: data.user.email || '',
      farmName: metadata.farm_name || 'Predio Agrícola',
      hectares: Number(metadata.hectares) || 10,
      cropType: metadata.crop_type || 'Cultivo General',
      role: 'farmer',
    };

    return {
      session: data.session,
      user: userProfile,
    };
  },

  /**
   * Reenvía el correo de validación / activación de cuenta
   */
  async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    const redirectUrl = getRedirectUrl();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      throw new Error(error.message || 'Error al reenviar el correo de validación');
    }

    return {
      success: true,
      message: `Enlace de validación reenviado exitosamente a ${email}`,
    };
  },

  /**
   * Valida una cuenta ingresando directamente un código OTP, token o enlace recibido por correo
   */
  async verifyOtpToken(email: string, tokenOrUrl: string): Promise<{ session: any; user: User | null }> {
    const raw = tokenOrUrl.trim();

    // Si el usuario pegó un enlace (ej: http://localhost:3000/auth/v1/verify?token=... o token_hash=...)
    if (raw.includes('http') || raw.includes('?') || raw.includes('token') || raw.includes('code=')) {
      try {
        let urlStr = raw;
        if (urlStr.startsWith('localhost')) urlStr = 'http://' + urlStr;
        const parsed = new URL(urlStr);
        const code = parsed.searchParams.get('code');
        const tokenHash = parsed.searchParams.get('token_hash');
        const token = parsed.searchParams.get('token');
        const type = parsed.searchParams.get('type') || 'signup';

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data?.session && data?.user) {
            return { session: data.session, user: this.mapUser(data.user) };
          }
        }

        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });
          if (!error && data?.session && data?.user) {
            return { session: data.session, user: this.mapUser(data.user) };
          }
        }

        if (token) {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: type as any,
          });
          if (!error && data?.session && data?.user) {
            return { session: data.session, user: this.mapUser(data.user) };
          }
        }
      } catch (e: any) {
        console.warn('Fallo al parsear URL de token:', e);
      }
    }

    // Intentar como código directo (OTP o token string) con type 'signup'
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: raw,
      type: 'signup',
    });

    if (!error && data?.session && data?.user) {
      return { session: data.session, user: this.mapUser(data.user) };
    }

    // Intentar con type 'email' por compatibilidad con diferentes versiones de GoTrue
    const { data: data2, error: error2 } = await supabase.auth.verifyOtp({
      email,
      token: raw,
      type: 'email' as any,
    });

    if (!error2 && data2?.session && data2?.user) {
      return { session: data2.session, user: this.mapUser(data2.user) };
    }

    throw new Error(error?.message || error2?.message || 'Código o token de validación inválido.');
  },

  /**
   * Procesa la confirmación de cuenta desde el enlace de correo (Callback)
   */
  async handleAuthCallback(): Promise<{ session: any; user: User | null }> {
    // 1. Verificar si hay código PKCE en URL search params
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const tokenHash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type') || 'signup';

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw new Error(error.message);
      if (data?.session && data?.user) {
        return {
          session: data.session,
          user: this.mapUser(data.user),
        };
      }
    }

    if (tokenHash) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });
      if (error) throw new Error(error.message);
      if (data?.session && data?.user) {
        return {
          session: data.session,
          user: this.mapUser(data.user),
        };
      }
    }

    // 2. Verificar si la sesión ya fue detectada automáticamente por Supabase en el hash
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) throw new Error(sessionErr.message);

    if (sessionData?.session?.user) {
      return {
        session: sessionData.session,
        user: this.mapUser(sessionData.session.user),
      };
    }

    return { session: null, user: null };
  },

  /**
   * Cierra la sesión activa en Supabase
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Helper para mapear usuario de Supabase a interfaz User de GaIA
   */
  mapUser(supabaseUser: any): User {
    const metadata = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0].toUpperCase(),
      email: supabaseUser.email || '',
      farmName: metadata.farm_name || 'Predio Agrícola GaIA',
      hectares: Number(metadata.hectares) || 10,
      cropType: metadata.crop_type || 'Cultivo General',
      role: 'farmer',
    };
  },
};
