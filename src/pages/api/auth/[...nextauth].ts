import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiPostLogin } from "../../../services/api";
import type { ResourcePermissions } from "../../../auth/permissions";
import {
  ACCESS_TOKEN_EXPIRED,
  calculateAccessTokenExpiresAt,
  isAccessTokenExpired,
} from "../../../auth/session";

interface ILoginResponse {
  token: string;
  expiresInToken: number;
  nome: string;
  username: string;
  resource: ResourcePermissions;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        cpf: { label: "CPF", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { cpf, senha } = credentials as { cpf?: string; senha?: string };
        try {
          const response = await apiPostLogin<ILoginResponse>("auth/login", { cpf, password: senha });
          if (!response.success) return null;

          const { token, expiresInToken, username, nome, resource } = response.data;
          const accessTokenExpiresAt = calculateAccessTokenExpiresAt(expiresInToken);
          if (!accessTokenExpiresAt) return null;

          return {
            id: username,
            name: nome,
            username,
            accessToken: token,
            accessTokenExpiresAt,
            resource
          };
        } catch {
          // Em vez de lançar um erro que faz o Next.js retornar uma página HTML
          // (causando o `Unexpected token '<'` no cliente), retornar `null`
          // indica falha na autenticação e faz o cliente receber JSON.
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.resource = user.resource;
      }

      return token;
    },
    async session({ session, token }) {
      const expired = isAccessTokenExpired(token.accessTokenExpiresAt);

      session.user.username = token.username ?? "";
      session.user.resource = token.resource ?? {};
      session.accessToken = expired ? "" : token.accessToken ?? "";
      session.accessTokenExpiresAt = token.accessTokenExpiresAt ?? 0;
      session.error = expired ? ACCESS_TOKEN_EXPIRED : undefined;
      return session;
    },
  },
};

export default NextAuth(authOptions);
