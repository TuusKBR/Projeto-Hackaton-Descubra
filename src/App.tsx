import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { apiService } from './services/api';
import { Jovem, Alerta, Vaga, AcompanhamentoSocial, ProgressoCurso } from './types';
import { calcularRisco } from './utils/calculadoraRisco';

// Imported modular components
import LoginScreen from './components/LoginScreen';
import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import YouthPortal from './pages/YouthPortal';
import CompanyDashboard from './pages/CompanyDashboard';
import SocialAssistantDashboard from './pages/SocialAssistantDashboard';
import StudentModals from './components/StudentModals';

export default function App() {
  // Roles: 'coordenador' | 'jovem' | 'empresa' | 'assistente_social'
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('descubra_current_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      id: 'user-coord',
      nome: 'Carlos Mendes',
      tipo: 'coordenador',
      bairro: 'Centro',
      cidade: 'Pirapora',
      email: 'coordenador@descubra.com'
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('descubra_is_logged_in') === 'true';
  });

  // State synchronization with localStorage
  useEffect(() => {
    localStorage.setItem('descubra_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('descubra_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Set title and favicon dynamically matching the green compass theme
  useEffect(() => {
    document.title = 'Trajetória Descubra+ | Portal de Inclusão';
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolygon points='16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76'%3E%3C/polygon%3E%3C/svg%3E";
  }, []);

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
  const [dbStats, setDbStats] = useState<any>(null);
  const [cursosProgresso, setCursosProgresso] = useState<ProgressoCurso[]>([]);

  // Search, filtration and paging states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBairro, setFilterBairro] = useState('Todos');
  const [filterRisco, setFilterRisco] = useState('Todos');
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('descubra_active_tab') || 'coord_geral';
  });

  useEffect(() => {
    localStorage.setItem('descubra_active_tab', activeTab);
  }, [activeTab]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Student (Coordenador) registration form state
  const [newJovem, setNewJovem] = useState({
    nome: '',
    idade: 16,
    data_nasc: '2010-04-18',
    genero: 'Masculino',
    raca: 'Pardo',
    telefone: '38999812345',
    cpf: '123.456.789-01',
    bairro: 'Santo Antônio',
    cidade: 'Pirapora',
    escolaridade: '9º Ano - Escola Municipal Santo Antônio',
    frequencia: 90,
    faltas_consecutivas: 0,
    desempenho: 'bom' as const,
    vulnerabilidade_tipo: 'Nenhuma',
    renda_familiar: 1200,
    status: 'pré-aprendizagem' as const,
    possui_mei: false,
    problemas_familiares: 'Não relatado',
    problema_fisico_saude: 'Não relatado',
    percepcao_familia_obs: 'Nenhuma observação complementar registrada.'
  });

  // CSV Import State
  const [csvText, setCsvText] = useState('');

  // Social referral popup modal states
  const [isEncaminharModalOpen, setIsEncaminharModalOpen] = useState(false);
  const [encaminharJovemId, setEncaminharJovemId] = useState('');
  const [encaminharMotivo, setEncaminharMotivo] = useState('');
  const [encaminharTipo, setEncaminharTipo] = useState('Evasão Escolar');
  const [encaminharGravidade, setEncaminharGravidade] = useState<'baixo' | 'medio' | 'alto'>('medio');

  // New Case Report State (Assistente Social)
  const [newAtendimento, setNewAtendimento] = useState({
    jovem_id: '',
    alerta_id: '',
    tema: 'Acompanhamento de Rotina',
    relatorio: '',
    encaminhamentos: ''
  });

  // New Job Vacancy State (Company)
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

  // Help Request (Jovem) States
  const [tipoAjuda, setTipoAjuda] = useState('Insegurança Alimentar');
  const [descricaoAjuda, setDescricaoAjuda] = useState('');

  // Course sub tabs states
  const [cursosSubTab, setCursosSubTab] = useState<'alunos' | 'lista'>('alunos');
  const [cursosSearch, setCursosSearch] = useState('');
  const [cursosFilterCategoria, setCursosFilterCategoria] = useState('Todos');
  const [cursosFilterStatus, setCursosFilterStatus] = useState('Todos');
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<'Iniciado' | 'Em Andamento' | 'Concluido'>('Iniciado');
  const [editingPercent, setEditingPercent] = useState<number>(0);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Selected Youth simulated profile picker state
  const [selectedJovemId, setSelectedJovemId] = useState('00000000-0000-0000-b000-000000000001');

  // Detailed profile summary pop up modal state
  const [infoJovemModal, setInfoJovemModal] = useState<Jovem | null>(null);

  // Toast notifier
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Initial Data loader hook
  const loadAllData = async () => {
    try {
      setLoading(true);
      const resJovens = await apiService.getJovens();
      const resAlertas = await apiService.getAlertas();
      const resVagas = await apiService.getVagas();
      const resAtendimentos = await apiService.getAtendimentos();
      const resStats = await apiService.getEstatisticasDashboard();
      const resCursos = await apiService.getCursosProgresso();

      setJovens(resJovens);
      setAlertas(resAlertas.filter(a => a.status === 'pendente' || a.status === 'em_atendimento'));
      setVagas(resVagas);
      setAtendimentos(resAtendimentos);
      setDbStats(resStats);
      setCursosProgresso(resCursos);

      // Pre-select first child for forms
      if (resJovens.length > 0) {
        setNewAtendimento(prev => ({
          ...prev,
          jovem_id: prev.jovem_id || resJovens[0].id
        }));
      }
    } catch (e) {
      showToast('Falha crítica ao ler base simulada.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  // Reseta o scroll para o topo ao trocar de sistema, fazer login ou mudar de aba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isLoggedIn, activeTab, currentUser.tipo]);

  // Handle role switching mapping
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
    } else if (role === 'assistente_social') {
      setCurrentUser({
        id: 'user-social',
        nome: 'Ana Paula Silva',
        tipo: 'assistente_social',
        bairro: 'Centro',
        cidade: 'Pirapora',
        email: 'anapaula.cras@pirapora.mg.gov.br'
      });
      setActiveTab('social_fila');
    } else if (role === 'empresa') {
      setCurrentUser({
        id: 'user-empresa',
        nome: 'AeroMinas Ligas',
        tipo: 'empresa',
        bairro: 'Industrial',
        cidade: 'Pirapora',
        email: 'rh@minasligas.com.br'
      });
      setActiveTab('empresa_match');
    } else if (role === 'jovem') {
      const activeYouth = jovens.find(j => j.id === selectedJovemId) || jovens[0] || {
        id: '00000000-0000-0000-b000-000000000001',
        nome: 'João Victor Mendes'
      };
      setCurrentUser({
        id: activeYouth.id,
        nome: activeYouth.nome,
        tipo: 'jovem',
        bairro: activeYouth.bairro || 'Santo Antônio',
        cidade: activeYouth.cidade || 'Pirapora',
        email: activeYouth.nome.toLowerCase().replace(/\s+/g, '') + '@descubra.com'
      });
      setActiveTab('jovem_perfil');
    }
  };

  // Reset database simulation action
  const handleResetDb = async () => {
    try {
      setLoading(true);
      await apiService.restaurarDados();
      showToast('Simulação do banco de dados resetada com sucesso!');
      await loadAllData();
    } catch (e) {
      showToast('Erro ao redefinir banco.');
    } finally {
      setLoading(false);
    }
  };

  // Create Student (Coordenador)
  const handleCadastrarJovem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.salvarJovem(newJovem);
      showToast(`Jovem "${newJovem.nome}" cadastrado com sucesso!`);
      setNewJovem({
        nome: '',
        idade: 16,
        data_nasc: '2010-04-18',
        genero: 'Masculino',
        raca: 'Pardo',
        telefone: '38999812345',
        cpf: '123.456.789-01',
        bairro: 'Santo Antônio',
        cidade: 'Pirapora',
        escolaridade: '9º Ano - Escola Municipal Santo Antônio',
        frequencia: 90,
        faltas_consecutivas: 0,
        desempenho: 'bom' as const,
        vulnerabilidade_tipo: 'Nenhuma',
        renda_familiar: 1200,
        status: 'pré-aprendizagem' as const,
        possui_mei: false,
        problemas_familiares: 'Não relatado',
        problema_fisico_saude: 'Não relatado',
        percepcao_familia_obs: 'Nenhuma observação complementar registrada.'
      });
      await loadAllData();
      setActiveTab('coord_mesa');
    } catch (e) {
      showToast('Não foi possível cadastrar o aluno.');
    }
  };

  // Send referral to social system (CRAS)
  const handleEncaminharSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encaminharJovemId) return;

    try {
      const targetYouth = jovens.find(j => j.id === encaminharJovemId);
      if (!targetYouth) return;

      const payload = {
        jovem_id: encaminharJovemId,
        jovem_nome: targetYouth.nome,
        jovem_bairro: targetYouth.bairro,
        tipo: encaminharTipo as any,
        gravidade: encaminharGravidade,
        status: 'pendente' as const,
        descricao: encaminharMotivo,
        data_criado: new Date().toISOString().split('T')[0]
      };

      await apiService.criarAlerta(payload);
      showToast(`SOS enviado! ${targetYouth.nome} foi encaminhado para acompanhamento emergencial do CRAS.`);
      
      setIsEncaminharModalOpen(false);
      setEncaminharJovemId('');
      setEncaminharMotivo('');
      
      await loadAllData();

      // Smooth scroll back to table
      const element = document.getElementById('pop-up-resumo-jovem');
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
        jovem_id: newAtendimento.jovem_id,
        tema: newAtendimento.tema,
        relatorio: newAtendimento.relatorio,
        encaminhamentos: newAtendimento.encaminhamentos,
        assistente_id: currentUser.id,
        assistente_name: currentUser.nome,
        data: new Date().toISOString().split('T')[0]
      };
      await apiService.salvarAtendimento(payload);

      // Auto-resolve linked alert if present
      if (newAtendimento.alerta_id) {
        await apiService.resolverAlerta(newAtendimento.alerta_id, 'resolvido', newAtendimento.relatorio);
      }

      showToast('Atendimento social registrado e adicionado à linha do tempo!');
      setNewAtendimento({
        jovem_id: jovens[0]?.id || '',
        alerta_id: '',
        tema: 'Acompanhamento de Rotina',
        relatorio: '',
        encaminhamentos: ''
      });
      await loadAllData();
      setActiveTab('social_historico');
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
      setActiveTab('empresa_match');
    } catch (e) {
      showToast('Erro ao lançar vaga.');
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
  const handleAtualizarCursoProgresso = async (
    cursoId: string,
    cursoTitulo: string,
    categoria: 'MEI' | 'Descubra Jovem',
    status: 'Iniciado' | 'Em Andamento' | 'Concluido',
    progressoPercentual: number,
    optJovemId?: string,
    optJovemNome?: string
  ) => {
    try {
      const targetId = optJovemId || currentUser.id;
      const activeYouth = optJovemId 
        ? (jovens.find(j => j.id === optJovemId) || { nome: optJovemNome || 'Jovem Aprendiz' })
        : (jovens.find(j => j.id === currentUser.id) || { nome: 'Jovem Aprendiz' });

      await apiService.atualizarCursoProgresso({
        jovemId: targetId,
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

  const youngActiveObj = jovens.find(j => j.id === currentUser.id) || jovens[0] || null;

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        handleLoginAs={handleLoginAs}
        selectedJovemId={selectedJovemId}
        setSelectedJovemId={setSelectedJovemId}
        jovens={jovens}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between" id="applet-container">
      
      {/* GLOBAL NOTIFICATION SYSTEM */}
      {toastMessage && (
        <div id="central-toast-notify" className="fixed bottom-6 right-6 z-50 bg-emerald-500 border border-emerald-400 text-slate-950 px-6 py-4.5 rounded-xl text-sm md:text-base font-black shadow-2xl flex items-center gap-3 animate-bounce font-mono tracking-wide">
          <Compass className="w-5 h-5 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <DashboardHeader 
        setIsLoggedIn={setIsLoggedIn}
        toast={toastMessage}
        handleResetDb={handleResetDb}
        showToast={showToast}
      />

      {/* CORE FRAME LAYOUT */}
      <main className="flex-1 w-full max-w-none px-4 lg:px-6 py-4 flex flex-col lg:flex-row gap-4" id="main-frame-layout">
        
        {/* SIDEBAR NAVIGATION SYSTEM */}
        <DashboardSidebar 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedJovemId={selectedJovemId}
          setSelectedJovemId={setSelectedJovemId}
          jovens={jovens}
          showToast={showToast}
        />

        {/* COMPONENT OUTLET FLEX MODULE */}
        <div className="flex-1 min-w-0 flex flex-col gap-4" id="dashboard-outlet">
          
          {/* A. COORDINATOR DASHBOARD PAGE */}
          {currentUser.tipo === 'coordenador' && (
            <CoordinatorDashboard 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              dbStats={dbStats}
              jovens={jovens}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterBairro={filterBairro}
              setFilterBairro={setFilterBairro}
              filterRisco={filterRisco}
              setFilterRisco={setFilterRisco}
              filteredJovens={filteredJovens}
              cursosProgresso={cursosProgresso}
              cursosSubTab={cursosSubTab}
              setCursosSubTab={setCursosSubTab}
              cursosSearch={cursosSearch}
              setCursosSearch={setCursosSearch}
              cursosFilterCategoria={cursosFilterCategoria}
              setCursosFilterCategoria={setCursosFilterCategoria}
              cursosFilterStatus={cursosFilterStatus}
              setCursosFilterStatus={setCursosFilterStatus}
              editingProgressId={editingProgressId}
              setEditingProgressId={setEditingProgressId}
              editingStatus={editingStatus}
              setEditingStatus={setEditingStatus}
              editingPercent={editingPercent}
              setEditingPercent={setEditingPercent}
              expandedStudentId={expandedStudentId}
              setExpandedStudentId={setExpandedStudentId}
              csvText={csvText}
              setCsvText={setCsvText}
              newJovem={newJovem}
              setNewJovem={setNewJovem}
              encaminharJovemId={encaminharJovemId}
              setEncaminharJovemId={setEncaminharJovemId}
              encaminharMotivo={encaminharMotivo}
              setEncaminharMotivo={setEncaminharMotivo}
              encaminharTipo={encaminharTipo}
              setEncaminharTipo={setEncaminharTipo}
              encaminharGravidade={encaminharGravidade}
              setEncaminharGravidade={setEncaminharGravidade}
              isEncaminharModalOpen={isEncaminharModalOpen}
              setIsEncaminharModalOpen={setIsEncaminharModalOpen}
              handleCadastrarJovem={handleCadastrarJovem}
              handleEncaminharSocial={handleEncaminharSocial}
              handleImportarCSV={handleImportarCSV}
              handleAtualizarCursoProgresso={handleAtualizarCursoProgresso}
              infoJovemModal={infoJovemModal}
              setInfoJovemModal={setInfoJovemModal}
              atendimentos={atendimentos}
              showToast={showToast}
            />
          )}

          {/* B. ESTUDANTE / JOVEM PORTAL PAGE */}
          {currentUser.tipo === 'jovem' && (
            <YouthPortal 
              activeTab={activeTab}
              currentUser={currentUser}
              youngActiveObj={youngActiveObj}
              atendimentos={atendimentos}
              alertas={alertas}
              cursosProgresso={cursosProgresso}
              tipoAjuda={tipoAjuda}
              setTipoAjuda={setTipoAjuda}
              descricaoAjuda={descricaoAjuda}
              setDescricaoAjuda={setDescricaoAjuda}
              handleCriarRequerimentoAjuda={handleCriarRequerimentoAjuda}
              handleAtualizarCursoProgresso={handleAtualizarCursoProgresso}
            />
          )}

          {/* C. EMPRESA RECRUITER PORTAL PAGE */}
          {currentUser.tipo === 'empresa' && (
            <CompanyDashboard 
              activeTab={activeTab}
              vagas={vagas}
              jovens={jovens}
              newVaga={newVaga}
              setNewVaga={setNewVaga}
              handleCriarVaga={handleCriarVaga}
              currentUser={currentUser}
            />
          )}

          {/* D. ASSISTENTE SOCIAL (CRAS DE PIRAPORA) PAGE */}
          {currentUser.tipo === 'assistente_social' && (
            <SocialAssistantDashboard 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              alertas={alertas}
              jovens={jovens}
              currentUser={currentUser}
              newAtendimento={newAtendimento}
              setNewAtendimento={setNewAtendimento}
              handleResolverAlerta={handleResolverAlerta}
              handleRegistrarAtendimento={handleRegistrarAtendimento}
              showToast={showToast}
              atendimentos={atendimentos}
            />
          )}

        </div>

      </main>

      {/* DETAILED INTERACTIVE OVERLAY MODALS FOR Referrals / Profiles */}
      <StudentModals 
        isEncaminharModalOpen={isEncaminharModalOpen}
        setIsEncaminharModalOpen={setIsEncaminharModalOpen}
        encaminharJovemId={encaminharJovemId}
        setEncaminharJovemId={setEncaminharJovemId}
        encaminharMotivo={encaminharMotivo}
        setEncaminharMotivo={setEncaminharMotivo}
        encaminharTipo={encaminharTipo}
        setEncaminharTipo={setEncaminharTipo}
        encaminharGravidade={encaminharGravidade}
        setEncaminharGravidade={setEncaminharGravidade}
        handleEncaminharSocial={handleEncaminharSocial}
        infoJovemModal={infoJovemModal}
        setInfoJovemModal={setInfoJovemModal}
        atendimentos={atendimentos}
        jovens={jovens}
        showToast={showToast}
      />

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
