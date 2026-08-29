export const RESOURCE = {
  PERFIL: "PERFIL",
  PERMISSOES: "PERMISSOES",
  RECURSO: "RECURSO",
  USUARIO: "USUARIO",
} as const;

export type Resource =
  (typeof RESOURCE)[keyof typeof RESOURCE];