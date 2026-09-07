# Starter Package App

Aplicação web de referência para autenticação e administração de usuários, perfis e permissões. O projeto consome a [Starter Package API](https://github.com/wagnerlemos94/starter-package-api) e usa Next.js 16, React 19, TypeScript, Material UI, NextAuth, React Hook Form e Zod.

Repositórios relacionados:

- Aplicação web: https://github.com/wagnerlemos94/starter-package-app
- API: https://github.com/wagnerlemos94/starter-package-api

## Funcionalidades

- Login com CPF e senha.
- Sessão JWT gerenciada pelo NextAuth.
- Controle de acesso por recurso e operação.
- CRUD de usuários.
- CRUD de perfis e associação de permissões.
- Consulta de recursos e permissões fornecidos pela API.
- Componentes reutilizáveis para formulários, tabelas e modais.

## Requisitos

- Node.js 24, conforme a imagem Docker
- npm
- Starter Package API acessível

## Configuração

Crie ou ajuste o arquivo `.env`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8085/api
NEXTAUTH_SECRET=substitua-por-um-segredo-forte
NEXTAUTH_URL=http://localhost:3000
```

| Variável | Escopo | Descrição |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Navegador e servidor | URL completa da API, incluindo `/api` |
| `NEXTAUTH_SECRET` | Servidor | Segredo usado para assinar e ler a sessão |
| `NEXTAUTH_URL` | Servidor | URL pública da aplicação; recomendada fora do desenvolvimento |

Não use o valor de exemplo de `NEXTAUTH_SECRET` em produção.

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Executa a versão compilada |
| `npm run lint` | Executa o ESLint |

## Docker

O Docker Compose publica a aplicação na porta `3005`:

```bash
docker compose up --build
```

Acesse http://localhost:3005. O compose usa bind mount e `npm run dev`, sendo voltado ao desenvolvimento.

## Integração com a API

O cliente HTTP está em `src/services/api.ts`. Caminhos relativos são combinados com `NEXT_PUBLIC_BASE_URL`:

```text
NEXT_PUBLIC_BASE_URL=http://localhost:8085/api
caminho=user
URL final=http://localhost:8085/api/user
```

Nas chamadas protegidas, o token armazenado como `accessToken` no `localStorage` é enviado como Bearer token:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Quando a API informa que o token expirou, o cliente remove o token local e inicia o logout.

## Autenticação

A tela envia `cpf` e `senha` ao NextAuth. O provedor de credenciais converte a senha para o contrato da API:

```json
{
  "cpf": "00000000000",
  "password": "sua-senha"
}
```

Endpoint consumido:

```http
POST /auth/login
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresInToken": "",
  "nome": "Nome do usuário",
  "username": "00000000000",
  "resource": {
    "USUARIO": ["VIEW", "CREATE", "UPDATE", "DELETE"],
    "PERFIL": ["VIEW", "CREATE"]
  }
}
```

O callback JWT guarda o usuário, o token da API e o mapa `resource` na sessão do NextAuth.

## Autorização

As permissões seguem o contrato da API:

- Recursos: `USUARIO`, `PERFIL`, `RECURSO` e `PERMISSOES`.
- Operações: `VIEW`, `CREATE`, `UPDATE` e `DELETE`.

O proxy protege atualmente:

| Página | Regra |
|---|---|
| `/usuario` | `USUARIO:VIEW` |
| `/usuario/formUsuario` | `USUARIO:CREATE` |
| `/usuario/formUsuario?id=<uuid>` | `USUARIO:UPDATE` |
| `/perfil` | `PERFIL:VIEW` |
| `/perfil/formPerfil` | `PERFIL:CREATE` |
| `/perfil/formPerfil?id=<uuid>` | `PERFIL:UPDATE` |

Usuários sem sessão são redirecionados para `/login`. Usuários sem a permissão exigida vão para `/nao-autorizado`, com `resource` e `permission` na URL.

Páginas ausentes de `src/auth/route-permissions.ts` não recebem controle de permissão pelo proxy.

## Endpoints consumidos

| Domínio | Operações usadas pelo app |
|---|---|
| Login | `POST /auth/login` |
| Usuários | `GET /user`, `GET /user/{id}`, `POST /user`, `PUT /user/{id}`, `DELETE /user/{id}` |
| Perfis | `GET /profile`, `GET /profile/{id}`, `POST /profile`, `PUT /profile/{id}`, `DELETE /profile/{id}` |
| Recursos | `GET /resource`, `GET /resource/{id}` |
| Permissões | `GET /permission`, `GET /permission/{id}` |

Todos os caminhos são relativos a `NEXT_PUBLIC_BASE_URL`.

O cliente HTTP em `src/services/api.ts` interpreta o contrato padronizado de erros da API. O resultado de falha contém `message`, `status`, `errorId` no corpo e a lista `errors`. No formulário de usuário, erros associados a campos são exibidos diretamente nos respectivos controles do React Hook Form.

## Estrutura principal

```text
src/
├── auth/             # Recursos, permissões e regras por rota
├── components/       # Componentes genéricos
├── hooks/api/        # Contratos e chamadas por domínio
├── layout/componets/ # Componentes de layout
├── pages/            # Páginas e rotas de API do Next.js
├── schemas/          # Validações Zod
├── services/         # Cliente HTTP e erros
└── proxy.ts          # Autenticação e autorização
```

O diretório `componets` mantém a grafia atual do código.

## Contratos principais

Usuário:

```ts
interface IUsuarioRequest {
  id?: string;
  cpf: string;
  name: string;
  profileId: string;
  active: boolean;
}
```

Perfil:

```ts
interface IPerfilRequest {
  id?: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  perfilRecurso: Record<string, string[]>;
}
```

Em `perfilRecurso`, cada chave é o UUID de um recurso e seu valor é a lista de UUIDs das permissões atribuídas.

## Observações para produção

- Defina um `NEXTAUTH_SECRET` forte e exclusivo por ambiente.
- Configure `NEXTAUTH_URL` com a URL pública correta.
- Remova logs de CPF, senha, token e respostas de autenticação.
- Evite manter o token simultaneamente na sessão e no `localStorage` sem uma estratégia explícita.
- Adicione todas as páginas privadas à matriz de rotas protegidas.
- Execute `npm run lint` e `npm run build` na integração contínua.
- Use uma imagem Docker de produção com build em múltiplos estágios.

## Documentação da API

Payloads completos, respostas, erros HTTP e matriz de permissões estão no README do [starter-package-api](https://github.com/wagnerlemos94/starter-package-api).
