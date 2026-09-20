# Execução com Docker

## Produção

Defina `NEXTAUTH_SECRET` no arquivo `.env` e execute:

```bash
docker compose up --build app
```

A aplicação estará disponível em `http://localhost:3005`. A imagem executa o build em múltiplos estágios e inicia o Next.js com `npm run start`.

Para informar outra URL da API durante o build:

```bash
NEXT_PUBLIC_BASE_URL=https://api.exemplo.com/api docker compose up --build app
```

## Desenvolvimento

O perfil de desenvolvimento utiliza bind mount e hot reload:

```bash
docker compose --profile dev up --build app-dev
```

A aplicação estará disponível em `http://localhost:3000`.

As variáveis aceitas estão documentadas em `.env.example`.
