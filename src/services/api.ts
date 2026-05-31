/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Jovem, Empresa, Vaga, Match, Alerta, AcompanhamentoSocial, Microtarefa, MicrotarefaRealizada, DoacaoPasses, SolicitacaoPasses, ProgressoCurso } from '../types';

export const API_URL = ''; // Same host

export async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro na requisição' }));
    throw new Error(err.message || `Erro ${res.status}`);
  }
  return res.json();
}

export const apiService = {
  login: async (email: string, password: string) => {
    return fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getJovens: async (): Promise<Jovem[]> => {
    return fetchJson('/api/jovens');
  },

  getJovem: async (id: string): Promise<Jovem> => {
    return fetchJson(`/api/jovens/${id}`);
  },

  salvarJovem: async (jovem: Partial<Jovem>) => {
    return fetchJson('/api/jovens', {
      method: 'POST',
      body: JSON.stringify(jovem),
    });
  },

  importarCSV: async (csvText: string) => {
    return fetchJson('/api/jovens/import', {
      method: 'POST',
      body: JSON.stringify({ csvText }),
    });
  },

  getAlertas: async (): Promise<Alerta[]> => {
    return fetchJson('/api/social/alertas');
  },

  resolverAlerta: async (id: string, status: string, acao?: string) => {
    return fetchJson(`/api/social/alertas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, acao }),
    });
  },

  criarAlerta: async (alerta: { jovem_id: string; jovem_nome: string; jovem_bairro: string; tipo: string; gravidade: string; status: string; descricao: string; data_criado: string }) => {
    return fetchJson('/api/social/alertas', {
      method: 'POST',
      body: JSON.stringify(alerta),
    });
  },

  getAtendimentos: async (): Promise<AcompanhamentoSocial[]> => {
    return fetchJson('/api/social/atendimentos');
  },

  salvarAtendimento: async (atendimento: any) => {
    return fetchJson('/api/social/atendimentos', {
      method: 'POST',
      body: JSON.stringify(atendimento),
    });
  },

  getTarefasRendaPonte: async (): Promise<{ tarefas: Microtarefa[]; realizadas: MicrotarefaRealizada[] }> => {
    return fetchJson('/api/rendaponte/tarefas');
  },

  concluirTarefaRenda: async (jovemId: string, tarefaId: string, resposta: string) => {
    return fetchJson('/api/rendaponte/concluir', {
      method: 'POST',
      body: JSON.stringify({ jovemId, tarefaId, resposta }),
    });
  },

  aprovarTarefaRenda: async (realizadaId: string, aprovar: boolean) => {
    return fetchJson('/api/rendaponte/aprovar', {
      method: 'POST',
      body: JSON.stringify({ realizadaId, aprovar }),
    });
  },

  getPasses: async (): Promise<{ doacoes: DoacaoPasses[]; solicitacoes: SolicitacaoPasses[] }> => {
    return fetchJson('/api/passes');
  },

  doarPasses: async (empresaId: string, quantidade: number, validade?: string) => {
    return fetchJson('/api/passes/doacoes', {
      method: 'POST',
      body: JSON.stringify({ empresaId, quantidade, validade }),
    });
  },

  solicitarPasses: async (jovemId: string, quantidade: number, motivo: string) => {
    return fetchJson('/api/passes/solicitacoes', {
      method: 'POST',
      body: JSON.stringify({ jovemId, quantidade, motivo }),
    });
  },

  aprovarSolicitacaoPasses: async (id: string, status: 'aprovada' | 'rejeitada') => {
    return fetchJson(`/api/passes/solicitacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getVagas: async (): Promise<Vaga[]> => {
    return fetchJson('/api/vagas');
  },

  criarVaga: async (vaga: any) => {
    return fetchJson('/api/vagas', {
      method: 'POST',
      body: JSON.stringify(vaga),
    });
  },

  getMatchmaking: async (queryParams: { youngId?: string; vagaId?: string }): Promise<Match[]> => {
    const q = new URLSearchParams(queryParams as any).toString();
    return fetchJson(`/api/matchmaking?${q}`);
  },

  interagirMatch: async (jovemId: string, vagaId: string, status: string) => {
    return fetchJson('/api/matchmaking/interagir', {
      method: 'POST',
      body: JSON.stringify({ jovemId, vagaId, status }),
    });
  },

  getRanking: async (bairro?: string): Promise<Jovem[]> => {
    const q = bairro ? `?bairro=${encodeURIComponent(bairro)}` : '';
    return fetchJson(`/api/ranking${q}`);
  },

  simularWhatsApp: async (jovemId: string, mensagem: string) => {
    return fetchJson('/api/whatsapp/simulador', {
      method: 'POST',
      body: JSON.stringify({ jovemId, mensagem }),
    });
  },

  getEstatisticasDashboard: async () => {
    return fetchJson('/api/dashboard/estatisticas');
  },

  getCursosProgresso: async (): Promise<ProgressoCurso[]> => {
    return fetchJson('/api/cursos/progresso');
  },

  atualizarCursoProgresso: async (payload: {
    jovemId: string;
    jovemNome: string;
    cursoId: string;
    cursoTitulo: string;
    categoria: 'MEI' | 'Descubra Jovem';
    status: 'Iniciado' | 'Em Andamento' | 'Concluido';
    progressoPercentual: number;
  }) => {
    return fetchJson('/api/cursos/progresso', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  restaurarDados: async () => {
    return fetchJson('/api/reset', { method: 'POST' });
  }
};
