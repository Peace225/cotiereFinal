// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. CrÃ©ation du client Supabase pour le serveur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. VÃ©rification de la session en cours
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 3. Protection de la route /admin
  if (pathname.startsWith("/admin")) {
    
    // Si l'utilisateur n'est pas connectÃ© du tout
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/connexion'
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // RÃ©cupÃ©ration du rÃ´le depuis ta table 'users'
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Si connectÃ© mais pas ADMIN, on le renvoie Ã  l'accueil
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*"], // ProtÃ¨ge toutes les routes qui commencent par /admin
}

