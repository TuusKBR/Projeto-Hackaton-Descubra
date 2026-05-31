/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Jovem {
  id: string;
  usuario_id?: string;
  nome: string;
  data_nasc: string;
  idade: number;
  genero: string;
  raca: string;
  bairro: string;
  cidade: string;
  lat: number;
  lng: number;
  vulnerabilidade_tipo: string;
  encaminhado_por: string;
  escolaridade: string;
  status: 'cadastrado' | 'encaminhado' | 'pré-aprendizagem' | 'aprendiz_contratado' | 'evadido';
  frequencia: number; // 0 - 100
  faltas_consecutivas: number;
  ultimo_contato: string; // ISO date or string representation
  renda_familiar: number; // Família
  desempenho: 'bom' | 'regular' | 'ruim';
  score_engajamento: number; // 0 - 100
  score_empregabilidade: number; // 0 - 100
  pontos_totais: number;
  nivel: number;
  badges: string[];
  telefone?: string;
}

export interface Empresa {
  id: string;
  usuario_id?: string;
  razao_social: string;
  cnpj: string;
  bairro: string;
  cidade: string;
  lat: number;
  lng: number;
  total_funcionarios: number;
  cota_minima: number;
  cotas_preenchidas: number;
}

export interface Vaga {
  id: string;
  empresa_id: string;
  empresa_nome: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  habilidades: string[];
  quantidade: number;
  bairro: string;
  cidade: string;
  lat: number;
  lng: number;
  status: 'aberta' | 'fechada';
}

export interface Match {
  id: string;
  jovem_id: string;
  jovem_nome: string;
  jovem_bairro: string;
  vaga_id: string;
  vaga_titulo: string;
  empresa_nome: string;
  score_match: number; // percentual de match
  distancia_km: number;
  status: 'sugerido' | 'candidatado' | 'entrevista' | 'contratado' | 'recusado';
  data_interacao: string;
}

export interface Alerta {
  id: string;
  jovem_id: string;
  jovem_nome: string;
  jovem_bairro: string;
  tipo: 'Falta Consecutiva' | 'Frequência Alerta' | 'Falta de Contato' | 'Evasão Escolar' | 'Mensagem WhatsApp' | 'Solicitação de Apoio';
  gravidade: 'baixo' | 'medio' | 'alto';
  status: 'pendente' | 'em_atendimento' | 'resolvido';
  descricao: string;
  data_criado: string;
}

export interface AcompanhamentoSocial {
  id: string;
  jovem_id: string;
  jovem_nome: string;
  assistente_id: string;
  assistente_nome: string;
  data: string;
  tema: string;
  relatorio: string;
  encaminhamentos: string;
}

export interface Microtarefa {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  tempo_estimado: string;
  ativa: boolean;
}

export interface MicrotarefaRealizada {
  id: string;
  jovem_id: string;
  jovem_nome: string;
  microtarefa_id: string;
  microtarefa_titulo: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  resposta: string;
  valor_recebido: number;
  data: string;
}

export interface DoacaoPasses {
  id: string;
  empresa_id: string;
  empresa_nome: string;
  quantidade: number;
  validade: string;
  status: 'ativo' | 'expirado';
}

export interface SolicitacaoPasses {
  id: string;
  jovem_id: string;
  jovem_nome: string;
  jovem_bairro: string;
  quantidade: number;
  motivo: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  qr_code: string;
  data: string;
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  pontos_necessarios: number;
  icone: string;
}

export interface ClassificacaoRiscoHistorico {
  id: string;
  jovem_id: string;
  data: string;
  risco: 'baixo' | 'medio' | 'alto';
  pontuacao: number;
}

export interface ProgressoCurso {
  id: string;
  jovem_id: string;
  jovem_nome: string;
  curso_id: string;
  curso_titulo: string;
  categoria: 'MEI' | 'Descubra Jovem';
  status: 'Iniciado' | 'Em Andamento' | 'Concluido';
  progresso_percentual: number;
  data_atualizacao: string;
}
