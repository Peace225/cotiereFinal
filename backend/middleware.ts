import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // CrÃ©ation du client Supabase pour le middleware
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
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // RÃ©cupÃ©ration de la session utilisateur
  const { data: { user } } = await supabase.auth.getUser()

  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 1. Si non connectÃ©, redirection vers la page de connexion
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/connexion'
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // 2. VÃ©rification du rÃ´le dans votre table 'users'
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // 3. Si l'utilisateur n'est pas ADMIN ou SUPER_ADMIN, accÃ¨s refusÃ©
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/?error=forbidden", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}

