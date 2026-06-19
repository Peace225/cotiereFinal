import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, forbidden, badRequest, serverError } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  nationality: z.string().optional(),
});

// GET /api/client/profile
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return forbidden();
    const userId = (session.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        whatsapp: true,
        nationality: true,
        createdAt: true,
      },
    });

    if (!user) return forbidden();
    return ok(user);
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/client/profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return forbidden();
    const userId = (session.user as { id: string }).id;

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const user = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        whatsapp: true,
        nationality: true,
      },
    });

    return ok(user);
  } catch (e) {
    return serverError(e);
  }
}


