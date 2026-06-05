import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { created, badRequest, serverError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const { firstName, lastName, email, password, phone, whatsapp } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest("Cet email est déjà utilisé");

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed, phone, whatsapp },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    return created(user);
  } catch (e) {
    return serverError(e);
  }
}
