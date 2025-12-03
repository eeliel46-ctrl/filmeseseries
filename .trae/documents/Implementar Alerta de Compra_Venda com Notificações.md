## Escopo
- Ativar alertas de compra e venda para qualquer ticker, com notificação por e‑mail e no sistema.
- Checagem automática e segura (Edge Function no Supabase, agendada).

## Banco de Dados
- `stock_alerts` (existente): usar campos `ticker`, `target_price`, `alert_type` (`buy`/`sell`), `notify_email`, `notify_system`, `is_active`, `triggered_at`.
- `notifications` (novo): `id`, `user_id`, `ticker`, `type` (`buy_trigger`/`sell_trigger`), `price_at_trigger`, `message`, `created_at`, `read` (bool).
- Policies: permitir leitura/escrita de `stock_alerts` e leitura/atualização de `notifications` apenas para `user_id` do dono.

## Edge Function: `check-alerts`
- Entradas (env no Supabase):
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `BRAPI_BASE_URL=https://brapi.dev/api`, `BRAPI_API_TOKEN`
- Fluxo:
  1. Buscar `stock_alerts` com `is_active=true` (paginado)
  2. Agrupar por `ticker` e consultar preço atual na BRAPI (uma vez por ticker)
  3. Avaliar regra:
     - Compra: `current_price <= target_price`
     - Venda: `current_price >= target_price`
  4. Para cada alerta disparado:
     - Atualizar `stock_alerts`: `is_active=false`, `triggered_at=now`
     - Inserir em `notifications` (histórico)
     - Notificar e‑mail (se `notify_email`) via SMTP/Resend
     - Emissão de evento ou gravação para “Notificação no Sistema”
- Agendamento: Scheduled Function a cada 10 minutos (ou ajuste desejado).

## Notificações
- E‑mail: usar SMTP do Supabase ou serviço externo (Resend/SendGrid).
- Sistema: listar em uma nova seção “Notificações” e exibir toast quando o usuário estiver online. Opcional: Realtime canal por `user_id` para push imediato.

## Atualizações na UI (Análises)
- Adicionar seletor `Tipo de Alerta`: `Compra`/`Venda`.
- Válidações: preço alvo numérico, switches de notificação, feedback de criação.
- Listar “Meus Alertas Ativos” com ações “Desativar” e “Excluir”.
- Seção “Notificações” (opcional) para histórico e marcar como lidas.

## Configuração
- Supabase:
  - Auth → Providers: E‑mail habilitado; “Allow signups” conforme sua preferência.
  - Auth → Settings: `Site URL` = domínio Vercel
  - Functions: criar `check-alerts` e agendar
- Vercel:
  - Definir envs públicas do cliente (já configuradas): BRAPI/Supabase

## Testes
- Criar alertas buy/sell com alvo próximo, invocar função manualmente e validar disparo.
- Checar criação de `notifications`, e‑mail recebido e item no app.
- Policies: tentar acessar recursos de outro `user_id` (deve negar).

## Entregáveis
- Edge Function `check-alerts` com agendamento
- Tabela `notifications` e policies
- UI: seletor `buy/sell`, listagem, desativação, e toasts
- Documentação de envs e operação

Confirma para eu implementar o worker (Edge Function), criar a tabela `notifications`, ajustar a UI e agendar a checagem? Posso fazer a validação com um alerta de teste assim que terminar.