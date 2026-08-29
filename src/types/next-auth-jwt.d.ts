import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      name: string;
      username: string;
      token: string;
      resource: Record<
        string,
        Array<
          "VIEW" |
          "CREATE" |
          "UPDATE" |
          "DELETE"
        >
      >;
    };

    accessToken?: string;
  }
}