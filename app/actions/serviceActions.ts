// app/actions/serviceActions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // ← Chemin réel et corrigé de votre auth NextAuth

/**
 * Récupère les services/contenus associés au partenaire (prestataire) connecté.
 */
export async function getPartnerServices() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  // Utilisation de partner_id (tel que défini dans votre schema.prisma)
  return prisma.villeContenu.findMany({
    where: {
      partner_id: session.user.id,
    },
    orderBy: {
      nom: "asc",
    },
  });
}

/**
 * Action serveur pour ajouter/créer un nouveau service.
 */
export async function createServiceAction(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const nom = formData.get("nom") as string;
  const ville = formData.get("ville") as string;
  const categorie = formData.get("categorie") as string;

  if (!nom || !ville || !categorie) {
    throw new Error("Veuillez remplir tous les champs obligatoires.");
  }

  // Enregistrement dans la table ville_contenus
  return prisma.villeContenu.create({
    data: {
      nom,
      ville,
      categorie,
      partner_id: session.user.id,
      isActive: true,
      description: formData.get("description") as string || null,
      adresse: formData.get("adresse") as string || null,
      telephone: formData.get("telephone") as string || null,
      whatsapp: formData.get("whatsapp") as string || null,
      siteWeb: formData.get("siteWeb") as string || null,
      image: formData.get("image") as string || null,
      prix: formData.get("prix") as string || null,
    },
  });
}