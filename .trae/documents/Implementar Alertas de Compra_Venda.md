## Escopo
- Criar alertas de preço (buy/sell) persistidos no banco, avaliados periodicamente e com notificações por e‑mail/sistema.

## Banco de Dados
- Adicionar modelos/tabelas:
  - Alert: userId, symbol, direction (buy/sell), condition (price_above/price_below), threshold, active, cooldown, lastTriggeredAt, createdAt
  - AlertEvent/Notifications: alertId, triggeredAt, price, provider, note, read
- RLS/policies: usuário acessa apenas seus dados.

## APIs
- GET /api/quotes/latest (Edge): retornar preço atual do ticker
- GET /api/alerts/evaluate (Node): avaliar alertas, registrar disparos, marcar cooldown e disparar webhooks/e‑mails
- GET/POST /api/alerts (Node): criar e listar alertas do usuário

## Agendamento
- Vercel Cron → vercel.json: agendar chamada a /api/alerts/evaluate (ex.: */10 * * * *)

## UI (Análises)
- Adicionar seletor "Tipo de Alerta": Compra/Venda e condição (acima/abaixo)
- Validações + feedback (toast)
- Listagem "Meus Alertas Ativos" com Desativar/Excluir
- Seção "Notificações" (opcional) com histórico e "marcar como lidas"

## Variáveis de Ambiente
- ALPHA_VANTAGE_API_KEY (ou outro provedor)
- ALERT_WEBHOOK_URL (opcional)
- DATABASE_URL (Postgres em produção)
- NEXTAUTH_URL, NEXTAUTH_SECRET

## Validação
- Criar alerta de teste (alvo próximo do preço)
- Invocar manualmente /api/alerts/evaluate
- Verificar eventos e desativação por cooldown
- Confirmar execuções do cron e logs

## Entrega
- Modelos/migrations
- Endpoints
- Cron
- Ajustes na UI
- Documentação dos envs e operação