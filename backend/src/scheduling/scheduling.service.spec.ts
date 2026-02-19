import { SchedulingService } from "./scheduling.service";

it("rejects overlapping approved bookings", async () => {
  const prisma = {
    booking: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  const service = new SchedulingService(prisma as any);
  prisma.booking.findUnique.mockResolvedValue({
    id: 2,
    instructorId: 1,
    startTime: new Date("2026-01-01T10:00:00Z"),
    endTime: new Date("2026-01-01T11:00:00Z"),
  });

  prisma.booking.findFirst.mockResolvedValue({
    id: 1,
  });

  await expect(
    service.approveBooking('2'),
  ).rejects.toThrow("Instructor has a scheduling conflict");
});

