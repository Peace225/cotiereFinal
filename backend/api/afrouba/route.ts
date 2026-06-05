import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  clientFirstName: z.string().min(1),
  clientLastName: z.string().min(1),
  clientPhone: z.string().min(6),
  clientEmail: z.string().email().optional().or(z.literal("")),
  documentType: z.string().min(2),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const requests = await prisma.afroubaRequest.findMany({ orderBy: { createdAt: "desc" } });
    return ok({ requests });
  } catch (e) { return serverError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);
    const d = parsed.data;
    const request = await prisma.afroubaRequest.create({
      data: {
        reference: `AFR-${Date.now().toString(36).toUpperCase()}`,
        clientFirstName: d.clientFirstName,
        clientLastName: d.clientLastName,
        clientPhone: d.clientPhone,
        clientEmail: d.clientEmail || "non-fourni@cotiere.ci",
        documentType: d.documentType,
        description: d.description,
        attachments: [],
      },
    });
    return created(request);
  } catch (e) { return serverError(e); }
}
