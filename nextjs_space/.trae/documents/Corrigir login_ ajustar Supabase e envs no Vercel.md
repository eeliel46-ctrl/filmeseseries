## O que vou ajustar
- Inserir as variáveis de ambiente no Vercel com os valores fornecidos
- Conferir e ajustar o “Site URL” do Supabase para o domínio Vercel
- Redeploy e validação do /auth

## Valores
- VITE_SUPABASE_URL = https://kyjibovxvzimnvzdvfkw.supabase.co
- VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_Cxvq-7Vhd-NZOpr0guD8SQ_o56HNz-N
- VITE_BRAPI_BASE_URL = https://brapi.dev/api
- VITE_BRAPI_API_TOKEN = ueN2j5ZC8PETzvsbqXUGwH

## Passos com links
- Vercel → Environment Variables:
  - https://vercel.com/<org>/<project>/settings/environment-variables
  - Adicionar as 4 envs em Production (e Preview se desejar) e salvar
- Supabase → Auth Settings (Site URL):
  - https://supabase.com/dashboard/project/kyjibovxvzimnvzdvfkw/settings/auth
  - Definir “Site URL” = https://financaeinvestimentos.vercel.app
- Supabase → API (checar keys):
  - https://supabase.com/dashboard/project/kyjibovxvzimnvzdvfkw/settings/api
- Redeploy do Vercel:
  - https://vercel.com/<org>/<project>/deployments → clicar em “Redeploy”

## Validação
- Acessar https://financaeinvestimentos.vercel.app/auth e testar login/cadastro
- Se erro persistir, verificar se as envs foram definidas em Production e se houve redeploy pós-env

Posso proceder e te guiar etapa a etapa (inserção de envs, ajuste no Supabase e redeploy) agora?