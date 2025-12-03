## Passos de Implementação
### 1) Banco de Dados
- Criar tabela `notifications` (id, user_id, ticker, type, price_at_trigger, message, created_at, read boolean)
- Políticas RLS:
  - `stock_alerts`: usuário só lê/insere/atualiza/exclui seus próprios alertas (`user_id = auth.uid()`).
  - `notifications`: usuário só lê/atualiza suas notificações (`user_id = auth.uid()`).

### 2) Edge Function `check-alerts`
- Ler envs no Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BRAPI_BASE_URL=https://brapi.dev/api`, `BRAPI_API_TOKEN`.
- Fluxo:
  1. Buscar `stock_alerts` ativos (paginado) e agrupar por `ticker`.
  2. Consultar BRAPI por ticker (uma chamada por ticker) para preço atual.
  3. Avaliar regra:
     - Compra: `current_price <= target_price`
     - Venda: `current_price >= target_price`
  4. Para disparos:
     - Atualizar `stock_alerts`: `is_active=false`, `triggered_at=now`.
     - Inserir uma linha em `notifications`.
     - Notificar e‑mail (SMTP Supabase/Resend) quando `notify_email=true`.
- Testes: função com dados mock; depois invocação manual em produção.
- Agendamento: Scheduled Function (ex.: a cada 10 minutos).

### 3) UI (Análises)
- Adicionar seletor `Tipo de Alerta`: `Compra`/`Venda`.
- Validações de preço alvo; mostrar feedback de criação.
- Listar “Meus Alertas Ativos”: permitir “Desativar” e “Excluir”.
- Seção “Notificações” (opcional): listar disparos e “marcar como lidas”.

### 4) Configuração
- Supabase → Auth Settings: `Site URL` = domínio Vercel; Providers: E‑mail habilitado; `Allow signups` de acordo.
- Vercel → envs (Production/Preview):
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_BRAPI_BASE_URL=https://brapi.dev/api`, `VITE_BRAPI_API_TOKEN`

### 5) Validação
- Criar alertas buy/sell com alvo perto do preço, invocar função; checar toast, item na lista e e‑mail.
- Confirmar que alertas são desativados após disparo.

Confirma para eu iniciar a implementação técnica (tabela/policies, função, UI e agendamento) e te entregar com testes de disparo? 