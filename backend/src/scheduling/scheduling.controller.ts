import { Controller, Post, Param, Body, UseGuards, Patch, BadRequestException } from "@nestjs/common";
import { SchedulingService } from "./scheduling.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../rbac/guard/roles.guard";
import { Roles } from "../rbac/decorators/roles.decorator";
import { Role } from "../rbac/roles.enum";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";

@Controller("scheduling")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) { }

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

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    if (!dto.status) {
      throw new BadRequestException('Status is required');
    }
    return this.schedulingService.updateBookingStatus(id, dto.status);
  }
}
