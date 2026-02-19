import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { LearningService } from "./learning.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../rbac/guard/roles.guard";
import { Roles } from "../rbac/decorators/roles.decorator";
import { Role } from "../rbac/roles.enum";

@Controller("learning")
@UseGuards(JwtAuthGuard, RolesGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}
  @Get("admin-check")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminCheck(@Req() req: any) {
    console.log(req.user);
    return { ok: true };
  }

  @Post("courses")
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  createCourse(@Body() dto: CreateCourseDto) {
    return this.learningService.createCourse(dto);
  }

  @Post("quizzes")
  @Roles(Role.INSTRUCTOR)
  createQuiz(@Body() dto: CreateQuizDto) {
    return this.learningService.createQuiz(dto);
  }
}
