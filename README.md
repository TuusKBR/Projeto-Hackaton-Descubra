# 🧭 TRAJETÓRIA DESCUBRA+ — HACKATHON

Plataforma Web Full-Stack de impacto social para acompanhamento e inclusão produtiva de jovens de 14 a 21 anos em situação de extrema vulnerabilidade social no **Programa Descubra!** em **Pirapora, Buritizeiro e Jequitaí (MG)**.

## 🚀 O Problema Social Resolvido
- **Evasão no Pré-Aprendizado:** Identificação preditiva matemática de comportamento de risco antes do abandono escolar ou profissional.
- **Barreira de Transporte:** Jovens de bairros afastados (como Planalto, São Geraldo ou Buritizeiro) impossibilitados de ir a entrevistas.
- **Trabalho Infantil x Subsistência:** Integração da **Renda Ponte Digital** para garantir micro-recompensas financeiras legítimas por atividades e tarefas protetivas de capacitação.
- **Desintegração de Atores:** Integração em tempo real entre Coordenador Municipal, Escolas Estaduais, CRAS/CREAS e Grandes Indústrias locais (**Minas Ligas, Liasa, Comercial Pirapora**).

---

## 🛠️ Stack Tecnológica
- **Backend:** Node.js + Express + TypeScript + geocalculadoras de vizinhança robustas (Porta 3000 integrada)
- **Frontend:** React + TypeScript + Tailwind CSS (Vite integrado)
- **Persistência / Simulação:** Banco persistente local estruturado em `database/state.json`, espelhando perfeitamente os esquemas de produção PostgreSQL do **Supabase**.

---

## 💻 Como Executar Localmente

### 1. Instalar as Dependências
O ambiente já vem completamente pré-instalado. Mas caso queira recomeçar:
```bash
npm install
```

### 2. Rodar o Servidor Integrado (Frontend + API Backend)
```bash
npm run dev
```
Isso iniciará o servidor unificado em [http://localhost:3000](http://localhost:3000) servindo a API de geoprocessamento e o painel de visualização simultânea!

### 3. Buildar para Produção
```bash
npm run build
```

---

## 📂 Arquitetura do Repositório
- `/server.ts` : Servidor Express unificado controlando autenticação, rotas de matchmaking de vizinhança e simuladores WhatsApp.
- `/src/App.tsx` : Interface máster de alta-fidelidade contendo o simulador simultâneo de 4 personas.
- `/src/utils/calculadoraRisco.ts` : Motor oficial de risco contendo regras de frequências, faltas e renda.
- `/database/` : Códigos de esquema, triggers de banco de dados, políticas RLS por perfil e dados seed realistas da região de Pirapora.
