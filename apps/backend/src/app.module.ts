import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";
import { UserController } from "./user/user.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule.forRoot({ auth }),
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
