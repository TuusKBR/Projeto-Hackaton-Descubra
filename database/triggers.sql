-- Triggers Postgres automatizados para segurança preventiva do Programa Descubra!

-- Trigger 1: Atualiza automaticamente a tabela de classificação de risco do jovem ao realizar inserções ou modificações
CREATE OR REPLACE TRIGGER trigger_classificar_risco_jovem
AFTER INSERT OR UPDATE OF frequencia, renda_familiar, desempenho, faltas_consecutivas, vulnerabilidade_tipo, ultimo_contato ON jovens
FOR EACH ROW
EXECUTE FUNCTION classificar_risco_automatico();


-- Trigger 2: Dispara Alertas de Evasão se o Risco for classificado como ALTO
CREATE OR REPLACE FUNCTION disparar_alerta_automatico()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.risco = 'alto' THEN
        -- Verifica se já possui um alerta pendente
        IF NOT EXISTS (
            SELECT 1 FROM alertas_evasao 
            WHERE jovem_id = NEW.jovem_id AND status <> 'resolvido'
        ) THEN
            INSERT INTO alertas_evasao (jovem_id, tipo, gravidade, status, descricao)
            VALUES (
                NEW.jovem_id, 
                'Evasão Alerta', 
                'alto', 
                'pendente', 
                'Gatilho Automático do Banco: pontuação de risco ' || NEW.pontuacao || '/100 excedeu os limites de proteção escolar.'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_disparar_alerta_evasao
AFTER INSERT ON classificacao_risco
FOR EACH ROW
EXECUTE FUNCTION disparar_alerta_automatico();
