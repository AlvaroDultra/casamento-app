# 💍 App de Casamento — Rede Social dos Convidados

Aplicação web **padrão (template)** para casamentos. Cada casamento roda a sua **própria cópia** deste app: os convidados criam uma conta rapidinha, postam fotos e vídeos da cerimônia e da festa, curtem e comentam — e depois os noivos têm tudo guardado para reviver o dia pela ótica de quem estava lá.

## Arquitetura

```
casamento-app/
├── casamento-api/   → Backend  (Spring Boot 3 + Java 21 + PostgreSQL + Cloudinary)
└── casamento-web/   → Frontend (Next.js 14 + TypeScript + Tailwind)
```

- **Contas, posts, comentários e curtidas** → banco PostgreSQL
- **Fotos e vídeos** → Cloudinary (armazenamento de mídia)
- **Login sem senha** → o convidado só digita o nome na primeira visita e fica conectado naquele aparelho (token JWT válido por 1 ano). A identidade é por aparelho; nomes podem repetir

---

## ▶️ Rodando localmente

### 1. Pré-requisitos
- Java 21 e Maven
- Node.js 18+ e npm
- PostgreSQL rodando, com um banco chamado `casamento`
- Uma conta gratuita no [Cloudinary](https://cloudinary.com)

### 2. Backend (`casamento-api`)
```bash
cd casamento-api
cp .env.example .env        # preencha as credenciais (banco + Cloudinary)
# exporte as variáveis do .env no seu shell e rode:
mvn spring-boot:run
```
A API sobe em `http://localhost:8080`. As tabelas são criadas automaticamente (Flyway).

### 3. Frontend (`casamento-web`)
```bash
cd casamento-web
cp .env.example .env.local  # já aponta para http://localhost:8080
npm install
npm run dev
```
O app abre em `http://localhost:3000`.

---

## 🎨 Personalizando para um novo casamento

Para cada casamento novo, **copie esta pasta** e altere apenas:

1. **`casamento-web/config/wedding.ts`** — nome do casal, data, hashtag, mensagens e **cores do tema**. É o coração da personalização: as cores viram o tema de todo o app automaticamente.
2. **`casamento-web/public/`** — troque `logo.svg` (monograma do casal) e adicione `hero.jpg` se quiser uma foto de capa. Pode usar PNG/JPG; só ajuste o caminho em `wedding.ts`.
3. **Credenciais** — um banco PostgreSQL e uma conta/pasta Cloudinary por casamento (no `.env` do backend) + um `JWT_SECRET` único.

Nada de código precisa ser tocado para um casamento novo. 🎉

---

## 🚀 Deploy (sugestão)
- **Frontend:** Vercel (gratuito) — defina `NEXT_PUBLIC_API_URL` apontando para a API.
- **Backend:** Railway / Render / Fly.io — use o `Dockerfile` incluído e configure as variáveis de ambiente.
- **Banco:** Postgres gerenciado (Railway/Render/Supabase).
- **Mídia:** Cloudinary (plano gratuito cobre bem um casamento).
