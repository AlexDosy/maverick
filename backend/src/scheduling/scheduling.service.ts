import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  async requestBooking(
    instructorId: string,
    studentId: string,
    startTime: Date,
    endTime: Date,
  ) {
    if (startTime >= endTime) {
      throw new BadRequestException("Invalid time range");
    }

    return this.prisma.booking.create({
      data: {
        instructorId,
        studentId,
        startTime,
        endTime,
        status: "REQUESTED",
      },
    });
  }

  async approveBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new BadRequestException("Booking not found");
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        instructorId: booking.instructorId,
        status: "APPROVED",
        AND: [
          { startTime: { lt: booking.endTime } },
          { endTime: { gt: booking.startTime } },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException("Instructor has a scheduling conflict");
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "APPROVED" },
    });
  }
}
