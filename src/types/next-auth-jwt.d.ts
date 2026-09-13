import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    accessToken?: string;
    resource?: Record<
      string,
      Array<"VIEW" | "CREATE" | "UPDATE" | "DELETE">
    >;
  }
}
