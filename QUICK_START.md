# Quick Start Guide - Form Builder with Stripe

## 🚀 Setup Rápido (5 minutos)

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

**Mínimo necessário para começar (sem Stripe ainda):**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/formbuilder"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Mailgun)
MAILGUN_API_KEY="your-key"
MAILGUN_DOMAIN="your-domain.com"
MAILGUN_FROM_EMAIL="noreply@yourdomain.com"
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Setup do Database

```bash
# Run migrations
npx prisma migrate dev

# (Opcional) Seed database
npx prisma db seed
```

### 4. Rodar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 💳 Setup do Stripe (quando estiver pronto)

### Passo 1: Criar conta no Stripe

1. Acesse https://stripe.com e crie uma conta
2. Vá para **Developers** → **API Keys**
3. Copie as chaves de **test mode**

### Passo 2: Adicionar chaves ao `.env.local`

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Passo 3: Criar Produtos no Stripe

No Stripe Dashboard → **Products**:

**Produto 1: Basic**
- Preço mensal: $19/month
- Preço anual: $199/year
- ✅ Enable 14-day free trial

**Produto 2: Pro**
- Preço mensal: $47/month
- Preço anual: $470/year
- ✅ Enable 14-day free trial

Copie os **Price IDs** e adicione ao `.env.local`:

```env
STRIPE_BASIC_MONTHLY_PRICE_ID="price_..."
STRIPE_BASIC_YEARLY_PRICE_ID="price_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
```

### Passo 4: Configurar Webhooks (Development)

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# ou baixe de: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copie o webhook secret exibido:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Passo 5: Ativar Customer Portal

No Stripe Dashboard:
1. **Settings** → **Billing** → **Customer portal**
2. Click **Activate**
3. Configure as you like

### Passo 6: Migrar Usuários Existentes

```bash
npm run migrate-billing
```

---

## ✅ Verificar Setup

### Sem Stripe (desenvolvimento básico):
- [ ] Database conectado
- [ ] Login/Signup funcionando
- [ ] Criar forms funcionando
- [ ] Dashboard carrega

### Com Stripe (billing completo):
- [ ] `/pricing` mostra planos
- [ ] `/billing` mostra informações do plano
- [ ] Dashboard mostra usage
- [ ] Checkout funciona (teste com cartão: `4242 4242 4242 4242`)
- [ ] Customer Portal abre
- [ ] Webhooks recebem eventos

---

## 🐛 Troubleshooting

### Erro: "NEXT_PUBLIC_APP_URL is not defined"
**Solução:** Adicione ao `.env.local`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Erro: "STRIPE_SECRET_KEY is not defined"
**Solução:** Se não quer usar Stripe ainda, pode ignorar. O app funciona sem billing. Para usar billing, configure as chaves do Stripe.

### Erro: "Invalid URL" no Customer Portal
**Solução:** Certifique-se que `NEXT_PUBLIC_APP_URL` está definido e começa com `http://` ou `https://`

### Webhook não recebe eventos
**Solução:** Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📚 Próximos Passos

1. **Desenvolvimento**: Use sem Stripe inicialmente
2. **Testar Billing**: Configure Stripe em test mode
3. **Production**: Mude para live keys e configure webhooks de produção

Ver documentação completa em:
- `STRIPE_SETUP.md` - Setup detalhado do Stripe
- `BILLING_IMPLEMENTATION.md` - Documentação técnica
