import "next-auth";
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    username: string;
    accessToken: string;
    accessTokenExpiresAt: number;
    resource: Record<
      string,
      Array<
        "VIEW" |
        "CREATE" |
        "UPDATE" |
        "DELETE"
      >
    >;
  }

  interface Session {
    user: User;
    accessToken: string;
    accessTokenExpiresAt: number;
    error?: "AccessTokenExpired";
  }
}
