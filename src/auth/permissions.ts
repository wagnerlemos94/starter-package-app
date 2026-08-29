export type Permission =
  | "VIEW"
  | "CREATE"
  | "UPDATE"
  | "DELETE";

export type ResourcePermissions = Record<
  string,
  Permission[]
>;

export function hasPermission(
  resources: ResourcePermissions | undefined,
  resource: string,
  permission: Permission
): boolean {
  if (!resources) {
    return false;
  }
  return resources[resource]?.includes(permission) ?? false;
}