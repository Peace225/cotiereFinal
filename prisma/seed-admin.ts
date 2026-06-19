import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cotiere.ci";
  const password = "Cotiere2025!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Compte admin dÃ©jÃ  existant :", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName: "Admin",
      lastName: "COTIERE",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log("âœ… Compte admin crÃ©Ã© :");
  console.log("   Email    :", admin.email);
  console.log("   Mot de passe :", password);
  console.log("   RÃ´le     :", admin.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


