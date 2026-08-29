import { RESOURCE } from "./resources";
import { Permission } from "./permissions";

type RoutePermission = {
  prefix: string;
  resource: string;
  type: "VIEW" | "FORM";
};

export const routePermissions: RoutePermission[] = [
  {
    prefix: "/usuario/formUsuario",
    resource: RESOURCE.USUARIO,
    type: "FORM",
  },
  {
    prefix: "/usuario",
    resource: RESOURCE.USUARIO,
    type: "VIEW",
  },

  {
    prefix: "/perfil/formPerfil",
    resource: RESOURCE.PERFIL,
    type: "FORM",
  },
  {
    prefix: "/perfil",
    resource: RESOURCE.PERFIL,
    type: "VIEW",
  },
];

export function findRoutePermission(
  pathname: string
) {
  return routePermissions
    .filter(
      ({ prefix }) =>
        pathname === prefix ||
        pathname.startsWith(`${prefix}/`)
    )
    .sort(
      (a, b) =>
        b.prefix.length - a.prefix.length
    )[0];
}

export function resolvePermission(
  route: RoutePermission,
  searchParams: URLSearchParams
): Permission {
  /*
   * Formulário:
   *
   * /formResponsavel
   *          ↓
   *       CREATE
   *
   * /formResponsavel?id=1
   *          ↓
   *       UPDATE
   */
  if (route.type === "FORM") {
    const id = searchParams.get("id");

    if (id) {
      return "UPDATE";
    }

    return "CREATE";
  }

  /*
   * Página normal
   */
  return "VIEW";
}