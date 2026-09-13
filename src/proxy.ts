import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getToken } from "next-auth/jwt";

import {
  findRoutePermission,
  resolvePermission,
} from "./auth/route-permissions";

interface ResourcePermissions {
  [resource: string]: string[];
}

export async function proxy(
  request: NextRequest
) {
  const {
    pathname,
    searchParams,
  } = request.nextUrl;

  /*
   * Rotas públicas
   */
  const publicRoutes = [
    "/login",
    "/nao-autorizado",
  ];

  const isPublicRoute =
    publicRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  /*
   * Recupera JWT do NextAuth.
   */
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /*
   * Usuário não autenticado.
   */
  if (!token) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname +
        request.nextUrl.search
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  const route = findRoutePermission(pathname);

  if (!route) {
    return NextResponse.next();
  }

  /*
   * Descobre a permissão necessária
   * para essa URL.
   */
  const permission =
    resolvePermission(
      route,
      searchParams
    );

  /*
   * Recurso que será verificado.
   */
  const resource =
    route.resource;

  /*
   * Permissões do usuário.
   */
  const resources =
    token.resource as
      | ResourcePermissions
      | undefined;

  const permissions =
    resources?.[resource] ?? [];

  /*
   * Verifica autorização.
   */
  const authorized =
    permissions.includes(permission);

  if (!authorized) {
    const unauthorizedUrl =
      new URL(
        "/nao-autorizado",
        request.url
      );

    unauthorizedUrl.searchParams.set(
      "resource",
      resource
    );

    unauthorizedUrl.searchParams.set(
      "permission",
      permission
    );

    return NextResponse.redirect(
      unauthorizedUrl
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
