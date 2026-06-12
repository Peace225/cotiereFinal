import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "./prisma";

async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {}
        },
      },
    }
  );
}

export async function getSession() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Utilisation de l'ID Supabase (UUID) pour chercher dans Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }, 
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });

    if (!dbUser) return null;

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        role: dbUser.role,
      }
    };
  } catch (e) {
    console.error("Erreur critique session :", e);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  
  if (!session) throw new Error("UNAUTHORIZED");
  
  // Vérification stricte du rôle
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  
  return session;
}