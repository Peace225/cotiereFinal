import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUITS = [
  { label: "Attieke frais (1kg)", desc: "Semoule de manioc traditionnelle fraiche", prix: 1500, unite: "kg", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"] },
  { label: "Attieke frais (5kg)", desc: "Semoule de manioc en gros", prix: 6500, unite: "5kg", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"] },
  { label: "Poisson braise", desc: "Poisson frais du jour braise", prix: 3000, unite: "piece", categorie: "Poissons", images: ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"] },
  { label: "Crevettes fraiches (500g)", desc: "Crevettes peche locale", prix: 5000, unite: "500g", categorie: "Fruits de mer", images: ["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80"] },
  { label: "Homard", desc: "Homard vivant du littoral", prix: 15000, unite: "piece", categorie: "Fruits de mer", images: ["https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80"] },
  { label: "Ananas frais", desc: "Ananas sucre de la region", prix: 1000, unite: "piece", categorie: "Fruits", images: ["https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80"] },
  { label: "Mangues (1kg)", desc: "Mangues mures de saison", prix: 1500, unite: "kg", categorie: "Fruits", images: ["https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80"] },
  { label: "Panier mixte fruits de mer", desc: "Assortiment crevettes, crabes, poissons", prix: 25000, unite: "panier", categorie: "Paniers", images: ["https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80"] },
  { label: "Tomates fraiches (1kg)", desc: "Tomates locales bien mures", prix: 800, unite: "kg", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80"] },
  { label: "Oignons (1kg)", desc: "Oignons frais du marche local", prix: 600, unite: "kg", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&q=80"] },
  { label: "Gombo frais (500g)", desc: "Gombo tendre pour sauces et plats", prix: 700, unite: "500g", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80"] },
  { label: "Aubergines (1kg)", desc: "Aubergines africaines fraiches", prix: 900, unite: "kg", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80"] },
  { label: "Piments frais (250g)", desc: "Piments locaux forts et parfumes", prix: 500, unite: "250g", categorie: "Legumes", images: ["https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&q=80"] },
  { label: "Igname (1kg)", desc: "Igname fraiche du littoral", prix: 1200, unite: "kg", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=80"] },
  { label: "Plantain mur (regime)", desc: "Banane plantain bien murie", prix: 2000, unite: "regime", categorie: "Feculents", images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80"] },
  { label: "Poulet entier", desc: "Poulet fermier local frais", prix: 5000, unite: "piece", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80"] },
  { label: "Viande de boeuf (1kg)", desc: "Boeuf frais decoupes en morceaux", prix: 4500, unite: "kg", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80"] },
  { label: "Viande de mouton (1kg)", desc: "Mouton frais du marche local", prix: 5500, unite: "kg", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80"] },
  { label: "Escargots (500g)", desc: "Escargots frais du littoral", prix: 3500, unite: "500g", categorie: "Viandes", images: ["https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80"] },
  { label: "Gingembre frais (250g)", desc: "Gingembre local tres parfume", prix: 600, unite: "250g", categorie: "Epices", images: ["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80"] },
  { label: "Ail frais (250g)", desc: "Ail local fort et aromatique", prix: 700, unite: "250g", categorie: "Epices", images: ["https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80"] },
  { label: "Cube Maggi (boite 100)", desc: "Assaisonnement cuisine africaine", prix: 2000, unite: "boite", categorie: "Epices", images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"] },
  { label: "Jus de gingembre (1L)", desc: "Boisson naturelle au gingembre frais", prix: 1500, unite: "litre", categorie: "Boissons", images: ["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80"] },
  { label: "Bissap (1L)", desc: "Jus d hibiscus naturel et rafraichissant", prix: 1200, unite: "litre", categorie: "Boissons", images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80"] },
  { label: "Vin de palme (1L)", desc: "Vin de palme traditionnel du littoral", prix: 1000, unite: "litre", categorie: "Boissons", images: ["https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=80"] },
];

async function main() {
  console.log("Seeding market produits...");
  // Vider d'abord pour éviter les doublons
  await prisma.marketProduit.deleteMany();
  for (const p of PRODUITS) {
    await prisma.marketProduit.create({ data: p });
  }
  console.log(`${PRODUITS.length} produits seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
