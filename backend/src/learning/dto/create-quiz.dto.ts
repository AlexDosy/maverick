import { IsString, IsNotEmpty, IsInt, Min } from "class-validator";

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  @Min(1)
  courseId!: number;
}
