import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

// Routes publiques — accessibles sans authentification
const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/cgu",
  "/mentions-legales",
  "/politique-confidentialite",
];

// Préfixes publics toujours accessibles (SEO / metadata / assets)
const PUBLIC_PREFIXES = ["/robots", "/sitemap", "/icon", "/apple-icon", "/manifest"];

// Routes d'auth — uniquement pour utilisateurs non connectés
const AUTH_PATHS = ["/login", "/signup"];

// Routes explicitement protégées (nécessitent connexion)
const PROTECTED_PREFIXES = ["/app", "/subscribe"];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}.`) || pathname.startsWith(`${p}/`));
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((p) => pathname.startsWith(p));
}

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Utilisateur connecté tentant d'accéder aux pages auth → /app
  if (user && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Pages publiques (SEO, landing, légal) : toujours accessibles
  if (isPublic(pathname) || isAuthPath(pathname)) {
    return supabaseResponse;
  }

  // Routes protégées (/app/*, /subscribe) : nécessitent connexion
  if (isProtected(pathname)) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // Tout le reste (routes inconnues) : laisse passer pour que Next.js
  // rende la page 404 correctement.
  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclut : endpoints API, assets statiques, webhook Stripe.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)).*)",
  ],
};
