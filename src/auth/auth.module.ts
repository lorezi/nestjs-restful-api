import { CommonModule } from './../common/common.module';
import { UserModule } from './../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [forwardRef(() => UserModule), CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
