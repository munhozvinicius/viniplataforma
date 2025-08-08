# Persistência para viniplataforma (Neon + Vercel)

## Passos rápidos
1. Configure a variável `POSTGRES_URL` na Vercel (Production/Preview/Development).
2. Copie a pasta `api/` para a **raiz** do projeto.
3. Copie `src/services/dataService.js` para dentro de `src/services/`.
4. Faça deploy (git push). Depois acesse `/api/migrate` uma vez (ou qualquer API que já roda `ensureSchema()`).
5. Use `DataService` no front para carregar e salvar.

## Instalação
```
npm i @neondatabase/serverless
```

## Exemplos
```
import { DataService } from './services/dataService';
const produtos = await DataService.listProducts();
await DataService.createProduct({ name: 'Microsoft 365 Business Standard', price: 97 });
```