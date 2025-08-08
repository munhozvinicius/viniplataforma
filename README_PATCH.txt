# Patch: Persistência direta no Neon (sem GitHub) + correções de erro `map`

## O que muda
- **Novas rotas serverless** em `/api/config/get.js` e `/api/config/set.js` que gravam/buscam em `page_configs` no Neon.
- **DataService** atualizado para usar essas rotas.
- Isso elimina a necessidade de digitar **token do GitHub** para salvar Home/Produtos/Ordem.

## Como aplicar
1. Copie os arquivos deste zip para as **mesmas pastas** do projeto:
   - `api/config/get.js`
   - `api/config/set.js`
   - `src/services/dataService.js`
2. Confirme o env na Vercel: `POSTGRES_URL` (o mesmo que já funciona no `/api/migrate`).
3. Faça **redeploy**.
4. No Admin:
   - Em **Editor da Home** e **Gestão de Produtos**, ao salvar, **não deve pedir token** e o retorno deve ser `ok`.
   - Se algum componente ainda abrir modal do GitHub, troque a chamada para `DataService.setConfig('home', cfg)` ou `DataService.setConfig('produtos', list)`.
     - Garanta **defaults** antes de usar `.map`: por exemplo
       ```js
       const cards = Array.isArray(cfg.cardsPersonalizados) ? cfg.cardsPersonalizados : [];
       ```
     - Faça o mesmo para `tabelas`, `agentesIA`, etc., sempre usando `Array.isArray(x) ? x : []`.

## Dica de debug rápido
- Abra o DevTools → Network e confira as chamadas:
  - `GET /api/config/get?key=home`
  - `POST /api/config/set` com body `{"key":"home","value":{...}}`
- Se vier 500, confira os logs do deployment (geralmente é env ausente).