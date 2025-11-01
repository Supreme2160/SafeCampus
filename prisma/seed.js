/*
  Prisma seed script
  Usage:
    - Ensure DATABASE_URL is set in .env
    - Run: npx prisma generate (first time or after schema changes)
    - Run: npx prisma db seed
*/

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function ensureModule(data) {
  const existing = await prisma.modules.findFirst({ where: { title: data.title } });
  if (existing) return existing;
  return prisma.modules.create({ data });
}

async function ensureQuiz(data) {
  const existing = await prisma.quiz.findFirst({ where: { title: data.title } });
  if (existing) return existing;
  return prisma.quiz.create({ data });
}

async function main() {
  // Users (password for all seeded users: password123)
  const passwordHash = await bcrypt.hash("password123", 10);

  // Teacher user
  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@safecampus.test" },
    update: {},
    create: {
      username: "teacher1",
      email: "teacher@safecampus.test",
      password: passwordHash,
      name: "Test Teacher",
      userType: "TEACHER",
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: { userId: teacherUser.id },
  });

  // Student users
  const student1User = await prisma.user.upsert({
    where: { email: "student1@safecampus.test" },
    update: {},
    create: {
      username: "student1",
      email: "student1@safecampus.test",
      password: passwordHash,
      name: "Student One",
      userType: "STUDENT",
    },
  });

  await prisma.student.upsert({
    where: { userId: student1User.id },
    update: {},
    create: { userId: student1User.id },
  });

  const student2User = await prisma.user.upsert({
    where: { email: "student2@safecampus.test" },
    update: {},
    create: {
      username: "student2",
      email: "student2@safecampus.test",
      password: passwordHash,
      name: "Student Two",
      userType: "STUDENT",
    },
  });

  await prisma.student.upsert({
    where: { userId: student2User.id },
    update: {},
    create: { userId: student2User.id },
  });

  // Learning modules with lessons
  const earthquakeModule = await ensureModule({
    title: "Earthquake Safety Basics",
    description:
      "Learn how to Drop, Cover, and Hold On, identify safe zones, and avoid hazards during earthquakes.",
    published: true,
    coverImage: null,
    duration: 20,
    level: "Beginner",
    lessons: {
      create: [
        {
          title: "Understanding Earthquakes",
          content:
            "Learn the fundamentals of earthquakes, including what causes them, how they occur, and why understanding them is crucial for safety.",
          videoUrl: "http://www.youtube.com/watch?v=I0ureVMVzP8",
        },
        {
          title: "Before an Earthquake",
          content:
            "Prepare for earthquakes by securing furniture, creating emergency plans, and assembling disaster kits.",
          videoUrl: "http://www.youtube.com/watch?v=I0ureVMVzP8",
        },
        {
          title: "During an Earthquake",
          content:
            "Learn the critical Drop, Cover, and Hold On technique and what to do when the ground starts shaking.",
          videoUrl: "http://www.youtube.com/watch?v=-MKMiFWK6Xk",
        },
        {
          title: "After an Earthquake",
          content:
            "Once shaking stops, carefully evacuate to an open area. Watch for debris, aftershocks, and check for injuries.",
          videoUrl: "http://www.youtube.com/watch?v=r5EbbrVXoQw",
        },
        {
          title: "School-Specific Protocols",
          content:
            "Special safety procedures for schools including classroom safety, evacuation routes, and emergency assembly points.",
          videoUrl: "http://www.youtube.com/watch?v=MllUVQM3KVk",
        },
      ],
    },
  });

  const preparednessModule = await ensureModule({
    title: "Emergency Backpack Essentials",
    description:
      "Build a go-bag with water, food, radio, flashlight, first aid, and important documents for different disasters.",
    published: true,
    coverImage: null,
    duration: 15,
    level: "Beginner",
    lessons: {
      create: [
        {
          title: "Water and Food",
          content: "Pack at least 3 days of water and shelf-stable food per person.",
          videoUrl: "https://example.com/videos/prep-water-food",
        },
        {
          title: "Tools and Communication",
          content: "Include flashlight, batteries, radio, whistle, and phone charger.",
          videoUrl: "https://example.com/videos/prep-tools-comm",
        },
      ],
    },
  });

  const cprModule = await ensureModule({
    title: "CPR Rhythm and Response",
    description:
      "Learn the 110 BPM compression rhythm, proper depth, and cycles of 30 compressions and 2 breaths.",
    published: true,
    coverImage: null,
    duration: 25,
    level: "Intermediate",
    lessons: {
      create: [
        {
          title: "Compression Rhythm",
          content:
            "Aim for 100–120 compressions per minute (ideal 110 BPM). Use a metronome or song like 'Stayin' Alive'.",
          videoUrl: "https://example.com/videos/cpr-rhythm",
        },
        {
          title: "Compression Depth and Recoil",
          content: "Push at least 5 cm (2 inches) on adults and allow full chest recoil.",
          videoUrl: "https://example.com/videos/cpr-depth",
        },
      ],
    },
  });

  // Quizzes with themed questions
  await ensureQuiz({
    title: "Earthquake Awareness Quiz",
    description: "Test your knowledge of earthquake safety principles.",
    questions: {
      create: [
        {
          questionText: "What is the safest immediate action during an earthquake?",
          options: ["Run outside", "Drop, Cover, and Hold On", "Stand in a doorway", "Use the elevator"],
          correctAnswer: "Drop, Cover, and Hold On",
          theme: "EARTHQUAKE",
        },
        {
          questionText: "Which place is typically safest indoors?",
          options: ["Near windows", "Under sturdy furniture", "Next to tall shelves", "In the elevator"],
          correctAnswer: "Under sturdy furniture",
          theme: "EARTHQUAKE",
        },
      ],
    },
  });

  await ensureQuiz({
    title: "Flood Safety Basics",
    description: "Know what to pack and how to react during floods.",
    questions: {
      create: [
        {
          questionText: "Which item is essential in a flood evacuation kit?",
          options: ["Candles", "Water", "Heavy textbooks", "Paint"],
          correctAnswer: "Water",
          theme: "FLOOD",
        },
        {
          questionText: "What should you do when driving and encountering flood water?",
          options: ["Drive through slowly", "Turn around, don’t drown", "Speed through", "Wait in the water"],
          correctAnswer: "Turn around, don’t drown",
          theme: "FLOOD",
        },
      ],
    },
  });

  // Initial game scores for students
  const s1 = await prisma.student.findUnique({ where: { userId: student1User.id } });
  const s2 = await prisma.student.findUnique({ where: { userId: student2User.id } });

  if (s1) {
    await prisma.gameScore.createMany({
      data: [
        {
          studentId: s1.id,
          score: 850,
          gameName: "EARTHQUAKE",
          gameType: "ADVENTURE",
        },
        {
          studentId: s1.id,
          score: 720,
          gameName: "FOREST_FIRE",
          gameType: "QUIZ",
        },
      ],
      skipDuplicates: true,
    });
  }

  if (s2) {
    await prisma.gameScore.create({
      data: {
        studentId: s2.id,
        score: 910,
        gameName: "EARTHQUAKE",
        gameType: "ADVENTURE",
      },
    });
  }

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
