export const RESOURCE = {
  DASHBOARD: "DASHBOARD",
  PERFIL: "PERFIL",
  PERMISSOES: "PERMISSOES",
  RECURSO: "RECURSO",
  USUARIO: "USUARIO",
} as const;

export type Resource =
  (typeof RESOURCE)[keyof typeof RESOURCE];
