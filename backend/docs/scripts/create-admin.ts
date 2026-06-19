/**
 * Script pour crÃ©er un compte admin
 * Usage: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cotiere.ci";
  const password = "Admin@2026!";
  const firstName = "Admin";
  const lastName = "COTIERE";

  // VÃ©rifier si l'admin existe dÃ©jÃ 
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Mettre Ã  jour le rÃ´le si le compte existe
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", emailVerified: true },
    });
    console.log(`âœ… Compte existant mis Ã  jour en ADMIN : ${email}`);
  } else {
    // CrÃ©er le compte admin
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "ADMIN",
        emailVerified: true,
      },
    });
    console.log(`âœ… Compte admin crÃ©Ã© avec succÃ¨s !`);
  }

  console.log(`\nðŸ“§ Email    : ${email}`);
  console.log(`ðŸ”‘ Mot de passe : ${password}`);
  console.log(`\nðŸ‘‰ Connectez-vous sur : http://localhost:3000/connexion`);
  console.log(`ðŸ‘‰ Puis accÃ©dez Ã     : http://localhost:3000/admin/dashboard`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


