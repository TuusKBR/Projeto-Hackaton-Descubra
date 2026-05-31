-- Schema oficial Supabase para "TRAJETÓRIA DESCUBRA+" (Pirapora-MG)

-- 1. perfis
CREATE TABLE perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('coordenador', 'assistente_social', 'empresa', 'jovem')),
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    avatar VARCHAR(255)
);

-- 2. jovens
CREATE TABLE jovens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id),
    nome VARCHAR(255) NOT NULL,
    data_nasc DATE NOT NULL,
    genero VARCHAR(50),
    raca VARCHAR(50),
    bairro VARCHAR(100) NOT NULL, -- Centro, Santo Antônio, Planalto, São Geraldo, Vila Rica etc.
    cidade VARCHAR(100) DEFAULT 'Pirapora',
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    vulnerabilidade_tipo VARCHAR(100),
    encaminhado_por VARCHAR(100),
    escolaridade VARCHAR(100),
    status VARCHAR(50) DEFAULT 'cadastrado' CHECK (status IN ('cadastrado', 'encaminhado', 'pré-aprendizagem', 'aprendiz_contratado', 'evadido')),
    frequencia NUMERIC(5, 2) DEFAULT 100,
    faltas_consecutivas INT DEFAULT 0,
    ultimo_contato TIMESTAMP DEFAULT NOW(),
    score_engajamento INT DEFAULT 50,
    score_empregabilidade INT DEFAULT 50,
    pontos_totais INT DEFAULT 0,
    nivel INT DEFAULT 1,
    badges TEXT[] DEFAULT '{}'::TEXT[]
);

-- 3. empresas
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id),
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    bairro VARCHAR(100),
    cidade VARCHAR(100) DEFAULT 'Pirapora',
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    total_funcionarios INT DEFAULT 0,
    cota_minima INT DEFAULT 0,
    cotas_preenchidas INT DEFAULT 0
);

-- 4. vagas
CREATE TABLE vagas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    requisitos TEXT,
    habilidades TEXT[] DEFAULT '{}'::TEXT[],
    quantidade INT DEFAULT 1,
    bairro VARCHAR(100),
    cidade VARCHAR(100) DEFAULT 'Pirapora',
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    status VARCHAR(50) DEFAULT 'aberta' CHECK (status IN ('aberta', 'fechada'))
);

-- 5. matchs
CREATE TABLE matchs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE,
    score_match INT DEFAULT 0,
    distancia_km NUMERIC(5, 2),
    status VARCHAR(50) DEFAULT 'sugerido' CHECK (status IN ('sugerido', 'candidatado', 'entrevista', 'contratado', 'recusado'))
);

-- 6. trajetoria
CREATE TABLE trajetoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    etapa VARCHAR(100) NOT NULL,
    data TIMESTAMP DEFAULT NOW(),
    observacoes TEXT
);

-- 7. acompanhamento_social
CREATE TABLE acompanhamento_social (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    assistente_id UUID NOT NULL,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    tema VARCHAR(255) NOT NULL,
    relatorio TEXT NOT NULL,
    encaminhamentos TEXT
);

-- 8. alertas_evasao
CREATE TABLE alertas_evasao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,
    gravidade VARCHAR(50) NOT NULL CHECK (gravidade IN ('baixo', 'medio', 'alto')),
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_atendimento', 'resolvido')),
    descricao TEXT,
    acao TEXT
);

-- 9. microtarefas
CREATE TABLE microtarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    tempo_estimado VARCHAR(50),
    ativa BOOLEAN DEFAULT TRUE
);

-- 10. microtarefas_realizadas
CREATE TABLE microtarefas_realizadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    microtarefa_id UUID REFERENCES microtarefas(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
    resposta TEXT,
    valor_recebido NUMERIC(10, 2)
);

-- 11. doacoes_passes
CREATE TABLE doacoes_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    quantidade INT NOT NULL,
    validade DATE,
    status VARCHAR(50) DEFAULT 'ativo'
);

-- 12. solicitacoes_passes
CREATE TABLE solicitacoes_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    quantidade INT NOT NULL,
    motivo TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
    qr_code VARCHAR(255)
);

-- 13. badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    pontos_necessarios INT DEFAULT 0,
    imagem VARCHAR(255)
);

-- 14. conquistas_jovem
CREATE TABLE conquistas_jovem (
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    data TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jovem_id, badge_id)
);

-- 15. mentorias
CREATE TABLE mentorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL,
    mentorado_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    inicio DATE,
    fim DATE,
    sessoes INT DEFAULT 0
);

-- 16. diario_bordo
CREATE TABLE diario_bordo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    video_url VARCHAR(255),
    descricao TEXT,
    curtidas INT DEFAULT 0
);

-- 17. classificacao_risco
CREATE TABLE classificacao_risco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jovem_id UUID REFERENCES jovens(id) ON DELETE CASCADE,
    data TIMESTAMP DEFAULT NOW(),
    risco VARCHAR(50) CHECK (risco IN ('baixo', 'medio', 'alto')),
    pontuacao INT NOT NULL
);
