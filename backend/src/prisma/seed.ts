import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  // --- Clean slate (deterministic seeds)
  await prisma.booking.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // --- Users
  const passwordHash = await hashPassword("password");

  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: "instructor@test.com",
      password: passwordHash,
      role: Role.INSTRUCTOR,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@test.com",
      password: passwordHash,
      role: Role.STUDENT,
    },
  });

  // --- Learning module (1 course → 1 lesson → 1 quiz)
  await prisma.course.create({
    data: {
      title: "Intro to Maverick",
      lessons: {
        create: {
          title: "Foundations",
          quiz: {
            create: {
              questions: {
                create: [
                  {
                    text: "What does RBAC stand for?",
                    options: [
                      "Role-Based Access Control",
                      "Random Backend Auth Code",
                      "Routing Based App Config",
                    ],
                    correctIndex: 0,
                  },
                  {
                    text: "Which layer enforces RBAC in this system?",
                    options: [
                      "Frontend UI",
                      "Database triggers",
                      "API guards",
                    ],
                    correctIndex: 2,
                  },
                ],
              },
            },
          },
        },
      },
    },
  });

  console.log("✅ Database seeded successfully");
  console.log("Demo credentials:");
  console.log("Admin: admin@test.com / password");
  console.log("Instructor: instructor@test.com / password");
  console.log("Student: student@test.com / password");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
