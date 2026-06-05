import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cotiere.ci";
  const password = "Admin@2026!";

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: { email },
    data: { password: hash, role: "ADMIN", emailVerified: true },
  });

  console.log("✅ Mot de passe réinitialisé !");
  console.log(`📧 Email    : ${user.email}`);
  console.log(`🔑 Mot de passe : ${password}`);
  console.log(`👤 Rôle     : ${user.role}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
