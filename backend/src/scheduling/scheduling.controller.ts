import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { SchedulingService } from "./scheduling.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../rbac/guard/roles.guard";
import { Roles } from "../rbac/decorators/roles.decorator";
import { Role } from "../rbac/roles.enum";

@Controller("scheduling")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post("request")
  @Roles(Role.STUDENT)
  request(@Body() body: any) {
    return this.schedulingService.requestBooking(
      body.instructorId,
      body.studentId,
      new Date(body.startTime),
      new Date(body.endTime),
    );
  }

  @Post(":id/approve")
  @Roles(Role.ADMIN)
  approve(@Param("id") id: string) {
    return this.schedulingService.approveBooking(String(id));
  }
}
