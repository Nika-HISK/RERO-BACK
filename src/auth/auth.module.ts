import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import {  } from './guard/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/jwt-auth.guard';
import {Jwtconstantcs} from './guard/secret'
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: Jwtconstantcs.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, 
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      },
    ],
  exports: [AuthService],
})
export class AuthModule {}
