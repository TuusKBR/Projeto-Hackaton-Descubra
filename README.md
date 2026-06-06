# 🧭 REMIX: TRAJETÓRIA DESCUBRA+

> 🏆 **PROJETO DESENVOLVIDO PARA HACKATHON**
> 
> Esta plataforma foi idealizada, prototipada e implementada sob a pressão de tempo e escopo de um Hackathon, com o objetivo de demonstrar como a tecnologia e o design centrado no ser humano podem combater a evasão social de jovens aprendizes pioneiros da microrregião de Pirapora-MG.
> 
> **A Tese Desenvolvida:** O abandono do jovem e o descumprimento de cotas pelas empresas não ocorrem por falta de interesse, mas por **falhas de infraestrutura, comunicação e falta de rede de apoio preditiva em tempo hábil**. Ao conectar os quatro elos do ecossistema (*Coordenação*, *CRAS*, *Empresas* e *Estudante*) e aplicar inteligência preditiva nas faltas e barreiras territoriais, provamos que é possível realizar intervenções protetivas antes do abandono acontecer.

---

### 📌 Sobre o projeto
O **Trajetória Descubra+** foi desenhado com foco na desburocratização e centralização de atores sociais vitais para o ecossistema de aprendizagem profissional e assistência do município de Pirapora-MG e cidades adjacentes. A plataforma atua unindo pontas essenciais: **Poder Público (CRAS/CREAS e Coordenação)**, **Grandes Empresas Locais** e os **Jovens Participantes**.

Procuramos provar que inteligência preditiva, geolocalização e engajamento gamificado em rede de apoio direta conseguem manter jovens extremamente vulneráveis ativos nas trilhas de capacitação profissional em polos industriais de difícil deslocamento.

---

### 📊 Visão geral dos módulos
| # | Módulo | Perfil Relacionado | Foco e Principais Funcionalidades |
|---|---|---|---|
| 1 | 👔 Coordenador | Central de Governança | Painel Geral de KPIs, Mapa de Calor Territorial, Monitoramento Preditivo e Importação |
| 2 | 🏢 Empresa Parceira | Grandes Empregadores | Matchmaking de Proximidade Espacial, Gestão de Vagas Aprendiz e Cumprimento de Cotas |
| 3 | 🛡️ CRAS / CREAS | Linha de Frente (Alt. Social) | Fila de Emergência (Risco Crítico), Prontuários e Registro de Atendimentos |
| 4 | 🎓 Estudante | Jovem Aprendiz / Participante | Meu Perfil & Badges, Linha do Tempo de Frequência, Cursos Extras ("Descubra MEI") e Suporte |

---

### 📚 Estrutura do repositório
```text
Trajetoria-Descubra-Plus/
│
├── README.md                      ← Este documento descritivo do projeto do Hackathon
├── package.json                   ← Dependências fundamentais Node, Express e React
├── vite.config.ts                 ← Configurações de build do frontend Vite
├── server.ts                      ← Servidor backend unificado Express em TypeScript
│
├── database/                      ← Camada de persistência local & prototipação de Banco SQL
│   ├── state.json                 ← Banco simulado JSON mutável e persistente
│   ├── schema.sql                 ← Esquema estrutural PostgreSQL completo para o Supabase
│   ├── seed.sql                   ← Carga de dados realísticos baseados nos bairros de Pirapora-MG
│   ├── triggers.sql               ← Gatilhos SQL para atualização automática de scores
│   └── rls_policies.sql           ← Políticas RLS adicionais de isolamento por login de ator
│
└── src/                           ← Código fonte da aplicação frontend React SPA
    ├── main.tsx                   ← Arquivo de ponto de entrada React
    ├── App.tsx                    ← Gerenciamento de rotas, contextos e fluxos de autenticação
    ├── types.ts                   ← Definição de contratos rígidos de tipos e interfaces
    ├── index.css                  ← Estilização e importações globais com Tailwind CSS
    │
    ├── components/                ← Componentes de interface compartilhados e específicos
    │   ├── DashboardSidebar.tsx   ← Navegação ergonômica hierárquica e simulação intuitiva
    │   ├── DashboardHeader.tsx    ← Resumos de conta de usuário ativos
    │   ├── MapLocationPicker.tsx  ← Coordenadas interativas para cadastramento de jovens
    │   └── ...
    │
    └── pages/                     ← Painéis dedicados e customizados de cada persona
        ├── CoordinatorDashboard.tsx ← Painel de controle global e mesas de dados preditivos
        ├── SocialDashboard.tsx     ← Fila de triagem prioritária do CRAS e registros clínicos
        ├── CompanyDashboard.tsx    ← Mecanismo de aproximação geográfica e vagas corporativas
        └── StudentDashboard.tsx    ← Visão gamificada, badges, trilha MEI e canal de socorro
```

---

### 📖 Conteúdo detalhado do Sistema

#### 👔 1. Portal do Coordenador (Central de Controle de Políticas Públicas)
O menu de opções do Coordenador foi redesenhado ergonomicamente para uma operação profissional eficiente:
*   **Painel Geral de Métricas:** KPIs agregados de taxa de permanência municipal, engajamento comunitário médio e preenchimento real de cotas ativas.
*   **Mapa de Calor Territorial:** Visão analítica tridimensional de onde provêm os jovens com maior pontuação de estresse social nas periferias e calhas urbanas.
*   **Monitoria de Trajetórias:** Grade detalhada de acompanhamento individual contendo cálculos de presença e escoamento de risco.
*   **Manutenção de Cursos:** Controle de trilhas e oficinas qualificadoras e profissionalizantes integradas com o SENAI e CRAS.
*   **Cadastro Simplificado de Beneficiários:** Fluxo ágil com assistente interativo de geolocalização e coleta de especificidades.
*   **Importação CSV de Frequências:** Facilitador em lote de importação de chamadas de centros educacionais externos para processamento ágil.

#### 🏢 2. Matchmaking Inteligente e Vagas Corporativas
Reduzindo gargalos logísticos para grandes empregadores regionais (como **Minas Ligas**, **Liasa S.A.** e **Comercial Pirapora**):
*   **Proximidade Territorial:** Ferramenta heurística de recomendação que cruza os endereços residenciais dos jovens aprendizes com a lotação territorial da vaga aberta, minimizando tempos de trânsito.
*   **Espaço Corporativo Próprio:** Abas dedicadas ("Minhas Vagas") de gerenciamento, abertura rápida, status de matchings recomendados e controle de contratações ativas.

#### 🛡️ 3. Moderação Assistencial de Linha de Frente (CRAS / CREAS)
Focalização de energia do técnico social nos casos prioritários:
*   **Fila de Monitoramento de Emergências:** Triagem algorítmica de vulnerabilidades críticas. O robô inteligente joga no topo as ocorrências de grande incidência de faltas recentes ou alertas de socorro para que uma visita domiciliar cirúrgica seja engatilhada.
*   **Histórico de Prontuários:** Consolidação unificada de atendimentos e evoluções sociais de cada aluno na comunidade sob absoluto sigilo técnico.

#### 🎓 4. Gamificação e Empoderamento Estudantil
Visão otimizada para dispositivos móveis com foco em autoimagem positiva e autonomia ativa:
*   **Central de Badges & Progressão de Nível:** Ganhos de reputação por pontualidade comunitária, microtarefas de cidadania e frequência escolar perfeita.
*   **Trilha "Descubra MEI" e Cidadania Digital:** Trilhas rápidas de conscientização fiscal, segurança ocupacional e economia criativa.
*   **Apoio em Um Clique (Canal de Resgate):** Botão prático para acionamento direto do assistente social em situações emergenciais de desabastecimento, alimentação ou passes de integração de transporte.

---

### 🚀 Como executar o projeto

1.  **Garanta a instalação das dependências estáticas do Node:**
    ```bash
    npm install
    ```
2.  **Rode o servidor full-stack unificado em ambiente de desenvolvimento:**
    ```bash
    npm run dev
    ```
    *O ecossistema multipaper será iniciado unificadamente na porta **3000** com hot reload.*
3.  **Para auditar constrangimentos de tipagem estática:**
    ```bash
    npm run lint
    ```
4.  **Para gerar a build de produção otimizada:**
    ```bash
    npm run build
    ```

---

### 🛠️ Tecnologias utilizadas

`React 18` · `Vite` · `Node.js` · `Express` · `TypeScript` · `Tailwind CSS` · `Motion` · `Lucide Icons`

*   **Persistência Reativa:** Banco relacional virtual mutável rodando sob controle contínuo em `/database/state.json`.
*   **Relatórios Visuais:** `recharts` integrado para painéis analíticos e tabelas de métricas.
*   **Desenho SQL Relacional:** Scripts de modelagem PostgreSQL prontificados com heranças, triggers automatizados e políticas de segurança rigorosas baseadas nas leis municipais de Pirapora-MG.

---

### 📝 Observações e Regras de Negócio

*   **Algoritmo Preditivo de Evasão:**
    $$\text{Risco} = (\text{Faltas Consecutivas} \times 12\%) + (100 - \text{Frequência}) \times 40\% + (\text{Fator Vulnerabilidade}) \times 48\%$$
*   **Amostrador de Perfis Incorporado (Hackathon Utility):**
    O painel lateral possui um seletor simulador que permite aos avaliadores do Hackathon alternar instantaneamente entre perfis de jovens de diferentes bairros e graus de risco vulnerável para testarem em tempo real a reação preditiva e a reorganização da fila de prioridade do CRAS.

---

### 🔗 Links úteis
*   [Programa Descubra! Juventude e Cidadania](https://www.mg.gov.br/)
*   [Curso de Aprendizagem Profissional SENAI](https://www.senaimg.com.br/)
*   [Prefeitura Municipal de Pirapora/MG](http://www.pirapora.mg.gov.br/)

---

### 👨‍💻 Autores
Desenvolvido por Abraão Rubens, Kauã Ribeiro e Vitor Rafael

---

### ⭐ Agradecimentos
Agradecimento especial à organização dos direitos da infância, comitês locais de Pirapora e mentores generosos por propiciar o espaço de resolução dessas problemáticas de tremendo apelo comunitário.
