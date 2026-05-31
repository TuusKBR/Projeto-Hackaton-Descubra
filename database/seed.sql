-- Dados simulados (SEED) realistas para homologação e apresentação no Hackathon (Pirapora-MG)

-- 1. Insersão de Perfis de Teste
INSERT INTO perfis (id, tipo, nome, cpf, telefone, avatar) VALUES
('00000000-0000-1000-a000-000000000001', 'coordenador', 'Carlos Mendes', '034.234.567-91', '(38) 99823-4567', 'carlos_coord.png'),
('00000000-0000-2000-a000-000000000002', 'assistente_social', 'Ana Paula Silva', '054.123.654-20', '(38) 99912-8832', 'anapaula_cras.png'),
('00000000-0000-3000-a000-000000000003', 'empresa', 'Carlos Drummond (Minas Ligas)', '17.200.354/0001-90', '(38) 3749-1100', 'minasligas.png');


-- 2. Insersão de Jovens de Pirapora com Bairros Reais
INSERT INTO jovens (id, nome, data_nasc, genero, raca, bairro, cidade, lat, lng, vulnerabilidade_tipo, encaminhado_por, escolaridade, status, frequencia, faltas_consecutivas, ultimo_contato, score_engajamento, score_empregabilidade, pontos_totais, nivel, badges) VALUES
(
    '00000000-0000-0000-b000-000000000001', 
    'João Victor Mendes', 
    '2010-03-12', 
    'Masculino', 
    'Parda', 
    'Santo Antônio', 
    'Pirapora', 
    -17.3510, 
    -44.9450, 
    'Medida Socioeducativa', 
    'CREAS Pirapora', 
    'Ensino Médio Incompleto', 
    'pré-aprendizagem', 
    65, 
    4, 
    NOW() - INTERVAL '16 days', 
    45, 
    40, 
    120, 
    1, 
    ARRAY['Primeiro Acesso']
),
(
    '00000000-0000-0000-b000-000000000002', 
    'Maria Eduarda Fernandes', 
    '2009-08-22', 
    'Feminino', 
    'Preta', 
    'Planalto', 
    'Pirapora', 
    -17.3380, 
    -44.9280, 
    'Egresso de acolhimento', 
    'CRAS Santo Antônio', 
    'Ensino Médio Incompleto', 
    'pré-aprendizagem', 
    82, 
    1, 
    NOW() - INTERVAL '4 days', 
    75, 
    68, 
    280, 
    2, 
    ARRAY['Primeiro Acesso', 'Frequência Bronze']
),
(
    '00000000-0000-0000-b000-000000000003', 
    'Lucas Silva Pereira', 
    '2011-01-05', 
    'Masculino', 
    'Branca', 
    'Centro', 
    'Pirapora', 
    -17.3444, 
    -44.9392, 
    'Nenhuma', 
    'E.E. Professor Geraldo de Paula Souza', 
    'Ensino Fundamental Incompleto', 
    'encaminhado', 
    90, 
    0, 
    NOW() - INTERVAL '1 days', 
    95, 
    85, 
    520, 
    3, 
    ARRAY['Primeiro Acesso', 'Frequência Bronze', 'Missão Transporte']
),
(
    '00000000-0000-0000-b000-000000000004', 
    'Ana Beatriz Santos', 
    '2010-11-15', 
    'Feminino', 
    'Parda', 
    'São Geraldo', 
    'Pirapora', 
    -17.3580, 
    -44.9350, 
    'Trabalho Infantil', 
    'CRAS Santo Antônio', 
    'Ensino Médio Incompleto', 
    'cadastrado', 
    45, 
    8, 
    NOW() - INTERVAL '28 days', 
    20, 
    30, 
    30, 
    1, 
    '{}'::TEXT[]
),
(
    '00000000-0000-0000-b000-000000000005', 
    'Rafael Oliveira Costa', 
    '2009-02-28', 
    'Masculino', 
    'Preta', 
    'Vila Rica', 
    'Pirapora', 
    -17.3480, 
    -44.9520, 
    'Pobreza Extrema', 
    'CREAS Pirapora', 
    'Ensino Médio Incompleto', 
    'aprendiz_contratado', 
    78, 
    2, 
    NOW() - INTERVAL '2 days', 
    80, 
    72, 
    450, 
    2, 
    ARRAY['Primeiro Acesso', 'Frequência Bronze', 'Contratado']
);


-- 3. Insersão de Empresas Parceiras de Pirapora
INSERT INTO empresas (id, usuario_id, razao_social, cnpj, bairro, cidade, lat, lng, total_funcionarios, cota_minima, cotas_preenchidas) VALUES
('00000000-0000-0000-c000-000000000001', '00000000-0000-3000-a000-000000000003', 'Minas Ligas (Companhia Ferroligas)', '17.200.354/0001-90', 'Industrial', 'Pirapora', -17.3300, -44.9150, 680, 34, 18),
('00000000-0000-0000-c000-000000000002', NULL, 'Liasa (Ligas de Alumínio S.A.)', '04.598.112/0001-22', 'Industrial', 'Pirapora', -17.3310, -44.9160, 420, 21, 9),
('00000000-0000-0000-c000-000000000003', NULL, 'Comercial Pirapora Ltda', '25.312.445/0002-11', 'Centro', 'Pirapora', -17.3444, -44.9392, 120, 6, 4);


-- 4. Insersão de Vagas Ativas de Aprendizado
INSERT INTO vagas (id, empresa_id, titulo, descricao, requisitos, habilidades, quantidade, bairro, cidade, lat, lng, status) VALUES
(
    '00000000-0000-0000-d000-000000000001', 
    '00000000-0000-0000-c000-000000000001', 
    'Aprendiz Auxiliar Mecânico de Manutenção', 
    'Executar serviços de manutenção corretiva industrial.', 
    'Ter no mínimo 16 anos e interesse em montagem.', 
    ARRAY['Noções de Ferramentas', 'Trabalho em Equipe'], 
    4, 
    'Industrial', 
    'Pirapora', 
    -17.3300, 
    -44.9150, 
    'aberta'
),
(
    '00000000-0000-0000-d000-000000000002', 
    '00000000-0000-0000-c000-000000000003', 
    'Aprendiz Assistente Administrativo', 
    'Controles de arquivos e faturamento de comércio.', 
    'Informática básica e boa comunicação escrita.', 
    ARRAY['Informática Básica', 'Organização'], 
    2, 
    'Centro', 
    'Pirapora', 
    -17.3444, 
    -44.9392, 
    'aberta'
);


-- 5. Insersão de Alertas Iniciais
INSERT INTO alertas_evasao (id, jovem_id, tipo, gravidade, status, descricao) VALUES
(
    '00000000-0000-0000-e000-000000000001', 
    '00000000-0000-0000-b000-000000000001', 
    'Frequência Alerta', 
    'alto', 
    'pendente', 
    'A frequencia caiu para 65% e há mais de 15 dias sem contato ativo coordenativo.'
),
(
    '00000000-0000-0000-e000-000000000002', 
    '00000000-0000-0000-b000-000000000004', 
    'Falta Consecutiva', 
    'alto', 
    'em_atendimento', 
    'Faltas consecutivas alarmantes e Trabalho Infantil.'
);


-- 6. Microtarefas (Renda Ponte Digital)
INSERT INTO microtarefas (id, titulo, descricao, valor, tempo_estimado, ativa) VALUES
('00000000-0000-0000-f000-000000000001', 'Pesquisa sobre transporte público em Pirapora', 'Entenda os deslocamentos municipais.', 10.00, '15 min', TRUE),
('00000000-0000-0000-f000-000000000002', 'Feedback do Curso de Preparação Profissional', 'Avalie sua experiência pedagógica.', 15.00, '20 min', TRUE);


-- 7. Doações de Passes de Transporte
INSERT INTO doacoes_passes (id, empresa_id, quantidade, validade, status) VALUES
('00000000-0000-0000-g000-000000000001', '00000000-0000-0000-c000-000000000001', 100, NOW() + INTERVAL '45 days', 'ativo');
