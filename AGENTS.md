<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Instruções do frontend

## Estrutura e implementação

- Stack: Next.js 16, React 19, TypeScript, Material UI, NextAuth, React Hook Form e Zod. Confira as versões no `package.json` ao alterar dependências.
- Este projeto usa Pages Router: páginas em `src/pages`, incluindo `_app.tsx`, `_document.tsx` e a rota de NextAuth. Preserve essa estrutura.
- Use `src/hooks/api/<domínio>` para contratos e chamadas de API; `src/features/<domínio>` para estado e regras de apresentação; `src/schemas` para validação.
- Reutilize `DataTable`, os componentes de formulário, `Toast`, `Loading` e os modais existentes.
- Amplie métodos existentes com parâmetros opcionais quando adequado. Não crie um serviço separado de paginação ou um método `listAll` para resolver as listagens atuais.

## Cliente HTTP e paginação

- Use `apiGet`, `apiPost`, `apiPut` e `apiDelete` de `src/services/api.ts` nos hooks. Preserve o contrato discriminado `ApiResult<T>`.
- Verifique `response.success` antes de acessar `response.data`. Mantenha os campos de erro, mensagens e erros por campo.
- `PageRequest` e `PageResponse<T>` ficam em `src/services/api.ts`.
- O método `list({ page = 0, size = 10 } = {})` retorna sempre `Promise<ApiResult<PageResponse<T>>>`. Não retorne array ou página condicionalmente à presença dos parâmetros.
- Monte `page` e `size` com `URLSearchParams` e chame `apiGet` diretamente no hook.
- Os registros estão em `response.data.content`; os totais vêm de `totalElements` e `totalPages`.
- Tabelas de usuários e perfis consultam o servidor ao trocar de página/tamanho. Preserve a proteção contra respostas antigas sobrescreverem a consulta atual e a recuperação de páginas que deixaram de existir.
- `DataTable` com `pagination` exibe o conteúdo recebido sem aplicar `slice` novamente. Sem essa prop, mantém a paginação local para outros usos.
- `useFormUsuario` consulta perfis com `{ page: 0, size: 20 }`. `useFormPerfil` consulta recursos e permissões com os mesmos parâmetros, em paralelo.
- Não percorra páginas com `while` ou buscas recursivas nos formulários. Uma consulta sem paginação será criada por caso específico se necessária e solicitada.

## Autenticação e formulários

- O JWT da API vem de `accessToken` na sessão NextAuth; não o duplique no `localStorage`.
- Preserve o envio Bearer token, o logout em resposta 401 e a autorização de rotas e ações em `src/auth` e `src/proxy.ts`.
- Preserve `profile` como nome e `profileId` como identificador na resposta de usuário.
- `/minha-conta` é acessível por sessão válida, pelo menu do cabeçalho. Use `GET/PUT /usuario/me`; CPF é somente leitura e perfil/status não são editáveis. Ao salvar, atualize o nome da sessão a partir da API, sem confiar em dados de identidade enviados pelo cliente.
- Use React Hook Form com os schemas Zod existentes. Na edição de usuário, senha vazia deve ser omitida para preservar a senha atual.
- Exiba mensagens e rótulos em português e siga o tema e os padrões visuais existentes.

## Validação

Execute a partir de `frontend/`:

```powershell
npx tsc --noEmit
npm test
npm run lint
```

- Use testes pertinentes à alteração; não crie testes que apenas repitam a implementação.
- Rode `npm run build` quando a alteração afetar rotas, configuração, renderização ou a compilação de produção.
- Se Node/npm não estiverem no PATH, use o runtime disponível no ambiente sem instalar ferramentas globalmente.
- Informe checks que falharam ou não concluíram; não declare validação bem-sucedida sem o resultado.
