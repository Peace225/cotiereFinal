import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["CLIENT", "ADMIN"]).default("CLIENT"),
});

export async function GET() {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const clients = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, whatsapp: true, role: true, emailVerified: true, createdAt: true,
        _count: {
          select: {
            studioBookings: true,
            excursionBookings: true,
            eventRequests: true,
            hotelBookings: true,
          },
        },
      },
    });
    return ok(clients);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email: d.email } });
    if (existing) return badRequest("Un compte avec cet email existe déjà");

    const password = d.password
      ? await bcrypt.hash(d.password, 12)
      : await bcrypt.hash(Math.random().toString(36).slice(2) + "Cotiere!", 12);

    const user = await prisma.user.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone,
        whatsapp: d.whatsapp,
        password,
        role: d.role,
        emailVerified: true,
      },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, whatsapp: true, role: true, emailVerified: true, createdAt: true,
        _count: { select: { studioBookings: true, excursionBookings: true, eventRequests: true, hotelBookings: true } },
      },
    });
    return created(user);
  } catch (e) {
    return serverError(e);
  }
}
