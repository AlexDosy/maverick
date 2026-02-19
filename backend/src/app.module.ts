import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RbacModule } from "./rbac/rbac.module";
import { LearningModule } from "./learning/learning.module";
import { SchedulingModule } from "./scheduling/scheduling.module";

@Module({
  imports: [AuthModule, PrismaModule, RbacModule, LearningModule, SchedulingModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
