import { Module } from "@nestjs/common";
import { LearningController } from "./learning.controller";
import { LearningService } from "./learning.service";
import { RbacModule } from "../rbac/rbac.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [RbacModule, PrismaModule],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}
