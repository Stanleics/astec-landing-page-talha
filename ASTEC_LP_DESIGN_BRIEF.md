# ASTEC — Design Brief para Landing Pages

> Documento de referência para a criação de novas LPs da Astec Indústria.  
> Todas as páginas seguem o mesmo design system, stack técnica e estrutura de seções.  
> O que muda entre páginas está explicitamente indicado em cada seção.

---

## 1. Identidade e Tom de Voz

**Empresa:** Astec Indústria — Canoas/RS — desde 1995  
**Público:** Engenheiros, gerentes de manutenção, compradores industriais, gestores de fábrica  
**Cobertura:** Rio Grande do Sul  
**Tom:** Técnico, direto, confiável. Não usa superlativo vazio ("o melhor", "o maior"). Fala de resultado: "parada zero", "conformidade NR", "diagnóstico preciso".

### Dados fixos (usar em todas as LPs)

| Item | Valor |
|------|-------|
| E-mail | `contato@astecind.com.br` |
| Telefone / WhatsApp | `(51) 3051-3302` |
| Link WA (formato API) | `https://api.whatsapp.com/send?phone=555130513302&text=...` |
| Endereço | R. Dom Pedro II, 1502, Niterói, Canoas/RS — CEP 92110-130 |
| Horário | Seg–Sex 08h–18h |
| Logo | `logomarca/logo_Astec.png` |

---

## 2. Design System

### 2.1 Paleta de Cores

| Token Tailwind | Hex | Uso |
|----------------|-----|-----|
| `astec-blue` | `#004EA2` | cor primária — botões, badges, destaques |
| `astec-blue-dark` | `#003872` | hover de botões azuis |
| `astec-blue-light` | `#4267AA` | elementos secundários azuis |
| `astec-dark` | `#0F172A` | textos principais, footer background |
| `astec-neutral` | `#64748B` | textos secundários e labels |
| `astec-light` | `#F8FAFC` | fundos de seção clara |
| `astec-accent` | `#F97316` | laranja — badges exclusivos, alertas, destaques de emergência |
| `astec-yellow` | `#F5B800` | amarelo — "Mais Vendida", badges RS, headline hero |
| `astec-success` | `#16A34A` | CTA WhatsApp (verde) |

**Gradiente warm (hero headline):**  
`linear-gradient(135deg, #F5B800 0%, #F97316 65%)`  
→ aplicado via `.text-gradient-warm` (background-clip: text)

**Hero background:** `#001228` (azul-marinho escuro)  
→ definir com `background-color` separado, nunca com shorthand `background:` (conflito com Tailwind)

### 2.2 Tipografia

| Fonte | Peso | Uso |
|-------|------|-----|
| Plus Jakarta Sans | 300–800 | corpo, labels, CTAs — classe `font-jakarta` |
| Roboto Condensed | 400, 700 | headline hero (fallback) |

CDN Google Fonts — ambas pré-conectadas com `<link rel="preconnect">`.

**Hierarquia headline hero:**
```
Linha 1 — font-black tracking-tighter, branco sólido,  5.25rem (lg)
Linha 2 — font-black tracking-tighter, outline stroke,  5.25rem (lg)   ← .hero-headline-outline
Linha 3 — font-bold, gradiente amarelo→laranja,          1.85rem (lg)   ← .text-gradient-warm
```

`.hero-headline-outline`:
```css
-webkit-text-stroke: 2px rgba(255,255,255,0.32);
color: transparent;
```

### 2.3 Classes CSS Globais (styles.css)

| Classe | O que faz |
|--------|-----------|
| `.hero-bg` | fundo do hero: `#001228` + gradientes + grid visual (via `::before`) |
| `.text-gradient-warm` | gradiente amarelo→laranja aplicado em texto |
| `.hero-headline-outline` | texto outline (stroke branco, fill transparente) |
| `.glass` | glassmorphism — `backdrop-blur + bg-white/10 + border-white/15` |
| `.btn-primary` | botão azul padrão com hover e shadow |
| `.service-card` | card com hover translateY e sombra |
| `.product-card` | card de produto (catálogo) |
| `.faq-item / .faq-trigger / .faq-content` | accordion de FAQ |
| `.reveal / .reveal-delay-N` | animação scroll (IntersectionObserver, via ui.js) |
| `.pulse-dot` | ponto pulsante (badge hero) |
| `.animate-blob` | blob animado via @keyframes blob |
| `.hero-stat` | card de estatística no stats bar |
| `.nav-scrolled` | navbar com shadow ao rolar (adicionado via ui.js) |
| `.hidden-card` | esconde card no catálogo (filtros, via catalog.js) |

### 2.4 Ícones

**Iconify Solar Icons** via CDN web component:
```html
<script src="https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js"></script>
```
Uso: `<iconify-icon icon="solar:NOME-bold" width="N" aria-hidden="true"></iconify-icon>`

Ícones padrão por contexto:
- Whatsapp CTA: `solar:phone-bold`
- Localização: `solar:map-point-bold-duotone`
- Manutenção preventiva: `solar:wrench-bold-duotone`
- Manutenção corretiva: `solar:settings-bold-duotone`
- Retrofit: `solar:restart-bold-duotone`
- Emergência: `solar:danger-triangle-bold-duotone`
- NR/Segurança: `solar:shield-check-bold-duotone`
- Empresa/Experiência: `solar:calendar-bold-duotone`
- Multimarca: `solar:stars-bold-duotone`
- Corpo técnico: `solar:users-group-rounded-bold-duotone`
- Fábrica: `solar:buildings-3-bold-duotone`
- FAQ: `solar:alt-arrow-down-bold`
- Medalha (prova social): `solar:medal-ribbons-star-bold-duotone`

---

## 3. Stack Técnica

```
HTML5 + Tailwind CSS Play CDN + JavaScript Vanilla
```

- **Sem framework, sem bundler** — arquivo `index.html` único, funcional direto no browser
- **Tailwind via CDN Play** — config inline no `<script>` do `<head>`
- **CSS customizado** — `assets/css/styles.css` (animações, hero, glassmorphism)
- **JS catálogo** — `assets/js/catalog.js` (filtros por `data-*` attributes)
- **JS UI** — `assets/js/ui.js` (navbar scroll, menu mobile, FAQ accordion, scroll reveal)
- Animações respeitam `prefers-reduced-motion`
- Acessibilidade: `<section aria-labelledby>`, `<nav aria-label>`, `role="list"`, `aria-pressed`, `aria-expanded`

### Tailwind config (inline no head)
```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'astec-blue':       '#004EA2',
        'astec-blue-dark':  '#003872',
        'astec-blue-light': '#4267AA',
        'astec-dark':       '#0F172A',
        'astec-neutral':    '#64748B',
        'astec-light':      '#F8FAFC',
        'astec-accent':     '#F97316',
        'astec-yellow':     '#F5B800',
        'astec-success':    '#16A34A',
      },
      fontFamily: { jakarta: ['"Plus Jakarta Sans"', 'sans-serif'] }
    }
  }
}
```

---

## 4. Estrutura de Seções — Mapa de Reuso

| # | ID | Nome | Talha Elétrica | Ponte Rolante | Observações |
|---|-----|------|---------------|---------------|-------------|
| 1 | `#navbar` | Navbar | ✅ | ✅ | Alterar links de âncora e texto do CTA WhatsApp |
| 2 | `#hero` | Hero | ✅ | ✅ **Texto muda** | Ver Seção 5 |
| 3 | `#catalogo` | Catálogo/Produtos | ✅ e-commerce | ❌ **Removida** | Substituir — ver Seção 6 |
| 4 | `#manutencao` | Serviços de Manutenção | ✅ | ✅ | Ajustar copy dos cards se necessário |
| 5 | `#diferenciais` | Por que Astec | ✅ | ✅ | Reutilizar na íntegra |
| 6 | `#como-funciona` | Como Funciona / Stepper | ✅ | ✅ | Ajustar copy dos passos |
| 7 | `#prova-social` | Prova Social | ✅ | ✅ | Reutilizar na íntegra |
| 8 | `#faq` | FAQ | ✅ | ✅ **Perguntas mudam** | Ver Seção 7 |
| 9 | `#orcamento` | Contato | ✅ | ✅ | Ajustar textos de WhatsApp |
| 10 | `footer` | Footer | ✅ | ✅ | Alterar lista de serviços/modelos |
| — | `#whatsapp-float` | Botão WA flutuante | ✅ | ✅ | Reutilizar na íntegra |

---

## 5. Hero — Estrutura e O Que Muda por Página

### Estrutura fixa (reutilizar)
- Background: `.hero-bg` (`#001228` + blobs animados + grid)
- Layout: `grid lg:grid-cols-2` — esquerda copy, direita foto/visual
- Badge pulsante no topo esquerdo
- Headline 3 linhas (branco / outline / gradiente warm)
- Parágrafo de suporte
- 2 CTAs: primário (WhatsApp) + secundário (âncora interna)
- Stats bar: 4 glass cards com `.text-gradient-warm`
- Painel direito: barra logo + foto em card arredondado + info overlay + badges

### O que muda por página

| Elemento | Talha Elétrica | Ponte Rolante |
|----------|---------------|---------------|
| Badge pulsante | "Atendimento Especializado no Rio Grande do Sul" | adaptar para Pontes Rolantes |
| Headline L1 | "Talhas" | "Pontes" |
| Headline L2 | "Elétricas" | "Rolantes" |
| Headline L3 | "para sua Indústria" | adaptar (ex.: "e Pórticos para sua Planta") |
| Parágrafo | "Venda, manutenção e adequação NR-12…" | adaptar para PR |
| CTA WhatsApp texto | "Cotar Talha Elétrica" | "Cotar Ponte Rolante" |
| Link WA (text param) | `...cotar uma talha elétrica` | `...cotar uma ponte rolante` |
| CTA secundário | "Ver Modelos" → `#catalogo` | "Ver Serviços" → `#servicos` ou `#manutencao` |
| Stats 4º card | "RS / Rio Grande do Sul" | manter igual |
| Cobertura (overlay foto) | "Rio Grande do Sul" | manter igual |
| Badge painel direito | "NR-12" + "RS" | manter igual ou adicionar "NR-11" |
| Badges inferiores foto | Corrente · Cabo de Aço · Multimarca | Monovia · Dupla Viga · Pórtico (ou similar) |
| Foto | `fotos/Montagem_Desmontagem_Equipamentos.jpeg` | foto de ponte rolante (solicitar ao cliente) |

---

## 6. Seção 3 — Catálogo (Talha) vs. Alternativa (Ponte Rolante)

### Por que o catálogo e-commerce NÃO se aplica à Ponte Rolante

Pontes rolantes e pórticos são **projetos sob medida** (vão, capacidade, altura de elevação, tipo de viga, acionamento). Não existe "modelo pronto" para exibir em cards com filtros. Exibir cards seria tecnicamente incorreto e confundiria o comprador.

### Substituição sugerida — Seção "Soluções"

Em vez de catálogo, usar uma **seção de soluções/aplicações** que mostre os tipos por contexto de uso, não por SKU. Formato sugerido: grid 2×3 de cards illustrativos, sem preço, sem filtro, com CTA "Solicitar Projeto".

**Estrutura do card de solução:**
```
[Ícone ilustrativo]
Nome da solução
Descrição curta (aplicação típica, capacidade comum)
[CTA: Solicitar Projeto → WhatsApp]
```

**Soluções possíveis para Ponte Rolante:**

| ID | Nome | Aplicação | Capacidade típica |
|----|------|-----------|-------------------|
| PR-MONO | Ponte Rolante Monovia | Indústria geral, montagem, manutenção | 1 t – 10 t |
| PR-DV | Ponte Rolante Dupla Viga | Cargas pesadas, siderurgia, papel e celulose | 10 t – 50 t+ |
| PO-MONO | Pórtico Monovia | Pátios externos, estaleiros, obras | 2 t – 20 t |
| PO-DV | Pórtico Dupla Viga | Logística pesada, pré-moldados | 10 t – 80 t+ |
| PR-SEMI | Semi-Pórtico | Galpões com parede-guia, expedição | 2 t – 30 t |
| PR-ESP | Projetos Especiais | Temperaturas extremas, ambientes corrosivos, salas limpas | Sob consulta |

> **Importante:** confirmar quais soluções a Astec efetivamente fornece antes de publicar.

---

## 7. Seção Manutenção — Cards

### Estrutura (4 cards — reutilizar)

| Card | Gradiente | Ícone | Título | Copy |
|------|-----------|-------|--------|------|
| Manutenção Preventiva | `#004EA2 → #003872` (azul) | `solar:wrench-bold-duotone` | igual | ajustar "talha" → "ponte rolante" se necessário |
| Manutenção Corretiva | `#0F172A → #1E293B` (escuro) | `solar:settings-bold-duotone` | igual | idem |
| Retrofit / Modernização | `#1E3A5F → #0F2749` (navy) | `solar:restart-bold-duotone` | igual | idem |
| Atendimento de Emergência | `#F97316 → #EA580C` (laranja) | `solar:danger-triangle-bold-duotone` | igual | idem |

As fotos dos cards de Manutenção Corretiva e Retrofit podem ser as mesmas ou substituídas quando o cliente enviar novas fotos.

---

## 8. Seção Diferenciais — 6 Cards (reutilizar na íntegra)

| Card | Ícone | Título | Copy |
|------|-------|--------|------|
| 1 | `solar:calendar-bold-duotone` | Desde 1995 | "Mais de 30 anos… no Rio Grande do Sul." |
| 2 | `solar:stars-bold-duotone` | Multimarca | "Atendemos Demag, CM, Yale, Kito, Stahl, R&M, Terex…" |
| 3 | `solar:shield-check-bold-duotone` | Conformidade NR | "NR-10, NR-11 e NR-12 garantidas…" |
| 4 | `solar:map-point-bold-duotone` | Cobertura no RS | "Atendimento especializado em todo o Rio Grande do Sul…" |
| 5 | `solar:buildings-3-bold-duotone` | Parque Fabril 600 m² | "Infraestrutura própria… em Canoas/RS." |
| 6 | `solar:users-group-rounded-bold-duotone` | Corpo Técnico Qualificado | "Engenheiros e técnicos especializados…" |

---

## 9. Stepper "Como Funciona" — Ajuste por Página

### Estrutura (4 passos — reutilizar, ajustar copy)

| Passo | Talha Elétrica | Ponte Rolante |
|-------|---------------|---------------|
| 1 | "Você nos conta sua aplicação" / capacidade, vão, altura | mesmo — ajustar para PR |
| 2 | "Engenheiro Astec dimensiona" | mesmo |
| 3 | "Cotação detalhada e ágil" | mesmo |
| 4 | "Entrega, instalação e treinamento" | mesmo |

---

## 10. Prova Social — Reutilizar na Íntegra

- Selo: "+1.000 talhas instaladas / no Rio Grande do Sul desde 1995"
  - Para PR: ajustar para "+X pontes rolantes instaladas" ou selo genérico "+30 anos de projetos"
- 6 logos de clientes: reutilizar (mesmos clientes)

**Logos disponíveis em `logomarcaclientes/`:**
- `LogoAdama.png`
- `LogoDUPONT.png`
- `logo-perto.png`
- `logoCSN.png`
- `logoGEDORE.png`
- `logoMinuano.png`

---

## 11. FAQ — Perguntas a Adaptar para Ponte Rolante

### Perguntas da Talha (referência)
1. Qual a diferença entre talha de corrente e talha de cabo de aço?
2. Vocês atendem manutenção de marcas que não foram compradas com vocês?
3. O que é a adequação NR-12 e por que ela é obrigatória?
4. Qual o prazo de entrega de uma talha nova?
5. Vocês oferecem locação de talha elétrica?
6. Como funciona o contrato de manutenção preventiva?
7. Em quais regiões a Astec atende?

### Perguntas sugeridas para Ponte Rolante
1. Qual a diferença entre ponte rolante monovia e dupla viga?
2. Qual a diferença entre ponte rolante e pórtico?
3. Vocês atendem manutenção de pontes de outras marcas? (Demag, Konecranes, Munck…)
4. A NR-11 é obrigatória para pontes rolantes?
5. Como é feito o dimensionamento de uma ponte rolante?
6. Vocês fabricam ou apenas instalam e mantêm?
7. Em quais regiões a Astec atende?

> **Nota:** validar respostas com a Astec antes de publicar — especialmente prazo e capacidades máximas fornecidas.

---

## 12. Seção Contato — Ajustes por Página

### O que muda
- Texto do link WA (parâmetro `text`) → usar mensagem específica do produto
- Título da seção e subtítulo: trocar referência ao produto
- Horário e endereço: **não alterar**

### Template WA para Ponte Rolante
```
https://api.whatsapp.com/send?phone=555130513302&text=Ol%C3%A1!%20Gostaria%20de%20cotar%20uma%20ponte%20rolante.
```

---

## 13. Footer — Ajustes por Página

### O que muda
- Coluna "Modelos" → para PR: lista das soluções (Monovia, Dupla Viga, Pórtico…)
- Coluna "Serviços" → reutilizar (Preventiva, Corretiva, Retrofit, Atendimento de Emergência)
- Coluna "Contato" → não alterar
- Coluna brand → não alterar

---

## 14. Fotos — Gestão de Assets

### Talha Elétrica (disponíveis)
| Arquivo | Uso |
|---------|-----|
| `fotos/Montagem_Desmontagem_Equipamentos.jpeg` | Hero painel direito + card Manutenção Corretiva |
| `fotos/Retrofit.jpeg` | Card Retrofit/Modernização |

### Placeholders de produtos
Todos os cards de produto usam placeholder CSS (gradiente azul + ícone). Quando o cliente enviar fotos:
1. Salvar em `assets/img/modelos/` como `.webp` (converter no squoosh.app)
2. Usar `object-contain` nos cards de produto, `object-cover` nas fotos de serviço
3. Sempre `loading="lazy"` exceto primeiro card visível

### Para Ponte Rolante
Solicitar ao cliente:
- Foto de ponte rolante em operação (hero)
- Foto de manutenção em ponte rolante (card Corretiva)
- Foto de retrofit/modernização (card Retrofit) — pode reutilizar da talha se necessário

---

## 15. SEO e Meta Tags — Template

```html
<title>[PRODUTO] — Venda e Manutenção | Astec</title>
<meta name="description" content="[Produto] para indústria. Venda, manutenção e adequação NR. Desde 1995 no Rio Grande do Sul.">
<meta name="keywords" content="[produto], [variações], NR-11, movimentação de carga, Astec, Canoas RS">
<link rel="canonical" href="https://lp.astecind.com.br/[slug]">

<!-- Open Graph -->
<meta property="og:title" content="[PRODUTO] — Venda e Manutenção | Astec">
<meta property="og:description" content="[Produto] para indústria. Venda, manutenção e locação. Desde 1995. Atendimento no Rio Grande do Sul.">
```

### Schema.org LocalBusiness (reutilizar)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Astec Indústria",
  "telephone": "+55-51-3051-3302",
  "email": "contato@astecind.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "R. Dom Pedro II, 1502",
    "addressLocality": "Canoas",
    "addressRegion": "RS",
    "postalCode": "92110-130",
    "addressCountry": "BR"
  },
  "openingHours": "Mo-Fr 08:00-18:00"
}
```

---

## 16. Publicação — GitHub Pages

| LP | Repositório | URL online |
|----|-------------|------------|
| Talha Elétrica | `Stanleics/astec-landing-page-talha` | https://stanleics.github.io/astec-landing-page-talha |
| Ponte Rolante | `Stanleics/astec-landing-page-ponte-rolante` *(a criar)* | https://stanleics.github.io/astec-landing-page-ponte-rolante |

### Fluxo de publicação
```bash
# 1. Novo repo: criar via API (token no macOS Keychain)
GITHUB_TOKEN=$(security find-internet-password -s github.com -w)
curl -H "Authorization: token $GITHUB_TOKEN" \
     -d '{"name":"astec-landing-page-ponte-rolante","private":false}' \
     https://api.github.com/user/repos

# 2. Push
git init && git add . && git commit -m "LP Ponte Rolante Astec"
git remote add origin https://Stanleics:$GITHUB_TOKEN@github.com/Stanleics/astec-landing-page-ponte-rolante.git
git push -u origin main

# 3. Ativar Pages
curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
     -d '{"source":{"branch":"main","path":"/"}}' \
     https://api.github.com/repos/Stanleics/astec-landing-page-ponte-rolante/pages
```

---

## 17. Checklist para Nova LP

- [ ] Copiar `index.html` da Talha Elétrica como base
- [ ] Ajustar meta tags (title, description, canonical, OG)
- [ ] Alterar Schema.org se necessário
- [ ] Atualizar links de âncora na navbar
- [ ] Reescrever hero (badge, headline 3 linhas, parágrafo, CTAs, badges da foto)
- [ ] Substituir seção catálogo pela seção de soluções
- [ ] Ajustar copy dos cards de manutenção (trocar "talha" por "ponte rolante")
- [ ] Revisar diferenciais (reutilizar na íntegra)
- [ ] Ajustar stepper (passo 1 — mencionar parâmetros de PR: vão, capacidade, etc.)
- [ ] Ajustar selo da prova social (número de equipamentos instalados)
- [ ] Reescrever FAQ (7 perguntas específicas de PR)
- [ ] Ajustar textos de contato e links WA
- [ ] Ajustar footer — coluna Modelos → Soluções
- [ ] Substituir foto do hero (solicitar ao cliente)
- [ ] Inicializar git, criar repo, ativar GitHub Pages
- [ ] Confirmar informações técnicas com a Astec (capacidades, prazos, fabricação própria ou terceiro)
