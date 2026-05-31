# 🌐 PASSO A PASSO PARA DEPLOY (Netlify + Render + Supabase)

Este documento descreve como levar o sistema de avaliação protetivo "TRAJETÓRIA DESCUBRA+" do Hackathon de Pirapora para produção em menos de 10 minutos.

---

## 💾 Fase 1: Configuração do Supabase (Banco de Dados)
1. Acesse [https://supabase.com](https://supabase.com) e crie um novo projeto chamado `trajetoria-descubra`.
2. Vá ao menu **SQL Editor** no painel esquerdo do Supabase.
3. Abra as abas correspondentes e execute sequencialmente os scripts contidos na pasta `/database`:
   - Primeiro execute o `/database/schema.sql` para criar a fiação de tabelas relvantes.
   - Depois execute o `/database/functions.sql` para cadastrar as geocalculadoras de risco.
   - Em seguida o `/database/triggers.sql` para automatizar as notificações preventivas.
   - Aplique o `/database/rls_policies.sql` para blindar o sigilo dos jovens sob supervisão judicial.
   - Finalize com o `/database/seed.sql` para obter os dados de homologação regional de Pirapora.

---

## ⚡ Fase 2: Backend Node.js (Render Cloud)
1. Conecte seu repositório GitHub ao painel do **Render** ([https://render.com](https://render.com)).
2. Crie um novo **Web Service**.
3. Selecione a raiz do projeto e configure as variáveis:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Na aba **Environment Variables (Secrets)**, inclua:
   - `DATABASE_URL` = Sua string de conexão oficial PostgreSQL fornecida no painel do Supabase.

---

## 🎨 Fase 3: Frontend Web SPA (Netlify)
1. Conecte o repositório ao painel do **Netlify** ([https://netlify.com](https://netlify.com)).
2. Escolha o site e selecione as configurações de build:
   - **Publish directory:** `dist/`
   - **Build command:** `vite build`
3. Se seu backend estiver separado, configure a variável de ambiente:
   - `VITE_API_URL` = URL fornecida peloRender no deploy anterior.
4. Adicione um arquivo `_redirects` na pasta de distribuição contendo `/* /index.html 200` para garantir o controle ideal de sub-routers SPA.
