import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiPostLogin } from "../../../services/api";

interface ILoginResponse {
  success: true,
  data: {
    token: string,
    expiresInToken: number,
    nome: string,
    username: string
  }
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
        console.log(cpf, senha)
        try {
          const response = await apiPostLogin<any>("auth/login", { cpf, password: senha });
          console.log('Resposta do login:', response);

          // apiPostLogin retorna ApiResult<T>. O backend pode devolver o payload em
          // diferentes níveis (por exemplo: { token } ou { data: { token } }).
          if (!response || !response.success) return null;

          const payload = response.data;
          // Tentar extrair token flexivelmente
          const tokenValue = (payload && ((payload.token) ?? (payload.data && payload.data.token))) ?? null;
          if (!tokenValue) return null;

          const username = (payload && (payload.username ?? payload.data?.username)) ?? "";
          const nome = (payload && (payload.nome ?? payload.data?.nome)) ?? "";
          const resource = (payload && (payload.resource ?? payload.data?.resource)) ?? {};

          return {
            id: username,
            name: nome,
            username,
            token: tokenValue,
            resource
          };
        } catch (err) {
          console.error("Authorize error:", err);
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
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
        token.accessToken = user.token;
        token.resource = user.resource;
      }

      return token;
    },
    async session({ session, token }: any) {
      (session as any).user = (token as any).user;
      (session as any).accessToken = (token as any).accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
