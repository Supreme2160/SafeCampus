/*
  Prisma seed script
  Usage:
    - Ensure DATABASE_URL is set in .env
    - Run: npx prisma generate (first time or after schema changes)
    - Run: npx prisma db seed
*/
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});




/* eslint-disable @typescript-eslint/no-explicit-any */
async function ensureModule(data: any) {
  const existing = await prisma.modules.findFirst({ where: { title: data.title } });
  if (existing) return existing;
  return prisma.modules.create({ data });
}

async function ensureQuiz(data: any) {
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
  await ensureModule({
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

   await ensureModule({
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

   await ensureModule({
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
        {
          questionText: "After an earthquake stops, what should you do first?",
          options: ["Call everyone you know", "Check for injuries and hazards", "Take photos for insurance", "Go back to sleep"],
          correctAnswer: "Check for injuries and hazards",
          theme: "EARTHQUAKE",
        },
        {
          questionText: "What should be in an earthquake emergency kit?",
          options: ["Video games and snacks", "Water, food, flashlight, and first aid", "Party decorations", "Expensive jewelry"],
          correctAnswer: "Water, food, flashlight, and first aid",
          theme: "EARTHQUAKE",
        },
        {
          questionText: "How many days of supplies should you have in your emergency kit?",
          options: ["1 day", "2 days", "3 days", "1 week"],
          correctAnswer: "3 days",
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
          options: ["Drive through slowly", "Turn around, don't drown", "Speed through", "Wait in the water"],
          correctAnswer: "Turn around, don't drown",
          theme: "FLOOD",
        },
        {
          questionText: "How many inches of fast-moving water can sweep away a vehicle?",
          options: ["2 inches", "6 inches", "12 inches", "24 inches"],
          correctAnswer: "12 inches",
          theme: "FLOOD",
        },
        {
          questionText: "Where should you move during a flood warning?",
          options: ["Basement", "Higher ground", "Near the river", "Underground parking"],
          correctAnswer: "Higher ground",
          theme: "FLOOD",
        },
        {
          questionText: "What should you avoid touching during a flood?",
          options: ["Dry clothing", "Electrical equipment", "Bottled water", "Your emergency supplies"],
          correctAnswer: "Electrical equipment",
          theme: "FLOOD",
        },
      ],
    },
  });

  await ensureQuiz({
    title: "Fire Safety Knowledge",
    description: "Master fire prevention, detection, and evacuation strategies.",
    questions: {
      create: [
        {
          questionText: "What should you do if your clothes catch fire?",
          options: ["Run to find water", "Stop, Drop, and Roll", "Wave your arms", "Keep walking normally"],
          correctAnswer: "Stop, Drop, and Roll",
          theme: "FOREST_FIRE",
        },
        {
          questionText: "How often should you test your smoke detectors?",
          options: ["Once a year", "Every 6 months", "Once a month", "Never"],
          correctAnswer: "Once a month",
          theme: "FOREST_FIRE",
        },
        {
          questionText: "What is the best way to escape a room filled with smoke?",
          options: ["Walk upright quickly", "Crawl low under the smoke", "Jump out the window", "Wait for help"],
          correctAnswer: "Crawl low under the smoke",
          theme: "FOREST_FIRE",
        },
        {
          questionText: "Where should you meet after evacuating during a fire?",
          options: ["Back inside to check", "At a designated meeting point outside", "In your neighbor's house", "In your car"],
          correctAnswer: "At a designated meeting point outside",
          theme: "FOREST_FIRE",
        },
        {
          questionText: "What is the universal emergency number in most countries?",
          options: ["911", "112", "Both 911 and 112", "999"],
          correctAnswer: "Both 911 and 112",
          theme: "FOREST_FIRE",
        },
      ],
    },
  });

  await ensureQuiz({
    title: "Tsunami Preparedness",
    description: "Learn critical tsunami warning signs and evacuation procedures.",
    questions: {
      create: [
        {
          questionText: "What is a natural warning sign of a tsunami?",
          options: ["Heavy rain", "Ocean receding rapidly", "Strong wind", "Dark clouds"],
          correctAnswer: "Ocean receding rapidly",
          theme: "TSUNAMI",
        },
        {
          questionText: "How high should you go to be safe from a tsunami?",
          options: ["10 feet above sea level", "30 feet or higher", "Just above the beach", "Any elevation"],
          correctAnswer: "30 feet or higher",
          theme: "TSUNAMI",
        },
        {
          questionText: "What should you do immediately after feeling an earthquake near the coast?",
          options: ["Go to the beach to watch", "Move to higher ground", "Wait for official warning", "Stay in your car"],
          correctAnswer: "Move to higher ground",
          theme: "TSUNAMI",
        },
        {
          questionText: "How fast can tsunami waves travel in deep ocean?",
          options: ["As fast as a car", "As fast as a jet plane", "As fast as a person running", "Very slowly"],
          correctAnswer: "As fast as a jet plane",
          theme: "TSUNAMI",
        },
        {
          questionText: "When is it safe to return after a tsunami warning?",
          options: ["After the first wave passes", "When authorities declare all-clear", "After 10 minutes", "When water starts receding"],
          correctAnswer: "When authorities declare all-clear",
          theme: "TSUNAMI",
        },
      ],
    },
  });

  await ensureQuiz({
    title: "Volcano Safety Awareness",
    description: "Understand volcanic hazards and protective actions.",
    questions: {
      create: [
        {
          questionText: "What is the most dangerous volcanic hazard?",
          options: ["Lava flows", "Pyroclastic flows", "Volcanic ash", "Earthquakes"],
          correctAnswer: "Pyroclastic flows",
          theme: "VOLCANO",
        },
        {
          questionText: "What should you do if caught in volcanic ashfall?",
          options: ["Go outside and play", "Stay indoors and seal doors/windows", "Drive through it quickly", "Ignore it"],
          correctAnswer: "Stay indoors and seal doors/windows",
          theme: "VOLCANO",
        },
        {
          questionText: "What type of mask is recommended during volcanic ashfall?",
          options: ["Cloth mask", "N95 respirator or better", "Surgical mask", "No mask needed"],
          correctAnswer: "N95 respirator or better",
          theme: "VOLCANO",
        },
        {
          questionText: "Why is volcanic ash dangerous to breathe?",
          options: ["It's too hot", "Contains tiny glass-like particles", "It smells bad", "It's not dangerous"],
          correctAnswer: "Contains tiny glass-like particles",
          theme: "VOLCANO",
        },
        {
          questionText: "What should you do with your vehicle during heavy ashfall?",
          options: ["Drive normally", "Avoid using it", "Drive faster", "Keep windows open"],
          correctAnswer: "Avoid using it",
          theme: "VOLCANO",
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
