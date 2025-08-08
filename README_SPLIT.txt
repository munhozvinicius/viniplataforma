Como aplicar os pacotes divididos:

1) Suba primeiro o part1_api.zip (conteúdo vai em /api/...) e faça commit.
2) Depois suba o part2_services.zip (src/services/dataService.js) e faça commit.
3) Depois o part3_admin_components.zip (AdminProdutos.jsx e AdminHome.jsx) e faça commit.
4) No Vercel, configure NEON_DATABASE_URL com sua connection string do Neon.
5) Faça redeploy e acesse /api/migrate (deve retornar {"ok": true}).
6) Pronto: a edição de Home e a Gestão de Produtos vão persistir.

Ordem recomendada: part1 -> part2 -> part3.
