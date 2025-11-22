# Stripe Billing Implementation Summary

## ✅ Implementation Complete

A integração completa do Stripe foi implementada no Form Builder SaaS com os seguintes recursos:

### 📊 Planos Implementados

Todos os novos usuários começam com **14 dias de trial no plano BASIC** (sem necessidade de cartão).

#### BASIC
- **Mensal**: $19/mês | **Anual**: $199/ano (economiza $29)
- 1,000 submissions/mês | 12,000/ano
- 1 custom domain
- Remove branding
- Advanced analytics

#### PRO
- **Mensal**: $47/mês | **Anual**: $470/ano (economiza $94)
- 7,000 submissions/mês | 84,000/ano
- 5 custom domains
- Remove branding
- Priority support
- Advanced analytics

---

## 🗄️ Database Schema

### Novos Models Criados:

1. **Subscription** - Gerencia assinaturas dos usuários
   - Stripe IDs (customer, subscription, price)
   - Plan type e billing cycle
   - Quotas e limites
   - Status e datas de trial/billing

2. **UsageRecord** - Rastreia uso de recursos
   - Submissions e domains por período
   - Histórico de uso

3. **Invoice** - Armazena faturas
   - Stripe invoice IDs
   - Links para PDFs e páginas de pagamento

4. **CustomDomain** - Gerencia domínios customizados
   - Domínios verificados por usuário
   - Controle de limite por plano

---

## 🔧 Backend Implementation

### Libraries & Helpers

**`/lib/stripe.ts`**
- Configuração do Stripe SDK
- Definições de planos e preços
- Helper functions para obter limites e price IDs

**`/lib/subscription.ts`**
- `createFreeSubscription()` - Cria subscription inicial com trial
- `getUserSubscription()` - Obtém dados da subscription
- `checkSubmissionQuota()` - Verifica se usuário pode criar submission
- `incrementSubmissionUsage()` - Incrementa uso
- `resetUsage()` - Reseta no início de novo período
- `updateSubscription()` - Atualiza após pagamento
- `cancelSubscription()` / `downgradeToFree()` - Gerencia cancelamentos
- `getUsageStats()` - Estatísticas para dashboard

### API Routes

**Billing Endpoints:**
- `POST /api/billing/create-checkout` - Cria Stripe Checkout Session
- `POST /api/billing/create-portal` - Abre Customer Portal
- `GET /api/billing/subscription` - Retorna subscription atual
- `GET /api/billing/usage` - Retorna estatísticas de uso

**Webhook Handler:**
- `POST /api/webhooks/stripe` - Processa eventos do Stripe
  - `checkout.session.completed` → Ativa subscription
  - `customer.subscription.updated` → Atualiza status
  - `customer.subscription.deleted` → Downgrade para FREE
  - `invoice.paid` → Salva invoice e reseta usage
  - `invoice.payment_failed` → Marca como PAST_DUE
  - `customer.subscription.trial_will_end` → Notifica 3 dias antes

### Quota Enforcement

**`/app/api/responses/route.ts`** (modificado)
- Verifica quota antes de aceitar submission
- Bloqueia com erro 402 se limite excedido
- Incrementa usage após submission bem-sucedida

**`/app/api/forms/slug/[slug]/route.ts`** (modificado)
- Retorna `showBranding` baseado no plano do usuário
- Forms de usuários FREE/BASIC mostram badge "Powered by"

### Auth Integration

**`/app/api/auth/register/route.ts`** (modificado)
- Cria automaticamente Stripe Customer
- Cria FREE subscription com trial de 14 dias
- Novo usuário já começa com billing configurado

---

## 🎨 Frontend Implementation

### Pages

**`/pricing/page.tsx`**
- Página pública de pricing
- Toggle mensal/anual com destaque de economia
- Cards dos planos com features
- Redirect para Stripe Checkout

**`/billing/page.tsx`**
- Dashboard de billing do usuário
- Mostra plano atual e status
- Progress bars de uso (submissions, domains)
- Botão para Customer Portal
- Alertas de trial ending e payment failures

**`/billing/success/page.tsx`**
- Página de confirmação pós-checkout
- Redirect para dashboard ou billing details

### Components

**`/components/billing/UsageWidget.tsx`**
- Widget compacto para sidebar do dashboard
- Mostra uso de submissions
- Progress bar visual
- Alertas quando próximo do limite
- Link para página de billing

**`/components/billing/UpgradeModal.tsx`**
- Modal de upgrade quando atingir limites
- Comparação de planos lado a lado
- Quick checkout direto do modal
- Contexto específico (submissions, domains, branding)

**`/components/billing/BrandingBadge.tsx`**
- Badge "Powered by FormBuilder" nos forms públicos
- Aparece apenas se `removeBranding: false`
- Fixed bottom-right em forms públicos

---

## 🔄 Fluxos Implementados

### 1. Signup Flow
```
User signs up
  ↓
Create User in DB
  ↓
Create Stripe Customer
  ↓
Create BASIC Subscription (14-day trial, no card required)
  ↓
Send verification email
  ↓
User has full BASIC features during trial
```

### 2. Upgrade Flow
```
User clicks "Upgrade" on /pricing
  ↓
Create Checkout Session via API
  ↓
Redirect to Stripe Checkout
  ↓
User completes payment
  ↓
Stripe sends webhook: checkout.session.completed
  ↓
Update subscription to BASIC/PRO
  ↓
Reset usage, set new quotas
  ↓
Redirect to /billing/success
```

### 3. Submission Flow
```
User submits form
  ↓
Check form owner's quota
  ↓
If exceeded → 402 error
  ↓
If OK → Save response
  ↓
Increment owner's usage
  ↓
Create usage record
```

### 4. Trial End Flow
```
3 days before trial ends
  ↓
Stripe sends webhook: customer.subscription.trial_will_end
  ↓
(TODO: Send email reminder)
  ↓
Trial ends without payment method
  ↓
Subscription status → CANCELED
  ↓
User loses access to forms/submissions
  ↓
Show reactivation prompts
```

### 5. Billing Cycle Reset
```
New billing period starts
  ↓
Stripe sends webhook: invoice.paid
  ↓
Save invoice to DB
  ↓
Reset submissionsUsed to 0
  ↓
Update currentPeriodEnd
```

---

## 🚀 Migration & Setup

### For Existing Users

Execute o script de migração:
```bash
npm run migrate-billing
```

Isso irá:
- Criar Stripe Customer para cada usuário
- Criar BASIC subscription com 14-day trial
- Configurar quotas do plano BASIC (1000 submissions, 1 domain, sem branding)

### Stripe Configuration

Ver `STRIPE_SETUP.md` para:
1. Criar produtos e preços no Stripe Dashboard
2. Configurar webhooks
3. Ativar Customer Portal
4. Obter API keys e price IDs
5. Testar integração

---

## 📝 Environment Variables

Adicionar ao `.env`:

```env
# Stripe Keys
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Price IDs (criar no Stripe Dashboard)
STRIPE_BASIC_MONTHLY_PRICE_ID="price_..."
STRIPE_BASIC_YEARLY_PRICE_ID="price_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."

# App URL (para redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ✨ Features Adicionais Implementadas

1. **Trial sem cartão** - Todos começam com 14 dias no BASIC sem precisar adicionar pagamento
2. **Auto-reset de quotas** - Reseta automaticamente no início de cada período
3. **Branding removido** - Todos os planos (BASIC e PRO) não mostram branding
4. **Customer Portal** - Usuários gerenciam própria assinatura (cartão, cancelar, etc)
5. **Usage tracking** - Histórico de uso armazenado para analytics
6. **Cancelamento completo** - Ao cancelar, usuário perde acesso (sem downgrade para FREE)
7. **Error handling** - 402 errors quando limite excedido com mensagem clara
8. **Proration automática** - Stripe calcula créditos em upgrades mid-cycle

---

## 🔐 Segurança

- ✅ Webhook signature verification
- ✅ Server-side quota checks
- ✅ User-owned resources only
- ✅ Stripe handles PCI compliance
- ✅ No card data touches our servers

---

## 📊 Testing

### Test Mode
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test Webhooks Locally
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🎯 Next Steps (Opcional)

Features que podem ser adicionadas no futuro:

1. **Email Notifications**
   - Trial ending reminder (3 days before)
   - Payment successful receipt
   - Payment failed notification
   - Subscription canceled confirmation

2. **Analytics Dashboard**
   - Revenue metrics
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - LTV (Lifetime Value)

3. **Overage Handling**
   - Allow extra submissions with per-unit pricing
   - Or hard block with upgrade prompt

4. **Team Plans**
   - Multiple users per subscription
   - Role-based access
   - Seat-based pricing

5. **Custom Domains Verification**
   - DNS verification flow
   - SSL certificates
   - Domain routing

6. **Referral Program**
   - Give credits for referrals
   - Track via Stripe metadata

---

## 📞 Support

Para questões sobre a implementação:
- Ver `STRIPE_SETUP.md` para configuração
- Logs do webhook em `/api/webhooks/stripe`
- Stripe Dashboard para transações e eventos
- Console do navegador para erros de frontend

---

## ✅ Checklist de Deploy

Antes de ir para produção:

- [ ] Trocar para Stripe Live Mode
- [ ] Atualizar todas as API keys
- [ ] Criar produtos/preços em Live Mode
- [ ] Configurar webhooks de produção
- [ ] Configurar Customer Portal
- [ ] Testar checkout completo
- [ ] Configurar monitoramento de erros
- [ ] Implementar email notifications
- [ ] Testar todos os fluxos de pagamento
- [ ] Documentar processo de suporte ao cliente
