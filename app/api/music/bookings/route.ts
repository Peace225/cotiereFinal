import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, forbidden } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bookingSchema = z.object({
  clientFirstName: z.string().min(1),
  clientLastName: z.string().min(1),
  clientPhone: z.string().min(6),
  clientEmail: z.string().email().optional().or(z.literal("")),
  artistName: z.string().optional(),
  projectDescription: z.string().optional(),
  sessionDate: z.string(),
  sessionDuration: z.string(),
  serviceType: z.string().min(1),
  totalAmount: z.number().optional(),
});

export async function GET() {
  try { 
    await requireAdmin(); 
  } catch (e) { 
    return forbidden(); 
  }

  try {
    const bookings = await prisma.musicBooking.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Ajout des en-têtes pour autoriser les cookies/crédients vers l'origine
    const response = ok({ bookings });
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequest(parsed.error.errors[0].message);
    }
    
    const d = parsed.data;
    const booking = await prisma.musicBooking.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        reference: `MUS-${Date.now().toString(36).toUpperCase()}`,
        clientFirstName: d.clientFirstName,
        clientLastName: d.clientLastName,
        clientPhone: d.clientPhone,
        clientEmail: d.clientEmail || "non-fourni@cotiere.ci",
        artistName: d.artistName,
        projectDescription: d.projectDescription,
        sessionDate: new Date(d.sessionDate),
        sessionDuration: d.sessionDuration,
        serviceType: d.serviceType,
        totalAmount: d.totalAmount,
      },
    });
    
    return created(booking);
  } catch (e) {
    return serverError(e);
  }
}