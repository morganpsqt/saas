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

// Routes d'auth — uniquement pour utilisateurs non connectés
const AUTH_PATHS = ["/login", "/signup"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((p) => pathname.startsWith(p));
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

  // Routes publiques : toujours accessibles
  if (isPublic(pathname) || isAuthPath(pathname)) {
    return supabaseResponse;
  }

  // Routes protégées (/app/*, /subscribe) : nécessitent connexion
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // On exclut les endpoints API, les assets statiques et le webhook Stripe
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)).*)",
  ],
};
