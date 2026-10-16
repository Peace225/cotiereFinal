
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ======================================================
// TYPES
// ======================================================

type SearchResult = {
  id: string;
  titre: string;
  type: string;
  description: string | null;
  image: string | null;
  images: string[];
  prix: number | null;
  destination: string;
  rating: number | null;
  service: string;

  // Informations spécifiques aux chambres
  slug?: string;
  quartier?: string | null;
  capacity?: number;
  amenities?: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isWeekend?: boolean;
};

// ======================================================
// UTILITAIRES
// ======================================================

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function toText(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function toNumber(value: unknown): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed = Number(
      value.replace(/\s/g, "").replace(",", ".")
    );

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

function parsePositiveInt(
  value: string | null,
  fallback: number
): number {
  if (!value || !value.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0
    ? parsed
    : fallback;
}

// ======================================================
// IMAGES
// ======================================================

function getImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return [
      ...new Set(
        value
          .flatMap((item) => getImages(item))
          .filter(Boolean)
      ),
    ];
  }

  if (typeof value === "string") {
    const text = value.trim();

    if (!text) return [];

    if (text.startsWith("[") || text.startsWith("{")) {
      try {
        return getImages(JSON.parse(text));
      } catch {
        return [];
      }
    }

    return [text];
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const image = value as Record<string, unknown>;

    return getImages(
      image.url ?? image.src ?? image.path
    );
  }

  return [];
}

// ======================================================
// RECHERCHE
// ======================================================

function matchesSearch(
  values: unknown[],
  query: string
): boolean {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return true;

  const searchable = normalize(
    values
      .filter(
        (value) =>
          value !== null &&
          value !== undefined
      )
      .map(String)
      .join(" ")
  );

  return normalizedQuery
    .split(" ")
    .filter(Boolean)
    .every((word) => searchable.includes(word));
}

// ======================================================
// CATÉGORIES
// ======================================================

function matchesCategory(
  type: string,
  category: string
): boolean {
  const selected = normalize(category);
  const actual = normalize(type);

  if (
    !selected ||
    selected === "tous" ||
    selected === "tout"
  ) {
    return true;
  }

  switch (selected) {
    case "hotel":
      return actual.includes("hotel");

    case "residence":
      return actual.includes("residence");

    case "villa":
      return actual.includes("villa");

    case "maison":
    case "maison d hotes":
      return (
        actual.includes("maison") ||
        actual.includes("hote")
      );

    default:
      return actual.includes(selected);
  }
}

// ======================================================
// PAGINATION
// ======================================================

function paginate(
  data: SearchResult[],
  page: number,
  limit: number
) {
  const total = data.length;
  const start = (page - 1) * limit;

  return {
    data: data.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: start + limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

// ======================================================
// GET /api/recherche
// ======================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const service = normalize(
      searchParams.get("service") || ""
    );

    const dest = (
      searchParams.get("dest") || ""
    ).trim();

    const category =
      searchParams.get("categorie") ||
      searchParams.get("type") ||
      "Tous";

    const page = parsePositiveInt(
      searchParams.get("page"),
      1
    );

    const limit = Math.min(
      parsePositiveInt(
        searchParams.get("limit"),
        50
      ),
      100
    );

    // ==================================================
    // 1. HÉBERGEMENTS
    // ==================================================

    const isStayService = [
      "sejours",
      "hebergements",
      "rooms",
    ].includes(service);

    const isExcursionService = [
      "excursions",
      "excursion",
    ].includes(service);

    const isEventService = [
      "evenements",
      "evenement",
    ].includes(service);

    if (
      service &&
      !isStayService &&
      !isExcursionService &&
      !isEventService
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Service de recherche inconnu.",
        },
        { status: 400 }
      );
    }

    let accommodations: SearchResult[] = [];

    if (!service || isStayService) {
      const rooms = await prisma.rooms.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          type: true,
          capacity: true,
          pricePerNight: true,
          images: true,
          amenities: true,
          city: true,
          quartier: true,
          rating: true,
          isFeatured: true,
          isPopular: true,
          isWeekend: true,
        },
        orderBy: [
          { isFeatured: "desc" },
          { isPopular: "desc" },
          { createdAt: "desc" },
        ],
      });

      accommodations = rooms
        .filter((room) => {
          const destinationMatches = matchesSearch(
            [
              room.name,
              room.description,
              room.city,
              room.quartier,
              room.type,
            ],
            dest
          );

          const categoryMatches = matchesCategory(
            room.type,
            category
          );

          return destinationMatches && categoryMatches;
        })
        .map((room): SearchResult => {
          const images = getImages(room.images);

          return {
            id: room.id,
            slug: room.slug,
            titre: room.name,
            type: room.type,
            description:
              toText(room.description) || null,
            image: images[0] || null,
            images,
            prix: room.pricePerNight,
            destination:
              toText(room.city) || "Côte d'Ivoire",
            quartier: room.quartier,
            capacity: room.capacity,
            amenities: room.amenities,
            rating:
              room.rating > 0
                ? room.rating
                : null,
            isFeatured: room.isFeatured,
            isPopular: room.isPopular,
            isWeekend: room.isWeekend,
            service: "sejours",
          };
        });
    }

    // ==================================================
    // 2. RÉPONSE SÉJOURS
    // ==================================================

    if (isStayService) {
      return NextResponse.json({
        success: true,
        service: "sejours",
        ...paginate(accommodations, page, limit),
      });
    }

    // ==================================================
    // 3. EXCURSIONS
    // ==================================================

    let excursionResults: SearchResult[] = [];

    if (!service || isExcursionService) {
      const excursions =
        await prisma.excursions.findMany({
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            priceAdult: true,
            images: true,
          },
        });

      excursionResults = excursions
        .filter((excursion) =>
          matchesSearch(
            [
              excursion.title,
              excursion.description,
            ],
            dest
          )
        )
        .map((excursion): SearchResult => {
          const images = getImages(excursion.images);

          return {
            id: excursion.id,
            titre: excursion.title,
            type: "Excursion",
            description: excursion.description,
            image: images[0] || null,
            images,
            prix: excursion.priceAdult,
            destination: dest,
            rating: null,
            service: "excursions",
          };
        });
    }

    // ==================================================
    // 4. RÉPONSE EXCURSIONS
    // ==================================================

    if (isExcursionService) {
      return NextResponse.json({
        success: true,
        service: "excursions",
        ...paginate(excursionResults, page, limit),
      });
    }

    // ==================================================
    // 5. ÉVÉNEMENTS
    // ==================================================

    let eventResults: SearchResult[] = [];

    if (!service || isEventService) {
      const events = await prisma.evenement.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          titre: true,
          description: true,
          image: true,
          prix: true,
          ville: true,
          lieu: true,
        },
      });

      eventResults = events
        .filter((event) =>
          matchesSearch(
            [
              event.titre,
              event.description,
              event.ville,
              event.lieu,
            ],
            dest
          )
        )
        .map((event): SearchResult => {
          const images = getImages(event.image);

          return {
            id: event.id,
            titre: event.titre,
            type: "Événement",
            description:
              toText(event.description) || null,
            image: images[0] || null,
            images,
            prix: toNumber(event.prix),
            destination:
              event.ville || event.lieu,
            rating: null,
            service: "evenements",
          };
        });
    }

    // ==================================================
    // 6. RÉPONSE ÉVÉNEMENTS
    // ==================================================

    if (isEventService) {
      return NextResponse.json({
        success: true,
        service: "evenements",
        ...paginate(eventResults, page, limit),
      });
    }

    // ==================================================
    // 7. RECHERCHE GÉNÉRALE
    // ==================================================

    const results = [
      ...accommodations,
      ...excursionResults,
      ...eventResults,
    ];

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error(
      "[API RECHERCHE] Erreur :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Impossible de récupérer les annonces.",
      },
      { status: 500 }
    );
  }
}
