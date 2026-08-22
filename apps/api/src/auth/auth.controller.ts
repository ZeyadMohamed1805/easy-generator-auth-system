import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { signInSchema, signUpSchema } from '@easygen/shared';
import type { PublicUser, SignInInput, SignUpInput } from '@easygen/shared';
import type { Request, Response } from 'express';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Env } from '../config/env';
import { REFRESH_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { CookieSettings, clearAuthCookies, setAuthCookies } from './cookies';

@ApiTags('auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an account and start a session' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'name', 'password'],
      properties: {
        email: { type: 'string', example: 'ada@example.com' },
        name: { type: 'string', example: 'Ada Lovelace' },
        password: { type: 'string', example: 'Abcd1234!' },
      },
    },
  })
  async signUp(
    @Body(new ZodValidationPipe(signUpSchema)) body: SignUpInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.authService.signUp(body);
    this.attachCookies(response, session);
    return { user: session.user };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in and start a session' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'ada@example.com' },
        password: { type: 'string', example: 'Abcd1234!' },
      },
    },
  })
  async signIn(
    @Body(new ZodValidationPipe(signInSchema)) body: SignInInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.authService.signIn(body);
    this.attachCookies(response, session);
    return { user: session.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rotate the refresh token and issue a new access cookie',
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: PublicUser }> {
    const session = await this.authService.refresh(
      readCookie(request, REFRESH_COOKIE),
    );
    this.attachCookies(response, session);
    return { user: session.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'End the session' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(readCookie(request, REFRESH_COOKIE));
    clearAuthCookies(response, this.cookieSettings());
  }

  private attachCookies(
    response: Response,
    session: { accessToken: string; refreshToken: string },
  ): void {
    setAuthCookies(response, session, this.cookieSettings());
  }

  private cookieSettings(): CookieSettings {
    return {
      secure: this.config.get('COOKIE_SECURE', { infer: true }),
      accessTtlSeconds: this.config.get('JWT_ACCESS_TTL_SECONDS', {
        infer: true,
      }),
      refreshTtlDays: this.config.get('REFRESH_TOKEN_TTL_DAYS', {
        infer: true,
      }),
    };
  }
}

function readCookie(request: Request, name: string): string | undefined {
  const value = request.cookies?.[name];
  return typeof value === 'string' ? value : undefined;
}
