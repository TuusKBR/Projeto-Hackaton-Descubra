/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Jovem } from '../types';

/**
 * Calcula a pontuação de risco de evasão e vulnerabilidade do jovem do Programa Descubra.
 * Retorna os pontos detalhados e a classificação final: 'baixo', 'medio' ou 'alto'.
 */
export function calcularRisco(jovem: Partial<Jovem>): {
  pontuacao: number;
  classificacao: 'baixo' | 'medio' | 'alto';
  detalhes: string[];
} {
  let pontuacao = 0;
  const detalhes: string[] = [];

  // 1. Frequência escolar / curso
  const frequencia = jovem.frequencia ?? 100;
  if (frequencia < 75) {
    pontuacao += 40;
    detalhes.push(`Frequência crítica (${frequencia}% < 75%): +40 pontos`);
  } else if (frequencia >= 75 && frequencia <= 85) {
    pontuacao += 20;
    detalhes.push(`Frequência em alerta (${frequencia}% entre 75-85%): +20 pontos`);
  }

  // 2. Renda per capita (renda_familiar)
  // Assumindo renda per capita como a renda familiar dividida por 3 (média de pessoas na família).
  // Se o jovem já tem renda_familiar informada direto, podemos usar ela de base ou se for declaradamente renda per capita.
  // Regra literal diz: "renda per capita < R$ 1412 -> +30".
  // Vamos assumir que a propriedade renda_familiar representa a renda per capita para fins de regra literal ou calculamos.
  const renda = jovem.renda_familiar ?? 1500;
  if (renda < 1412) {
    pontuacao += 30;
    detalhes.push(`Renda per capita abaixo do salário mínimo (R$ ${renda} < R$ 1412): +30 pontos`);
  }

  // 3. Desempenho
  const desempenho = jovem.desempenho ?? 'bom';
  if (desempenho === 'ruim') {
    pontuacao += 30;
    detalhes.push(`Desempenho escolar/acadêmico ruim: +30 pontos`);
  } else if (desempenho === 'regular') {
    pontuacao += 15;
    detalhes.push(`Desempenho escolar/acadêmico regular: +15 pontos`);
  }

  // 4. Faltas consecutivas
  const faltas = jovem.faltas_consecutivas ?? 0;
  if (faltas >= 5) {
    pontuacao += 40;
    detalhes.push(`Absenteísmo crônico (${faltas} faltas consecutivas >= 5): +40 pontos`);
  } else if (faltas >= 3) {
    pontuacao += 25;
    detalhes.push(`Absenteísmo preocupante (${faltas} faltas consecutivas >= 3): +25 pontos`);
  }

  // 5. Tipo de Vulnerabilidade
  const vul = jovem.vulnerabilidade_tipo ?? '';
  if (vul && vul.trim() !== '' && vul !== 'Nenhuma' && vul !== '-') {
    pontuacao += 20;
    detalhes.push(`Vulnerabilidade social declarada (${vul}): +20 pontos`);
  }

  // 6. Último contato (>15 dias)
  // Verificamos se ultimo_contato indica mais de 15 dias sem contato
  const ultimoContatoStr = jovem.ultimo_contato ?? '';
  let maisDe15Dias = false;

  if (ultimoContatoStr) {
    try {
      const dataContato = new Date(ultimoContatoStr);
      const hoje = new Date();
      const difTempo = hoje.getTime() - dataContato.getTime();
      const difDias = Math.floor(difTempo / (1000 * 60 * 60 * 24));
      if (difDias > 15) {
        maisDe15Dias = true;
        pontuacao += 25;
        detalhes.push(`Último contato há ${difDias} dias (> 15 dias): +25 pontos`);
      }
    } catch (e) {
      // Se for apenas uma string descritiva que remeta a tempo decorrido, ou erro de parse
      if (ultimoContatoStr.includes('15') || ultimoContatoStr.includes('mês') || ultimoContatoStr.includes('há mais')) {
        maisDe15Dias = true;
        pontuacao += 25;
        detalhes.push(`Indício de ausência de contato: +25 pontos`);
      }
    }
  }

  // Classificação final: >=70 = alto, 40-69 = médio, <40 = baixo
  let classificacao: 'baixo' | 'medio' | 'alto' = 'baixo';
  if (pontuacao >= 70) {
    classificacao = 'alto';
  } else if (pontuacao >= 40) {
    classificacao = 'medio';
  }

  return {
    pontuacao,
    classificacao,
    detalhes,
  };
}
