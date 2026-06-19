import { prisma } from "@/lib/prisma";
import { ok, forbidden, serverError } from "@/lib/api-response";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return forbidden();
    const userId = (session.user as { id: string }).id;

    const [studio, excursions, events, music, equipment, hotel] = await Promise.all([
      prisma.studioBooking.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { id: true, reference: true, eventType: true, eventDate: true, status: true, totalAmount: true, estimatedPriceMin: true, createdAt: true } }),
      prisma.excursionBooking.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { excursions: { select: { title: true } } } }),
      prisma.eventRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { id: true, reference: true, eventType: true, eventDate: true, status: true, totalAmount: true, createdAt: true, description: true, eventLocation: true } }),
      prisma.musicBooking.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { id: true, reference: true, serviceType: true, sessionDate: true, status: true, totalAmount: true, createdAt: true } }),
      // ✅ CORRECTION : Remplacement de 'equipment_rental_items' par 'equipment_rental_items' ou 'items' selon votre schéma (ici 'equipment_rental_items')
      prisma.equipmentRental.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { equipment_rental_items: { include: { equipment: { select: { name: true } } } } } }),
      // ✅ CORRECTION : Remplacement de 'room' par 'rooms'
      prisma.hotelBooking.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { rooms: { select: { name: true, images: true } } } }),
    ]);

    return ok({
      studio: studio.map(b => ({
       ...b, type: "studio", label: b.eventType,
        image: "https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=100&q=80",
        pageUrl: "/services/studio",
      })),
      excursions: excursions.map(b => ({
       ...b, type: "excursion", label: b.excursions?.title || "Excursion",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&q=80",
        pageUrl: `/services/tourisme/${b.excursionId}`,
      })),
      events: events.map(b => {
        const MARKET_IMAGES: Record<string, string> = {
          "Attieke frais (1kg)": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&q=80",
          "Attieke frais (5kg)": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&q=80",
          "Poisson braise": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=100&q=80",
          "Crevettes fraiches (500g)": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&q=80",
          "Homard": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&q=80",
          "Ananas frais": "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=100&q=80",
          "Mangues (1kg)": "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=100&q=80",
          "Panier mixte fruits de mer": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=100&q=80",
        };
        const HOTEL_IMAGES: Record<string, string> = {
          "Chambre Standard": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=80",
          "Chambre Superieure": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=100&q=80",
          "Chambre Supérieure": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=100&q=80",
          "Suite Familiale": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&q=80",
        };
        const EVENT_IMAGES: Record<string, string> = {
          "Mariage": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&q=80",
          "Anniversaire": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&q=80",
          "Conference": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80",
          "Bapteme": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100&q=80",
        };
        const produitName = b.eventType?.replace(/^Commander\s*:\s*/i, "").trim() ?? "";
        const image =
          MARKET_IMAGES[produitName] ??
          HOTEL_IMAGES[b.eventType ?? ""] ??
          EVENT_IMAGES[b.eventType ?? ""] ??
          (b.eventType === "Commande Market" ? "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=100&q=80" : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&q=80");
        const HOTEL_IDS: Record<string, string> = {
          "Chambre Standard": "1", "Chambre Superieure": "2", "Chambre Supérieure": "2", "Suite Familiale": "3",
        };
        const hotelId = HOTEL_IDS[b.eventType ?? ""];
        const pageUrl = hotelId
          ? `/services/hebergement/${hotelId}`
          : b.eventLocation?.startsWith("http") ? b.eventLocation : "/services/market";
        return {...b, type: "event", label: b.eventType, image, pageUrl };
      }),
      // ✅ CORRECTION : Remplacement de b.room.name / b.room.images par b.rooms.name / b.rooms.images
      hotel: hotel.map(b => ({
       ...b, type: "hotel", label: b.rooms?.name || "Chambre",
        image: b.rooms?.images?.[0] ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=80",
        pageUrl: `/services/hebergement/${b.roomId}`,
        eventDate: b.checkIn,
      })),
      music: music.map(b => ({
       ...b, type: "music", label: b.serviceType,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&q=80",
        pageUrl: "/services/music",
      })),
      // ✅ CORRECTION : Ajustement pour correspondre à l'include défini plus haut (equipment_rental_items)
      equipment: equipment.map(b => ({
       ...b, type: "equipment", label: (b.equipment_rental_items || []).map(i => i.equipment?.name).join(", ") || "Équipements",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80",
        pageUrl: "/services/location",
      })),
    });
  } catch (e) { return serverError(e); }
}

