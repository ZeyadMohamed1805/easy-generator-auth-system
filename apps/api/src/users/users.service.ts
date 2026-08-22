import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PublicUser } from '@easygen/shared';
import { User, UserDocument } from './schemas/user.schema';

const DUPLICATE_KEY = 11000;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
  ) {}

  async create(input: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<UserDocument> {
    try {
      return await this.users.create(input);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: number }).code === DUPLICATE_KEY
      ) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }
      throw error;
    }
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.users.findOne({ email }).select('+passwordHash').exec();
  }

  async findPublicById(id: string): Promise<PublicUser> {
    const user = await this.users.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }
    return {
      id: user.id as string,
      email: user.email,
      name: user.name,
    };
  }
}
