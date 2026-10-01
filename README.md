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
- Edição do próprio nome e senha em “Minha conta”, pelo menu do usuário.

Os menus usam ícones Material compatíveis com cada ação: pessoas para Usuários, escudo para Perfis, laboratório para Exemplos, gerenciamento de conta para Minha conta e saída para Sair.

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
| `npm test` | Executa os testes automatizados com Vitest |

## Docker

O Docker Compose publica a imagem de produção na porta `3005`:

```bash
docker compose up --build
```

Acesse http://localhost:3005. Para executar com hot reload, use `docker compose --profile dev up --build app-dev`. Os detalhes estão em `README.docker.md`.

## Integração com a API

O cliente HTTP está em `src/services/api.ts`. Caminhos relativos são combinados com `NEXT_PUBLIC_BASE_URL`:

```text
NEXT_PUBLIC_BASE_URL=http://localhost:8085/api
caminho=usuario
URL final=http://localhost:8085/api/usuario
```

Nas chamadas protegidas, o cliente obtém o `accessToken` da sessão assinada do NextAuth e o envia como Bearer token:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Quando uma chamada protegida recebe `401`, o cliente encerra a sessão e redireciona o usuário para o login. O token não é duplicado no `localStorage`.

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
  "expiresInToken": 86400000,
  "nome": "Nome do usuário",
  "username": "00000000000",
  "resource": {
    "USUARIO": ["VIEW", "CREATE", "UPDATE", "DELETE"],
    "PERFIL": ["VIEW", "CREATE"]
  }
}
```

O callback JWT guarda o usuário, o token da API, sua expiração e o mapa `resource` na sessão do NextAuth. Quando o prazo informado em `expiresInToken` termina, o proxy rejeita a sessão e o cliente realiza logout.

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

Todas as páginas privadas exigem uma sessão válida. A matriz em `src/auth/route-permissions.ts` acrescenta a autorização por recurso e operação às rotas administrativas.

## Endpoints consumidos

| Domínio | Operações usadas pelo app |
|---|---|
| Login | `POST /auth/login` |
| Própria conta | `GET /usuario/me`, `PUT /usuario/me` |
| Usuários | `GET /usuario`, `GET /usuario/{id}`, `POST /usuario`, `PUT /usuario/{id}`, `DELETE /usuario/{id}` |
| Perfis | `GET /perfil`, `GET /perfil/{id}`, `POST /perfil`, `PUT /perfil/{id}`, `DELETE /perfil/{id}` |
| Recursos | `GET /recurso`, `GET /recurso/{id}` |
| Permissões | `GET /permissao`, `GET /permissao/{id}` |

Todos os caminhos são relativos a `NEXT_PUBLIC_BASE_URL`.

O cliente HTTP em `src/services/api.ts` interpreta o contrato padronizado de erros da API. O resultado de falha contém `message`, `status`, `errorId` no corpo e a lista `errors`. No formulário de usuário, erros associados a campos são exibidos diretamente nos respectivos controles do React Hook Form.

## Paginação e contrato das listagens

Os hooks `useApiUsuario`, `useApiPerfil`, `useApiRecurso` e `useApiPermissao` usam o método `list` existente, com parâmetros opcionais:

```ts
const response = await list({ page: 0, size: 20 });
if (response.success) {
  const registros = response.data.content;
  const total = response.data.totalElements;
}
```

Sem parâmetros, `list()` usa a página 0 com 10 registros. O retorno é sempre `ApiResult<PageResponse<T>>`: o formato `success`, `data` e os campos de erro do cliente HTTP é preservado. `PageRequest` e `PageResponse` estão em `src/services/api.ts`; cada hook chama `apiGet` diretamente.

As tabelas de usuários e perfis consultam o servidor ao trocar de página ou de tamanho (10, 25 ou 50 registros). `DataTable` recebe `pagination` com a página, o tamanho, o total e os callbacks; nesse modo, exibe os registros recebidos sem aplicar um segundo recorte local. Respostas de consultas antigas são ignoradas e, se a página deixar de existir após uma exclusão, a listagem retorna à última página disponível. Sem `pagination`, a tabela mantém a paginação local.

Os formulários de usuário e perfil consultam apenas a primeira página com 20 registros para as opções de perfis, recursos e permissões. Eles não percorrem todas as páginas. Se um caso precisar de uma lista completa, implemente uma consulta sem paginação específica para esse caso.

## Minha conta

No menu do nome do usuário, escolha **Minha conta** para abrir `/minha-conta`. A página exige uma sessão válida e pode ser usada mesmo sem permissões administrativas de usuários.

O formulário permite alterar o nome e a senha. CPF é somente leitura; perfil e status permanecem sob administração. Deixe a nova senha em branco para manter a senha atual. A troca de senha exige a senha atual e uma nova senha entre 8 e 72 caracteres.

O hook `useFormMinhaConta` usa `getCurrent` e `updateCurrent` de `useApiUsuario`, preservando `ApiResult<IUsuarioResponse>`. Após salvar, os campos de senha são limpos e a sessão NextAuth relê o nome na API para atualizar o cabeçalho. A atualização da sessão não aceita identidade nem permissões enviadas pelo navegador.

## Estrutura principal

```text
src/
├── auth/             # Recursos, permissões e regras por rota
├── components/       # Componentes genéricos
├── config/           # Identidade e configurações da aplicação
├── features/         # Estado e regras de apresentação por funcionalidade
├── hooks/api/        # Contratos e chamadas por domínio
├── layout/components/# Componentes de layout
├── pages/            # Páginas e rotas de API do Next.js
├── schemas/          # Validações Zod
├── services/         # Cliente HTTP e erros
└── proxy.ts          # Autenticação e autorização
```

## Contratos principais

Usuário:

```ts
interface IUsuarioRequest {
  id?: string;
  cpf: string;
  name: string;
  profileId: string;
  password?: string;
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
- Execute `npm run lint`, `npm test` e `npm run build` na integração contínua.
- Mantenha `NEXT_PUBLIC_BASE_URL` definido durante o build da imagem Docker, pois variáveis públicas são incorporadas ao bundle do navegador.

## Documentação da API

Payloads completos, respostas, erros HTTP e matriz de permissões estão no README do [starter-package-api](https://github.com/wagnerlemos94/starter-package-api).
