import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'johnwick',
      password: 'root',
      database: 'next',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    RoleModule,
    PermissionModule,
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
