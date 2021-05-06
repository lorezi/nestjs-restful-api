import { PermissionGuard } from './permission.guard';
import { CommonModule } from './../common/common.module';
import { Permission } from './permission.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), CommonModule],
  exports: [PermissionService],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
