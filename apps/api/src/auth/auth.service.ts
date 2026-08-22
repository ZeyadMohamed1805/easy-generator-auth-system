import { createHash, randomUUID, randomBytes } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model, Types } from 'mongoose';
import type { PublicUser, SignInInput, SignUpInput } from '@easygen/shared';
import { Env } from '../config/env';
import { UsersService } from '../users/users.service';
import { INVALID_CREDENTIALS } from './auth.constants';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';

export type AuthSession = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  private dummyHashPromise: Promise<string> | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokens: Model<RefreshTokenDocument>,
  ) {}

  async signUp(input: SignUpInput): Promise<AuthSession> {
    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });
    const user = await this.usersService.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });
    return this.issueSession(user.id as string, user.email, user.name);
  }

  async signIn(input: SignInInput): Promise<AuthSession> {
    const user = await this.usersService.findByEmailWithPassword(input.email);
    const hash = user?.passwordHash ?? (await this.dummyHash());
    const passwordMatches = await argon2
      .verify(hash, input.password)
      .catch(() => false);

    if (!user || !passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return this.issueSession(user.id as string, user.email, user.name);
  }

  async refresh(rawRefreshToken: string | undefined): Promise<AuthSession> {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Invalid session');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.refreshTokens.findOne({ tokenHash }).exec();
    if (!stored) {
      throw new UnauthorizedException('Invalid session');
    }

    if (stored.revokedAt) {
      await this.refreshTokens.updateMany(
        { familyId: stored.familyId, revokedAt: { $exists: false } },
        { $set: { revokedAt: new Date() } },
      );
      throw new UnauthorizedException('Invalid session');
    }

    if (stored.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid session');
    }

    stored.revokedAt = new Date();
    await stored.save();

    const user = await this.usersService.findPublicById(
      stored.userId.toString(),
    );
    return this.issueSession(user.id, user.email, user.name, stored.familyId);
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.refreshTokens.findOne({ tokenHash }).exec();
    if (!stored) {
      return;
    }
    stored.revokedAt = new Date();
    await stored.save();
  }

  private async issueSession(
    userId: string,
    email: string,
    name: string,
    familyId?: string,
  ): Promise<AuthSession> {
    const family = familyId ?? randomUUID();
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email,
    });
    const refreshToken = randomBytes(32).toString('base64url');
    const ttlDays = this.config.get('REFRESH_TOKEN_TTL_DAYS', { infer: true });
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    await this.refreshTokens.create({
      userId: new Types.ObjectId(userId),
      tokenHash: hashToken(refreshToken),
      familyId: family,
      expiresAt,
    });

    return {
      user: { id: userId, email, name },
      accessToken,
      refreshToken,
    };
  }

  private dummyHash(): Promise<string> {
    this.dummyHashPromise ??= argon2.hash('timing-pad', {
      type: argon2.argon2id,
    });
    return this.dummyHashPromise;
  }
}

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}
