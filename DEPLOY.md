# 🚀 Guia de Deploy — Vercel + Render + Cloudinary

Arquitetura em produção:

```
Convidado → Vercel (frontend Next.js) → Render (API Spring Boot) → Render PostgreSQL
                                              └→ Cloudinary (fotos/vídeos)
```

> Pré-requisitos: contas gratuitas no **GitHub**, **Vercel**, **Render** e **Cloudinary** (esta já está configurada).

---

## Passo 1 — Subir o código para o GitHub

O repositório já está com git inicializado e o primeiro commit feito. Crie um repositório vazio no GitHub (ex: `casamento-app`) e rode:

```bash
git remote add origin https://github.com/SEU_USUARIO/casamento-app.git
git branch -M main
git push -u origin main
```

---

## Passo 2 — Backend + Banco no Render (via Blueprint)

1. No [Render](https://dashboard.render.com) → **New** → **Blueprint**.
2. Conecte o repositório do GitHub. O Render lê o `render.yaml` e propõe criar:
   - **casamento-db** (PostgreSQL)
   - **casamento-api** (web service Docker)
3. Clique em **Apply**. Ele vai pedir os valores das variáveis marcadas como "sync:false":
   - `CLOUDINARY_CLOUD_NAME` = `drgtxuwtm`
   - `CLOUDINARY_API_KEY` = (sua key)
   - `CLOUDINARY_API_SECRET` = (seu secret)
   - `FRONTEND_ORIGIN` = deixe `https://localhost` por enquanto (ajustamos no Passo 4)
4. O Render faz o build do Docker (~3-5 min na 1ª vez), roda as migrations (Flyway) e sobe a API.
5. Anote a URL pública da API, algo como: `https://casamento-api.onrender.com`
6. Teste: abra `https://casamento-api.onrender.com/ping` → deve responder `{"status":"ok"}`.

> ⚠️ **Plano free do Render** hiberna após ~15 min sem uso (1ª requisição depois demora ~1 min). Ótimo para demonstrar a ideia; para o casamento real, suba para um plano pago (US$ 7/mês) ou mantenha um "ping" periódico.
>
> ⚠️ O **PostgreSQL free** do Render é removido após ~30 dias. Para produção, use o plano pago ou um Postgres permanente (ex: Supabase/Neon).

---

## Passo 3 — Frontend na Vercel

1. No [Vercel](https://vercel.com) → **Add New** → **Project** → importe o mesmo repositório.
2. Em **Root Directory**, selecione **`casamento-web`** (importante: é um monorepo).
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_API_URL` = a URL da API do Render (ex: `https://casamento-api.onrender.com`)
4. Clique em **Deploy**. Ao final, a Vercel te dá a URL pública, ex: `https://casamento-ana-joao.vercel.app`.

---

## Passo 4 — Conectar os dois (CORS)

1. Volte ao Render → serviço **casamento-api** → **Environment**.
2. Edite `FRONTEND_ORIGIN` para a URL da Vercel (sem barra no final):
   `https://casamento-ana-joao.vercel.app`
3. Salve — o Render reinicia a API sozinho.

Pronto! Abra a URL da Vercel, crie sua conta e poste uma foto. 🎉

---

## Para cada casamento novo

1. Duplique o repositório (ou crie um novo a partir desta base).
2. Edite `casamento-web/config/wedding.ts` (nomes, data, cores) e troque as imagens em `casamento-web/public/`.
3. Repita os Passos 1-4 com nomes próprios (ex: `casamento-bia-leo`).
4. Use um banco, um projeto Vercel e (idealmente) uma pasta/conta Cloudinary por casamento.

## Checklist de produção (quando vender de verdade)
- [ ] Render: planos pagos (API que não hiberna + Postgres permanente)
- [ ] `JWT_SECRET` único por casamento (o Blueprint já gera automaticamente)
- [ ] Domínio personalizado na Vercel (ex: `anaejoao.com.br`)
- [ ] Backups do banco ativados no Render
