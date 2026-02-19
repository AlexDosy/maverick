import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateQuizDto } from "./dto/create-quiz.dto";

@Injectable()
export class LearningService {
  createCourse(dto: CreateCourseDto) {
    return { message: "Course created", dto };
  }

  createQuiz(dto: CreateQuizDto) {
    return { message: "Quiz created", dto };
  }
}
