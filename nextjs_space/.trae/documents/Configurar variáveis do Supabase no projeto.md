## O que está faltando
- As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` não estão definidas. O cliente lê essas variáveis em src/integrations/supabase/client.ts:5.

## Onde obter os valores
- No painel do Supabase:
  1. Acesse seu projeto → Settings → API
  2. Copie:
     - Project URL (ex.: https://xxxxx.supabase.co)
     - anon public key (Publishable)

## Como configurar localmente
1. Abra o arquivo `.env` na raiz e adicione:
   - VITE_SUPABASE_URL=<sua Project URL>
   - VITE_SUPABASE_PUBLISHABLE_KEY=<sua anon key>
2. Salve e reinicie o servidor: npm run dev
3. Valide login/cadastro na página de autenticação.

## Em produção (Vercel/Netlify)
- Adicione as mesmas variáveis na seção Environment Variables do projeto.
- Confirme que `VITE_BRAPI_BASE_URL=https://brapi.dev/api` também está definido.

## Ajustes no Supabase
- Authentication → Settings:
  - Defina Site URL para o domínio do seu deploy
  - Se usar e-mail magic link, confirme o domínio permitido
- Policies das tabelas usadas (expenses, investments, stock_alerts) devem permitir leitura/escrita para o usuário autenticado.

Envie sua Project URL e anon key que eu insiro no `.env` e reinicio para validar o login imediatamente.