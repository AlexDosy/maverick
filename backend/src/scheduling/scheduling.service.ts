import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BookingStatus } from "@prisma/client";

@Injectable()
export class SchedulingService {
  constructor(private readonly prisma: PrismaService) { }

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

  private isValidTransition(
    current: BookingStatus,
    next: BookingStatus,
  ): boolean {
    const allowed: Record<BookingStatus, BookingStatus[]> = {
      REQUESTED: ['APPROVED', 'CANCELLED'],
      APPROVED: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    return allowed[current].includes(next);
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

  async updateBookingStatus(
    bookingId: string,
    nextStatus: BookingStatus,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!this.isValidTransition(booking.status, nextStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${booking.status} to ${nextStatus}`,
      );
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: nextStatus },
    });
  }

}
