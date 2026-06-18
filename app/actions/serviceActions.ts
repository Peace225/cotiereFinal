// app/actions/serviceActions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // Supposons que tu utilises NextAuth

export async function getPartnerServices() {
  const session = await auth(); // Récupère la session de l'utilisateur connecté
  
  if (!session?.user?.id) throw new Error("Non autorisé");

  return await prisma.villeContenu.findMany({
    where: {
      partnerId: session.user.id // 👈 LE FILTRE CRUCIAL : On ne récupère que SES services
    },
    orderBy: { nom: 'asc' }
  });
}