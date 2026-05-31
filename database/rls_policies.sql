-- Políticas de RLS (Row Level Security) organizados por perfil municipal para o Programa Descubra!

-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE jovens ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchs ENABLE ROW LEVEL SECURITY;
ALTER TABLE acompanhamento_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_evasao ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitacoes_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE microtarefas_realizadas ENABLE ROW LEVEL SECURITY;

-- 1. POLÍTICAS PARA JOVEM (Vê e altera somente seus próprios dados)
CREATE POLICY jovem_read_own ON jovens
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY jovem_update_own ON jovens
    FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY jovem_read_own_passes ON solicitacoes_passes
    FOR SELECT USING (jovem_id IN (SELECT id FROM jovens WHERE usuario_id = auth.uid()));

CREATE POLICY jovem_insert_own_passes ON solicitacoes_passes
    FOR INSERT WITH CHECK (jovem_id IN (SELECT id FROM jovens WHERE usuario_id = auth.uid()));

CREATE POLICY jovem_read_own_tasks ON microtarefas_realizadas
    FOR SELECT USING (jovem_id IN (SELECT id FROM jovens WHERE usuario_id = auth.uid()));

CREATE POLICY jovem_insert_own_tasks ON microtarefas_realizadas
    FOR INSERT WITH CHECK (jovem_id IN (SELECT id FROM jovens WHERE usuario_id = auth.uid()));


-- 2. POLÍTICAS PARA EMPRESA (Vê jovens com status de preparo, e gerencia suas vagas/matches)
CREATE POLICY empresa_read_jovens ON jovens
    FOR SELECT USING (
        status IN ('pré-aprendizagem', 'encaminhado') 
        OR id IN (SELECT jovem_id FROM matchs WHERE vaga_id IN (SELECT id FROM vagas WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())))
    );

CREATE POLICY empresa_read_own ON empresas
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY empresa_manage_vagas ON vagas
    FOR ALL USING (empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()));

CREATE POLICY empresa_manage_matches ON matchs
    FOR ALL USING (vaga_id IN (SELECT id FROM vagas WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())));


-- 3. POLÍTICAS PARA ASSISTENTE SOCIAL (Vê e altera todos jovens da microrregião de Pirapora)
CREATE POLICY assistente_all_jovens ON jovens
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM perfis 
            WHERE id = auth.uid() AND tipo IN ('assistente_social', 'coordenador')
        )
    );

CREATE POLICY assistente_all_atendimentos ON acompanhamento_social
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM perfis 
            WHERE id = auth.uid() AND tipo IN ('assistente_social', 'coordenador')
        )
    );

CREATE POLICY assistente_all_alertas ON alertas_evasao
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM perfis 
            WHERE id = auth.uid() AND tipo IN ('assistente_social', 'coordenador')
        )
    );


-- 4. POLÍTICAS PARA COORDENADOR (Apenas o coordenador da Secretaria Municipal tem super-poderes de escrita/aprovação ou leitura global)
CREATE POLICY coordenador_master_rule ON perfis
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM perfis 
            WHERE id = auth.uid() AND tipo = 'coordenador'
        )
    );
