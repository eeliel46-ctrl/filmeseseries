## Viabilidade
- Sim, dá para fazer deploy como app Vite estático. Atenção ao proxy: em desenvolvimento usamos `/brapi` via Vite; em produção, defina `VITE_BRAPI_BASE_URL=https://brapi.dev/api` ou crie uma função de proxy.

## Variáveis de ambiente (produção)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_BRAPI_API_TOKEN`
- `VITE_BRAPI_BASE_URL=https://brapi.dev/api`

## Vercel (recomendado)
1. Garanta que o código está no GitHub (feito).
2. Importar repositório no Vercel.
3. Build: `npm run build`; Output: `dist`.
4. Definir envs acima no projeto Vercel.
5. Deploy e validar: “Análises” (gráfico e refresh), “Investimentos” (diálogo com histórico).

## Netlify (alternativa)
1. Conectar repo e escolher Vite.
2. Build: `npm run build`; Publish: `dist`.
3. Definir envs.

## Proxy opcional
- Se preferir manter `/brapi` em produção, crie uma função serverless `/api/brapi` que repassa para `https://brapi.dev/api` com o token e ajuste `VITE_BRAPI_BASE_URL=/api/brapi`.

## Validação pós-deploy
- Testar tickers: PETR4, VALE3, KLBN11, ITUB4 em 1D/5D/1mo/3mo/6mo/1y.
- Testar login/cadastro (com Supabase configurado).

Posso preparar os envs e te guiar para a importação no Vercel agora?