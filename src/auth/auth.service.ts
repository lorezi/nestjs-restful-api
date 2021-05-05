import { Request } from 'express';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signedUserID(request: Request): Promise<string> {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);

    if (!data['id']) {
      throw new HttpException('unauthenticated user', HttpStatus.UNAUTHORIZED);
    }

    return data['id'];
  }
}
