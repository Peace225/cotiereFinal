/**
 * Script pour créer un compte admin
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

  // Vérifier si l'admin existe déjà
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Mettre à jour le rôle si le compte existe
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", emailVerified: true },
    });
    console.log(`✅ Compte existant mis à jour en ADMIN : ${email}`);
  } else {
    // Créer le compte admin
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
    console.log(`✅ Compte admin créé avec succès !`);
  }

  console.log(`\n📧 Email    : ${email}`);
  console.log(`🔑 Mot de passe : ${password}`);
  console.log(`\n👉 Connectez-vous sur : http://localhost:3000/connexion`);
  console.log(`👉 Puis accédez à    : http://localhost:3000/admin/dashboard`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
