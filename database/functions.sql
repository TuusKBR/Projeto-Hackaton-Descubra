-- PL/pgSQL database functions optimized for evasion calculations and geolocation indexing in Pirapora (MG)

-- 1. Function to compute risk score linearly in Postgres
CREATE OR REPLACE FUNCTION calcular_risco_evasao(
    p_frequencia_curso NUMERIC,
    p_renda_familiar NUMERIC,
    p_desempenho VARCHAR,
    p_faltas_consecutivas INT,
    p_vulnerabilidade_tipo VARCHAR,
    p_ultimo_contato TIMESTAMP
)
RETURNS JSON AS $$
DECLARE
    v_pontuacao INT := 0;
    v_classificacao VARCHAR(20) := 'baixo';
    v_dias_sem_contato INT;
BEGIN
    -- Evaluate school frequency (< 75% -> 40 pts, < 85% -> 20 pts)
    IF p_frequencia_curso < 75 THEN
        v_pontuacao := v_pontuacao + 40;
    ELSIF p_frequencia_curso <= 85 THEN
        v_pontuacao := v_pontuacao + 20;
    END IF;

    -- Evaluate family per-capita income (< 1412 -> 30 pts)
    IF p_renda_familiar < 1412 THEN
        v_pontuacao := v_pontuacao + 30;
    END IF;

    -- Evaluate performance grade
    IF p_desempenho = 'ruim' THEN
        v_pontuacao := v_pontuacao + 30;
    ELSIF p_desempenho = 'regular' THEN
        v_pontuacao := v_pontuacao + 15;
    END IF;

    -- Absenteeism consecutive counts
    IF p_faltas_consecutivas >= 5 THEN
        v_pontuacao := v_pontuacao + 40;
    ELSIF p_faltas_consecutivas >= 3 THEN
        v_pontuacao := v_pontuacao + 25;
    END IF;

    -- Declared risk social state (Work, Socioeducation, Abuse etc)
    IF p_vulnerabilidade_tipo IS NOT NULL AND p_vulnerabilidade_tipo <> 'Nenhuma' AND p_vulnerabilidade_tipo <> '' THEN
        v_pontuacao := v_pontuacao + 20;
    END IF;

    -- Days from last coordinator visit
    IF p_ultimo_contato IS NOT NULL THEN
        v_dias_sem_contato := EXTRACT(DAY FROM (NOW() - p_ultimo_contato))::INT;
        IF v_dias_sem_contato > 15 THEN
            v_pontuacao := v_pontuacao + 25;
        END IF;
    END IF;

    -- Output tags
    IF v_pontuacao >= 70 THEN
        v_classificacao := 'alto';
    ELSIF v_pontuacao >= 40 THEN
        v_classificacao := 'medio';
    END IF;

    RETURN json_build_object(
        'pontuacao', v_pontuacao,
        'classificacao', v_classificacao
    );
END;
$$ LANGUAGE plpgsql;


-- 2. Bulk classification update routine
CREATE OR REPLACE FUNCTION classificar_risco_automatico()
RETURNS TRIGGER AS $$
DECLARE
    v_res JSON;
BEGIN
    v_res := calcular_risco_evasao(
        NEW.frequencia,
        NEW.renda_familiar,
        NEW.desempenho,
        NEW.faltas_consecutivas,
        NEW.vulnerabilidade_tipo,
        NEW.ultimo_contato
    );

    -- Insert updated audit log table
    INSERT INTO classificacao_risco (jovem_id, risco, pontuacao)
    VALUES (NEW.id, v_res->>'classificacao', (v_res->>'pontuacao')::INT);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
