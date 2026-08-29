"use client";
import { useSession } from "next-auth/react";

import {
  hasPermission,
  type Permission,
} from "./permissions";

export function usePermission() {
  const { data: session, status } = useSession();

  const resources =
    (session?.user as any)?.resource;

  const checkPermission = (
    resource: string,
    permission: Permission
  ): boolean => {
    return hasPermission(
      resources,
      resource,
      permission
    );
  };

  return {
    hasPermission: checkPermission,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}