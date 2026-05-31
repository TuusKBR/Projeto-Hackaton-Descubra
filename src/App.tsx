/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  ShieldAlert, 
  FileSpreadsheet, 
  User, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Award, 
  Coins, 
  Compass, 
  QrCode, 
  Bus, 
  MessageSquare, 
  HelpCircle,
  BookOpen,
  GraduationCap,
  Send, 
  Heart, 
  Plus, 
  Check, 
  X, 
  Search, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Map, 
  CheckCircle2, 
  Building, 
  School,
  Clock
} from 'lucide-react';
import { apiService } from './services/api';
import { Jovem, Empresa, Vaga, Match, Alerta, AcompanhamentoSocial, Microtarefa, MicrotarefaRealizada, DoacaoPasses, SolicitacaoPasses, ProgressoCurso } from './types';
import { calcularRisco } from './utils/calculadoraRisco';

const MEI_COURSES = [
  {
    id: 'mei-emp',
    titulo: 'Empreendedorismo na Prática',
    descricao: 'Aprenda como abrir seu próprio negócio (MEI), identificar oportunidades no mercado municipal e estruturar sua ideia de negócio.',
    link: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline/empreendedorismo-como-comecar',
    cargaHoraria: '12 horas',
    conteudo: ['O que é MEI', 'Como gerar renda sustentável', 'Modelagem de Negócios (Canvas)', 'Pesquisa de mercado básico']
  },
  {
    id: 'mei-fin',
    titulo: 'Gestão Financeira & Fluxo de Caixa',
    descricao: 'Não misture dinheiro da empresa com dinheiro pessoal. Domine precificação, capital de giro e planejamento financeiro para autônomos.',
    link: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline/gestao-financeira-para-mei',
    cargaHoraria: '10 horas',
    conteudo: ['Custos fixos e variáveis', 'Margem de lucro recomendada', 'Controle diário de caixa', 'Planejamento de reservas']
  },
  {
    id: 'mei-orat',
    titulo: 'Oratória & Negociação com Clientes',
    descricao: 'Descubra como vender sua ideia, perder a timidez ao falar em público e fechar parcerias comerciais com confiança extrema.',
    link: 'https://www.youtube.com/results?search_query=curso+de+oratoria+gratuito',
    cargaHoraria: '8 horas',
    conteudo: ['Técnicas de respiração', 'Storytelling persuasivo', 'Tratando objeções de vendas', 'Postura em entrevistas e reuniões']
  },
  {
    id: 'mei-mktdig',
    titulo: 'Marketing Digital para Prestadores',
    descricao: 'Use as redes sociais de forma profissional para atrair clientes locais em Pirapora. Crie conteúdo que vende e posicione sua marca.',
    link: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline/marketing-digital-para-o-empreendedor',
    cargaHoraria: '15 horas',
    conteudo: ['Instas corporativos de sucesso', 'Vídeos de divulgação que convertem', 'WhatsApp Business automatizado', 'Anúncios geo-localizados básicos']
  }
];

const DESCUBRA_JOVEM_COURSES = [
  {
    id: 'dj-math',
    titulo: 'Raciocínio Lógico & Matemática Comercial',
    descricao: 'Desenvolva sua mente racional para resolver problemas reais de operações do varejo, porcentagem, juros simples e cálculos corporativos.',
    link: 'https://pt.khanacademy.org/math',
    cargaHoraria: '20 horas',
    conteudo: ['Operações comerciais', 'Porcentagens e descontos', 'Interpretação analítica de gráficos', 'Estatística básica de rotina']
  },
  {
    id: 'dj-soft',
    titulo: 'Soft Skills: Inteligência Emocional',
    descricao: 'Aprenda a lidar com críticas, frustrações da vida pessoal, empatia técnica, resoluções de conflitos no ambiente de trabalho e paciência.',
    link: 'https://escola.enap.gov.br/',
    cargaHoraria: '10 horas',
    conteudo: ['Controle de ansiedade e fobias', 'Comunicação não-violenta (CNV)', 'Gestão do tempo e agendas', 'Trabalho em equipes diversas']
  },
  {
    id: 'dj-cid',
    titulo: 'Cidadania e Direitos Sociais do Aprendiz',
    descricao: 'Conheça seu lugar no mundo e como cidadão ativo. Direitos fundamentais, legislação trabalhista protetiva do aprendiz, e ética na sociedade.',
    link: 'https://cidadania.almg.gov.br/',
    cargaHoraria: '8 horas',
    conteudo: ['O Estatuto da Criança e do Adolescente (ECA)', 'Como funciona o Programa de Aprendizagem', 'Cidadania participativa municipal', 'Ética na internet e Fake News']
  },
  {
    id: 'dj-vida',
    titulo: 'Orientação Vocacional & Projeto de Vida',
    descricao: 'Reflita sobre o seu futuro pessoal e profissional de forma planejada, para não desanimar diante das barreiras sociais locais.',
    link: 'https://www.youtube.com/results?search_query=projeto+de+vida+adolescentes',
    cargaHoraria: '6 horas',
    conteudo: ['Auto-conhecimento pessoal', 'Definição de metas de curto e médio prazo', 'Identificando mentores locais', 'Montagem do primeiro currículo minimalista']
  }
];

export default function App() {
  // Roles: 'coordenador' | 'jovem' | 'empresa' | 'assistente_social'
  const [currentUser, setCurrentUser] = useState({
    id: 'user-coord',
    nome: 'Carlos Mendes',
    tipo: 'coordenador',
    bairro: 'Centro',
    cidade: 'Pirapora',
    email: 'coordenador@descubra.com'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Helper to log in from portal buttons
  const handleLoginAs = (role: string) => {
    handleRoleSwitch(role);
    setIsLoggedIn(true);
  };

  // State arrays from DB API
  const [jovens, setJovens] = useState<Jovem[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [atendimentos, setAtendimentos] = useState<AcompanhamentoSocial[]>([]);
  const [solicitacoesPasses, setSolicitacoesPasses] = useState<SolicitacaoPasses[]>([]);
  const [doacoesPasses, setDoacoesPasses] = useState<DoacaoPasses[]>([]);
  const [microtarefas, setMicrotarefas] = useState<Microtarefa[]>([]);
  const [microtarefasRealizadas, setMicrotarefasRealizadas] = useState<MicrotarefaRealizada[]>([]);
  const [dbStats, setDbStats] = useState<any>(null);
  const [ranking, setRanking] = useState<Jovem[]>([]);
  const [cursosProgresso, setCursosProgresso] = useState<ProgressoCurso[]>([]);

  // Simulation settings
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('coord_geral');
  const [selectedJovemId, setSelectedJovemId] = useState<string>('jovem-1');

  // Interactive Form States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBairro, setFilterBairro] = useState('Todos');
  const [filterRisco, setFilterRisco] = useState('Todos');

  // Course progress search and filters for coordinator dashboard
  const [cursosSearch, setCursosSearch] = useState('');
  const [cursosFilterCategoria, setCursosFilterCategoria] = useState('Todos');
  const [cursosFilterStatus, setCursosFilterStatus] = useState('Todos');

  // WhatsApp Simulator
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [whatsappLogs, setWhatsappLogs] = useState<{ sender: 'jovem' | 'bot'; text: string; time: string }[]>([
    { sender: 'bot', text: 'Olá! Envie uma palavra-chave como TRANSPORTE, FOME, SAÚDE ou FALTA se precisar de auxílio emergencial.', time: '14:20' }
  ]);

  // Request system state
  const [tipoAjuda, setTipoAjuda] = useState('transporte');
  const [descricaoAjuda, setDescricaoAjuda] = useState('');

  // New young register state
  const [newJovem, setNewJovem] = useState({
    nome: '',
    data_nasc: '2010-01-01',
    genero: 'Feminino',
    raca: 'Parda',
    bairro: 'Santo Antônio',
    cidade: 'Pirapora',
    vulnerabilidade_tipo: 'Nenhuma',
    encaminhado_por: 'CRAS Pirapora',
    escolaridade: 'Ensino Médio Incompleto',
    frequencia: 100,
    faltas_consecutivas: 0,
    ultimo_contato: new Date().toISOString().split('T')[0],
    renda_familiar: 1200,
    desempenho: 'regular' as 'bom' | 'regular' | 'ruim',
    telefone: ''
  });

  // Action register states
  const [newAtendimento, setNewAtendimento] = useState({
    jovem_id: '',
    tema: 'Acompanhamento de Rotina',
    relatorio: '',
    encaminhamentos: ''
  });

  // Encaminhamento Social State
  const [encaminharJovemId, setEncaminharJovemId] = useState('');
  const [encaminharMotivo, setEncaminharMotivo] = useState('');
  const [encaminharTipo, setEncaminharTipo] = useState('Evasão Escolar');
  const [encaminharGravidade, setEncaminharGravidade] = useState<'baixo' | 'medio' | 'alto'>('medio');
  const [isEncaminharModalOpen, setIsEncaminharModalOpen] = useState(false);

  // Selected Youth detailed summary pop up modal state
  const [infoJovemModal, setInfoJovemModal] = useState<Jovem | null>(null);
  const [expandedMatchJovemId, setExpandedMatchJovemId] = useState<string | null>(null);

  // New Job posting state
  const [newVaga, setNewVaga] = useState({
    empresa_id: 'empresa-1',
    titulo: '',
    descricao: '',
    requisitos: '',
    habilidades: 'Comunicação, Proatividade, Pontualidade',
    quantidade: 1,
    bairro: 'Industrial',
    cidade: 'Pirapora'
  });

  // Microtarefa submit payload
  const [microtarefaAnswers, setMicrotarefaAnswers] = useState<{ [key: string]: string }>({});

  // Passes Request Motivation
  const [passesRequest, setPassesRequest] = useState({
    quantidade: 4,
    motivo: ''
  });

  // Ticket donation
  const [passesDonation, setPassesDonation] = useState({
    quantidade: 10,
    empresa_id: 'empresa-1'
  });

  // CSV text input
  const [csvText, setCsvText] = useState(
    `nome,data_nascimento,genero,bairro,cidade,frequencia_curso,renda_familiar,desempenho,faltas_consecutivas,vulnerabilidade_tipo,ultimo_contato\n` +
    `Gabriel Souza Bispo,2009-04-18,Masculino,São Geraldo,Pirapora,55,750,ruim,6,Evasão Recente,2026-05-12\n` +
    `Lorena Martins Vieira,2010-07-01,Feminino,Cidade Jardim,Pirapora,84,1100,regular,2,Pobreza Extrema,2026-05-28\n` +
    `Carlos Eduardo Melo,2008-11-22,Masculino,Santo Antônio,Pirapora,92,1500,bom,0,Nenhuma,2026-05-29\n` +
    `Thays Cristine Santos,2011-02-14,Feminino,Vila Rica,Pirapora,35,500,ruim,12,Trabalho Infantil,2026-05-01`
  );

  // Success notifications
  const [toast, setToast] = useState<string | null>(null);

  // Load all system data from API Node server
  const loadAllData = async () => {
    setLoading(true);
    try {
      const jData = await apiService.getJovens();
      setJovens(jData);

      const aData = await apiService.getAlertas();
      setAlertas(aData);

      const vData = await apiService.getVagas();
      setVagas(vData);

      const sData = await apiService.getEstatisticasDashboard();
      setDbStats(sData);

      const rankData = await apiService.getRanking();
      setRanking(rankData);

      const passesData = await apiService.getPasses();
      setDoacoesPasses(passesData.doacoes);
      setSolicitacoesPasses(passesData.solicitacoes);

      const rpData = await apiService.getTarefasRendaPonte();
      setMicrotarefas(rpData.tarefas);
      setMicrotarefasRealizadas(rpData.realizadas || []);

      const atenData = await apiService.getAtendimentos();
      setAtendimentos(atenData);

      try {
        const progressData = await apiService.getCursosProgresso();
        setCursosProgresso(progressData || []);
      } catch (err_progress) {
        console.warn('Cursos progress endpoint not ready yet or loading:', err_progress);
      }

      // Default the new service jovem ID to first jovem
      if (jData.length > 0 && !newAtendimento.jovem_id) {
        setNewAtendimento(prev => ({ ...prev, jovem_id: jData[0].id }));
      }
    } catch (e) {
      console.error(e);
      showToast('Erro ao atualizar dados. O servidor local está sincronizando.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Switch Role simulation
  const handleRoleSwitch = (role: string) => {
    if (role === 'coordenador') {
      setCurrentUser({
        id: 'user-coord',
        nome: 'Carlos Mendes',
        tipo: 'coordenador',
        bairro: 'Centro',
        cidade: 'Pirapora',
        email: 'coordenador@descubra.com'
      });
      setActiveTab('coord_geral');
    } else if (role === 'jovem') {
      const activeYouth = jovens.find(j => j.id === selectedJovemId) || jovens[0];
      setCurrentUser({
        id: activeYouth?.id || 'jovem-1',
        nome: activeYouth?.nome || 'João Victor Mendes',
        tipo: 'jovem',
        bairro: activeYouth?.bairro || 'Santo Antônio',
        cidade: activeYouth?.cidade || 'Pirapora',
        email: (activeYouth?.nome ? activeYouth.nome.toLowerCase().replace(/\s+/g, '') : 'joaovictor') + '@descubra.com'
      });
      setActiveTab('jovem_perfil');
    } else if (role === 'empresa') {
      setCurrentUser({
        id: 'empresa-1',
        nome: 'Carlos Drummond',
        tipo: 'empresa',
        bairro: 'Industrial',
        cidade: 'Pirapora',
        email: 'minas@minasligas.com'
      });
      setActiveTab('empresa_vagas');
    } else if (role === 'assistente_social') {
      setCurrentUser({
        id: 'user-ast-1',
        nome: 'Ana Paula Silva',
        tipo: 'assistente_social',
        bairro: 'Santo Antônio',
        cidade: 'Pirapora',
        email: 'assistente@cras.com'
      });
      setActiveTab('social_fila');
    }
    showToast(`Ambiente simulado alterado para perfil: ${role.toUpperCase()}`);
  };

  // Run Reset DB
  const handleResetDb = async () => {
    if (confirm('Deseja restaurar todos os dados simulados originais de Pirapora?')) {
      try {
        await apiService.restaurarDados();
        showToast('Banco de dados de simulação recriado com sucesso!');
        await loadAllData();
      } catch (e) {
        showToast('Erro ao reiniciar.');
      }
    }
  };

  // Post Jovem registration
  const handleCadastrarJovem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.salvarJovem(newJovem);
      showToast(`Jovem "${newJovem.nome}" cadastrado e classificado em tempo real!`);
      // clear form
      setNewJovem({
        nome: '',
        data_nasc: '2010-01-01',
        genero: 'Feminino',
        raca: 'Parda',
        bairro: 'Santo Antônio',
        cidade: 'Pirapora',
        vulnerabilidade_tipo: 'Nenhuma',
        encaminhado_por: 'CRAS Pirapora',
        escolaridade: 'Ensino Médio Incompleto',
        frequencia: 100,
        faltas_consecutivas: 0,
        ultimo_contato: new Date().toISOString().split('T')[0],
        renda_familiar: 1200,
        desempenho: 'regular',
        telefone: ''
      });
      await loadAllData();
      setActiveTab('coord_mesa');
    } catch (err) {
      showToast('Erro ao cadastrar jovem.');
    }
  };

  // Submit Social Care Referral
  const handleEncaminharSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encaminharJovemId) {
      showToast('Por favor, selecione um jovem para encaminhar.');
      return;
    }
    const targetJovem = jovens.find(j => j.id === encaminharJovemId);
    if (!targetJovem) {
      showToast('Jovem selecionado não foi encontrado.');
      return;
    }

    try {
      await apiService.criarAlerta({
        jovem_id: targetJovem.id,
        jovem_nome: targetJovem.nome,
        jovem_bairro: targetJovem.bairro,
        tipo: encaminharTipo as any,
        gravidade: encaminharGravidade,
        status: 'pendente',
        descricao: encaminharMotivo,
        data_criado: new Date().toISOString().split('T')[0]
      });

      showToast(`Jovem "${targetJovem.nome}" encaminhado com sucesso para acompanhamento social!`);
      
      // clear fields
      setEncaminharJovemId('');
      setEncaminharMotivo('');
      setEncaminharTipo('Evasão Escolar');
      setEncaminharGravidade('medio');
      
      await loadAllData();
      setIsEncaminharModalOpen(false);
      
      // Smooth scroll back to alerts list if user wants to see it, or stay
      const element = document.getElementById('tabela-trajetoria-card');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      showToast('Erro ao realizar o encaminhamento social.');
    }
  };

  // Submit CSV action
  const handleImportarCSV = async () => {
    try {
      const res = await apiService.importarCSV(csvText);
      showToast(`Sucesso! ${res.count} novos jovens vulneráveis integrados.`);
      await loadAllData();
      setActiveTab('coord_mesa');
    } catch (e) {
      showToast('Falha ao processar CSV. Verifique o cabeçalho e as separações.');
    }
  };

  // Resolve Alert Event
  const handleResolverAlerta = async (id: string) => {
    const action = prompt('Qual providência/ação de acolhimento social foi tomada?');
    if (action === null) return;
    try {
      await apiService.resolverAlerta(id, 'resolvido', action);
      showToast('Alerta resolvido e arquivado na trajetória protetiva!');
      await loadAllData();
    } catch (e) {
      showToast('Erro ao salvar decisão.');
    }
  };

  // Create Atendimento report
  const handleRegistrarAtendimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAtendimento.relatorio) {
      alert('Favor preencher o relatório do atendimento.');
      return;
    }
    try {
      const payload = {
        ...newAtendimento,
        assistente_id: currentUser.id,
        assistente_name: currentUser.nome,
        data: new Date().toISOString().split('T')[0]
      };
      await apiService.salvarAtendimento(payload);
      showToast('Atendimento social registrado e adicionado à linha do tempo!');
      setNewAtendimento({
        jovem_id: jovens[0]?.id || '',
        tema: 'Acompanhamento de Rotina',
        relatorio: '',
        encaminhamentos: ''
      });
      await loadAllData();
      setActiveTab('social_fila');
    } catch (e) {
      showToast('Falha ao registrar.');
    }
  };

  // Post new Vaga
  const handleCriarVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArr = newVaga.habilidades.split(',').map(s => s.trim());
      await apiService.criarVaga({
        ...newVaga,
        habilidades: skillsArr,
        status: 'aberta'
      });
      showToast(`Vaga de Aprendiz "${newVaga.titulo}" registrada no bairro ${newVaga.bairro}!`);
      setNewVaga({
        empresa_id: 'empresa-1',
        titulo: '',
        descricao: '',
        requisitos: '',
        habilidades: 'Comunicação, Proatividade, Pontualidade',
        quantidade: 1,
        bairro: 'Industrial',
        cidade: 'Pirapora'
      });
      await loadAllData();
      setActiveTab('empresa_vagas');
    } catch (e) {
      showToast('Erro ao lançar vaga.');
    }
  };

  // Submit Microtarefa (Jovem role)
  const handleConcluirMicrotarefa = async (tarefaId: string) => {
    const answer = microtarefaAnswers[tarefaId];
    if (!answer) {
      alert('Por favor, escreva uma resposta antes de submeter.');
      return;
    }
    try {
      await apiService.concluirTarefaRenda(currentUser.id, tarefaId, answer);
      showToast('Sua submissão de Renda Ponte Digital foi enviada para validação! Aguarde crédito.');
      // clear text
      setMicrotarefaAnswers(prev => ({ ...prev, [tarefaId]: '' }));
      await loadAllData();
    } catch (e) {
      showToast('Falha ao enviar resposta.');
    }
  };

  // Action on Microtask (Coordenador approves)
  const handleDecidirMicrotarefa = async (realizacaoId: string, aprovar: boolean) => {
    try {
      await apiService.aprovarTarefaRenda(realizacaoId, aprovar);
      showToast(aprovar ? 'Microtarefa Aprovada! Créditos de R$ liberados.' : 'Submissão reprovada.');
      await loadAllData();
    } catch (e) {
      showToast('Erro ao validar tarefa.');
    }
  };

  // Submit Bus Tickets Request
  const handlePedirPasses = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passesRequest.motivo) {
      alert('Explique o motivo do deslocamento profissional.');
      return;
    }
    try {
      await apiService.solicitarPasses(currentUser.id, passesRequest.quantidade, passesRequest.motivo);
      showToast('Solicitação de passes registrada! Aguarde deferimento do CRAS.');
      setPassesRequest({ quantidade: 4, motivo: '' });
      await loadAllData();
    } catch (e) {
      showToast('Erro na solicitação.');
    }
  };

  // Decide Bus Ticket
  const handleDecidirPasses = async (solId: string, aprovar: boolean) => {
    try {
      await apiService.aprovarSolicitacaoPasses(solId, aprovar ? 'aprovada' : 'rejeitada');
      showToast(aprovar ? 'Passes Liberados com QR Code ativo!' : 'Solicitação indeferida.');
      await loadAllData();
    } catch (e) {
      showToast('Erro ao processar.');
    }
  };

  // Donate Passes (Company)
  const handleDoarPasses = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.doarPasses(passesDonation.empresa_id, passesDonation.quantidade);
      showToast(`Muito obrigado! Doação de ${passesDonation.quantidade} passes de transporte registrada.`);
      await loadAllData();
    } catch (e) {
      showToast('Erro ao processar doação.');
    }
  };

  // Matchmaking Interactive candidate simulation
  const handleContratarJovemMatch = async (jovemId: string, vagaId: string, action: string) => {
    try {
      await apiService.interagirMatch(jovemId, vagaId, action);
      showToast(`Jovem atualizado com status de "${action.toUpperCase()}"!`);
      await loadAllData();
    } catch (e) {
      showToast('Erro ao registrar alteração de contratação.');
    }
  };

  // Submit Help Request
  const handleCriarRequerimentoAjuda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricaoAjuda.trim()) return;

    try {
      const activeYouth = jovens.find(j => j.id === currentUser.id) || jovens[0] || {} as any;
      const novoAlerta = {
        jovem_id: currentUser.id,
        jovem_nome: activeYouth.nome || 'Jovem Aprendiz',
        jovem_bairro: activeYouth.bairro || 'Centro',
        tipo: 'Solicitação de Apoio' as const,
        gravidade: 'medio' as const,
        status: 'pendente' as const,
        descricao: `[REQ: ${tipoAjuda.toUpperCase()}] ${descricaoAjuda}`,
        data_criado: new Date().toISOString().split('T')[0]
      };

      await apiService.criarAlerta(novoAlerta);
      showToast('✓ Requerimento enviado para o assistente social com sucesso!');
      setDescricaoAjuda('');
      await loadAllData();
    } catch (err) {
      showToast('Erro ao enviar requerimento.');
    }
  };

  // Course progress tracking handler
  const handleAtualizarCursoProgresso = async (cursoId: string, cursoTitulo: string, categoria: 'MEI' | 'Descubra Jovem', status: 'Iniciado' | 'Em Andamento' | 'Concluido', progressoPercentual: number) => {
    try {
      const activeYouth = jovens.find(j => j.id === currentUser.id) || jovens[0] || {} as any;
      await apiService.atualizarCursoProgresso({
        jovemId: currentUser.id,
        jovemNome: activeYouth.nome || 'Jovem Aprendiz',
        cursoId,
        cursoTitulo,
        categoria,
        status,
        progressoPercentual
      });
      showToast(`✓ Progresso atualizado no curso "${cursoTitulo}" para ${status}!`);
      await loadAllData();
    } catch (e) {
      showToast('Erro ao atualizar progresso do curso.');
    }
  };

  // Filter young records
  const filteredJovens = jovens.filter(j => {
    const nomeMatches = j.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const bairroMatches = filterBairro === 'Todos' || j.bairro === filterBairro;
    
    // Risk match calculation
    const calc = calcularRisco(j).classificacao;
    const riscoMatches = filterRisco === 'Todos' || calc === filterRisco;

    return nomeMatches && bairroMatches && riscoMatches;
  });

  // Calculate coordinates distance helper for frontend matches rendering
  const getProximityBonus = (b1: string, b2: string) => {
    if (b1 === b2) return { text: 'Mesmo Bairro', bg: 'bg-green-100 text-green-700' };
    const proximas: { [key: string]: string[] } = {
      'Santo Antônio': ['Centro', 'São Geraldo', 'Vila Rica'],
      'Planalto': ['Centro', 'Industrial'],
      'São Geraldo': ['Santo Antônio', 'Centro', 'Vila Rica'],
      'Vila Rica': ['Santo Antônio', 'São Geraldo', 'Cidade Jardim'],
      'Centro': ['Santo Antônio', 'Planalto', 'São Geraldo', 'Industrial'],
      'Industrial': ['Planalto', 'Centro']
    };
    if (proximas[b1]?.includes(b2)) return { text: 'Região Próxima', bg: 'bg-emerald-50 text-emerald-600' };
    return { text: 'Outra Região', bg: 'bg-amber-50 text-amber-600' };
  };

  // Quick stats computed
  const youngActiveObj = jovens.find(j => j.id === currentUser.id) || jovens[0] || {} as any;
  const youngRisk = calcularRisco(youngActiveObj);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="login-screen-view">
        {/* Decorative glow gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl w-full space-y-8 z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shadow-xl shadow-emerald-900/40">
              <Compass className="w-10 h-10 animate-spin-slow" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 rounded-full py-0.5">SISTEMA INTEGRADO</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-600 text-white rounded-full">HACKATHON PIRAPORA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans mt-2">
                TRAJETÓRIA DESCUBRA+
              </h1>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Inclusão profissional pragmática de jovens vulneráveis por proximidade territorial, incentivos Renda Ponte e combate à evasão escolar no Programa Descubra!.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white">Como deseja acessar o sistema?</h2>
              <p className="text-xs text-slate-400 mt-1">Selecione uma conta de de demonstração para carregar os painéis interativos de simulação sem senhas complexas:</p>
            </div>

            {/* Grid of login buttons/cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Coordenador Profile card */}
              <button 
                id="login-role-coordenador"
                onClick={() => handleLoginAs('coordenador')}
                className="group text-left p-5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-amber-950/10 cursor-pointer text-slate-100">
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg group-hover:bg-amber-500/20 transition">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold bg-amber-950 px-1.5 py-0.5 rounded">Geral e Escolas</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">Coordenador Geral</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Acompanhar relatórios de matrículas, gráficos de engajamento, status de cotas e classificar o mapa de risco geral de evasão.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300">
                  <span className="font-mono text-[11px]">👤 Carlos Mendes</span>
                  <span className="font-semibold text-amber-500">Acessar &rarr;</span>
                </div>
              </button>

              {/* Assistente Social card */}
              <button 
                id="login-role-assistente"
                onClick={() => handleLoginAs('assistente_social')}
                className="group text-left p-5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-red-950/10 cursor-pointer text-slate-100">
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg group-hover:bg-red-500/20 transition">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-red-500 font-bold bg-red-950 px-1.5 py-0.5 rounded">CRAS / CREAS</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition">Assistente Social</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Fila de vulnerabilidades do CRAS Santo Antônio, registros de visitas, atendimentos de rotina e controle de alertas SOS de gravidade.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300">
                  <span className="font-mono text-[11px]">👤 Ana Paula Silva</span>
                  <span className="font-semibold text-red-500">Acessar &rarr;</span>
                </div>
              </button>

              {/* Empresa Siderurgica / Industrial Card */}
              <button 
                id="login-role-empresa"
                onClick={() => handleLoginAs('empresa')}
                className="group text-left p-5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-blue-950/10 cursor-pointer text-slate-100">
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition">
                      <Building className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-blue-500 font-bold bg-blue-950 px-1.5 py-0.5 rounded">Indústrias Parceiras</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">Empresa Parceira</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Anunciar novas vagas profissionais de jovem aprendiz, patrocinar passes de transporte por doação e verificar matchs geoespaciais automáticos.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300">
                  <span className="font-mono text-[11px]">🏭 Minas Ligas S.A.</span>
                  <span className="font-semibold text-blue-500">Acessar &rarr;</span>
                </div>
              </button>

              {/* Jovem Participante Card with selection */}
              <div 
                id="login-role-jovem-container"
                onClick={() => handleLoginAs('jovem')}
                className="group text-left p-5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-emerald-950/10 cursor-pointer text-slate-100">
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-500 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">Jovens</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">Jovem Participante</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Gerenciar seu saldo de Renda Ponte, requisitar passagens digitais via QR Code e verificar sugestões de vagas na sua vizinhança.
                    </p>
                  </div>

                  {/* Nested Youth Selector picker */}
                  <div className="mt-2 border-t border-slate-900 pt-2 shadow-inner" onClick={(e) => e.stopPropagation()}>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-semibold">Simular como Jovem específico:</label>
                    <select 
                      id="login-youth-picker"
                      value={selectedJovemId} 
                      onChange={(e) => {
                        const newId = e.target.value;
                        setSelectedJovemId(newId);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white uppercase font-mono focus:border-emerald-500 focus:outline-none transition-all">
                      {jovens.length > 0 ? (
                        jovens.map(j => (
                          <option key={j.id} value={j.id}>{j.nome} ({j.bairro})</option>
                        ))
                      ) : (
                        <>
                          <option value="00000000-0000-0000-b000-000000000001">João Victor Mendes (S. Antônio)</option>
                          <option value="00000000-0000-0000-b000-000000000002">Maria Eduarda Fernandes (Planalto)</option>
                          <option value="00000000-0000-0000-b000-000000000003">Lucas Silva Pereira (Centro)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[10px] text-slate-500">Selecione e clique para entrar</span>
                  <span className="font-semibold text-emerald-500">Acessar &rarr;</span>
                </div>
              </div>

            </div>
          </div>

          <div className="text-center text-xs text-slate-505 font-mono space-y-1">
            <p>Secretaria Municipal de Assistência Social e Inclusão - Pirapora, MG</p>
            <p className="text-[10px]">Desenvolvido com foco no combate à evasão e subsistência digna no Programa Descubra!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased">
      {/* Visual Identity Logo & Dynamic Mock Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-40 px-4 py-3" id="main-header">
        <div className="w-full max-w-none px-4 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-md shadow-emerald-900/35">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">TRAJETÓRIA DESCUBRA+</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-orange-600 text-white rounded-full">HACKATHON PIRAPORA</span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">Proteção social, Renda Ponte e Inserção de Jovens Aprendizes em Pirapora, Buritizeiro e Jequitaí</p>
            </div>
          </div>

          {/* SAIR / TROCAR CONTA */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button 
              id="switch-logout"
              onClick={() => {
                setIsLoggedIn(false);
                showToast("Sessão encerrada com sucesso!");
              }}
              className="px-4 py-1.5 text-xs rounded-xl font-bold transition duration-200 hover:bg-red-800/80 hover:text-red-100 text-red-450 text-red-400 bg-red-950/30 border border-red-900/30 shadow-sm flex items-center gap-1.5">
              <span>Sair / Trocar Conta</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* QUICK STATUS NOTIFICATION TOAST */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-700 border border-emerald-500 text-white rounded-xl shadow-2xl p-4 max-w-sm flex gap-3 animate-bounce shadow-emerald-9900/40">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
          <div>
            <p className="text-sm font-medium">{toast}</p>
          </div>
        </div>
      )}

      {/* RE-ESTABLISH AND RESET HARDCODE DATA DECK */}
      <div className="bg-slate-950 px-4 py-2 text-xs border-b border-slate-800/40 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Hora Local: 2026-05-30 18:30 UTC</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline text-emerald-400">● Conexão Segura Supabase Mock API Ativa</span>
        </div>
        <button 
          id="btn-restaurar-dados"
          onClick={handleResetDb} 
          className="hover:text-amber-400 flex items-center gap-1 transition text-[11px] text-slate-400 font-medium">
          <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
          Restaurar Banco de Dados Simulado
        </button>
      </div>

      {/* INTERNAL LAYOUT CONTAINER WITH INTERACTIVE TAB SYSTEM */}
      <main className="flex-1 w-full max-w-none px-4 lg:px-8 xl:px-12 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDE BAR DESIGNS */}
        <aside className="lg:col-span-3 xl:col-span-2 flex flex-col gap-4">
          
          {/* USER INFO PROFILE WIDGET */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800" id="user-profile-card">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3 font-mono">USUÁRIO ATIVO</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-inner">
                {currentUser.nome.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white leading-tight truncate">{currentUser.nome}</h3>
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 rounded-md mt-1 font-mono">
                  {currentUser.tipo === 'assistente_social' ? 'Assist. Social (CRAS)' : currentUser.tipo}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{currentUser.email}</p>
              </div>
            </div>

            {/* If simulating young, toggle list picker so judges can preview different danger risk scores */}
            {currentUser.tipo === 'jovem' && (
              <div className="mt-4 pt-4 border-t border-slate-900">
                <label className="block text-[11px] text-slate-400 font-medium mb-1.5">Selecionar outro Jovem para simular:</label>
                <select 
                  id="youth-picker-simulation"
                  value={selectedJovemId} 
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedJovemId(id);
                    const matching = jovens.find(j => j.id === id);
                    if (matching) {
                      setCurrentUser({
                        id: matching.id,
                        nome: matching.nome,
                        tipo: 'jovem',
                        bairro: matching.bairro,
                        cidade: matching.cidade,
                        email: matching.nome.toLowerCase().replace(/\s+/g, '') + '@descubra.com'
                      });
                      showToast(`Simulando Portal do Jovem: ${matching.nome}`);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white uppercase font-mono">
                  {jovens.map(j => (
                    <option key={j.id} value={j.id}>{j.nome} ({j.bairro})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* VIEW SWITCH NAVIGATION NAV */}
          <nav className="flex flex-col gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800" id="desktop-side-nav">
             {currentUser.tipo === 'coordenador' && (
              <div className="flex flex-col gap-1.5" id="nav-options-coordenador">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 px-2 py-1 mb-1 font-mono">OPÇÕES DO COORDENADOR</h2>
                
                <button 
                  id="nav-tab-coord"
                  onClick={() => {
                    setActiveTab('coord_geral');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-300 rounded-lg text-sm md:text-base font-bold transition duration-200 border-l-4 ${activeTab === 'coord_geral' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Painel Geral</span>
                </button>

                <button 
                  id="nav-sub-coord-heatmap"
                  onClick={() => {
                    setActiveTab('coord_mapa');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'coord_mapa' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Map className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Mapa de Calor</span>
                </button>

                <button 
                  id="nav-sub-coord-trajectory"
                  onClick={() => {
                    setActiveTab('coord_mesa');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'coord_mesa' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Users className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Monitoramento (Mesa)</span>
                </button>

                <button 
                  id="nav-sub-coord-insert"
                  onClick={() => {
                    setActiveTab('coord_cadastro');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'coord_cadastro' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Plus className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Inserir Novo Jovem</span>
                </button>

                <button 
                  id="nav-tab-import"
                  onClick={() => {
                    setActiveTab('coord_import');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-300 rounded-lg text-sm md:text-base font-bold transition duration-200 border-l-4 ${activeTab === 'coord_import' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Importação CSV</span>
                </button>

                <button 
                  id="nav-sub-coord-cursos"
                  onClick={() => {
                    setActiveTab('coord_cursos');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'coord_cursos' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Acompanhamento de Cursos</span>
                </button>
              </div>
            )}

            {currentUser.tipo === 'jovem' && (
              <div className="flex flex-col gap-1.5" id="nav-options-jovem">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 px-2 py-1 mb-1 font-mono">OPÇÕES DO ESTUDANTE</h2>
                
                <button 
                  id="nav-tab-jovem"
                  onClick={() => {
                    setActiveTab('jovem_perfil');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-300 rounded-lg text-sm md:text-base font-bold transition duration-200 border-l-4 ${activeTab === 'jovem_perfil' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Meu Perfil & Nível</span>
                </button>

                <button 
                  id="nav-sub-jovem-timeline"
                  onClick={() => {
                    setActiveTab('jovem_timeline');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'jovem_timeline' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Clock className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Linha do Tempo</span>
                </button>

                <button 
                  id="nav-sub-jovem-suporte"
                  onClick={() => {
                    setActiveTab('jovem_suporte');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'jovem_suporte' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Requerer Apoio / Ajuda</span>
                </button>

                <button 
                  id="nav-sub-jovem-mei"
                  onClick={() => {
                    setActiveTab('jovem_descubra_mei');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'jovem_descubra_mei' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Descubra MEI (Empreender)</span>
                </button>

                <button 
                  id="nav-sub-jovem-descubra"
                  onClick={() => {
                    setActiveTab('jovem_descubra_jovem');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'jovem_descubra_jovem' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Descubra Jovem (Pré-Aprendiz)</span>
                </button>
              </div>
            )}

            {currentUser.tipo === 'empresa' && (
              <div className="flex flex-col gap-1.5" id="nav-options-empresa">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 px-2 py-1 mb-1 font-mono">OPÇÕES DA EMPRESA</h2>
                
                <button 
                  id="nav-tab-empresa"
                  onClick={() => {
                    setActiveTab('empresa_vagas');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-300 rounded-lg text-sm md:text-base font-bold transition duration-200 border-l-4 ${activeTab === 'empresa_vagas' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>Painel Empresa (Vagas)</span>
                </button>

                <button 
                  id="nav-sub-empresa-insert"
                  onClick={() => {
                    setActiveTab('empresa_publicar');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'empresa_publicar' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Plus className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Publicar Vaga Ap.</span>
                </button>

                <button 
                  id="nav-sub-empresa-matches"
                  onClick={() => {
                    setActiveTab('empresa_match');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'empresa_match' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <Compass className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Matchmaking Jovem</span>
                </button>
              </div>
            )}

            {currentUser.tipo === 'assistente_social' && (
              <div className="flex flex-col gap-1.5" id="nav-options-social">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 px-2 py-1 mb-1 font-mono">OPÇÕES DO CRAS</h2>
                
                <button 
                  id="nav-tab-social"
                  onClick={() => {
                    setActiveTab('social_fila');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-300 rounded-lg text-sm md:text-base font-bold transition duration-200 border-l-4 ${activeTab === 'social_fila' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Fila Emergências</span>
                </button>

                <button 
                  id="nav-sub-social-register"
                  onClick={() => {
                    setActiveTab('social_registrar');
                  }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition duration-200 pl-9 border-l-2 ${activeTab === 'social_registrar' ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                  <FileText className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Registrar Atendimento</span>
                </button>
              </div>
            )}
          </nav>

          {/* PIRAPORA GEOGRAPHICAL INSIGHT CARD */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
            <h3 className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2 uppercase tracking-wide text-[11px] font-mono">
              <Map className="w-3.5 h-3.5 text-emerald-500" />
              Abrangência Territorial
            </h3>
            <p className="mb-2">Monitoramento ativo das calhas urbanas doRio São Francisco e periferias integrando:</p>
            <ul className="space-y-1 bg-slate-900/80 p-2 rounded border border-slate-800 font-mono text-[10px] text-slate-300">
              <li>• Pirapora (Sede - 7 bairros)</li>
              <li>• Buritizeiro (Conexão ponte)</li>
              <li>• Jequitaí (Região produtora)</li>
            </ul>
          </div>
        </aside>

        {/* MAIN CONSOLE INTERFACES */}
        <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-6" id="main-content-panels">
          
          {/* ========================================================================================= */}
          {activeTab.startsWith('coord_') && (
            <div className="space-y-6" id="tab-coordinator">
              
              {/* STAGE METRICS HERO BANNER BAR */}
              {activeTab === 'coord_geral' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* METRIC 1 */}
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between shadow-md">
                    <div>
                      <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider font-semibold font-mono">Jovens Cadastrados</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mt-1.5">{dbStats?.total || jovens.length}</h3>
                    </div>
                    <div className="mt-3 text-xs md:text-sm text-emerald-400 font-medium flex items-center gap-1">
                      <span>100% integrados no sistema</span>
                    </div>
                  </div>

                  {/* METRIC 2 */}
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between shadow-md">
                    <div>
                      <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider font-semibold font-mono">Contratados (Menor Aprendiz)</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1.5">{dbStats?.contratados || 0}</h3>
                    </div>
                    <div className="mt-3 text-xs md:text-sm text-slate-400 font-medium font-mono">
                      Adotados em vagas locais
                    </div>
                  </div>

                  {/* METRIC 3 - MANDATORY METRIC: Adotados vs Deixados de Lado */}
                  <div className="bg-slate-950 p-6 rounded-xl border-2 border-orange-500/30 bg-orange-950/20 flex flex-col justify-between relative overflow-hidden shadow-md">
                    <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-orange-500/10 font-bold text-8xl pointer-events-none font-mono">!</div>
                    <div>
                      <p className="text-xs md:text-sm text-orange-400 uppercase tracking-wider font-bold font-mono">Aguardando Vaga</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-orange-400 mt-1.5">{dbStats?.elegiveisSemVaga || 0}</h3>
                    </div>
                    <div className="mt-3 text-xs md:text-sm text-orange-200 font-medium">
                      "Deixados de Lado" elegíveis sem contratação
                    </div>
                  </div>

                  {/* METRIC 4 - MANDATORY METRIC: Mulheres vinculadas (Meninas e trans inseridas) */}
                  <div className="bg-slate-950 p-6 rounded-xl border-2 border-emerald-500/20 flex flex-col justify-between shadow-md">
                    <div>
                      <p className="text-xs md:text-sm text-emerald-400 uppercase tracking-wider font-bold font-mono">Inclusão Feminina/Trans</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mt-1.5">{dbStats?.mulheresVinculadas || 0}%</h3>
                    </div>
                    <p className="mt-3 text-xs md:text-sm text-slate-400 font-medium font-mono">Taxa contratada do total feminino</p>
                  </div>

                </div>
              )}

              {/* RISK TRACKERS DECK */}
              {activeTab === 'coord_geral' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse" />
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm md:text-base">Risco Alto (SOS)</h4>
                        <p className="text-xs md:text-sm text-slate-450 text-slate-400">Emergência social ou abandono</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-red-500 bg-red-950/40 px-3 py-1 rounded font-mono">
                      {dbStats?.altoRisco || 0}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm md:text-base">Risco Médio</h4>
                        <p className="text-xs md:text-sm text-slate-450 text-slate-400">Faltas iniciais registradas</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-amber-500 bg-amber-950/40 px-3 py-1 rounded font-mono">
                      {dbStats?.medioRisco ?? 0}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-500" />
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm md:text-base">Sob Controle</h4>
                        <p className="text-xs md:text-sm text-slate-450 text-slate-400">Frequência e contato estáveis</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded font-mono">
                      {dbStats?.baixoRisco ?? 0}
                    </span>
                  </div>
                </div>
              )}

              {/* INTEGRATIVE DUAL CODES: HEATMAP BY NEIGHBORHOOD & HIGH FIDELITY TABLE */}
              {(activeTab === 'coord_mapa' || activeTab === 'coord_mesa') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* NEIGHBORHOOD MAP OF HEAT / CONTRATACAO */}
                  {activeTab === 'coord_mapa' && (
                    <div id="mapa-calor-card" className="lg:col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                      <div className="flex items-center gap-3 mb-4 border-b border-slate-900 pb-4">
                        <Map className="w-7 h-7 text-emerald-400 animate-pulse" />
                        <div>
                          <h3 className="font-bold text-white text-xl md:text-2xl uppercase tracking-tight font-mono">
                            Mapa de Calor de Pirapora
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">Adensamento de vulnerabilidade e taxa de empregabilidade real por microrregião de atuação</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dbStats?.bairroStats ? (
                          dbStats.bairroStats.map((st: any) => {
                            const statusTag = st.taxa_contratacao > 65 ? { text: 'Estabilidade Social', color: 'bg-green-950 text-green-300 border-green-800' } :
                                              st.taxa_contratacao > 35 ? { text: 'Atenção Requerida', color: 'bg-amber-950 text-amber-300 border-amber-900' } :
                                              { text: 'Ação Urgente CRAS', color: 'bg-red-950 text-red-300 border-red-900' };

                            return (
                              <div key={st.bairro} className="bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-800/80 hover:border-slate-700/85 transition duration-200 shadow-md flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start gap-2 mb-3">
                                    <span className="font-extrabold text-white text-lg md:text-xl font-mono tracking-tight">{st.bairro}</span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${statusTag.color}`}>
                                      {statusTag.text}
                                    </span>
                                  </div>

                                  <div className="flex items-baseline justify-between mb-4">
                                    <span className="text-xs text-slate-400 uppercase font-mono font-semibold">Taxa de Inclusão:</span>
                                    <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                                      {st.taxa_contratacao}%
                                    </span>
                                  </div>
                                  
                                  {/* Beautiful Taller Progress Track Indicator */}
                                  <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                    <div 
                                      className="h-full rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${st.taxa_contratacao || 5}%`,
                                        backgroundColor: st.taxa_contratacao > 60 ? '#10B981' : st.taxa_contratacao > 30 ? '#F59E0B' : '#DC2626'
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-5 pt-3.5 border-t border-slate-850 text-xs md:text-sm font-mono text-slate-350">
                                  <div className="bg-slate-950 p-2 rounded text-center border border-slate-850/60">
                                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Monitorados</span>
                                    <b className="text-slate-200 text-sm">{st.jovens} Jovens</b>
                                  </div>
                                  <div className="bg-slate-950 p-2 rounded text-center border border-slate-850/60">
                                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Score Médio</span>
                                    <b className="text-emerald-400 text-sm">{st.avg_score_empregabilidade || 50}</b>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-slate-400 text-center py-10 col-span-3 italic">Nenhum dado consolidado de Pirapora.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DETAILED HIGH FIDELITY TABLE */}
                  {activeTab === 'coord_mesa' && (
                    <div id="tabela-trajetoria-card" className="lg:col-span-12 bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="font-bold text-slate-200 text-base md:text-lg uppercase tracking-wide mb-1.5 font-mono flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            Acompanhamento da Trajetória Detalhado
                          </h3>
                          <p className="text-sm text-slate-400">Classificação de risco em tempo real e evolução de cada jovem</p>
                        </div>

                        {/* INTERACTIVE ROW CONTROLS */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                              id="input-pesquisar-jovens"
                              type="text" 
                              placeholder="Buscar por nome..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 pr-3 py-1.5 text-xs md:text-sm bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-emerald-500 w-36 md:w-48"
                            />
                          </div>

                          <select 
                            id="select-filtro-bairro"
                            value={filterBairro}
                            onChange={(e) => setFilterBairro(e.target.value)}
                            className="p-1.5 px-2.5 bg-slate-900 border border-slate-800 rounded-md text-slate-300 text-xs md:text-sm focus:outline-none font-mono">
                            <option value="Todos">Todos Bairros</option>
                            <option value="Santo Antônio">Santo Antônio</option>
                            <option value="Planalto">Planalto</option>
                            <option value="São Geraldo">São Geraldo</option>
                            <option value="Centro">Centro</option>
                            <option value="Vila Rica">Vila Rica</option>
                            <option value="Cidade Jardim">Cidade Jardim</option>
                            <option value="Sagrada Família">Sagrada Família</option>
                            <option value="Buritizeiro">Buritizeiro</option>
                            <option value="Jequitaí">Jequitaí</option>
                          </select>

                          <select 
                            id="select-filtro-risco"
                            value={filterRisco}
                            onChange={(e) => setFilterRisco(e.target.value)}
                            className="p-1.5 px-2.5 bg-slate-900 border border-slate-800 rounded-md text-slate-300 text-xs md:text-sm focus:outline-none font-mono">
                            <option value="Todos">Todos Riscos</option>
                            <option value="alto">Alto Risco</option>
                            <option value="medio">Risco Médio</option>
                            <option value="baixo">Baixo Risco</option>
                          </select>

                          <button
                            id="btn-open-encaminhar-modal"
                            title="Criar novo encaminhamento para a Assistente Social..."
                            onClick={() => {
                              setEncaminharJovemId('');
                              setIsEncaminharModalOpen(true);
                            }}
                            className="p-1.5 px-2.5 bg-rose-950/40 border border-rose-900/60 hover:border-rose-500 rounded text-rose-450 hover:text-white hover:bg-rose-900/80 transition-all text-xs md:text-sm font-mono font-bold cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            Novo Encaminhamento CRAS
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                          <thead className="bg-slate-900 text-xs text-slate-400 uppercase font-mono border-b border-slate-800">
                            <tr>
                              <th className="py-4 px-4">Jovem</th>
                              <th className="py-4 px-4">Região</th>
                              <th className="py-4 px-4 text-center">Frequência</th>
                              <th className="py-4 px-4">Situação Social</th>
                              <th className="py-4 px-4 text-center">Risco</th>
                              <th className="py-4 px-4">Status Programa</th>
                              <th className="py-4 px-4 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/60">
                            {filteredJovens.length > 0 ? (
                              filteredJovens.map((j) => {
                                const riskCalc = calcularRisco(j);
                                
                                // Colors for risks
                                let riskBadgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-900';
                                let riskBallColor = 'bg-emerald-500';
                                if (riskCalc.classificacao === 'alto') {
                                  riskBadgeColor = 'bg-red-950 text-red-400 border-red-900';
                                  riskBallColor = 'bg-red-600 animate-pulse';
                                } else if (riskCalc.classificacao === 'medio') {
                                  riskBadgeColor = 'bg-amber-950 text-amber-400 border-amber-900';
                                  riskBallColor = 'bg-amber-500';
                                }

                                // Colors for status
                                let statusColor = 'bg-slate-900 text-slate-400';
                                if (j.status === 'aprendiz_contratado') statusColor = 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/20';
                                else if (j.status === 'pré-aprendizagem') statusColor = 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
                                else if (j.status === 'evadido') statusColor = 'bg-red-500/10 text-red-500 border border-red-500/20';

                                return (
                                  <tr key={j.id} className="hover:bg-slate-900/60 transition duration-150">
                                    <td className="py-5 px-4 font-medium">
                                      <div className="text-white text-sm md:text-base font-semibold">{j.nome}</div>
                                      <div className="text-xs text-slate-400 font-mono mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                        <span>Idade: {j.idade ?? 16} • Renda: R$ {j.renda_familiar ?? 1000}</span>
                                        <span className="text-slate-700">|</span>
                                        <a 
                                          href={`https://wa.me/55${j.telefone || '38999812345'}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title={`Conversar com ${j.nome} no WhatsApp (+55 ${j.telefone || '38999812345'})`}
                                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                                        >
                                          <MessageSquare className="w-3.5 h-3.5" />
                                          Conversar com Aluno
                                        </a>
                                      </div>
                                    </td>
                                    <td className="py-5 px-4 font-mono text-xs md:text-sm text-slate-300">
                                      {j.bairro}
                                      <div className="text-[11px] text-slate-500 mt-0.5">{j.cidade}</div>
                                    </td>
                                    <td className="py-5 px-4 text-center font-bold text-sm">
                                      <span className={j.frequencia < 75 ? 'text-red-500' : j.frequencia < 85 ? 'text-amber-500' : 'text-emerald-400'}>
                                        {j.frequencia}%
                                      </span>
                                      <div className="text-[11px] font-normal text-slate-500 mt-0.5">{j.faltas_consecutivas} faltas</div>
                                    </td>
                                    <td className="py-5 px-4 italic truncate max-w-[150px] text-slate-350 text-xs md:text-sm">
                                      {j.vulnerabilidade_tipo}
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${riskBadgeColor}`}>
                                        <span className={`w-2 h-2 rounded-full ${riskBallColor}`} />
                                        {riskCalc.classificacao}
                                      </span>
                                    </td>
                                    <td className="py-5 px-4 font-mono text-xs">
                                      <span className={`px-2.5 py-1 rounded-md ${statusColor} font-bold`}>
                                        {j.status}
                                      </span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                      <div className="flex justify-end items-center gap-2">
                                        <button 
                                          id={`view-trajectory-${j.id}`}
                                          onClick={() => {
                                            setInfoJovemModal(j);
                                            showToast(`Abrindo informações detalhadas de ${j.nome}`);
                                          }}
                                          className="p-1.5 px-3 border border-slate-700 hover:border-emerald-500 rounded bg-slate-900 text-xs hover:text-emerald-400 transition font-mono whitespace-nowrap cursor-pointer">
                                          Mais Informações
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-500">Nenhum jovem corresponde aos filtros em Pirapora.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* MODAL / POPUP: ENCAMINHAMENTO DE JOVEM PARA ASSISTÊNCIA SOCIAL (CRAS/CREAS) */}
                  {isEncaminharModalOpen && (
                    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                      <div 
                        className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]"
                        id="secao-encaminhamento-social"
                      >
                        {/* Close button */}
                        <button 
                          id="btn-close-encaminhar-modal"
                          type="button"
                          onClick={() => {
                            setIsEncaminharModalOpen(false);
                            setEncaminharJovemId('');
                            setEncaminharMotivo('');
                          }}
                          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-900 p-2 rounded-lg transition-all cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                          <ShieldAlert className="w-7 h-7 text-rose-500 animate-pulse" />
                          <div>
                            <h3 className="font-bold text-white text-base md:text-lg uppercase tracking-wide font-mono">
                              Encaminhar para Assistente Social (CRAS)
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Envie um alerta imediato à equipe do CRAS Santo Antônio para intervenção de alta vulnerabilidade.
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleEncaminharSocial} className="space-y-4">
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 space-y-4">
                            
                            {/* JOVEM SELECTOR */}
                            <div>
                              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 font-mono">
                                Escolher Jovem para Encaminhar
                              </label>
                              <select
                                id="select-encaminhar-jovem"
                                value={encaminharJovemId}
                                onChange={(e) => setEncaminharJovemId(e.target.value)}
                                required
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                              >
                                <option value="">-- Selecione o Jovem do programa --</option>
                                {jovens.map((j) => (
                                  <option key={j.id} value={j.id}>
                                    {j.nome} ({j.bairro}) - Risco atual: {calcularRisco(j).classificacao.toUpperCase()}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* TIPO DE GATILHO/VULNERABILIDADE */}
                              <div>
                                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 font-mono">
                                  Classificação do Gatilho
                                </label>
                                <select
                                  id="select-encaminhar-tipo"
                                  value={encaminharTipo}
                                  onChange={(e) => setEncaminharTipo(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                                >
                                  <option value="Evasão Escolar">Abandono / Evasão Escolar</option>
                                  <option value="Falta Consecutiva">Faltas Consecutivas na Qualificação</option>
                                  <option value="Falta de Contato">Incomunicabilidade (Sem Contato)</option>
                                  <option value="Mensagem WhatsApp">Gatilho Emocional (SOS Chat)</option>
                                  <option value="Frequência Alerta">Extrema Vulnerabilidade Familiar</option>
                                </select>
                              </div>

                              {/* GRAVIDADE */}
                              <div>
                                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 font-mono">
                                  Gravidade do Alerta
                                </label>
                                <div className="grid grid-cols-3 gap-2 h-[46px]">
                                  {(['baixo', 'medio', 'alto'] as const).map((g) => {
                                    const labelStr = g === 'baixo' ? 'Baixo' : g === 'medio' ? 'Médio' : 'Alto';
                                    const activeBgClass = g === 'baixo' ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : g === 'medio' ? 'bg-amber-950 text-amber-400 border-amber-500' : 'bg-rose-950 text-rose-450 border-rose-500';
                                    
                                    return (
                                      <button
                                        key={g}
                                        type="button"
                                        onClick={() => setEncaminharGravidade(g)}
                                        className={`rounded-lg border text-xs font-bold font-mono transition-all text-center cursor-pointer flex items-center justify-center ${
                                          encaminharGravidade === g ? activeBgClass : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                                        }`}
                                      >
                                        {labelStr}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* MOTIVO DETALHADO */}
                            <div>
                              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 font-mono">
                                Especificar Motivo / Detalhes do Encaminhamento
                              </label>
                              <textarea
                                id="textarea-encaminhar-motivo"
                                rows={4}
                                required
                                value={encaminharMotivo}
                                onChange={(e) => setEncaminharMotivo(e.target.value)}
                                placeholder="Descreva detalhadamente a situação identificada pelo coordenador (ex: Jovem enfrenta ausência de transporte público para o curso, relatou insegurança alimentar em casa ou problemas familiares urgentes)..."
                                className="w-full bg-slate-950 border border-slate-850 text-sm p-3 text-white rounded-lg focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-sans"
                              />
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEncaminharModalOpen(false);
                                setEncaminharJovemId('');
                                setEncaminharMotivo('');
                              }}
                              className="px-5 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all text-sm font-mono cursor-pointer font-bold"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 cursor-pointer font-mono uppercase"
                            >
                              <ShieldAlert className="w-4 h-4 text-white" />
                              Encaminhar ao CRAS
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* MODAL / POPUP: DETALHES DO JOVEM (RESUMO DE INFORMAÇÕES E LINHA DO TEMPO) */}
                  {infoJovemModal && (() => {
                    const j = infoJovemModal;
                    const rCalc = calcularRisco(j);
                    const timelineRecords = atendimentos.filter(at => at.jovem_id === j.id);

                    // Colors for risk
                    let rBadge = 'bg-emerald-950 text-emerald-400 border-emerald-900';
                    let rBall = 'bg-emerald-500';
                    if (rCalc.classificacao === 'alto') {
                      rBadge = 'bg-red-950 text-red-400 border-red-900';
                      rBall = 'bg-red-600 animate-pulse';
                    } else if (rCalc.classificacao === 'medio') {
                      rBadge = 'bg-amber-950 text-amber-400 border-amber-900';
                      rBall = 'bg-amber-500';
                    }

                    // Colors for status
                    let sBadge = 'bg-slate-900 text-slate-400 border-slate-800';
                    if (j.status === 'aprendiz_contratado') sBadge = 'bg-emerald-600/10 text-emerald-400 border-emerald-500/25';
                    else if (j.status === 'pré-aprendizagem') sBadge = 'bg-orange-500/10 text-orange-400 border-orange-500/25';
                    else if (j.status === 'evadido') sBadge = 'bg-red-500/10 text-red-500 border-red-500/25';

                    return (
                      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div 
                          className="bg-slate-950 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]"
                          id="pop-up-resumo-jovem"
                        >
                          {/* Close button */}
                          <button 
                            id="btn-close-info-modal"
                            type="button"
                            onClick={() => setInfoJovemModal(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-900 p-2 rounded-lg transition-all cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          {/* Header: Name and Status */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-900">
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h3 className="font-extrabold text-white text-xl md:text-2xl uppercase tracking-wide font-mono">
                                  {j.nome}
                                </h3>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${rBadge}`}>
                                  <span className={`w-2 h-2 rounded-full ${rBall}`} />
                                  RISCO {rCalc.classificacao.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 font-mono">
                                ID do Estudante: {j.id} • Cadastrado no Programa Descubra Pirapora
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-md text-xs font-black uppercase border ${sBadge} font-mono`}>
                                Status: {j.status}
                              </span>
                            </div>
                          </div>

                          {/* Layout Grid with Information & Timeline */}
                          <div className="space-y-6">
                            
                            {/* Top row: Info on the Left, School Indicators on the Right */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                              {/* Left Side: General Profile Info */}
                              <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-850 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2">
                                  Informações Pessoais & Contato
                                </h4>

                                <div className="grid grid-cols-1 gap-3 text-xs md:text-sm font-mono text-slate-300">
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Idade / Nasc:</span>
                                    <span className="text-white font-medium">{j.idade} anos ({j.data_nasc})</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Gênero / Raça:</span>
                                    <span className="text-white font-medium">{j.genero} • {j.raca}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Telefone:</span>
                                    <span className="text-emerald-400 font-bold">
                                      {(j.telefone || '38999812345').replace(/^38/, '(38) ').replace(/^(\(\d{2}\)\s*)?(\d{5})(\d{4})$/, '$1$2-$3')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Localização:</span>
                                    <span className="text-white font-medium text-right">{j.bairro}, {j.cidade}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Renda Familiar:</span>
                                    <span className="text-orange-400 font-bold">R$ {j.renda_familiar ?? 1000}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5">
                                    <span className="text-slate-500">Escolaridade:</span>
                                    <span className="text-white font-medium text-right max-w-[200px] truncate" title={j.escolaridade}>{j.escolaridade}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Side: Educational & Social indicators */}
                              <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-850 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2">
                                  Indicadores Escolares & Sociais
                                </h4>

                                <div className="grid grid-cols-1 gap-3 text-xs md:text-sm font-mono text-slate-350">
                                  <div className="flex justify-between py-1.5 border-b border-slate-950 items-center">
                                    <span className="text-slate-500">Frequência Escolar:</span>
                                    <span className={`font-bold text-base ${j.frequencia < 75 ? 'text-red-500' : j.frequencia < 85 ? 'text-amber-500' : 'text-emerald-400'}`}>
                                      {j.frequencia}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Faltas Consecutivas:</span>
                                    <span className="text-white font-bold">{j.faltas_consecutivas} registradas</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Desempenho Geral:</span>
                                    <span className={`font-bold capitalize ${j.desempenho === 'bom' ? 'text-emerald-400' : j.desempenho === 'regular' ? 'text-amber-500' : 'text-red-500'}`}>
                                      {j.desempenho}
                                    </span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Vulnerabilidade Crítica:</span>
                                    <span className="text-amber-400 font-semibold">{j.vulnerabilidade_tipo}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 border-b border-slate-950">
                                    <span className="text-slate-500">Encaminhado Por:</span>
                                    <span className="text-slate-300 font-semibold">{j.encaminhado_por}</span>
                                  </div>
                                  <div className="flex justify-between py-1.5 text-xs">
                                    <span className="text-slate-500">Pontuação Descubra+:</span>
                                    <span className="text-amber-400 font-bold font-mono">{j.pontos_totais ?? 0} PTS (Nível {j.nivel ?? 1})</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                            
                            {/* Bottom Side: Full-width Timeline trajectory summary */}
                            <div className="w-full">
                              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 max-h-[320px] overflow-y-auto">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2 mb-5">
                                  Linha do Tempo Social / Trajetória Protetiva
                                </h4>

                                <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6 font-mono text-xs text-slate-350">
                                  
                                  {/* Action Today */}
                                  <div className="relative">
                                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow" />
                                    <span className="text-[10px] text-slate-500 font-black">Histórico Recente</span>
                                    <h5 className="font-bold text-white text-xs mt-0.5">Sob Monitoramento da Central de Impacto</h5>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                      Frequência escolar de {j.frequencia}% e evolução de evasão analisada pelo algoritmo preditivo Descubra+ de Pirapora.
                                    </p>
                                  </div>

                                  {timelineRecords.map((at) => (
                                    <div key={at.id} className="relative">
                                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-slate-950 shadow" />
                                      <span className="text-[10px] text-orange-400 font-bold">{at.data}</span>
                                      <h5 className="font-bold text-white text-xs mt-0.5">Atendimento: {at.tema}</h5>
                                      <p className="text-[10px] text-slate-500 mt-0.5"><b className="text-slate-450 uppercase">Técnico:</b> {at.assistente_nome}</p>
                                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-850 mt-1.5 leading-relaxed italic">
                                        "{at.relatorio}"
                                      </p>
                                      {at.encaminhamentos && (
                                        <p className="text-[10px] text-emerald-400 font-extrabold mt-1">
                                          → Encaminhado para: {at.encaminhamentos}
                                        </p>
                                      )}
                                    </div>
                                  ))}

                                  {/* Registration base */}
                                  <div className="relative">
                                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-950 shadow" />
                                    <span className="text-[10px] text-slate-500 font-black">05/03/2026</span>
                                    <h5 className="font-bold text-white text-xs mt-0.5">Inclusão e Registro Inicial no Descubra+</h5>
                                    <p className="text-xs text-slate-400 mt-1">
                                      Parâmetros sociais consolidados do CRAS Pirapora aplicados no cadastro inicial do jovem.
                                    </p>
                                  </div>

                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Footer action bar */}
                          <div className="flex flex-wrap items-center justify-between border-t border-slate-900/80 pt-5 mt-6 gap-3">
                            <div className="flex gap-2.5">
                              <a 
                                href={`https://wa.me/55${j.telefone || '38999812345'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-emerald-600 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-white transition text-xs font-mono font-bold cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4 text-emerald-450 hover:text-white" />
                                Conversar no WhatsApp
                              </a>

                              <button 
                                type="button"
                                onClick={() => {
                                  setEncaminharJovemId(j.id);
                                  setIsEncaminharModalOpen(true);
                                  setInfoJovemModal(null);
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-rose-900 font-bold bg-rose-950/40 border border-rose-900/60 rounded-lg text-rose-450 hover:text-white transition text-xs font-mono cursor-pointer"
                              >
                                <ShieldAlert className="w-4 h-4 text-rose-400 hover:text-white" />
                                Encaminhar ao CRAS
                              </button>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setInfoJovemModal(null)}
                              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition text-xs font-mono font-bold cursor-pointer"
                            >
                              Fechar Resumo
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* DOCK 3: REGISTRO DE NOVO JOVEM */}
              {activeTab === 'coord_cadastro' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* INLINE REGISTRATION FORM FOR COORDINATORS */}
                  <div id="registrar-jovem-form" className="lg:col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                      <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                        <Plus className="w-7 h-7 text-emerald-400" />
                        <div>
                          <h3 className="font-bold text-white text-lg md:text-xl uppercase tracking-wide font-mono">
                            Inserir Novo Jovem na Base de Monitoramento
                          </h3>
                          <p className="text-xs md:text-sm text-slate-400 mt-1">Insira os dados iniciais do estudante para calcular o score preditivo de risco de evasão e vinculá-lo a ações imediatas do CRAS.</p>
                        </div>
                      </div>

                      <form onSubmit={handleCadastrarJovem} className="space-y-6">
                        
                        {/* SEÇÃO 1: INFORMAÇÕES PESSOAIS */}
                        <div className="bg-slate-900/65 p-4 md:p-6 rounded-xl border border-slate-850">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4 border-l-2 border-emerald-500 pl-2">Informações Pessoais</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Nome Completo do Jovem</label>
                              <input 
                                id="input-novo-jovem-nome"
                                type="text" 
                                required
                                placeholder="Ex: Gabriel Souza Bispo"
                                value={newJovem.nome}
                                onChange={(e) => setNewJovem({...newJovem, nome: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">WhatsApp / Celular com DDD (Ex: 38999998888)</label>
                              <input 
                                id="input-novo-jovem-telefone"
                                type="text" 
                                placeholder="Ex: 38999998888"
                                value={newJovem.telefone}
                                onChange={(e) => setNewJovem({...newJovem, telefone: e.target.value.replace(/\D/g, '')})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono font-medium"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Data de Nascimento</label>
                                <input 
                                  id="input-novo-jovem-nasc"
                                  type="date"
                                  required
                                  value={newJovem.data_nasc}
                                  onChange={(e) => setNewJovem({...newJovem, data_nasc: e.target.value})}
                                  className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Território (Bairro)</label>
                                <select 
                                  id="select-novo-jovem-bairro"
                                  value={newJovem.bairro}
                                  onChange={(e) => setNewJovem({...newJovem, bairro: e.target.value})}
                                  className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-medium">
                                  <option value="Santo Antônio">Santo Antônio</option>
                                  <option value="Centro">Centro</option>
                                  <option value="Planalto">Planalto</option>
                                  <option value="São Geraldo">São Geraldo</option>
                                  <option value="Vila Rica">Vila Rica</option>
                                  <option value="Cidade Jardim">Cidade Jardim</option>
                                  <option value="Sagrada Família">Sagrada Família</option>
                                  <option value="Buritizeiro">Buritizeiro</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SEÇÃO 2: MÉTRICAS DE ENGAJAMENTO ESCOLARES */}
                        <div className="bg-slate-900/65 p-4 md:p-6 rounded-xl border border-slate-850">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4 border-l-2 border-emerald-500 pl-2">Desempenho & Engajamento Escolar</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Frequência Escolar do Curso (%)</label>
                              <input 
                                id="input-novo-jovem-frequencia"
                                type="number"
                                min="0"
                                max="100"
                                value={newJovem.frequencia}
                                onChange={(e) => setNewJovem({...newJovem, frequencia: Number(e.target.value)})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Faltas Consecutivas Totais</label>
                              <input 
                                id="input-novo-jovem-faltas"
                                type="number"
                                min="0"
                                value={newJovem.faltas_consecutivas}
                                onChange={(e) => setNewJovem({...newJovem, faltas_consecutivas: Number(e.target.value)})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Rendimento/Desempenho Geral</label>
                              <select 
                                id="select-novo-jovem-desempenho"
                                value={newJovem.desempenho}
                                onChange={(e) => setNewJovem({...newJovem, desempenho: e.target.value as any})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-medium"
                              >
                                <option value="bom">Bom Aproveitamento</option>
                                <option value="regular">Regular / Instável</option>
                                <option value="ruim">Ruim (Abaixo do esperado)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* SEÇÃO 3: INDICADORES SOCIOECONÔMICOS E VULNERABILIDADE */}
                        <div className="bg-slate-900/65 p-4 md:p-6 rounded-xl border border-slate-850">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4 border-l-2 border-emerald-500 pl-2">Indicadores Socioeconômicos & Vulnerabilidades</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Renda Familiar Per Capita (R$)</label>
                              <input 
                                id="input-novo-jovem-renda"
                                type="number"
                                placeholder="Reais (R$)"
                                value={newJovem.renda_familiar}
                                onChange={(e) => setNewJovem({...newJovem, renda_familiar: Number(e.target.value)})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Vulnerabilidade Crítica Reconhecida</label>
                              <select 
                                id="select-novo-jovem-vulnerabilidade"
                                value={newJovem.vulnerabilidade_tipo}
                                onChange={(e) => setNewJovem({...newJovem, vulnerabilidade_tipo: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-medium">
                                <option value="Nenhuma">Nenhuma registrada</option>
                                <option value="Trabalho Infantil">Trabalho Infantil</option>
                                <option value="Medida Socioeducativa">Socioeducativo (CREAS)</option>
                                <option value="Pobreza Extrema">Pobreza Extrema / Fome</option>
                                <option value="Egresso de acolhimento">Egresso de Acolhimento</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Último Contato Realizado</label>
                              <input 
                                id="input-novo-jovem-contato"
                                type="text"
                                placeholder="Ex: 2026-05-30"
                                value={newJovem.ultimo_contato}
                                onChange={(e) => setNewJovem({...newJovem, ultimo_contato: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          id="btn-cadastrar-jovem"
                          type="submit" 
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm md:text-base transition uppercase font-mono tracking-wider shadow-lg shadow-emerald-900/30 cursor-pointer">
                          Calcular Fatores de Risco e Cadastrar Jovem na Base ✓
                        </button>
                      </form>
                    </div>
                </div>
              )}

              {activeTab === 'coord_import' && (
                <div className="space-y-6 max-w-5xl mx-auto w-full" id="tab-csv-import">
                  <div className="bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                      <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="font-bold text-white text-xl md:text-2xl font-mono uppercase tracking-wide">
                          Importadora Integrada de Trajetórias (CSV)
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 mt-1">
                          Ganhe agilidade no processamento socioassistencial. Importe planilhas geradas por escolas estaduais ou institutos técnicos (SENAI/SENAC).
                        </p>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed font-sans">
                      O algoritmo de inteligência territorial realiza o processamento em tempo real do nosso modelo preditivo de evasão escolar, recalculando todas as variáveis de risco e de compatibilidade profissional municipal.
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 font-mono text-xs md:text-sm text-slate-300 shadow-inner">
                      <span className="block font-black text-orange-400 mb-3 tracking-widest uppercase text-xs">LAYOUT DE COLUNAS OBRIGATÓRIO (PADRÃO EXCEL/CSV):</span>
                      <div className="overflow-x-auto whitespace-nowrap bg-slate-950 p-4 rounded-lg text-xs md:text-sm border border-slate-850 font-bold text-emerald-400">
                        nome, data_nascimento, genero, bairro, cidade, frequencia_curso, renda_familiar, desempenho, faltas_consecutivas, vulnerabilidade_tipo, ultimo_contato
                      </div>
                    </div>

                    <textarea
                      id="textarea-csv-import"
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder="Cole as linhas do seu CSV estruturado aqui..."
                      className="w-full bg-slate-900 border border-slate-800 text-sm md:text-base p-4 text-white rounded-lg focus:border-emerald-500 font-mono h-64 focus:outline-none resize-none leading-relaxed transition focus:ring-1 focus:ring-emerald-500 mb-2"
                    />

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <button 
                        id="btn-trigger-import-csv"
                        onClick={handleImportarCSV}
                        className="py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm md:text-base transition uppercase font-mono font-black tracking-wider shadow-lg shadow-emerald-950/20 cursor-pointer flex-1">
                        Carregar e Processar Planilha de Impacto ✓
                      </button>
                      <button 
                        id="btn-clear-csv-text"
                        onClick={() => setCsvText('')}
                        className="py-4 px-6 hover:bg-slate-900 text-slate-400 rounded-xl text-sm md:text-base border border-slate-800 font-mono cursor-pointer transition">
                        Limpar Campo
                      </button>
                    </div>
                  </div>

                  {/* CSV TIPS BOX */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
                    <div className="bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-md">
                      <h4 className="font-extrabold mb-3 font-mono uppercase text-sm md:text-base text-emerald-400 tracking-wide border-l-2 border-emerald-500 pl-2.5">Cidade de Origem Territorial</h4>
                      <p className="leading-relaxed text-xs md:text-sm text-slate-300 font-sans">
                        O importador analisa automaticamente os registros vindos de <b>Pirapora, Buritizeiro e Jequitaí</b>, mapeando a localização física de residência de cada jovem para otimizar trajetos de ônibus no Banco de Passes.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-md">
                      <h4 className="font-extrabold mb-3 font-mono uppercase text-sm md:text-base text-emerald-400 tracking-wide border-l-2 border-emerald-500 pl-2.5">Classificação Instantânea</h4>
                      <p className="leading-relaxed text-xs md:text-sm text-slate-300 font-sans">
                        Se o jovem importado tiver frequência inferior a 75% ou faltas consecutivas acima de 5, o sistema lança um Alerta SOS no painel de assistência social e gera notificações no mesmo instante.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* ========================================================================================= */}
          {/* 2. DYNAMICAL YOUTH DASHBOARD SECTION */}
          {/* ========================================================================================= */}
          {activeTab.startsWith('jovem_') && (
            <div className="space-y-6" id="tab-young">
              
              {/* STAGE METRICS HERO */}
              {activeTab === 'jovem_perfil' && (
                <div className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-8 md:p-10 rounded-xl border-2 border-emerald-500/20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl" id="young-hero-metrics">
                  
                  {/* Score Empregabilidade */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-slate-900" id="employability-score-card">
                    <span className="text-xs md:text-sm font-black text-slate-400 tracking-widest uppercase font-mono mb-4">Score Empregabilidade Ativo</span>
                    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900 rounded-full border-4 border-emerald-400 shadow-2xl shadow-emerald-950/40 ring-4 ring-emerald-500/10">
                      <div className="text-center">
                        <span className="text-5xl font-black text-white font-mono tracking-tighter">{youngActiveObj?.score_empregabilidade || 50}</span>
                        <p className="text-xs md:text-sm text-slate-400 mt-1 font-mono uppercase tracking-wider font-bold">Pontos</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <span className="text-xs md:text-sm text-emerald-400 bg-emerald-950/65 px-4 py-2 rounded-xl font-mono font-black uppercase tracking-wider border border-emerald-900">
                        Perfil Pré-Profissional ✓
                      </span>
                    </div>
                  </div>

                  {/* LEVEL SHELF GAMEFICACAO */}
                  <div className="md:col-span-7 flex flex-col gap-6">
                    <div className="flex justify-between items-center gap-4 flex-wrap border-b border-slate-900 pb-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-sans">{youngActiveObj?.nome}</h2>
                        <p className="text-xs md:text-sm text-slate-300 font-mono mt-1 font-medium bg-slate-900 px-3 py-1 rounded-md border border-slate-850 inline-block">Nível {youngActiveObj?.nivel || 1} • {youngActiveObj?.pontos_totais || 50} XP acumulado</p>
                      </div>
                      <span className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs md:text-sm font-black font-mono uppercase shrink-0 tracking-wider shadow-md shadow-orange-950/20">
                        {youngActiveObj?.status === 'aprendiz_contratado' ? 'CONTRATADO ✓' : 'DISPONÍVEL'}
                      </span>
                    </div>

                    {/* Level progress */}
                    <div>
                      <div className="flex justify-between text-xs md:text-sm text-slate-300 font-mono mb-2">
                        <span className="font-bold">Barra de Progresso (XP Próximo Nível)</span>
                        <span className="font-black text-emerald-400">{youngActiveObj?.pontos_totais || 50} / {((youngActiveObj?.nivel || 1) + 1) * 200} XP</span>
                      </div>
                      <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow shadow-emerald-400/50" 
                          style={{ width: `${Math.min(100, (((youngActiveObj?.pontos_totais || 50) % 200) / 200) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Badges conquistadas */}
                    <div>
                      <span className="block text-xs md:text-sm text-slate-300 font-bold uppercase tracking-widest mb-3 font-mono">Conquistas e Selos da Sua Trajetória:</span>
                      <div className="flex flex-wrap gap-2.5">
                        {youngActiveObj?.badges && youngActiveObj.badges.map((b: string) => (
                          <span key={b} className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-bold text-orange-400 bg-orange-950/40 border border-orange-900/60 rounded-xl shadow-lg font-mono">
                            <Award className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                            {b}
                          </span>
                        ))}
                        {(!youngActiveObj?.badges || youngActiveObj.badges.length === 0) && (
                          <p className="text-xs md:text-sm text-slate-500 italic font-mono">Conclua microtarefas ou garanta entrevistas de emprego para desbloquear badges!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* LINEA DE TIEMPO INTERACTIVE WIDGET */}
              {activeTab === 'jovem_timeline' && (
                <div id="linha-tempo-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                    <Clock className="w-7 h-7 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-xl md:text-2xl uppercase tracking-wide font-mono">
                        Sua Linha do Tempo de Trajetória Protetiva
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400 mt-1">
                        Acompanhe todos os marcos e ações coordenadas pelo CRAS Pirapora para assegurar sua permanência escolar e desenvolvimento profissional.
                      </p>
                    </div>
                  </div>

                  <div className="relative border-l-2 border-slate-800 ml-6 pl-8 space-y-10 mt-8 mb-4">
                    
                    {/* Item 1 - Today */}
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-md ring-2 ring-emerald-500/20" />
                      <span className="text-xs md:text-sm text-slate-400 font-mono font-black block mb-1">30 de Maio de 2026</span>
                      <h4 className="text-base md:text-lg font-bold text-white uppercase font-mono">Trajetória Monitorada por "Descubra+"</h4>
                      <p className="text-sm md:text-base text-slate-300 italic font-medium leading-relaxed mt-2.5 text-slate-400">
                        Sua frequência escolar, submissão de microtarefas e engajamento geral no curso protetivo estão sob monitoramento de impacto. Seu perfil está sendo otimizado para matchmaking com vagas de Jovem Aprendiz locais.
                      </p>
                    </div>

                    {/* Item 2 - Social actions on this youth */}
                    {atendimentos.filter(a => a.jovem_id === currentUser.id).map((at) => (
                      <div key={at.id} className="relative">
                        <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-orange-500 border-4 border-slate-950 shadow-md ring-2 ring-orange-500/20" />
                        <span className="text-xs md:text-sm text-slate-400 font-mono font-black block mb-1">{at.data}</span>
                        <h4 className="text-base md:text-lg font-bold text-white uppercase font-mono">Lançado Atendimento: {at.tema}</h4>
                        <p className="text-xs md:text-sm text-slate-400 mt-2 font-mono"><b className="text-slate-300 uppercase">Profissional Responsável:</b> {at.assistente_nome}</p>
                        <p className="text-sm md:text-base text-slate-300 italic mt-3 bg-slate-900 p-4 rounded-xl border border-slate-850 leading-relaxed font-sans shadow-inner">
                          <b className="text-orange-500 uppercase text-[10px] block mb-1.5 font-bold font-mono">Relato de Acompanhamento:</b>
                          "{at.relatorio}"
                        </p>
                        <p className="text-sm text-emerald-400 font-extrabold mt-3.5 flex items-center gap-2 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/40 font-mono">
                          <span>✓ Encaminhamento Ativo:</span>
                          <span className="text-white">{at.encaminhamentos}</span>
                        </p>
                      </div>
                    ))}

                    {/* Base original registration */}
                    <div className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-slate-700 border-4 border-slate-950 shadow-md ring-2 ring-slate-700/20" />
                      <span className="text-xs md:text-sm text-slate-400 font-mono font-black block mb-1">05 de Março de 2026</span>
                      <h4 className="text-base md:text-lg font-bold text-white uppercase font-mono">Inclusão Eletrônica no Programa Descubra Pirapora</h4>
                      <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed mt-2">
                        O jovem foi oficialmente referenciado e incluído na base de monitoramento de evasão escolar do município parceiro com a aplicação dos termos de risco iniciais.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* PORTAL DE REQUERIMENTOS DE ASSISTÊNCIA AO ESTUDANTE */}
              {activeTab === 'jovem_suporte' && (
                <div id="requerimentos-apoio-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                      <HelpCircle className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="font-bold text-white text-xl md:text-2xl uppercase tracking-wide font-mono">
                          Portal de Requerimentos de Apoio (CRAS / Assistência Social)
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 mt-1">
                          Solicite auxílio para superar obstáculos no seu processo de aprendizagem e contratação. Sua solicitação é enviada diretamente ao assistente social responsável.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Form to submit request */}
                      <form onSubmit={handleCriarRequerimentoAjuda} className="md:col-span-6 bg-slate-900/60 p-5 md:p-6 rounded-xl border border-slate-850 space-y-5">
                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest font-mono mb-2 border-l-2 border-emerald-500 pl-2">
                          Novo Requerimento
                        </h4>

                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2 font-mono uppercase tracking-wider">
                            Tipo de Apoio Necessário
                          </label>
                          <select
                            id="select-tipo-ajuda"
                            value={tipoAjuda}
                            onChange={(e) => setTipoAjuda(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-sm p-3.5 text-white rounded-lg font-mono focus:border-emerald-500 font-medium"
                          >
                            <option value="transporte">🚗 Passe / Auxílio Transporte (Passagens para curso/estágio)</option>
                            <option value="alimentacao">🍎 Alimentação / Cesta Básica (Insegurança alimentar na família)</option>
                            <option value="saude_mental">🧠 Apoio à Saúde / Assistência Psicológica (Acolhimento emocional)</option>
                            <option value="material_didatico">📚 Material de Estudo / Vestuário (Cadernos, livros ou uniforme)</option>
                            <option value="outro">⚠️ Outra Urgência Familiar (Descrever detalhadamente)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2 font-mono uppercase tracking-wider">
                            Por que você precisa deste apoio? (Justificativa)
                          </label>
                          <textarea
                            id="textarea-descricao-ajuda"
                            required
                            rows={5}
                            placeholder="Descreva detalhadamente sua necessidade atual e sua situação socioeconômica para avaliação da equipe do CRAS..."
                            value={descricaoAjuda}
                            onChange={(e) => setDescricaoAjuda(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-sm p-4 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition leading-relaxed"
                          />
                        </div>

                        <button
                          id="btn-submit-requerimento"
                          type="submit"
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs md:text-sm font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-950/20"
                        >
                          Enviar Requerimento de Apoio ✓
                        </button>
                      </form>

                      {/* Right: History / Submitted Requests */}
                      <div className="md:col-span-6 space-y-4">
                        <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2">
                          Seus Requerimentos Ativos ({alertas.filter(a => a.jovem_id === currentUser.id && a.tipo === 'Solicitação de Apoio').length})
                        </h4>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {(() => {
                            const userReqs = alertas.filter(a => a.jovem_id === currentUser.id && a.tipo === 'Solicitação de Apoio');
                            if (userReqs.length === 0) {
                              return (
                                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-500 font-mono text-xs">
                                  Nenhum requerimento ativo cadastrado. Se precisar de apoio, preencha o formulário ao lado.
                                </div>
                              );
                            }

                            return userReqs.map((req) => {
                              // Extract type from "[REQ: TYPE]" pattern
                              const typeMatch = req.descricao.match(/^\[REQ: ([^\]]+)\]/);
                              const cleanDesc = req.descricao.replace(/^\[REQ: [^\]]+\]\s*/, '');
                              const displayType = typeMatch ? typeMatch[1].toUpperCase() : 'OUTRO';

                              // Icons & badges depending on status
                              const isResolved = req.status === 'resolvido';
                              const statusColor = isResolved 
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/50' 
                                : req.status === 'em_atendimento' 
                                  ? 'bg-amber-950/80 text-amber-400 border-amber-900/50' 
                                  : 'bg-slate-900/80 text-slate-400 border-slate-800';

                              return (
                                <div key={req.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3 text-xs">
                                  <div className="flex justify-between items-center gap-2 flex-wrap">
                                    <span className="font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/30 text-[10px]">
                                      {displayType}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      Enviado em: <b>{req.data_criado}</b>
                                    </span>
                                  </div>

                                  <p className="text-slate-300 leading-relaxed font-sans text-xs italic">
                                    "{cleanDesc}"
                                  </p>

                                  <div className="pt-2 border-t border-slate-950/50 flex flex-col gap-2">
                                    <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                      <span className="text-[11px] text-slate-500 font-mono font-bold">STATUS DO CRAS:</span>
                                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${statusColor}`}>
                                        {req.status === 'resolvido' ? 'Deferido/Atendido' : req.status === 'em_atendimento' ? 'Em Análise/Social' : 'Aguardando Avaliação'}
                                      </span>
                                    </div>
                                    
                                    {isResolved && (
                                      <div className="bg-emerald-950/30 border border-emerald-900/30 p-2.5 rounded-lg space-y-1">
                                        <span className="block font-sans font-bold text-emerald-400 text-[10px] uppercase tracking-wide">feedback de atendimento social:</span>
                                        <p className="text-slate-300 text-[11px] leading-relaxed">
                                          Sua solicitação foi avaliada e resolvida pela equipe técnica de assistência social municipal de Pirapora-MG.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* DESCUBRA MEI PANEL */}
              {activeTab === 'jovem_descubra_mei' && (
                <div id="descubra-mei-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-900 pb-5">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-emerald-400 animate-pulse" />
                        <div>
                          <h3 className="text-lg md:text-xl font-bold font-sans tracking-tight text-white">
                            Descubra MEI <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900/30 ml-2">Público: 18+ anos</span>
                          </h3>
                          <p className="text-xs text-slate-400 font-sans mt-0.5">
                            Trilha de Empreendedorismo e Gestão Autônoma para o Jovem de Pirapora-MG
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 text-xs text-right">
                        <span className="block text-slate-500 font-mono">SEU SCORE EMPREENDEDOR:</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {(() => {
                            const youth = jovens.find(j => j.id === currentUser.id);
                            return youth ? youth.score_empregabilidade : 0;
                          })()}% APTO
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 mb-6 leading-relaxed text-xs text-slate-300">
                      <p className="mb-2">
                        💡 <b>Por que empreender?</b> A taxa de desemprego juvenil no país é desafiadora, e nem sempre o mercado tradicional garante contratação imediata. O empreendedorismo autônomo (MEI) permite criar as suas próprias oportunidades de renda, prestar serviços na comunidade local e desenvolver autonomia financeira.
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        * Ao iniciar ou concluir qualquer minicurso abaixo, você ganha Pontos de Engajamento para subir de nível e destaque frente a potenciais contratantes!
                      </p>
                    </div>

                    <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-4">Minicursos Disponíveis</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {MEI_COURSES.map((curso) => {
                        const prog = cursosProgresso.find(cp => cp.jovem_id === currentUser.id && cp.curso_id === curso.id);
                        const progressPercent = prog ? prog.progresso_percentual : 0;
                        const status = prog ? prog.status : 'Não Iniciado';

                        let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';
                        if (status === 'Iniciado') badgeColor = 'bg-blue-950/80 text-blue-400 border-blue-900/30';
                        if (status === 'Em Andamento') badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-900/30';
                        if (status === 'Concluido') badgeColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30';

                        return (
                          <div key={curso.id} className="bg-slate-900/70 p-5 rounded-xl border border-slate-850 flex flex-col justify-between hover:border-slate-800/80 transition duration-200">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                <h5 className="font-sans font-bold text-sm text-slate-200">{curso.titulo}</h5>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor} whitespace-nowrap`}>
                                  {status === 'Concluido' ? 'Concluído ✓' : status}
                                </span>
                              </div>
                              
                              <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                                {curso.descricao}
                              </p>

                              <div className="text-xs font-mono text-slate-500 space-y-1 bg-slate-950/35 p-3 rounded-lg border border-slate-900">
                                <div><b className="text-slate-405">CARGA HORÁRIA:</b> {curso.cargaHoraria}</div>
                                <div>
                                  <b className="text-slate-405">TÓPICOS CHAVE:</b>
                                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-400 grid grid-cols-2 gap-x-2 gap-y-0.5">
                                    {curso.conteudo.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-900 space-y-4">
                              {/* Progress bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-slate-500 uppercase font-black">Progresso do Curso:</span>
                                  <span className="text-slate-300 font-bold">{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                                  <div 
                                    className={`h-full transition-all duration-350 ${status === 'Concluido' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <a 
                                  href={curso.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={() => {
                                    if (status === 'Não Iniciado') {
                                      handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Iniciado', 10);
                                    }
                                  }}
                                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition border border-slate-800 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  Estudar Curso Oficial ↗
                                </a>

                                <div className="grid grid-cols-3 gap-1.5">
                                  <button
                                    onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Iniciado', 10)}
                                    disabled={status === 'Concluido'}
                                    className={`py-1 rounded text-[10px] font-mono transition font-bold uppercase border cursor-pointer ${status === 'Iniciado' ? 'bg-blue-900 border-blue-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                                  >
                                    10% (Iniciar)
                                  </button>
                                  <button
                                    onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Em Andamento', 50)}
                                    disabled={status === 'Concluido'}
                                    className={`py-1 rounded text-[10px] font-mono transition font-bold uppercase border cursor-pointer ${status === 'Em Andamento' ? 'bg-amber-900 border-amber-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                                  >
                                    50% (Andamento)
                                  </button>
                                  <button
                                    onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Concluido', 100)}
                                    className={`py-1 rounded text-[10px] font-mono transition font-bold uppercase border cursor-pointer ${status === 'Concluido' ? 'bg-emerald-900 border-emerald-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                                  >
                                    ✓ Concluir (100%)
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* DESCUBRA JOVEM PANEL */}
              {activeTab === 'jovem_descubra_jovem' && (
                <div id="descubra-jovem-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-900 pb-5">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-emerald-400" />
                        <div>
                          <h3 className="text-lg md:text-xl font-bold font-sans tracking-tight text-white">
                            Descubra Jovem <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900/30 ml-2">Público: 14 aos 18 anos</span>
                          </h3>
                          <p className="text-xs text-slate-400 font-sans mt-0.5">
                            Trilha de Desenvolvimento Humano, Pré-Aprendizagem e Cidadania para Jovens de Pirapora-MG
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 text-xs text-right">
                        <span className="block text-slate-500 font-mono">SEU SCORE SOCIAL & NÍVEL:</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {(() => {
                            const youth = jovens.find(j => j.id === currentUser.id);
                            return youth ? `Nível ${youth.nivel} (${youth.pontos_totais} XP)` : 'Nível 1';
                          })()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 mb-6 leading-relaxed text-xs text-slate-300">
                      <p className="mb-2">
                        🌟 <b>Encontre sua direção!</b> Esta trilha é dedicada a jovens em situação de vulnerabilidade, oferecendo capacitação em soft skills (inteligência emocional), matemática aplicada comercial (raciocínio lógico) e direitos de cidadania. Não se perca na vida; construa uma perspectiva para o mercado formal de trabalho e o programa de menor aprendiz local.
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        * Completando os cursos abaixo, seu perfil se posiciona melhor no algoritmo de matchmaking de vagas do coordenador municipal da rede social.
                      </p>
                    </div>

                    <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-4">Trilhas de Apoio Formativas</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {DESCUBRA_JOVEM_COURSES.map((curso) => {
                        const prog = cursosProgresso.find(cp => cp.jovem_id === currentUser.id && cp.curso_id === curso.id);
                        const progressPercent = prog ? prog.progresso_percentual : 0;
                        const status = prog ? prog.status : 'Não Iniciado';

                        let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';
                        if (status === 'Iniciado') badgeColor = 'bg-blue-950/80 text-blue-400 border-blue-900/30';
                        if (status === 'Em Andamento') badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-900/30';
                        if (status === 'Concluido') badgeColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30';

                        return (
                          <div key={curso.id} className="bg-slate-900/70 p-5 rounded-xl border border-slate-850 flex flex-col justify-between hover:border-slate-800/80 transition duration-200">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                <h5 className="font-sans font-bold text-sm text-slate-200">{curso.titulo}</h5>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor} whitespace-nowrap`}>
                                  {status === 'Concluido' ? 'Concluído ✓' : status}
                                </span>
                              </div>
                              
                              <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                                {curso.descricao}
                              </p>

                              <div className="text-xs font-mono text-slate-500 space-y-1 bg-slate-950/35 p-3 rounded-lg border border-slate-900">
                                <div><b className="text-slate-405">CARGA HORÁRIA:</b> {curso.cargaHoraria}</div>
                                <div>
                                  <b className="text-slate-405">TÓPICOS FORMATIVOS:</b>
                                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-400 grid grid-cols-2 gap-x-2 gap-y-0.5">
                                    {curso.conteudo.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-900 space-y-4">
                              {/* Progress bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-slate-500 uppercase font-black">Progresso do Curso:</span>
                                  <span className="text-slate-300 font-bold">{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                                  <div 
                                    className={`h-full transition-all duration-350 ${status === 'Concluido' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <a 
                                  href={curso.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={() => {
                                    if (status === 'Não Iniciado') {
                                      handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Iniciado', 10);
                                    }
                                  }}
                                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition border border-slate-800 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  Estudar Curso Oficial ↗
                                </a>

                                <div className="grid grid-cols-3 gap-1.5">
                                  <button
                                    onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Iniciado', 10)}
                                    disabled={status === 'Concluido'}
                                    className={`py-1 rounded text-[10px] font-mono transition font-bold uppercase border cursor-pointer ${status === 'Iniciado' ? 'bg-blue-900 border-blue-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                                  >
                                    10% (Iniciar)
                                  </button>
                                  <button
                                    onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Em Andamento', 50)}
                                    disabled={status === 'Concluido'}
                                    className={`py-1 rounded text-[10px] font-mono transition font-bold uppercase border cursor-pointer ${status === 'Em Andamento' ? 'bg-amber-900 border-amber-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                                  >
                                    50% (Andamento)
                                  </button>
                                  <button
                                    onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Concluido', 100)}
                                    className={`py-1 rounded text-[10px] font-mono transition font-bold uppercase border cursor-pointer ${status === 'Concluido' ? 'bg-emerald-900 border-emerald-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                                  >
                                    ✓ Concluir (100%)
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* COORD_CURSOS PANEL */}
              {activeTab === 'coord_cursos' && (
                <div id="coord-cursos-card" className="col-span-12 max-w-6xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl space-y-6">
                  <div className="border-b border-slate-900 pb-5">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="text-lg md:text-xl font-bold font-sans tracking-tight text-white">
                          Acompanhamento de Minicursos (Módulos Descubra)
                        </h3>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          Monitore o progresso de empreendedorismo (Descubra MEI) e cidadania (Descubra Jovem) dos estudantes de Pirapora-MG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* High Level Stats widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-mono block font-black uppercase tracking-wider">Trilhas de Cursos Iniciadas</span>
                      <span className="text-2xl font-bold font-mono text-white mt-1 block">
                        {cursosProgresso.length}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Matrículas ativas na plataforma</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-mono block font-black uppercase tracking-wider">Cursos Concluídos (100%)</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                        {cursosProgresso.filter(cp => cp.status === 'Concluido').length}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Com emissão automática de distintivos e XP</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-mono block font-black uppercase tracking-wider">Estudante mais engajado</span>
                      <span className="text-base font-bold text-yellow-400 mt-1 block truncate">
                        {(() => {
                          if (cursosProgresso.length === 0) return 'Nenhum progresso registrado';
                          // Count completions per user
                          const counts: { [key: string]: { nome: string; count: number } } = {};
                          cursosProgresso.forEach(p => {
                            if (!counts[p.jovem_id]) counts[p.jovem_id] = { nome: p.jovem_nome, count: 0 };
                            counts[p.jovem_id].count += 1;
                          });
                          const array = Object.values(counts);
                          if (array.length === 0) return 'Nenhum';
                          array.sort((a, b) => b.count - a.count);
                          return `${array[0].nome} (${array[0].count} módulos)`;
                        })()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Líder de engajamento escolar</span>
                    </div>
                  </div>

                  {/* Filter and search bar */}
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                    <div className="w-full md:w-1/3 relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar aluno por nome..."
                        value={cursosSearch}
                        onChange={(e) => setCursosSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-10 pr-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-1">Filtrar Categoria</label>
                        <select
                          value={cursosFilterCategoria}
                          onChange={(e) => setCursosFilterCategoria(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-350 text-xs rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="Todos">Todas as Categorias</option>
                          <option value="MEI">Descubra MEI</option>
                          <option value="Descubra Jovem">Descubra Jovem</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-1">Filtrar Status</label>
                        <select
                          value={cursosFilterStatus}
                          onChange={(e) => setCursosFilterStatus(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-350 text-xs rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="Todos">Todos os Status</option>
                          <option value="Iniciado">Iniciado</option>
                          <option value="Em Andamento">Em Andamento</option>
                          <option value="Concluido">Concluído</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Progress Table */}
                  <div className="bg-slate-900/60 rounded-xl border border-slate-850 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 text-[10px] font-mono tracking-widest uppercase">
                            <th className="p-4">Estudante</th>
                            <th className="p-4">Categoria / Trilha</th>
                            <th className="p-4">Curso Selecionado</th>
                            <th className="p-4">Progresso Geral</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Última Interação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                          {(() => {
                            const filtered = cursosProgresso.filter(cp => {
                              const matchSearch = cp.jovem_nome.toLowerCase().includes(cursosSearch.toLowerCase());
                              const matchCat = cursosFilterCategoria === 'Todos' || cp.categoria === cursosFilterCategoria;
                              const matchStat = cursosFilterStatus === 'Todos' || cp.status === cursosFilterStatus;
                              return matchSearch && matchCat && matchStat;
                            });

                            if (filtered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="text-center py-12 text-slate-500 font-mono italic">
                                    Nenhuma evolução ou andamento de curso registrada no filtro selecionado.
                                  </td>
                                </tr>
                              );
                            }

                            return filtered.map((cp) => {
                              let catBadge = 'bg-blue-950/60 text-blue-400 border-blue-900/30';
                              if (cp.categoria === 'MEI') catBadge = 'bg-purple-950/60 text-purple-400 border-purple-900/30';

                              let statBadge = 'bg-slate-950 text-slate-400 border-slate-900';
                              if (cp.status === 'Iniciado') statBadge = 'bg-blue-950/85 text-blue-400 border-blue-900/30';
                              if (cp.status === 'Em Andamento') statBadge = 'bg-amber-950 text-amber-400 border-amber-900/30';
                              if (cp.status === 'Concluido') statBadge = 'bg-emerald-950 text-emerald-400 border-emerald-900/30';

                              return (
                                <tr key={cp.id} className="hover:bg-slate-900/40 transition">
                                  <td className="p-4 font-bold text-white">{cp.jovem_nome}</td>
                                  <td className="p-4">
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${catBadge}`}>
                                      {cp.categoria === 'MEI' ? 'Descubra MEI' : 'Descubra Jovem'}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono font-bold text-slate-250">{cp.curso_titulo}</td>
                                  <td className="p-4 w-44">
                                    <div className="space-y-1">
                                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                                        <span>PROGRESSO:</span>
                                        <span className="font-bold text-slate-300">{cp.progresso_percentual}%</span>
                                      </div>
                                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                        <div 
                                          className={`h-full ${cp.status === 'Concluido' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                          style={{ width: `${cp.progresso_percentual}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${statBadge}`}>
                                      {cp.status === 'Concluido' ? 'Concluído ✓' : cp.status}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-[11px] text-slate-500">{cp.data_atualizacao}</td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}


          {/* ========================================================================================= */}
          {/* 3. DYNAMICAL COMPANY DASHBOARD VIEW */}
          {/* ========================================================================================= */}
          {activeTab.startsWith('empresa_') && (
            <div className="space-y-6" id="tab-company">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* CREATE VAGA REGISTRATION FORM */}
                {activeTab === 'empresa_publicar' && (
                  <div id="publicar-vaga-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                      <Plus className="w-7 h-7 text-emerald-400" />
                      <div>
                        <h3 className="font-bold text-white text-lg md:text-xl uppercase tracking-wide font-mono">
                          Lançar Nova Oportunidade Jovem Aprendiz
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 mt-1">Publique uma vaga corporativa no sistema para que o algoritmo de matchmaking identifique instantaneamente jovens elegíveis pelo critério de proximidade.</p>
                      </div>
                    </div>

                    <form onSubmit={handleCriarVaga} className="space-y-6 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Título Atrativo da Vaga</label>
                          <input 
                            id="input-vaga-titulo"
                            type="text" 
                            required
                            placeholder="Ex: Aprendiz em Automação Industrial, Auxiliar de Almoxarifado"
                            value={newVaga.titulo}
                            onChange={(e) => setNewVaga({...newVaga, titulo: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm text-slate-400 font-semibold mb-2 font-mono text-emerald-400 uppercase tracking-wider">Habilidades Desejadas (separadas por vírgula)</label>
                          <input 
                            id="input-vaga-habilidades"
                            type="text" 
                            placeholder="Ex: Informática Básica, Excel, Trabalho em Equipe, Organização"
                            value={newVaga.habilidades}
                            onChange={(e) => setNewVaga({...newVaga, habilidades: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Quantidade de Vagas Oferecidas</label>
                          <input 
                            id="input-vaga-qtd"
                            type="number"
                            min="1"
                            required
                            value={newVaga.quantidade}
                            onChange={(e) => setNewVaga({...newVaga, quantidade: parseInt(e.target.value) || 1})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3 text-white rounded-lg font-mono font-bold focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Cidade Sede da Atividade</label>
                          <select 
                            id="select-vaga-cidade"
                            value={newVaga.cidade}
                            onChange={(e) => setNewVaga({...newVaga, cidade: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3 text-white rounded-lg font-mono font-medium focus:border-emerald-500 focus:outline-none">
                            <option value="Pirapora">Pirapora (MG)</option>
                            <option value="Buritizeiro">Buritizeiro (MG)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2 font-mono">Bairro Polo da Unidade</label>
                          <select 
                            id="select-vaga-bairro"
                            value={newVaga.bairro}
                            onChange={(e) => setNewVaga({...newVaga, bairro: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3 text-white rounded-lg font-mono font-medium">
                            <option value="Industrial">Bairro Industrial</option>
                            <option value="Centro">Centro</option>
                            <option value="Santo Antônio">Santo Antônio</option>
                            <option value="Planalto">Planalto</option>
                            <option value="São Geraldo">São Geraldo</option>
                            <option value="Vila Rica">Vila Rica</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Requisitos e Instruções Finais</label>
                          <textarea 
                            id="input-vaga-requisitos"
                            required
                            rows={3}
                            placeholder="Ex: Ensino Médio em andamento, preferencialmente morar na região do Santo Antônio ou Centro..."
                            value={newVaga.requisitos}
                            onChange={(e) => setNewVaga({...newVaga, requisitos: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3.5 text-white rounded-lg focus:border-emerald-500 focus:outline-none h-20 resize-none leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2 font-mono">Descrição Breve das Tarefas</label>
                          <textarea
                            id="input-vaga-descricao"
                            required
                            rows={3}
                            placeholder="Ex: Atuar na gerência administrativa local, auxiliar no controle de planilhas e atendimento geral..."
                            value={newVaga.descricao}
                            onChange={(e) => setNewVaga({...newVaga, descricao: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm p-3.5 text-white rounded-lg focus:border-emerald-500 focus:outline-none h-20 resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Assinatura da Empresa Parceira</label>
                        <select 
                          id="select-vaga-empresa"
                          value={newVaga.empresa_id}
                          onChange={(e) => setNewVaga({...newVaga, empresa_id: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 text-sm p-3 text-white rounded-lg font-mono font-medium">
                          <option value="empresa-1">Minas Ligas S.A. (Metalurgia/Logística)</option>
                          <option value="empresa-2">Liasa S.A. (Produção de Silício Metálico)</option>
                          <option value="empresa-3">Comercial Pirapora Ltda (Comércio/Varejo)</option>
                        </select>
                      </div>

                      <button 
                        id="btn-criar-vaga"
                        type="submit" 
                        className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm md:text-base transition uppercase font-mono tracking-wider shadow-lg shadow-emerald-900/30 cursor-pointer">
                        Lançar Oportunidade no Barramento Descubra ✓
                      </button>
                      
                    </form>
                  </div>
                )}

                {/* INTERACTIVE ALGORITHM MATCHMAKING RESULT DESK (COMPANY DEMO) */}
                {(activeTab === 'empresa_vagas' || activeTab === 'empresa_match') && (
                  <div id="matchmaking-inteligente-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                        <Compass className="w-7 h-7 text-emerald-400 animate-spin-slow" />
                        <div>
                          <h3 className="font-bold text-white text-xl md:text-2xl uppercase tracking-wide font-mono">
                            Algoritmo de Compatibilidade da Vaga (Matchmaking Municipal)
                          </h3>
                          <p className="text-xs md:text-sm text-slate-400 mt-1">
                            Sugestões automatizadas refinadas por inteligência geográfica: prioriza o menor custo de deslocamento urbano e proximidade do CRAS correspondente.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {vagas.map((v) => {
                          // Find young candidate suggestions for this vacancy
                          return (
                            <div key={v.id} className="bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-850 shadow-inner">
                              <div className="flex justify-between items-start mb-4 border-b border-slate-950 pb-3 flex-wrap gap-2">
                                <div>
                                  <span className="text-xs uppercase font-extrabold text-emerald-400 font-mono bg-emerald-950 px-3 py-1 rounded">
                                    {v.empresa_nome} (Polo da vaga: {v.bairro})
                                  </span>
                                  <h4 className="text-base md:text-lg font-bold text-white mt-2.5 uppercase font-mono">{v.titulo}</h4>
                                </div>
                                <span className="text-xs md:text-sm text-slate-400 font-mono font-bold bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">Qtd Autorizada: {v.quantidade}</span>
                              </div>

                              {/* MATCH SUGGESTIONS LIST PANEL */}
                              <div className="space-y-4 mt-4">
                                <span className="block text-xs text-slate-400 font-black uppercase font-mono tracking-wider">Aptidões e Proximidades Calculadas:</span>
                                
                                {jovens.filter(j => j.status !== 'aprendiz_contratado').map((j) => {
                                  // Calculate simple matching metric in frontend for visualizer
                                  const distBonus = getProximityBonus(j.bairro, v.bairro);
                                  
                                  // Base Match calculation logic representing algorithm
                                  let pct = 60;
                                  if (j.bairro === v.bairro) pct += 25;
                                  if (j.score_empregabilidade > 65) pct += 10;
                                  if (j.frequencia > 80) pct += 5;

                                  return (
                                    <div key={j.id} className="bg-slate-950 p-4 md:p-5 rounded-lg border border-slate-850 flex flex-col transition hover:border-emerald-600/40">
                                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="font-extrabold text-white text-base md:text-lg">{j.nome}</span>
                                            <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-md font-mono font-bold tracking-wider ${distBonus.bg}`}>
                                              {distBonus.text}
                                            </span>
                                            <span className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono text-slate-400">
                                              {j.idade} anos | {j.genero}
                                            </span>
                                          </div>
                                          <p className="text-sm text-slate-400 font-mono mt-2 leading-relaxed">
                                            Bairro Residência: <b className="text-slate-300 font-bold">{j.bairro}</b> | Frequência Escolar: <b className="text-slate-300 font-bold">{j.frequencia}%</b> | Score Ativo: <b className="text-emerald-400 font-mono font-black">{j.score_empregabilidade} pts</b>
                                          </p>
                                        </div>

                                        {/* MATCH EMBLEM SCORE */}
                                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-0 border-slate-900 pt-3 sm:pt-0">
                                          <div className="text-left sm:text-right">
                                            <span className="block text-emerald-400 font-mono font-black text-base md:text-lg">{pct}% Match</span>
                                            <span className="text-[10px] text-slate-500 font-mono italic">Prioridade Algorítmica</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button 
                                              type="button"
                                              onClick={() => setExpandedMatchJovemId(expandedMatchJovemId === j.id ? null : j.id)}
                                              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-800">
                                              <span>{expandedMatchJovemId === j.id ? 'Ocultar Ficha ▴' : 'Analisar Perfil ▾'}</span>
                                            </button>
                                            <button 
                                              id={`btn-hire-${j.id}-vaga-${v.id}`}
                                              onClick={() => handleContratarJovemMatch(j.id, v.id, 'contratado')}
                                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs text-white rounded-lg font-black font-mono tracking-wider transition uppercase shadow-md shadow-emerald-950/20 cursor-pointer">
                                              Contratar ✓
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* EXPANDABLE PROFILE DETAILS INTERESTING FOR CORPORATE SELECTION */}
                                      {expandedMatchJovemId === j.id && (
                                        <div className="mt-4 pt-4 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                          
                                          {/* COL 1: FORMAÇÃO & LEALDADE ESCOLAR */}
                                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900/80 space-y-3">
                                            <h5 className="font-extrabold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-950/60 pb-2">
                                              <School className="w-4 h-4 text-emerald-400" />
                                              Academias & Assiduidade
                                            </h5>
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                                <span className="text-slate-500">Escolaridade:</span>
                                                <span className="text-slate-200 font-semibold">{j.escolaridade}</span>
                                              </div>
                                              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                                <span className="text-slate-500">Frequência Escolar:</span>
                                                <span className={`font-black ${j.frequencia >= 85 ? 'text-emerald-400' : j.frequencia >= 75 ? 'text-amber-400' : 'text-red-400'}`}>{j.frequencia}%</span>
                                              </div>
                                              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                                <span className="text-slate-500">Rendimento Pedagógico:</span>
                                                <span className="text-slate-200 uppercase font-bold text-xs">{j.desempenho === 'bom' ? 'Excelente ✓' : j.desempenho === 'regular' ? 'Regular ⚠' : 'Requer Reforço 🗇'}</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* COL 2: EMPREGABILIDADE & ENGAJAMENTO SOCIAL */}
                                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900/80 space-y-3">
                                            <h5 className="font-extrabold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-950/60 pb-2">
                                              <Award className="w-4 h-4 text-emerald-400" />
                                              Desempenho & Preparação
                                            </h5>
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                                <span className="text-slate-500">Score de Empregabilidade:</span>
                                                <span className="text-emerald-400 font-extrabold font-mono">{j.score_empregabilidade} pts</span>
                                              </div>
                                              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                                <span className="text-slate-500">Participação Social:</span>
                                                <span className="text-white font-mono">{j.score_engajamento} pts</span>
                                              </div>
                                              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                                                <span className="text-slate-500">Pontuação Total:</span>
                                                <span className="text-amber-400 font-bold font-mono">{j.pontos_totais} pts (Nível {j.nivel})</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* COL 3: BENEFÍCIOS CORPORATIVOS & CONQUISTAS */}
                                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900/80 space-y-3 flex flex-col justify-between">
                                            <div>
                                              <h5 className="font-extrabold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-950/60 pb-2 mb-2">
                                                <Coins className="w-4 h-4 text-emerald-400" />
                                                Impacto Social & ESG
                                              </h5>
                                              <p className="text-slate-400 text-xs leading-relaxed">
                                                <b>ESG Benefício Legal:</b> Jovem referenciado pelo CRAS ({j.vulnerabilidade_tipo}). Admissão facilita redução fiscal indireta e pontua em responsabilidade corporativa.
                                              </p>
                                            </div>

                                            <div className="space-y-1.5 border-t border-slate-950/70 pt-2">
                                              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-extrabold">Qualificações / Badges:</p>
                                              <div className="flex flex-wrap gap-1">
                                                {j.badges && j.badges.length > 0 ? (
                                                  j.badges.map((bgName) => (
                                                    <span key={bgName} className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                                                      {bgName}
                                                    </span>
                                                  ))
                                                ) : (
                                                  <>
                                                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 text-[10px] px-2 py-0.5 rounded font-mono font-bold">Resiliente</span>
                                                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 text-[10px] px-2 py-0.5 rounded font-mono font-bold">Assíduo</span>
                                                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 text-[10px] px-2 py-0.5 rounded font-mono font-bold">Microtarefas Ok</span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* ACTION FOOTER INSIDE DETAIL */}
                                          <div className="md:col-span-3 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 p-3 rounded-lg border border-slate-900 gap-3 text-xs font-mono">
                                            <div className="text-slate-400">
                                              <b>Dica Algorítmica:</b> {distBonus.text === 'Vizinho Próximo' || j.bairro === v.bairro ? 'Reside no mesmo polo geográfico da vaga, resultando em menor passaporte de vale-transporte e cansaço de trânsito.' : 'Excelente aderência escolar, o que mitiga ausências ou atrasos no cumprimento do estágio regulamentado.'}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => setInfoJovemModal(j)}
                                              className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1 shrink-0 p-1 px-2.5 rounded hover:bg-slate-900 cursor-pointer text-xs">
                                              <FileText className="w-3.5 h-3.5" />
                                              Ficha Completa
                                            </button>
                                          </div>

                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}


          {/* ========================================================================================= */}
          {/* 4. ASSISTENTE SOCIAL (CRAS DE PIRAPORA) ACCION PANEL */}
          {/* ========================================================================================= */}
          {activeTab.startsWith('social_') && (
            <div className="space-y-6" id="tab-social-assistant">
              
              <div className="grid grid-cols-1 gap-6">

                {activeTab === 'social_fila' && (
                  <div id="fila-alertas-sos-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4 text-red-500">
                      <ShieldAlert className="w-8 h-8 animate-pulse text-red-500" />
                      <div>
                        <h3 className="font-bold text-white text-xl md:text-2xl uppercase tracking-wide font-mono">
                          Fila de Emergências Sociais CRAS / CREAS (Pirapora)
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 mt-1">
                          Acompanhamento ativo e intervenção de urgência para jovens identificados com risco altíssimo de evasão escolar pelo modelo preditivo municipal.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed font-sans">
                      Abaixo estão as ocorrências em andamento geradas por faltas consecutivas ou redução súbita de frequência no Descubra!. Recomenda-se visita domiciliar imediata e registro permanente na evolução social do jovem:
                    </p>
 
                    <div className="space-y-5">
                      {alertas.length > 0 ? (
                        alertas.map((a) => {
                          let statusLogo = 'bg-red-950 text-red-400 border-red-900';
                          if (a.status === 'resolvido') statusLogo = 'bg-emerald-950 text-emerald-400 border-emerald-900';
                          else if (a.status === 'em_atendimento') statusLogo = 'bg-amber-950 text-amber-400 border-amber-900';
 
                          return (
                            <div key={a.id} className="bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-850 shadow-inner flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black font-mono uppercase border tracking-wider ${statusLogo}`}>
                                    {a.status.toUpperCase()}
                                  </span>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-base md:text-lg font-black text-white font-mono">{a.jovem_nome} (<span className="text-slate-400">{a.jovem_bairro}</span>)</h4>
                                    <a 
                                      href={`https://wa.me/55${(() => {
                                        const jComp = jovens.find(j => j.id === a.jovem_id);
                                        return jComp?.telefone || '38999812345';
                                      })()}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={`Conversar com ${a.jovem_nome} no WhatsApp`}
                                      className="shrink-0 flex items-center justify-center w-7 h-7 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-500/20 shadow-sm cursor-pointer"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400 hover:text-inherit" />
                                    </a>
                                  </div>
                                </div>
                                <span className="block text-xs text-slate-500 font-mono mt-1.5 font-bold">
                                  Data de Notificação: {a.data_criado} • WhatsApp: <span className="text-slate-300 font-bold">{(() => {
                                    const jComp = jovens.find(j => j.id === a.jovem_id);
                                    const rawPhone = jComp?.telefone || '38999812345';
                                    return `(38) ${rawPhone.replace(/^38/, '').replace(/^(\d{5})(\d{4})$/, '$1-$2')}`;
                                  })()}</span>
                                </span>
                                
                                <p className="text-sm md:text-base text-slate-300 italic mt-3 bg-slate-950 p-4 rounded-xl border border-slate-850 max-w-none">
                                  <b className="text-red-400 uppercase text-xs font-bold font-mono tracking-wider block mb-1">Gatilho de Risco Identificado:</b>
                                  "{a.descricao}"
                                </p>
                              </div>
 
                              {a.status !== 'resolvido' ? (
                                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0 items-stretch md:items-end justify-center pt-2 md:pt-0">
                                  <button 
                                    id={`btn-act-atendimento-${a.id}`}
                                    onClick={() => {
                                      setNewAtendimento({
                                        jovem_id: a.jovem_id,
                                        tema: `Visita Emergencial - ${a.tipo}`,
                                        relatorio: `Efetuado acolhimento emergencial na residência do bairro ${a.jovem_bairro}. `,
                                        encaminhamentos: 'Registrar vale-transporte solidário ou encaminhar auxílio.'
                                      });
                                      showToast(`Preenchendo ação emergencial para ${a.jovem_nome}`);
                                    }}
                                    className="text-xs md:text-sm font-black font-mono px-4 py-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-slate-300 hover:text-orange-400 transition cursor-pointer text-center">
                                    Tratar no Relatório ✓
                                  </button>
                                  <button 
                                    id={`btn-resolve-alert-${a.id}`}
                                    onClick={() => handleResolverAlerta(a.id)}
                                    className="text-xs md:text-sm font-black font-mono px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer transition text-center shadow-lg shadow-emerald-950/20 uppercase tracking-wide">
                                    Acolher e Deferir
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2 items-center text-sm md:text-base text-emerald-400 font-mono tracking-wide bg-emerald-950/30 p-3 rounded-lg border border-emerald-900 px-4">
                                  <Check className="w-5 h-5 text-emerald-400" />
                                  <span className="font-bold">Ação realizada com sucesso!</span>
                                </div>
                              )}
 
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm md:text-base text-slate-500 py-10 text-center italic font-mono bg-slate-900/40 rounded-xl border border-slate-850">Parabéns! Nenhuma denúncia ou sinalização de evasão pendente no município de Pirapora.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* REGISTER ATENDIMENTO SOCIAL PANEL */}
                {activeTab === 'social_registrar' && (
                  <div id="registrar-atendimento-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                      <FileText className="w-7 h-7 text-emerald-400" />
                      <div>
                        <h3 className="font-bold text-white text-lg md:text-xl uppercase tracking-wide font-mono">
                          Registrar Atendimento do CRAS (Evolução Social)
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 mt-1">
                          Ligue visitas comunitárias, de acolhimento preventivo, e evoluções de assistência técnica diretamente no histórico socioassistencial do jovem.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleRegistrarAtendimento} className="space-y-6 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-400">Selecionar Jovem Referenciado</label>
                          <select 
                            id="select-atendimento-jovem"
                            value={newAtendimento.jovem_id}
                            onChange={(e) => setNewAtendimento({...newAtendimento, jovem_id: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm md:text-base p-4 text-white rounded-xl font-mono focus:border-emerald-500 focus:outline-none font-medium shadow-inner">
                            {jovens.map(j => (
                              <option key={j.id} value={j.id}>{j.nome} ({j.bairro} - {j.cidade})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-400">Tema / Categoria do Registro</label>
                          <select 
                            id="select-atendimento-tema"
                            value={newAtendimento.tema}
                            onChange={(e) => setNewAtendimento({...newAtendimento, tema: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 text-sm md:text-base p-4 text-white rounded-xl focus:border-emerald-500 focus:outline-none font-medium shadow-inner">
                            <option value="Acompanhamento de Rotina">Acompanhamento de Rotina do Descubra</option>
                            <option value="Visita Domiciliar Preventiva">Visita Domiciliar Preventiva CRAS</option>
                            <option value="Denúncia de Trabalho Infantil">Denúncia de Exploração / Trabalho Infantil</option>
                            <option value="Suporte Psicológico Extremo">Suporte e Acolhimento Psicológico Extremo</option>
                            <option value="Auxílio Alimentação Liberado">Emissão de Auxílio Alimentação/Ponte</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-400">Parecer e Relatório Social Detalhado</label>
                        <textarea 
                          id="input-atendimento-relatorio"
                          required
                          rows={5}
                          placeholder="Digite os fatos socioeconômicos observados, conversas com os responsáveis e parecer do assistente municipal para a ficha permanente do jovem do Programa Descubra!..."
                          value={newAtendimento.relatorio}
                          onChange={(e) => setNewAtendimento({...newAtendimento, relatorio: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 text-sm md:text-base p-4 text-white rounded-xl focus:border-emerald-500 focus:outline-none h-36 resize-none leading-relaxed shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-400">Encaminhamentos Imediatos / Próximos Passos Coordenados</label>
                        <input 
                          id="input-atendimento-encaminhamentos"
                          type="text" 
                          required
                          placeholder="Ex: Encaminhar para curso técnico SENAI, deferir passes VT, acionar Bolsa Família municipal"
                          value={newAtendimento.encaminhamentos}
                          onChange={(e) => setNewAtendimento({...newAtendimento, encaminhamentos: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 text-sm md:text-base p-4 text-white rounded-xl focus:border-emerald-500 focus:outline-none font-medium shadow-inner"
                        />
                      </div>

                      <button 
                        id="btn-salvar-atendimento"
                        type="submit" 
                        className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-base md:text-lg transition uppercase font-mono tracking-wider shadow-lg shadow-emerald-950/30 cursor-pointer border border-emerald-500/20">
                        Registrar Ficha Socioassistencial do Jovem na Rede ✓
                      </button>
                    </form>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </main>

      {/* FOOTER CO-DESIGN */}
      <footer className="border-t border-slate-800 py-6 mt-8 bg-slate-950 text-xs text-center text-slate-500">
        <div className="w-full max-w-none px-4 lg:px-8 xl:px-12 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 Plataforma Trajetória Descubra+. Desenvolvido para o Hackathon Municipal de Pirapora-MG.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span className="hover:text-emerald-400 cursor-help">Contatos do CRAS: Santo Antônio</span>
            <span>•</span>
            <span className="hover:text-emerald-400 cursor-help font-semibold">Parceria: Minas Ligas / Liasa S.A.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
