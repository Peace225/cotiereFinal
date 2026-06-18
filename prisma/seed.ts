import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Début du remplissage de la base de données...")

  // Nettoyage complet pour repartir sur des bases saines
  await prisma.room.deleteMany({})
  await prisma.villeContenu.deleteMany({})
  await prisma.excursion.deleteMany({})

  // =====================================================================
  // 1. HÔTELS & RÉSIDENCES (Table: Room)
  // =====================================================================
  const rooms = [
    { 
      name: "La Baie d'Assinie Boutique Hotel", 
      slug: "baie-assinie-boutique-hotel", 
      capacity: 2, 
      description: "Un écrin de paradis niché entre l'océan et la lagune.", 
      pricePerNight: 180000, 
      city: "Assinie Mafia", 
      quartier: "Assinie",
      type: "Hôtel", 
      rating: 9.4, 
      images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"],
      amenities: ["WiFi gratuit", "Piscine", "Climatisation", "Plage privée"],
      isFeatured: true,
      isPopular: true
    },
    { 
      name: "San Pedro Ocean View", 
      slug: "san-pedro-ocean-view", 
      capacity: 2, 
      description: "Réveillez-vous avec le bruit des vagues et une vue panoramique.", 
      pricePerNight: 85000, 
      city: "San Pedro", 
      quartier: "Balmer",
      type: "Hôtel", 
      rating: 8.8, 
      images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"],
      amenities: ["Plage privée", "Restaurant", "Climatisation", "Parking gratuit"],
      isFeatured: true
    },
    { 
      name: "Grand-Béréby Spa & Resort", 
      slug: "grand-bereby-spa-resort", 
      capacity: 4, 
      description: "Le grand luxe face à la somptueuse Baie des Sirènes.", 
      pricePerNight: 250000, 
      city: "Grand-Béréby", 
      quartier: "Baie des Sirènes",
      type: "Hôtel", 
      rating: 9.6, 
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
      amenities: ["Spa complet", "Piscine à débordement", "Vue mer"],
      isWeekend: true
    },
    { 
      name: "Jacqueville Plage Resort", 
      slug: "jacqueville-plage-resort", 
      capacity: 3, 
      description: "Piscine à débordement et bungalows modernes.", 
      pricePerNight: 120000, 
      city: "Jacqueville", 
      quartier: "Centre",
      type: "Hôtel", 
      rating: 8.5, 
      images: ["https://images.unsplash.com/photo-1551882547-ff40c0d582af?w=800&q=80"],
      amenities: ["Piscine", "WiFi gratuit", "Bar extérieur"]
    },
    { 
      name: "Les Rochers de Sassandra", 
      slug: "les-rochers-de-sassandra", 
      capacity: 2, 
      description: "Vue imprenable sur l'embouchure du fleuve et l'océan.", 
      pricePerNight: 95000, 
      city: "Sassandra", 
      quartier: "Falaises",
      type: "Hôtel", 
      rating: 8.9, 
      images: ["https://images.unsplash.com/photo-1542314831-c6a4d27de6a1?w=800&q=80"],
      amenities: ["Balcon", "Restaurant", "Vue panoramique"]
    },
    { 
      name: "Résidence Océane Bassam", 
      slug: "residence-oceane-bassam", 
      capacity: 6, 
      description: "Superbe bâtisse de style colonial entièrement rénovée face à la mer.", 
      pricePerNight: 110000, 
      city: "Grand-Bassam", 
      quartier: "Quartier France",
      type: "Résidence", 
      rating: 8.7, 
      images: ["https://images.unsplash.com/photo-1502672260266-1c1de2d9d0d9?w=800&q=80"],
      amenities: ["Cuisine équipée", "Balcon", "WiFi gratuit", "Climatisation"],
      isWeekend: true
    }
  ]

  for (const room of rooms) {
    await prisma.room.create({ data: room })
  }

  // =====================================================================
  // 2. RESTAURANTS, NIGHT CLUBS, LIEUX & STUDIO (Table: VilleContenu)
  // =====================================================================
  const destinationsContenus = [
    // --- ABIDJAN ---
    { ville: "Abidjan", categorie: "nightclub", nom: "Le Mix", description: "Le club le plus select de la Zone 4.", adresse: "Zone 4", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", prix: "Entrée payante", note: 4.8 },
    { ville: "Abidjan", categorie: "tourisme", nom: "Plateau & Musée des Civilisations", description: "Le centre d'affaires et la richesse historique.", adresse: "Plateau", image: "https://images.unsplash.com/photo-1589308078059-be1415eab49a?w=800&q=80", prix: "Gratuit", note: 4.5 },

    // --- ASSINIE MAFIA ---
    { ville: "Assinie Mafia", categorie: "nightclub", nom: "Bahia Club", description: "Ambiance sélecte en bord de lagune.", adresse: "Km 5", image: "https://images.unsplash.com/photo-1574391884720-bbc3740c9d31?w=800&q=80", prix: "Entrée libre", note: 4.6 },
    { ville: "Assinie Mafia", categorie: "tourisme", nom: "Embouchure", description: "Lieu où la lagune rencontre l'océan.", adresse: "Pointe d'Assinie", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", prix: "Pirogue 20k", note: 4.9 },

    // --- GRAND-BASSAM ---
    { ville: "Grand-Bassam", categorie: "restaurant", nom: "Le Quai de Bassam", description: "Spécialités de fruits de mer.", adresse: "Quartier France", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", prix: "15k-25k", note: 4.7 },
    { ville: "Grand-Bassam", categorie: "tourisme", nom: "Palais du Gouverneur", description: "Patrimoine historique UNESCO.", adresse: "Quartier France", image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80", prix: "2k", note: 4.8 },

    // --- SAN PEDRO ---
    { ville: "San Pedro", categorie: "tourisme", nom: "Plage de Monogaga", description: "Plage sauvage et rocheuse spectaculaire.", adresse: "San Pedro", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", prix: "Gratuit", note: 4.9 },
    { ville: "San Pedro", categorie: "restaurant", nom: "Le Maritime", description: "Poisson braisé avec vue sur le port.", adresse: "Port de San Pedro", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", prix: "5k-10k", note: 4.4 },

    // --- GRAND-BÉRÉBY ---
    { ville: "Grand-Béréby", categorie: "tourisme", nom: "Baie des Sirènes", description: "L'une des plus belles baies d'Afrique.", adresse: "Baie des Sirènes", image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80", prix: "Gratuit", note: 5.0 },

    // --- SASSANDRA ---
    { ville: "Sassandra", categorie: "tourisme", nom: "Mangrove du fleuve", description: "Exploration en pirogue de la biodiversité.", adresse: "Fleuve Sassandra", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80", prix: "10k", note: 4.7 },

    // --- JACQUEVILLE ---
    { ville: "Jacqueville", categorie: "tourisme", nom: "Île aux cocotiers", description: "Repos et noix de coco sur le sable blanc.", adresse: "Plage de Jacqueville", image: "https://images.unsplash.com/photo-1540202404-b7118816ab9b?w=800&q=80", prix: "Gratuit", note: 4.6 },

    // --- ⚠️ AJOUT : HBL STUDIO+ (Indispensable pour la page d'accueil) ---
    { ville: "Grand-Lahou", categorie: "studio", nom: "Shooting Photo Premium", description: "Séance photo professionnelle en studio ou extérieur.", adresse: "Studio Central", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", prix: "Sur devis", note: 4.9 },
    { ville: "San Pedro", categorie: "studio", nom: "Réalisation Vidéo 4K", description: "Captation vidéo très haute définition et montage.", adresse: "Studio Central", image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=800&q=80", prix: "Sur devis", note: 5.0 },
    { ville: "Abidjan", categorie: "studio", nom: "Prises Aériennes Drone", description: "Vues spectaculaires pour vos événements et clips.", adresse: "En extérieur", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80", prix: "Sur devis", note: 4.8 },
    { ville: "Sassandra", categorie: "studio", nom: "Couverture Événementielle", description: "Immortalisez vos meilleurs moments (mariages, concerts).", adresse: "Sur site", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", prix: "Sur devis", note: 4.7 }
  ];

  for (const lieu of destinationsContenus) {
    await prisma.villeContenu.create({ data: lieu })
  }

  // =====================================================================
  // 3. EXCURSIONS (Table: Excursion)
  // =====================================================================
  const excursions = [
    {
      title: "Safari au Parc National de Taï",
      slug: "safari-parc-national-tai",
      description: "Explorez la dernière grande forêt primaire d'Afrique de l'Ouest.",
      price: 45000,
      duration: "Journée complète",
      location: "San Pedro / Taï",
      images: ["https://images.unsplash.com/photo-1547471080-7cb2ac647a50?w=800&q=80"],
      rating: 4.9,
      isPopular: true
    },
    {
      title: "Croisière sur la Lagune Ébrié",
      slug: "croisiere-lagune-ebrie",
      description: "Découvrez Abidjan sous un nouvel angle, avec dîner à bord.",
      price: 25000,
      duration: "3 heures",
      location: "Abidjan",
      images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"],
      rating: 4.7,
      isPopular: true
    }
  ];

  for (const ex of excursions) {
    // Adapter cette ligne si les champs de ton modèle Excursion sont différents (ex: "nom" au lieu de "title")
    await prisma.excursion.create({ data: ex })
  }

  console.log("🎉 Remplissage complet (Hébergements, Lieux, Studio, Excursions) terminé avec succès !")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())