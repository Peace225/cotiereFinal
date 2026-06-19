import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, badRequest, serverError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const blockSchema = z.object({
  serviceType: z.enum(["studio", "excursion", "hotel", "music"]),
  serviceId: z.string().optional(),
  date: z.string(),
  reason: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const month = searchParams.get("month");
    let startDate: Date, endDate: Date;
    if (month) {
      const [year, m] = month.split("-").map(Number);
      startDate = new Date(year, m - 1, 1);
      endDate = new Date(year, m, 0);
    } else {
      startDate = new Date();
      endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    }
    const where: any = {
       ...(service ? { serviceType: service } : {}),
       date: { gte: startDate, lte: endDate },
    };
    // âœ… CORRIGÃ‰ : Utilisation du modÃ¨le pluriel exact blocked_dates
    const blocked = await prisma.blocked_dates.findMany({ where });
    return ok(blocked);
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const body = await req.json();
    const parsed = blockSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);
    // âœ… CORRIGÃ‰ : Utilisation du modÃ¨le pluriel exact blocked_dates
    const blocked = await prisma.blocked_dates.create({
      data: {
        id: crypto.randomUUID(),
        serviceType: parsed.data.serviceType,
        serviceId: parsed.data.serviceId,
        date: new Date(parsed.data.date),
        reason: parsed.data.reason,
      },
    });
    return ok(blocked);
  } catch (e) { return serverError(e); }
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return forbidden(); }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return badRequest("ID requis");
    // âœ… CORRIGÃ‰ : Utilisation du modÃ¨le pluriel exact blocked_dates
    await prisma.blocked_dates.delete({ where: { id } });
    return ok({ message: "Date dÃ©bloquÃ©e" });
  } catch (e) { return serverError(e); }
}

