/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Jovem, Empresa, Vaga, Match, Alerta, AcompanhamentoSocial, Microtarefa, MicrotarefaRealizada, DoacaoPasses, SolicitacaoPasses } from './src/types';
import { calcularRisco } from './src/utils/calculadoraRisco';

const app = express();
const PORT = 3000;

app.use(express.json());

// Paths definitions
const DB_DIR = path.join(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'state.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial Realistic Seed Data for Pirapora, MG
const initialJovens: Jovem[] = [
  {
    id: 'jovem-1',
    nome: 'João Victor Mendes',
    data_nasc: '2010-03-12',
    idade: 16,
    genero: 'Masculino',
    raca: 'Parda',
    bairro: 'Santo Antônio',
    cidade: 'Pirapora',
    lat: -17.3510,
    lng: -44.9450,
    vulnerabilidade_tipo: 'Medida Socioeducativa',
    encaminhado_por: 'CREAS Pirapora',
    escolaridade: 'Ensino Médio Incompleto',
    status: 'pré-aprendizagem',
    frequencia: 65,
    faltas_consecutivas: 4,
    ultimo_contato: '2026-05-10', // Mais de 15 dias para o tempo de 2026-05-30
    renda_familiar: 800, // Per capita < 1412
    desempenho: 'ruim',
    score_engajamento: 45,
    score_empregabilidade: 40,
    pontos_totais: 120,
    nivel: 1,
    badges: ['Primeiro Acesso'],
    telefone: '38999812345'
  },
  {
    id: 'jovem-2',
    nome: 'Maria Eduarda Fernandes',
    data_nasc: '2009-08-22',
    idade: 17,
    genero: 'Feminino',
    raca: 'Preta',
    bairro: 'Planalto',
    cidade: 'Pirapora',
    lat: -17.3380,
    lng: -44.9280,
    vulnerabilidade_tipo: 'Egresso de acolhimento',
    encaminhado_por: 'CRAS Pirapora (Santo Antônio)',
    escolaridade: 'Ensino Médio Incompleto',
    status: 'pré-aprendizagem',
    frequencia: 82,
    faltas_consecutivas: 1,
    ultimo_contato: '2026-05-25',
    renda_familiar: 1200, // Per capita < 1412
    desempenho: 'regular',
    score_engajamento: 75,
    score_empregabilidade: 68,
    pontos_totais: 280,
    nivel: 2,
    badges: ['Primeiro Acesso', 'Frequência Bronze'],
    telefone: '38988225544'
  },
  {
    id: 'jovem-3',
    nome: 'Lucas Silva Pereira',
    data_nasc: '2011-01-05',
    idade: 15,
    genero: 'Masculino',
    raca: 'Branca',
    bairro: 'Centro',
    cidade: 'Pirapora',
    lat: -17.3444,
    lng: -44.9392,
    vulnerabilidade_tipo: 'Nenhuma',
    encaminhado_por: 'E.E. Professor Geraldo de Paula Souza',
    escolaridade: 'Ensino Fundamental Incompleto',
    status: 'encaminhado',
    frequencia: 90,
    faltas_consecutivas: 0,
    ultimo_contato: '2026-05-29',
    renda_familiar: 2000,
    desempenho: 'bom',
    score_engajamento: 95,
    score_empregabilidade: 85,
    pontos_totais: 520,
    nivel: 3,
    badges: ['Primeiro Acesso', 'Frequência Bronze', 'Missão Transporte'],
    telefone: '38991238899'
  },
  {
    id: 'jovem-4',
    nome: 'Ana Beatriz Santos',
    data_nasc: '2010-11-15',
    idade: 16,
    genero: 'Feminino',
    raca: 'Parda',
    bairro: 'São Geraldo',
    cidade: 'Pirapora',
    lat: -17.3580,
    lng: -44.9350,
    vulnerabilidade_tipo: 'Trabalho Infantil',
    encaminhado_por: 'CRAS Pirapora (Santo Antônio)',
    escolaridade: 'Ensino Médio Incompleto',
    status: 'cadastrado',
    frequencia: 45,
    faltas_consecutivas: 8,
    ultimo_contato: '2026-05-02', // Crítico
    renda_familiar: 600,
    desempenho: 'ruim',
    score_engajamento: 20,
    score_empregabilidade: 30,
    pontos_totais: 30,
    nivel: 1,
    badges: [],
    telefone: '38984013322'
  },
  {
    id: 'jovem-5',
    nome: 'Rafael Oliveira Costa',
    data_nasc: '2009-02-28',
    idade: 17,
    genero: 'Masculino',
    raca: 'Preta',
    bairro: 'Vila Rica',
    cidade: 'Pirapora',
    lat: -17.3480,
    lng: -44.9520,
    vulnerabilidade_tipo: 'Pobreza Extrema',
    encaminhado_por: 'CREAS Pirapora',
    escolaridade: 'Ensino Médio Incompleto',
    status: 'aprendiz_contratado',
    frequencia: 78,
    faltas_consecutivas: 2,
    ultimo_contato: '2026-05-28',
    renda_familiar: 1000,
    desempenho: 'regular',
    score_engajamento: 80,
    score_empregabilidade: 72,
    pontos_totais: 450,
    nivel: 2,
    badges: ['Primeiro Acesso', 'Frequência Bronze', 'Contratado'],
    telefone: '38995551212'
  }
];

const initialEmpresas: Empresa[] = [
  {
    id: 'empresa-1',
    razao_social: 'Minas Ligas (Companhia Ferroligas Minas Gerais)',
    cnpj: '17.200.354/0001-90',
    bairro: 'Industrial',
    cidade: 'Pirapora',
    lat: -17.3300,
    lng: -44.9150,
    total_funcionarios: 680,
    cota_minima: 34, // 5%
    cotas_preenchidas: 18
  },
  {
    id: 'empresa-2',
    razao_social: 'Liasa (Ligas de Alumínio S.A.)',
    cnpj: '04.598.112/0001-22',
    bairro: 'Industrial',
    cidade: 'Pirapora',
    lat: -17.3310,
    lng: -44.9160,
    total_funcionarios: 420,
    cota_minima: 21,
    cotas_preenchidas: 9
  },
  {
    id: 'empresa-3',
    razao_social: 'Comercial Pirapora Ltda',
    cnpj: '25.312.445/0002-11',
    bairro: 'Centro',
    cidade: 'Pirapora',
    lat: -17.3444,
    lng: -44.9392,
    total_funcionarios: 120,
    cota_minima: 6,
    cotas_preenchidas: 4
  }
];

const initialVagas: Vaga[] = [
  {
    id: 'vaga-1',
    empresa_id: 'empresa-1',
    empresa_nome: 'Minas Ligas',
    titulo: 'Aprendiz Auxiliar Mecânico de Manutenção',
    descricao: 'Executar serviços auxiliares de manutenção corretiva e preventiva de máquinas e equipamentos industriais instalados, desmontando e lavando peças, transportando ferramentas.',
    requisitos: 'Ter entre 16 e 21 anos, cursando Ensino Médio, morar em Pirapora ou Buritizeiro, interesse por mecânica industrial.',
    habilidades: ['Foco', 'Trabalho em Equipe', 'Noções de Ferramentas'],
    quantidade: 4,
    bairro: 'Industrial',
    cidade: 'Pirapora',
    lat: -17.3300,
    lng: -44.9150,
    status: 'aberta'
  },
  {
    id: 'vaga-2',
    empresa_id: 'empresa-3',
    empresa_nome: 'Comercial Pirapora',
    titulo: 'Aprendiz Assistente Administrativo',
    descricao: 'Atuar no controle de arquivos corporativos, organização de documentos, atendimento ao cliente inicial, digitação de planilhas e suporte geral ao setor de faturamento.',
    requisitos: 'Ter entre 14 e 18 anos, cursando ensino regular, conhecimento básico de informática (Office/Digitação).',
    habilidades: ['Informática Básica', 'Comunicação', 'Organização'],
    quantidade: 2,
    bairro: 'Centro',
    cidade: 'Pirapora',
    lat: -17.3444,
    lng: -44.9392,
    status: 'aberta'
  },
  {
    id: 'vaga-3',
    empresa_id: 'empresa-2',
    empresa_nome: 'Liasa S.A.',
    titulo: 'Auxiliar de Eletricista Predial Aprendiz (SENAI)',
    descricao: 'Auxiliar na montagem de infraestrutura para fiação elétrica, fixação de conduítes, passagem de cabos e reparos básicos sob supervisão de engenheiro ou técnico.',
    requisitos: 'Ter de 16 a 21 anos, matriculado no curso SENAI Pirapora de Eletrotécnica.',
    habilidades: ['Atenção aos Detalhes', 'Raciocínio Lógico', 'SENAI'],
    quantidade: 3,
    bairro: 'Planalto',
    cidade: 'Pirapora',
    lat: -17.3380,
    lng: -44.9280,
    status: 'aberta'
  }
];

const initialAlertas: Alerta[] = [
  {
    id: 'alerta-1',
    jovem_id: 'jovem-1',
    jovem_nome: 'João Victor Mendes',
    jovem_bairro: 'Santo Antônio',
    tipo: 'Frequência Alerta',
    gravidade: 'alto',
    status: 'pendente',
    descricao: 'A frequencia do curso/escola caiu para 65% e há mais de 15 dias que o coordenador não registra contato profissional.',
    data_criado: '2026-05-20'
  },
  {
    id: 'alerta-2',
    jovem_id: 'jovem-4',
    jovem_nome: 'Ana Beatriz Santos',
    jovem_bairro: 'São Geraldo',
    tipo: 'Falta Consecutiva',
    gravidade: 'alto',
    status: 'em_atendimento',
    descricao: 'Detectado 8 faltas consecutivas na escola e vulnerabilidade gravíssima de Trabalho Infantil.',
    data_criado: '2026-05-15'
  }
];

const initialMicrotarefas: Microtarefa[] = [
  {
    id: 'task-1',
    titulo: 'Pesquisa sobre transporte público em Pirapora',
    descricao: 'Responda a uma pesquisa rápida sobre quais linhas de ônibus você consome ou se costuma se locomover de bicicleta/a pé pelos bairros Planalto, São Geraldo e Santo Antônio.',
    valor: 10,
    tempo_estimado: '15 min',
    ativa: true
  },
  {
    id: 'task-2',
    titulo: 'Feedback do Curso de Preparação Profissional',
    descricao: 'Avalie sua experiência de aprendizado inicial e proponha ideias de melhoria para os professores ou mentores do Programa Descubra local.',
    valor: 15,
    tempo_estimado: '20 min',
    ativa: true
  },
  {
    id: 'task-3',
    titulo: 'Preenchimento do Perfil Profissional de Habilidades',
    descricao: 'Complete seu cadastro com três habilidades pessoais e duas metas de carreira (ex: mecânico, vendas, costura).',
    valor: 10,
    tempo_estimado: '10 min',
    ativa: true
  }
];

const initialAtendimentos: AcompanhamentoSocial[] = [
  {
    id: 'aten-1',
    jovem_id: 'jovem-4',
    jovem_nome: 'Ana Beatriz Santos',
    assistente_id: 'ast-1',
    assistente_nome: 'Ana Paula Silva',
    data: '2026-05-18',
    tema: 'Visita Domiciliar - Trabalho Infantil',
    relatorio: 'Realizada visita no bairro São Geraldo. Conversado com a mãe e com a adolescente sobre a evasão escolar decorrente de trabalho informal. Foi garantido encaminhamento para auxílio emergencial e inclusão prioritária em oficina do SENAC.',
    encaminhamentos: 'Matricular em curso rápido de Gestão Comercial e garantir ticket transporte solidário.'
  }
];

const initialSolicitacoesPasses: SolicitacaoPasses[] = [
  {
    id: 'sol-1',
    jovem_id: 'jovem-1',
    jovem_nome: 'João Victor Mendes',
    jovem_bairro: 'Santo Antônio',
    quantidade: 4,
    motivo: 'Efetuar deslocamento para entrevista de emprego na Minas Ligas (bairro Industrial). Distância excede 6km.',
    status: 'aprovada',
    qr_code: 'DESCUBRA_PASS_VALID_12345',
    data: '2026-05-28'
  },
  {
    id: 'sol-2',
    jovem_id: 'jovem-2',
    jovem_nome: 'Maria Eduarda Fernandes',
    jovem_bairro: 'Planalto',
    quantidade: 2,
    motivo: 'Ida ao SENAC para renovação de matrícula escolar e entrega de documentos.',
    status: 'pendente',
    qr_code: '',
    data: '2026-05-29'
  }
];

const initialDoacoes: DoacaoPasses[] = [
  {
    id: 'doa-1',
    empresa_id: 'empresa-1',
    empresa_nome: 'Minas Ligas',
    quantidade: 50,
    validade: '2026-07-30',
    status: 'ativo'
  },
  {
    id: 'doa-2',
    empresa_id: 'empresa-3',
    empresa_nome: 'Comercial Pirapora',
    quantidade: 25,
    validade: '2026-08-15',
    status: 'ativo'
  }
];

const initialMicrotarefasRealizadas: MicrotarefaRealizada[] = [];
const initialMatches: Match[] = [
  {
    id: 'match-1',
    jovem_id: 'jovem-1',
    jovem_nome: 'João Victor Mendes',
    jovem_bairro: 'Santo Antônio',
    vaga_id: 'vaga-1',
    vaga_titulo: 'Aprendiz Auxiliar Mecânico de Manutenção',
    empresa_nome: 'Minas Ligas',
    score_match: 78,
    distancia_km: 4.8,
    status: 'sugerido',
    data_interacao: '2026-05-29'
  }
];

// Complete Local JSON Database wrapper
const loadState = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      // Basic structure validation
      if (parsed.jovens && parsed.empresas && parsed.vagas) {
        if (!parsed.cursosProgresso) {
          parsed.cursosProgresso = [];
        }
        return parsed;
      }
    }
  } catch (error) {
    console.error('Falha ao parsear banco de dados local. Iniciando do zero:', error);
  }

  // Generate initial database
  const state = {
    jovens: initialJovens,
    empresas: initialEmpresas,
    vagas: initialVagas,
    alertas: initialAlertas,
    microtarefas: initialMicrotarefas,
    microtarefasRealizadas: initialMicrotarefasRealizadas,
    doacoesPasses: initialDoacoes,
    solicitacoesPasses: initialSolicitacoesPasses,
    atendimentos: initialAtendimentos,
    matches: initialMatches,
    cursosProgresso: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
  return state;
};

// Write current state to json
const saveState = (state: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
};

// Distance calculation in KM
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Ray of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// ---------------------- API ROUTES ----------------------

// Auth simulation
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const state = loadState();

  if (email === 'coordenador@descubra.com' && password === 'demo123') {
    return res.json({
      success: true,
      user: {
        id: 'user-coord',
        nome: 'Carlos Mendes',
        tipo: 'coordenador',
        cidade: 'Pirapora',
        bairro: 'Centro',
        email
      }
    });
  }

  if (email === 'assistente@cras.com' && password === 'demo123') {
    return res.json({
      success: true,
      user: {
        id: 'user-ast-1',
        nome: 'Ana Paula Silva',
        tipo: 'assistente_social',
        cidade: 'Pirapora',
        bairro: 'Santo Antônio',
        email
      }
    });
  }

  // Check Empresa accounts
  if (email === 'minas@minasligas.com' && password === 'demo123') {
    const entry = state.empresas.find((e: Empresa) => e.cnpj.includes('354'));
    return res.json({
      success: true,
      user: {
        id: entry ? entry.id : 'empresa-1',
        nome: 'Carlos Drummond (Minas Ligas)',
        tipo: 'empresa',
        cnpj: '17.200.354/0001-90',
        razao_social: 'Minas Ligas',
        cidade: 'Pirapora',
        bairro: 'Industrial',
        email
      }
    });
  }

  if (email === 'comercial@comercial.com' && password === 'demo123') {
    const entry = state.empresas.find((e: Empresa) => e.cnpj.includes('445'));
    return res.json({
      success: true,
      user: {
        id: entry ? entry.id : 'empresa-3',
        nome: 'Juliana Barros (Comercial Pirapora)',
        tipo: 'empresa',
        cnpj: '25.312.445/0002-11',
        razao_social: 'Comercial Pirapora',
        cidade: 'Pirapora',
        bairro: 'Centro',
        email
      }
    });
  }

  // Check if it's one of our young users logging in by email (simplifying, name as lowercase-email)
  const matchingJovem = state.jovens.find((j: Jovem) => {
    const formattedEmail = j.nome.toLowerCase().replace(/\s+/g, '') + '@descubra.com';
    return formattedEmail === email;
  });

  if (matchingJovem && password === 'demo123') {
    return res.json({
      success: true,
      user: {
        id: matchingJovem.id,
        nome: matchingJovem.nome,
        tipo: 'jovem',
        cidade: 'Pirapora',
        bairro: 'Santo Antônio',
        email
      }
    });
  }

  // Fallback default mock user for first-access youth or registration
  if (email.endsWith('@descubra.com') && password === 'demo123') {
    const genericId = 'jovem-1';
    const entry = state.jovens.find((j: any) => j.id === genericId) || state.jovens[0];
    return res.json({
      success: true,
      user: {
        id: entry.id,
        nome: entry.nome,
        tipo: 'jovem',
        cidade: entry.cidade,
        bairro: entry.bairro,
        email
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Credenciais inválidas. Use coordenador@descubra.com, assistente@cras.com, ou email de jovem.' });
});

// GET Jovens
app.get('/api/jovens', (req, res) => {
  const state = loadState();
  res.json(state.jovens);
});

// GET Single Jovem
app.get('/api/jovens/:id', (req, res) => {
  const state = loadState();
  const jovem = state.jovens.find((j: Jovem) => j.id === req.params.id);
  if (!jovem) return res.status(404).json({ message: 'Jovem não encontrado' });
  res.json(jovem);
});

// UPDATE/POST Jovem Profile
app.post('/api/jovens', (req, res) => {
  const state = loadState();
  const novoJovem = req.body;
  if (!novoJovem.id) {
    novoJovem.id = `jovem-${Date.now()}`;
  }

  // Parse birthday to compute age
  if (novoJovem.data_nasc) {
    const birth = new Date(novoJovem.data_nasc);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    novoJovem.idade = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  // Coordinates by Bairro of Pirapora mapping
  const coordMap: { [key: string]: { lat: number, lng: number } } = {
    'Centro': { lat: -17.3444, lng: -44.9392 },
    'Santo Antônio': { lat: -17.3510, lng: -44.9450 },
    'Planalto': { lat: -17.3380, lng: -44.9280 },
    'São Geraldo': { lat: -17.3580, lng: -44.9350 },
    'Vila Rica': { lat: -17.3480, lng: -44.9520 },
    'Cidade Jardim': { lat: -17.3610, lng: -44.9550 },
    'Sagrada Família': { lat: -17.3660, lng: -44.9480 },
    'Buritizeiro': { lat: -17.3512, lng: -44.9620 },
    'Jequitaí': { lat: -17.2215, lng: -44.4361 }
  };

  const coords = coordMap[novoJovem.bairro] || { lat: -17.3444, lng: -44.9392 };
  novoJovem.lat = coords.lat;
  novoJovem.lng = coords.lng;

  // Add default missing parameters
  novoJovem.frequencia = Number(novoJovem.frequencia ?? 100);
  novoJovem.faltas_consecutivas = Number(novoJovem.faltas_consecutivas ?? 0);
  novoJovem.renda_familiar = Number(novoJovem.renda_familiar ?? 1000);
  novoJovem.score_engajamento = Number(novoJovem.score_engajamento ?? 50);
  novoJovem.score_empregabilidade = Number(novoJovem.score_empregabilidade ?? 50);
  novoJovem.pontos_totais = Number(novoJovem.pontos_totais ?? 50);
  novoJovem.nivel = Number(novoJovem.nivel ?? 1);
  novoJovem.badges = novoJovem.badges || ['Primeiro Acesso'];
  novoJovem.telefone = novoJovem.telefone || `3899${Math.floor(10000000 + Math.random() * 90000000)}`;

  const existingIdx = state.jovens.findIndex((j: Jovem) => j.id === novoJovem.id);
  if (existingIdx !== -1) {
    state.jovens[existingIdx] = { ...state.jovens[existingIdx], ...novoJovem };
  } else {
    state.jovens.push(novoJovem);
  }

  // Re-calculate Risk in Background & Trigger alarm if ALTO RISK
  const riskResult = calcularRisco(novoJovem);
  if (riskResult.classificacao === 'alto') {
    // Check if there is already an active alert
    const hasActiveAlert = state.alertas.some((a: Alerta) => a.jovem_id === novoJovem.id && a.status !== 'resolvido');
    if (!hasActiveAlert) {
      state.alertas.unshift({
        id: `alerta-${Date.now()}`,
        jovem_id: novoJovem.id,
        jovem_nome: novoJovem.nome,
        jovem_bairro: novoJovem.bairro,
        tipo: 'Frequência Alerta',
        gravidade: 'alto',
        status: 'pendente',
        descricao: `Alerta gerado automaticamente para assistente social: Fuga de parâmetros protetivos. Pontuação de risco: ${riskResult.pontuacao}/100. ${riskResult.detalhes.join(', ')}`,
        data_criado: new Date().toISOString().split('T')[0]
      });
    }
  }

  saveState(state);
  res.json({ success: true, jovem: novoJovem });
});

// CSV Import
app.post('/api/jovens/import', (req, res) => {
  const { csvText } = req.body;
  if (!csvText) {
    return res.status(400).json({ success: false, message: 'Texto CSV ausente.' });
  }

  const state = loadState();
  const lines = csvText.split('\n');
  const headers = lines[0].toLowerCase().split(',');

  // Columns: nome, data_nascimento, genero, bairro, cidade, frequencia_curso, renda_familiar, desempenho, faltas_consecutivas, vulnerabilidade_tipo, ultimo_contato
  const importedCount = 0;
  const jovensImported: Jovem[] = [];

  const coordMap: { [key: string]: { lat: number, lng: number } } = {
    'Centro': { lat: -17.3444, lng: -44.9392 },
    'Santo Antônio': { lat: -17.3510, lng: -44.9450 },
    'Planalto': { lat: -17.3380, lng: -44.9280 },
    'São Geraldo': { lat: -17.3580, lng: -44.9350 },
    'Vila Rica': { lat: -17.3480, lng: -44.9520 },
    'Cidade Jardim': { lat: -17.3610, lng: -44.9550 },
    'Sagrada Família': { lat: -17.3660, lng: -44.9480 },
    'Buritizeiro': { lat: -17.3512, lng: -44.9620 },
    'Jequitaí': { lat: -17.2215, lng: -44.4361 }
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Direct split but with quotes safe
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (parts.length < headers.length) continue;

    const row: any = {};
    headers.forEach((h: string, idx: number) => {
      row[h.trim()] = parts[idx]?.replace(/^"|"$/g, '').trim();
    });

    // Formulate young values
    const nome = row.nome || 'Jovem Cadastrado';
    const data_nasc = row.data_nascimento || '2009-01-01';
    const genero = row.genero || 'Feminino';
    const bairro = row.bairro || 'Santo Antônio';
    const cidade = row.cidade || 'Pirapora';
    const frequencia = parseFloat(row.frequencia_curso || '100');
    const renda_familiar = parseFloat(row.renda_familiar || '1200');
    const desempenho = row.desempenho || 'regular';
    const faltas_consecutivas = parseInt(row.faltas_consecutivas || '0');
    const vulnerabilidade_tipo = row.vulnerabilidade_tipo || 'Nenhuma';
    const ultimo_contato = row.ultimo_contato || '2026-05-25';

    // Age compute
    const birth = new Date(data_nasc);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    const idade = Math.abs(ageDate.getUTCFullYear() - 1970);

    const coords = coordMap[bairro] || { lat: -17.3444, lng: -44.9392 };

    const j: Jovem = {
      id: `jovem-csv-${Date.now()}-${i}`,
      nome,
      data_nasc,
      idade,
      genero,
      raca: 'Parda',
      bairro,
      cidade,
      lat: coords.lat,
      lng: coords.lng,
      vulnerabilidade_tipo,
      encaminhado_por: 'Upload CSV',
      escolaridade: 'Ensino Médio Incompleto',
      status: 'cadastrado',
      frequencia,
      faltas_consecutivas,
      ultimo_contato,
      renda_familiar,
      desempenho: desempenho as any,
      score_engajamento: 50,
      score_empregabilidade: 45,
      pontos_totais: 50,
      nivel: 1,
      badges: ['Primeiro Acesso']
    };

    state.jovens.push(j);
    jovensImported.push(j);

    // Calculate risk
    const riskResult = calcularRisco(j);
    if (riskResult.classificacao === 'alto') {
      state.alertas.unshift({
        id: `alerta-${Date.now()}-${i}`,
        jovem_id: j.id,
        jovem_nome: j.nome,
        jovem_bairro: j.bairro,
        tipo: 'Frequência Alerta',
        gravidade: 'alto',
        status: 'pendente',
        descricao: `Importação automática identificou Alto Risco de Evasão. Motivo: ${riskResult.detalhes.join('. ')}`,
        data_criado: new Date().toISOString().split('T')[0]
      });
    }
  }

  saveState(state);
  res.json({ success: true, count: jovensImported.length, imported: jovensImported });
});

// GET Alertas
app.get('/api/social/alertas', (req, res) => {
  const state = loadState();
  res.json(state.alertas);
});

// POST Alerta (Encaminhamento para Assistente Social)
app.post('/api/social/alertas', (req, res) => {
  const state = loadState();
  const novoAlerta = req.body;
  
  novoAlerta.id = `alerta-${Date.now()}`;
  novoAlerta.data_criado = novoAlerta.data_criado || new Date().toISOString().split('T')[0];
  novoAlerta.status = novoAlerta.status || 'pendente';
  
  state.alertas.unshift(novoAlerta);
  saveState(state);
  res.json({ success: true, alerta: novoAlerta });
});

// PUT Alerta Resolve
app.put('/api/social/alertas/:id', (req, res) => {
  const state = loadState();
  const alertId = req.params.id;
  const { status, acao } = req.body;

  const idx = state.alertas.findIndex((a: Alerta) => a.id === alertId);
  if (idx !== -1) {
    state.alertas[idx].status = status;
    if (acao) {
      state.alertas[idx].descricao += ` [Ação Corretiva: ${acao}]`;
    }
    saveState(state);
    return res.json({ success: true, alerta: state.alertas[idx] });
  }
  res.status(404).json({ message: 'Alerta não encontrado' });
});

// GET Atendimentos Sociais
app.get('/api/social/atendimentos', (req, res) => {
  const state = loadState();
  res.json(state.atendimentos);
});

// POST Atendimentos Sociais
app.post('/api/social/atendimentos', (req, res) => {
  const state = loadState();
  const at = req.body;
  if (!at.id) {
    at.id = `aten-${Date.now()}`;
  }

  // Link youth's name
  const youthObj = state.jovens.find((j: Jovem) => j.id === at.jovem_id);
  if (youthObj) {
    at.jovem_nome = youthObj.nome;
  }

  state.atendimentos.unshift(at);

  // If we resolve their social risk, we register an event in their trajectory trajectory
  saveState(state);
  res.json({ success: true, atendimento: at });
});

// GET Microtarefas (Renda Ponte)
app.get('/api/rendaponte/tarefas', (req, res) => {
  const state = loadState();
  res.json({
    tarefas: state.microtarefas,
    realizadas: state.microtarefasRealizadas
  });
});

// POST Complete Microtask (by Jovem in UI)
app.post('/api/rendaponte/concluir', (req, res) => {
  const { jovemId, tarefaId, resposta } = req.body;
  const state = loadState();

  const task = state.microtarefas.find((m: Microtarefa) => m.id === tarefaId);
  const youth = state.jovens.find((j: Jovem) => j.id === jovemId);

  if (!task || !youth) {
    return res.status(404).json({ success: false, message: 'Tarefa ou Jovem não encontrado' });
  }

  const realizada: MicrotarefaRealizada = {
    id: `real-${Date.now()}`,
    jovem_id: jovemId,
    jovem_nome: youth.nome,
    microtarefa_id: tarefaId,
    microtarefa_titulo: task.titulo,
    status: 'pendente',
    resposta,
    valor_recebido: task.valor,
    data: new Date().toISOString().split('T')[0]
  };

  state.microtarefasRealizadas.push(realizada);
  saveState(state);
  res.json({ success: true, realizada });
});

// APPROVE Microtask (by Coordenador in UI)
app.post('/api/rendaponte/aprovar', (req, res) => {
  const { realizadaId, aprovar } = req.body;
  const state = loadState();

  const idx = state.microtarefasRealizadas.findIndex((mr: MicrotarefaRealizada) => mr.id === realizadaId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Submissão não encontrada' });
  }

  const submission = state.microtarefasRealizadas[idx];
  submission.status = aprovar ? 'aprovado' : 'rejeitado';

  if (aprovar) {
    // Reward points and coins to youth
    const youthIdx = state.jovens.findIndex((j: Jovem) => j.id === submission.jovem_id);
    if (youthIdx !== -1) {
      state.jovens[youthIdx].pontos_totais += 50; // Level point bonus
      state.jovens[youthIdx].score_engajamento = Math.min(100, state.jovens[youthIdx].score_engajamento + 15);
      // level system
      state.jovens[youthIdx].nivel = Math.floor(state.jovens[youthIdx].pontos_totais / 200) + 1;
    }
  }

  saveState(state);
  res.json({ success: true, realizada: submission });
});

// GET Passes Solidários
app.get('/api/passes', (req, res) => {
  const state = loadState();
  res.json({
    doacoes: state.doacoesPasses,
    solicitacoes: state.solicitacoesPasses
  });
});

// POST Donate Tickets (by Empresa)
app.post('/api/passes/doacoes', (req, res) => {
  const { empresaId, quantidade, validade } = req.body;
  const state = loadState();

  const emp = state.empresas.find((e: Empresa) => e.id === empresaId);
  const doacao: DoacaoPasses = {
    id: `doa-${Date.now()}`,
    empresa_id: empresaId,
    empresa_nome: emp ? emp.razao_social : 'Empresa Solidária',
    quantidade: parseInt(quantidade),
    validade: validade || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'ativo'
  };

  state.doacoesPasses.unshift(doacao);
  saveState(state);
  res.json({ success: true, doacao });
});

// POST Request Tickets (by Youth)
app.post('/api/passes/solicitacoes', (req, res) => {
  const { jovemId, quantidade, motivo } = req.body;
  const state = loadState();

  const youth = state.jovens.find((j: Jovem) => j.id === jovemId);
  if (!youth) return res.status(404).json({ message: 'Jovem não encontrado' });

  const solicitacao: SolicitacaoPasses = {
    id: `sol-${Date.now()}`,
    jovem_id: jovemId,
    jovem_nome: youth.nome,
    jovem_bairro: youth.bairro,
    quantidade: parseInt(quantidade),
    motivo,
    status: 'pendente',
    qr_code: '',
    data: new Date().toISOString().split('T')[0]
  };

  state.solicitacoesPasses.unshift(solicitacao);
  saveState(state);
  res.json({ success: true, solicitacao });
});

// PUT Approve Ticket Request
app.put('/api/passes/solicitacoes/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'aprovada' | 'rejeitada'
  const state = loadState();

  const idx = state.solicitacoesPasses.findIndex((s: SolicitacaoPasses) => s.id === id);
  if (idx !== -1) {
    state.solicitacoesPasses[idx].status = status;
    if (status === 'aprovada') {
      state.solicitacoesPasses[idx].qr_code = `DESCUBRA_PASS_VALID_${Math.floor(Math.random() * 900000 + 100000)}`;

      // Award badge "Missão Transporte" if youth requested/got pass
      const yId = state.solicitacoesPasses[idx].jovem_id;
      const yIdx = state.jovens.findIndex((j: Jovem) => j.id === yId);
      if (yIdx !== -1) {
        if (!state.jovens[yIdx].badges.includes('Missão Transporte')) {
          state.jovens[yIdx].badges.push('Missão Transporte');
          state.jovens[yIdx].pontos_totais += 20;
        }
      }
    }
    saveState(state);
    return res.json({ success: true, solicitacao: state.solicitacoesPasses[idx] });
  }
  res.status(404).json({ message: 'Solicitação não encontrada' });
});

// GET Vagas
app.get('/api/vagas', (req, res) => {
  const state = loadState();
  res.json(state.vagas);
});

// POST Create Vaga
app.post('/api/vagas', (req, res) => {
  const state = loadState();
  const novaVaga = req.body;
  if (!novaVaga.id) {
    novaVaga.id = `vaga-${Date.now()}`;
  }

  // Map coordinates
  const coordMap: { [key: string]: { lat: number, lng: number } } = {
    'Centro': { lat: -17.3444, lng: -44.9392 },
    'Santo Antônio': { lat: -17.3510, lng: -44.9450 },
    'Planalto': { lat: -17.3380, lng: -44.9280 },
    'São Geraldo': { lat: -17.3580, lng: -44.9350 },
    'Vila Rica': { lat: -17.3480, lng: -44.9520 },
    'Cidade Jardim': { lat: -17.3610, lng: -44.9550 },
    'Sagrada Família': { lat: -17.3660, lng: -44.9480 },
    'Industrial': { lat: -17.3300, lng: -44.9150 },
    'Buritizeiro': { lat: -17.3512, lng: -44.9620 }
  };
  const coords = coordMap[novaVaga.bairro] || { lat: -17.3444, lng: -44.9392 };
  novaVaga.lat = coords.lat;
  novaVaga.lng = coords.lng;

  const emp = state.empresas.find((e: Empresa) => e.id === novaVaga.empresa_id);
  novaVaga.empresa_nome = emp ? emp.razao_social : 'Empresa Parceira';
  novaVaga.status = novaVaga.status || 'aberta';

  state.vagas.unshift(novaVaga);
  saveState(state);
  res.json({ success: true, vaga: novaVaga });
});

// GET Matchmaking Suggestions
app.get('/api/matchmaking', (req, res) => {
  const state = loadState();
  const { youngId, vagaId } = req.query;

  // Matchmaking logic
  // Returns match scores between youth and vacancies!
  // Distancia, Habilidades (requisitos da vaga vs perfil) e Score de empregabilidade

  const calculateScoreMatch = (j: Jovem, v: Vaga) => {
    // 1. Proximidade geográfica (max 40 pontos)
    const dist = calcularDistancia(j.lat, j.lng, v.lat, v.lng);
    let distScore = 0;
    if (dist <= 1.5) distScore = 40;
    else if (dist <= 3) distScore = 30;
    else if (dist <= 6) distScore = 20;
    else distScore = 10;

    // 2. Habilidade Matching (max 30 pontos)
    // Se jovem tem habilidades que encaixam, ou baseamos no score do jovem
    let skillsMatched = 0;
    v.habilidades.forEach((sk: string) => {
      // Mocking check: se o jovem tem maior nível ele ganha mais, ou based on skills list
      // Let's generate arbitrary match score centered around employee status
      if (j.score_empregabilidade > 60) skillsMatched += 10;
      if (j.escolaridade.includes('Médio')) skillsMatched += 10;
      if (j.score_engajamento > 70) skillsMatched += 10;
    });
    const skillsScore = Math.min(30, Math.max(10, skillsMatched));

    // 3. Empregabilidade global (max 30 pontos)
    const empScore = Math.floor(j.score_empregabilidade * 0.3);

    return {
      score: distScore + skillsScore + empScore,
      dist
    };
  };

  // If filtered by single young person
  if (youngId) {
    const j = state.jovens.find((j: Jovem) => j.id === youngId);
    if (!j) return res.status(404).json({ message: 'Jovem não encontrado' });

    // Suggest vacancies for this young person
    const recs = state.vagas.filter((v: Vaga) => v.status === 'aberta').map((v: Vaga) => {
      const calc = calculateScoreMatch(j, v);
      return {
        id: `match-calc-${Date.now()}-${v.id}`,
        jovem_id: j.id,
        jovem_nome: j.nome,
        jovem_bairro: j.bairro,
        vaga_id: v.id,
        vaga_titulo: v.titulo,
        empresa_nome: v.empresa_nome,
        score_match: calc.score,
        distancia_km: calc.dist,
        status: 'sugerido',
        data_interacao: new Date().toISOString().split('T')[0]
      };
    }).sort((a: any, b: any) => b.score_match - a.score_match);

    return res.json(recs);
  }

  // If filtered by single vacancy
  if (vagaId) {
    const v = state.vagas.find((v: Vaga) => v.id === vagaId);
    if (!v) return res.status(404).json({ message: 'Vaga não encontrada' });

    // Find young matches looking for job (not contracted already)
    const recs = state.jovens.filter((j: Jovem) => j.status !== 'aprendiz_contratado').map((j: Jovem) => {
      const calc = calculateScoreMatch(j, v);
      return {
        id: `match-calc-${Date.now()}-${j.id}`,
        jovem_id: j.id,
        jovem_nome: j.nome,
        jovem_bairro: j.bairro,
        vaga_id: v.id,
        vaga_titulo: v.titulo,
        empresa_nome: v.empresa_nome,
        score_match: calc.score,
        distancia_km: calc.dist,
        status: 'sugerido',
        data_interacao: new Date().toISOString().split('T')[0]
      };
    }).sort((a: any, b: any) => b.score_match - a.score_match);

    return res.json(recs);
  }

  res.json(state.matches);
});

// POST Candidatar / Contratar jovem
app.post('/api/matchmaking/interagir', (req, res) => {
  const { jovemId, vagaId, status } = req.body; // status: 'candidatado' | 'entrevista' | 'contratado' | 'recusado'
  const state = loadState();

  const jIdx = state.jovens.findIndex((j: Jovem) => j.id === jovemId);
  const v = state.vagas.find((v: Vaga) => v.id === vagaId);

  if (jIdx === -1 || !v) {
    return res.status(404).json({ success: false, message: 'Jovem ou Vaga não encontrado' });
  }

  // Update young status
  if (status === 'contratado') {
    state.jovens[jIdx].status = 'aprendiz_contratado';
    if (!state.jovens[jIdx].badges.includes('Contratado')) {
      state.jovens[jIdx].badges.push('Contratado');
      state.jovens[jIdx].pontos_totais += 100;
    }
    // Update company filled slots
    const empIdx = state.empresas.findIndex((e: Empresa) => e.id === v.empresa_id);
    if (empIdx !== -1) {
      state.empresas[empIdx].cotas_preenchidas += 1;
    }
  } else if (status === 'candidatado') {
    // Elevate young engajamento
    state.jovens[jIdx].score_engajamento = Math.min(100, state.jovens[jIdx].score_engajamento + 10);
    if (!state.jovens[jIdx].badges.includes('Frequência Bronze') && state.jovens[jIdx].score_engajamento > 60) {
      state.jovens[jIdx].badges.push('Primeira Candidatura');
    }
  }

  // Save into matches list or update existing
  const mIdx = state.matches.findIndex((m: Match) => m.jovem_id === jovemId && m.vaga_id === vagaId);
  if (mIdx !== -1) {
    state.matches[mIdx].status = status;
  } else {
    // compute distance
    const dist = calcularDistancia(state.jovens[jIdx].lat, state.jovens[jIdx].lng, v.lat, v.lng);
    state.matches.push({
      id: `match-real-${Date.now()}`,
      jovem_id: jovemId,
      jovem_nome: state.jovens[jIdx].nome,
      jovem_bairro: state.jovens[jIdx].bairro,
      vaga_id: vagaId,
      vaga_titulo: v.titulo,
      empresa_nome: v.empresa_nome,
      score_match: 85, // estimated
      distancia_km: dist,
      status: status,
      data_interacao: new Date().toISOString().split('T')[0]
    });
  }

  saveState(state);
  res.json({ success: true, jovem: state.jovens[jIdx] });
});

// GET ranking por bairro
app.get('/api/ranking', (req, res) => {
  const { bairro } = req.query;
  const state = loadState();

  let filtered = [...state.jovens];
  if (bairro) {
    filtered = filtered.filter((j: Jovem) => j.bairro === bairro);
  }

  const sorted = filtered.sort((a, b) => b.pontos_totais - a.pontos_totais);
  res.json(sorted);
});

// SIMULATE WhatsApp bot message
app.post('/api/whatsapp/simulador', (req, res) => {
  const { jovemId, mensagem } = req.body;
  if (!jovemId || !mensagem) {
    return res.status(400).json({ message: 'Parâmetro inválido' });
  }

  const state = loadState();
  const youth = state.jovens.find((j: Jovem) => j.id === jovemId);
  if (!youth) return res.status(404).json({ message: 'Jovem não encontrado' });

  // Simple IA triggers checking keyword
  const textNormalized = mensagem.toUpperCase();
  let keywordMatched = '';
  let autoResponse = 'Olá! O canal oficial da Trajetória Descubra+ agradece seu contato. Registramos sua mensagem e a equipe social do CRAS/CREAS de Pirapora foi nofiticada.';

  if (textNormalized.includes('TRANSPORTE') || textNormalized.includes('PASS') || textNormalized.includes('ÔNIBUS')) {
    keywordMatched = 'Problema de Transporte';
    autoResponse = 'Entendemos a falta de transporte para as aulas/empresa. Solicitamos que acesse a área "Banco de Passes" no seu portal do Jovem para requisitar passagens gratuitas!';
  } else if (textNormalized.includes('FOME') || textNormalized.includes('COMIDA') || textNormalized.includes('ALIMENTO') || textNormalized.includes('CESTA')) {
    keywordMatched = 'Insegurança Alimentar';
    autoResponse = 'Assunto urgente! O Programa Descubra mais possui parcerias para cestas de alimentos emergenciais. A equipe social do CRAS entrará em contato de forma oculta o quanto antes.';
  } else if (textNormalized.includes('SAÚDE') || textNormalized.includes('DOENÇA') || textNormalized.includes('MEDICO') || textNormalized.includes('PSI')) {
    keywordMatched = 'Problema de Saúde';
    autoResponse = 'Sentimos por isso. Nós notificamos imediatamente os deuses do CRAS para priorizar um encaminhamento rápido ao Posto de Saúde / UBS de Pirapora.';
  } else if (textNormalized.includes('FALTA') || textNormalized.includes('EVADIR') || textNormalized.includes('SAIR') || textNormalized.includes('DESISTIR')) {
    keywordMatched = 'Alta Probabilidade de Evasão';
    autoResponse = 'Por favor, não desista de sua jornada profissional! O Programa Descubra e Pirapora estão aqui para te apoiar. Um assistente social irá bater um papo amigável contigo amanhã.';
  }

  // Trigger high severity alert to system if emergency keywords trigger
  if (keywordMatched) {
    state.alertas.unshift({
      id: `alerta-bot-${Date.now()}`,
      jovem_id: youth.id,
      jovem_nome: youth.nome,
      jovem_bairro: youth.bairro,
      tipo: 'Mensagem WhatsApp',
      gravidade: 'alto',
      status: 'pendente',
      descricao: `Alerta emergencial via WhatsApp. Gatilho IA: "${keywordMatched}". Mensagem enviada pelo jovem: "${mensagem}"`,
      data_criado: new Date().toISOString().split('T')[0]
    });
  }

  saveState(state);
  res.json({ success: true, response: autoResponse, alertGenerated: !!keywordMatched });
});

// GET course progress
app.get('/api/cursos/progresso', (req, res) => {
  const state = loadState();
  res.json(state.cursosProgresso || []);
});

// POST update or register course progress
app.post('/api/cursos/progresso', (req, res) => {
  const { jovemId, jovemNome, cursoId, cursoTitulo, categoria, status, progressoPercentual } = req.body;
  if (!jovemId || !cursoId) {
    return res.status(400).json({ success: false, message: 'Parâmetros inválidos' });
  }

  const state = loadState();
  if (!state.cursosProgresso) {
    state.cursosProgresso = [];
  }

  const idx = state.cursosProgresso.findIndex((p: any) => p.jovem_id === jovemId && p.curso_id === cursoId);
  const data_atualizacao = new Date().toISOString().split('T')[0];

  if (idx !== -1) {
    state.cursosProgresso[idx].status = status;
    state.cursosProgresso[idx].progresso_percentual = progressoPercentual;
    state.cursosProgresso[idx].data_atualizacao = data_atualizacao;
  } else {
    state.cursosProgresso.unshift({
      id: `prog-${Date.now()}`,
      jovem_id: jovemId,
      jovem_nome: jovemNome,
      curso_id: cursoId,
      curso_titulo: cursoTitulo,
      categoria: categoria,
      status: status,
      progresso_percentual: progressoPercentual,
      data_atualizacao
    });
  }

  // Award XP inside State.jovens
  const youthIdx = state.jovens.findIndex((j: any) => j.id === jovemId);
  if (youthIdx !== -1) {
    if (status === 'Concluido') {
      state.jovens[youthIdx].pontos_totais += 40;
      state.jovens[youthIdx].score_engajamento = Math.min(100, state.jovens[youthIdx].score_engajamento + 10);
      state.jovens[youthIdx].score_empregabilidade = Math.min(100, state.jovens[youthIdx].score_empregabilidade + 15);
      state.jovens[youthIdx].nivel = Math.floor(state.jovens[youthIdx].pontos_totais / 200) + 1;
      if (!state.jovens[youthIdx].badges.includes('Foco Futuro')) {
        state.jovens[youthIdx].badges.push('Foco Futuro');
      }
    } else if (status === 'Iniciado') {
      state.jovens[youthIdx].pontos_totais += 10;
      state.jovens[youthIdx].nivel = Math.floor(state.jovens[youthIdx].pontos_totais / 200) + 1;
    }
  }

  saveState(state);
  res.json({ success: true, progress: state.cursosProgresso });
});

// GET Dashboard statistics
app.get('/api/dashboard/estatisticas', (req, res) => {
  const state = loadState();

  const total = state.jovens.length;
  const contratados = state.jovens.filter((j: Jovem) => j.status === 'aprendiz_contratado').length;
  const elegiveisSemVaga = state.jovens.filter((j: Jovem) => j.status === 'pré-aprendizagem' || j.status === 'encaminhado').length;

  // Risco count
  let altoRisco = 0;
  let medioRisco = 0;
  let baixoRisco = 0;

  state.jovens.forEach((j: Jovem) => {
    const risk = calcularRisco(j).classificacao;
    if (risk === 'alto') altoRisco++;
    else if (risk === 'medio') medioRisco++;
    else baixoRisco++;
  });

  const evadidos = state.jovens.filter((j: Jovem) => j.status === 'evadido').length;

  // Women connected ratio (percentual de meninas/trans contratadas)
  const totalFeminino = state.jovens.filter((j: Jovem) => j.genero === 'Feminino').length;
  const femininoContratado = state.jovens.filter((j: Jovem) => j.genero === 'Feminino' && j.status === 'aprendiz_contratado').length;

  const pctMulheresVinculadas = totalFeminino > 0 ? parseFloat(((femininoContratado / totalFeminino) * 100).toFixed(1)) : 0;

  // Heatmap table by neighborhood
  const bairrosList = ['Centro', 'Santo Antônio', 'Planalto', 'São Geraldo', 'Vila Rica', 'Cidade Jardim', 'Sagrada Família', 'Buritizeiro', 'Jequitaí'];
  const bairroStats = bairrosList.map((b: string) => {
    const jovensNoBairro = state.jovens.filter((j: Jovem) => j.bairro === b);
    const count = jovensNoBairro.length;
    const conts = jovensNoBairro.filter((j: Jovem) => j.status === 'aprendiz_contratado').length;
    const pre_ap = jovensNoBairro.filter((j: Jovem) => j.status === 'pré-aprendizagem').length;

    const contratacaoRate = count > 0 ? parseFloat(((conts / count) * 100).toFixed(0)) : 0;
    const avgEmpregabilidade = count > 0 ? Math.round(jovensNoBairro.reduce((acc, current) => acc + current.score_empregabilidade, 0) / count) : 0;

    return {
      bairro: b,
      jovens: count,
      contratados: conts,
      pre_aprendiz: pre_ap,
      taxa_contratacao: contratacaoRate,
      avg_score_empregabilidade: avgEmpregabilidade
    };
  });

  res.json({
    total,
    contratados,
    elegiveisSemVaga,
    evadidos,
    altoRisco,
    medioRisco,
    baixoRisco,
    mulheresVinculadas: pctMulheresVinculadas,
    bairroStats
  });
});

// POST Reset Database to initial seed
app.post('/api/reset', (req, res) => {
  const state = {
    jovens: initialJovens,
    empresas: initialEmpresas,
    vagas: initialVagas,
    alertas: initialAlertas,
    microtarefas: initialMicrotarefas,
    microtarefasRealizadas: [],
    doacoesPasses: initialDoacoes,
    solicitacoesPasses: initialSolicitacoesPasses,
    atendimentos: initialAtendimentos,
    matches: initialMatches,
    cursosProgresso: []
  };
  saveState(state);
  res.json({ success: true, message: 'Banco de dados restaurado!' });
});

// Vite & express assets binding
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server "TRAJETÓRIA DESCUBRA+" running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
