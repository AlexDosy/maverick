import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { ListCoursesDto } from "./dto/list-courses.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}
  createCourse(dto: CreateCourseDto) {
    return { message: "Course created", dto };
  }

  createQuiz(dto: CreateQuizDto) {
    return { message: "Quiz created", dto };
  }

async getCourses(query: ListCoursesDto) {
  const { page = 1, limit = 10, search } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.CourseWhereInput = search
    ? {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  const [items, total] = await this.prisma.$transaction([
    this.prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.course.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}
