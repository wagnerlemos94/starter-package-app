# Rodando com Docker

Comandos rápidos:

Construir imagem (produção):

```
docker build -t escolar-frontend:latest .
```

Executar imagem:

```
docker run -p 3000:3000 --env NODE_ENV=production escolar-frontend:latest
```

Usando docker-compose (produção):

```
docker-compose up --build web
```

Modo desenvolvimento (com hot-reload):

```
docker-compose up --build dev
```

Observações:
- O serviço de produção usa `npm run build` seguido de `npm start`.
- Se usar variáveis de ambiente, defina-as via `docker run -e NOME=valor` ou em um arquivo `.env` e carregue no compose.
