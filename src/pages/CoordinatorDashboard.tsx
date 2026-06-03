import React, { useState } from 'react';
import { 
  Users, ShieldAlert, FileSpreadsheet, User, Plus, Search, 
  Clock, Edit, ChevronDown, ChevronUp, Map, BookOpen, List, 
  MessageSquare, MessageCircle, CheckCircle2, X 
} from 'lucide-react';
import { Jovem, Alerta, ProgressoCurso } from '../types';
import { MEI_COURSES, DESCUBRA_JOVEM_COURSES } from '../data';
import { apiService } from '../services/api';
import { calcularRisco } from '../utils/calculadoraRisco';

interface CoordinatorDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dbStats: any;
  jovens: Jovem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterBairro: string;
  setFilterBairro: (val: string) => void;
  filterRisco: string;
  setFilterRisco: (val: string) => void;
  filteredJovens: Jovem[];
  cursosProgresso: ProgressoCurso[];
  cursosSubTab: 'alunos' | 'lista';
  setCursosSubTab: (sub: 'alunos' | 'lista') => void;
  cursosSearch: string;
  setCursosSearch: (search: string) => void;
  cursosFilterCategoria: string;
  setCursosFilterCategoria: (cat: string) => void;
  cursosFilterStatus: string;
  setCursosFilterStatus: (status: string) => void;
  editingProgressId: string | null;
  setEditingProgressId: (id: string | null) => void;
  editingStatus: 'Iniciado' | 'Em Andamento' | 'Concluido';
  setEditingStatus: (status: 'Iniciado' | 'Em Andamento' | 'Concluido') => void;
  editingPercent: number;
  setEditingPercent: (percent: number) => void;
  expandedStudentId: string | null;
  setExpandedStudentId: (id: string | null) => void;
  csvText: string;
  setCsvText: (text: string) => void;
  newJovem: any;
  setNewJovem: React.Dispatch<React.SetStateAction<any>>;
  encaminharJovemId: string;
  setEncaminharJovemId: (id: string) => void;
  encaminharMotivo: string;
  setEncaminharMotivo: (motivo: string) => void;
  encaminharTipo: string;
  setEncaminharTipo: (tipo: string) => void;
  encaminharGravidade: 'baixo' | 'medio' | 'alto';
  setEncaminharGravidade: (g: 'baixo' | 'medio' | 'alto') => void;
  isEncaminharModalOpen: boolean;
  setIsEncaminharModalOpen: (open: boolean) => void;
  handleCadastrarJovem: (e: React.FormEvent) => void;
  handleEncaminharSocial: (e: React.FormEvent) => void;
  handleImportarCSV: () => void;
  handleAtualizarCursoProgresso: (
    cursoId: string, 
    cursoTitulo: string, 
    categoria: 'MEI' | 'Descubra Jovem', 
    status: 'Iniciado' | 'Em Andamento' | 'Concluido', 
    progressoPercentual: number, 
    optJovemId?: string, 
    optJovemNome?: string
  ) => void;
  infoJovemModal: Jovem | null;
  setInfoJovemModal: (jovem: Jovem | null) => void;
  atendimentos: any[];
  showToast: (msg: string) => void;
}

export default function CoordinatorDashboard({
  activeTab,
  setActiveTab,
  dbStats,
  jovens,
  searchQuery,
  setSearchQuery,
  filterBairro,
  setFilterBairro,
  filterRisco,
  setFilterRisco,
  filteredJovens,
  cursosProgresso,
  cursosSubTab,
  setCursosSubTab,
  cursosSearch,
  setCursosSearch,
  cursosFilterCategoria,
  setCursosFilterCategoria,
  cursosFilterStatus,
  setCursosFilterStatus,
  editingProgressId,
  setEditingProgressId,
  editingStatus,
  setEditingStatus,
  editingPercent,
  setEditingPercent,
  expandedStudentId,
  setExpandedStudentId,
  csvText,
  setCsvText,
  newJovem,
  setNewJovem,
  encaminharJovemId,
  setEncaminharJovemId,
  encaminharMotivo,
  setEncaminharMotivo,
  encaminharTipo,
  setEncaminharTipo,
  encaminharGravidade,
  setEncaminharGravidade,
  isEncaminharModalOpen,
  setIsEncaminharModalOpen,
  handleCadastrarJovem,
  handleEncaminharSocial,
  handleImportarCSV,
  handleAtualizarCursoProgresso,
  infoJovemModal,
  setInfoJovemModal,
  atendimentos,
  showToast
}: CoordinatorDashboardProps) {
  return (
    <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-6" id="main-content-panels">
      
      {/* ========================================================================================= */}
      {activeTab.startsWith('coord_') && activeTab !== 'coord_cursos' && (
        <div className="space-y-4" id="tab-coordinator">
          
          {/* STAGE METRICS HERO BANNER BAR */}
          {activeTab === 'coord_geral' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* METRIC 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between shadow-md">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">Jovens Cadastrados</p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1">{dbStats?.total || jovens.length}</h3>
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <span>100% integrados</span>
                </div>
              </div>

              {/* METRIC 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between shadow-md">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">Contratados</p>
                  <h3 className="text-xl md:text-2xl font-bold text-emerald-400 mt-1">{dbStats?.contratados || 0}</h3>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-medium font-mono">
                  Adotados em vagas locais
                </div>
              </div>

              {/* METRIC 3 - MANDATORY METRIC: Adotados vs Deixados de Lado */}
              <div className="bg-slate-950 p-4 rounded-xl border-2 border-orange-500/30 bg-orange-950/25 flex flex-col justify-between relative overflow-hidden shadow-md">
                <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-orange-500/10 font-bold text-6xl pointer-events-none font-mono">!</div>
                <div>
                  <p className="text-[10px] md:text-xs text-orange-405 uppercase tracking-wider font-bold font-mono">Aguardando Vaga</p>
                  <h3 className="text-xl md:text-2xl font-bold text-orange-400 mt-1">{dbStats?.elegiveisSemVaga || 0}</h3>
                </div>
                <div className="mt-2 text-xs text-orange-200 font-medium">
                  Elegíveis sem contratação
                </div>
              </div>

              {/* METRIC 4 - MANDATORY METRIC: Mulheres vinculadas */}
              <div className="bg-slate-950 p-4 rounded-xl border-2 border-emerald-500/20 flex flex-col justify-between shadow-md">
                <div>
                  <p className="text-[10px] md:text-xs text-emerald-405 uppercase tracking-wider font-bold font-mono">Inclusão Feminina/Trans</p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1">{dbStats?.mulheresVinculadas || 0}%</h3>
                </div>
                <p className="mt-2 text-xs text-slate-400 font-medium font-mono">Taxa contratada</p>
              </div>

            </div>
          )}

          {/* RISK TRACKERS DECK */}
          {activeTab === 'coord_geral' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse" />
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs md:text-sm">Risco Alto (SOS)</h4>
                    <p className="text-[11px] text-slate-400">Emergência ou abandono</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-500 bg-red-950/40 px-2.5 py-0.5 rounded font-mono">
                  {dbStats?.altoRisco || 0}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs md:text-sm">Risco Médio</h4>
                    <p className="text-[11px] text-slate-400">Faltas iniciais registradas</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-amber-500 bg-amber-950/40 px-2.5 py-0.5 rounded font-mono">
                  {dbStats?.medioRisco ?? 0}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs md:text-sm">Sob Controle</h4>
                    <p className="text-[11px] text-slate-400">Frequência e contato estáveis</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded font-mono">
                  {dbStats?.baixoRisco ?? 0}
                </span>
              </div>
            </div>
          )}

          {/* INTEGRATIVE DUAL CODES */}
          {(activeTab === 'coord_mapa' || activeTab === 'coord_mesa') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* NEIGHBORHOOD MAP OF HEAT */}
              {activeTab === 'coord_mapa' && (
                <div id="mapa-calor-card" className="lg:col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-2.5 mb-3 border-b border-slate-900 pb-2.5">
                    <Map className="w-6 h-6 text-emerald-400 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-white text-lg md:text-xl uppercase tracking-tight font-mono">
                        Mapa de Calor de Pirapora
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Adensamento de vulnerabilidade e taxa de empregabilidade real por microrregião de atuação</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dbStats?.bairroStats ? (
                      dbStats.bairroStats.map((st: any) => {
                        const statusTag = st.taxa_contratacao > 65 ? { text: 'Estabilidade', color: 'bg-green-950 text-green-300 border-green-800' } :
                                          st.taxa_contratacao > 35 ? { text: 'Atenção', color: 'bg-amber-950 text-amber-300 border-amber-900' } :
                                          { text: 'CRAS Urgente', color: 'bg-red-950 text-red-300 border-red-900' };

                        return (
                          <div key={st.bairro} className="bg-slate-900 p-4 rounded-lg border border-slate-800/80 hover:border-slate-700/85 transition duration-200 shadow-md flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="font-extrabold text-white text-base font-mono tracking-tight">{st.bairro}</span>
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${statusTag.color}`}>
                                  {statusTag.text}
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between mb-2">
                                <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Inclusão:</span>
                                <span className="text-xl font-black text-emerald-400 font-mono">
                                  {st.taxa_contratacao}%
                                </span>
                              </div>
                              
                              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                <div 
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${st.taxa_contratacao || 5}%`,
                                    backgroundColor: st.taxa_contratacao > 60 ? '#10B981' : st.taxa_contratacao > 30 ? '#F59E0B' : '#DC2626'
                                  }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-xs font-mono text-slate-300">
                              <div className="bg-slate-950 p-1.5 rounded text-center border border-slate-800/60">
                                <span className="block text-[8px] text-slate-400 uppercase font-semibold">Monitorados</span>
                                <b className="text-slate-200 text-xs">{st.jovens} Jovens</b>
                              </div>
                              <div className="bg-slate-950 p-1.5 rounded text-center border border-slate-800/60">
                                <span className="block text-[8px] text-slate-400 uppercase font-semibold">Score Médio</span>
                                <b className="text-emerald-400 text-xs">{st.avg_score_empregabilidade || 50}</b>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6 col-span-3 italic">Nenhum dado consolidado de Pirapora.</p>
                    )}
                  </div>
                </div>
              )}

              {/* DETAILED HIGH FIDELITY TABLE */}
              {activeTab === 'coord_mesa' && (
                <div id="tabela-trajetoria-card" className="lg:col-span-12 bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm md:text-base uppercase tracking-wide mb-1 font-mono flex items-center gap-1.5">
                        <Users className="w-4.5 h-4.5 text-emerald-500" />
                        Acompanhamento da Trajetória Detalhado
                      </h3>
                      <p className="text-xs text-slate-400">Classificação de risco em tempo real e evolução de cada jovem</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          id="input-pesquisar-jovens"
                          type="text" 
                          placeholder="Buscar por nome..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-emerald-500 w-32 md:w-40"
                        />
                      </div>

                      <select 
                        id="select-filtro-bairro"
                        value={filterBairro}
                        onChange={(e) => setFilterBairro(e.target.value)}
                        className="p-1 px-2 bg-slate-900 border border-slate-800 rounded-md text-slate-300 text-xs focus:outline-none font-mono">
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
                        className="p-1 px-2 bg-slate-900 border border-slate-800 rounded-md text-slate-300 text-xs focus:outline-none font-mono">
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
                        className="p-1 px-2 bg-rose-950/40 border border-rose-900/60 hover:border-rose-500 rounded text-rose-300 hover:text-white hover:bg-rose-900/80 transition-all text-xs font-mono font-bold cursor-pointer flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        Novo Encaminhamento
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-305 text-slate-300">
                      <thead className="bg-slate-900 text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                        <tr>
                          <th className="py-2 px-3">Jovem</th>
                          <th className="py-2 px-3">Região</th>
                          <th className="py-2 px-3 text-center">Frequência</th>
                          <th className="py-2 px-3">Situação Social</th>
                          <th className="py-2 px-3 text-center">Risco</th>
                          <th className="py-2 px-3">Status Programa</th>
                          <th className="py-2 px-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredJovens.length > 0 ? (
                          filteredJovens.map((j) => {
                            const riskCalc = calcularRisco(j);
                            
                            let riskBadgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-900';
                            let riskBallColor = 'bg-emerald-500';
                            if (riskCalc.classificacao === 'alto') {
                              riskBadgeColor = 'bg-red-950 text-red-400 border-red-900';
                              riskBallColor = 'bg-red-600 animate-pulse';
                            } else if (riskCalc.classificacao === 'medio') {
                              riskBadgeColor = 'bg-amber-950 text-amber-300 border-amber-900';
                              riskBallColor = 'bg-amber-500';
                            }

                            let statusColor = 'bg-slate-900 text-slate-400';
                            if (j.status === 'aprendiz_contratado') statusColor = 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/20';
                            else if (j.status === 'pré-aprendizagem') statusColor = 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
                            else if (j.status === 'evadido') statusColor = 'bg-red-500/10 text-red-500 border border-red-500/20';

                            return (
                              <tr key={j.id} className="hover:bg-slate-900/60 transition duration-150">
                                <td className="py-2.5 px-3 font-medium">
                                  <div className="text-white text-xs md:text-sm font-semibold">{j.nome}</div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-1 space-y-1">
                                    <div>Idade: {j.idade ?? 16} • Renda: R$ {j.renda_familiar ?? 1000}</div>
                                    <div className="pt-0.5">
                                      <a 
                                        href={`https://wa.me/55${j.telefone || '38999812345'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`Conversar com ${j.nome} no WhatsApp (+55 ${j.telefone || '38999812345'})`}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-950/40 hover:bg-emerald-900/30 border border-emerald-900/40 hover:border-emerald-500 rounded text-[9px] uppercase tracking-wide font-black text-emerald-400 transition whitespace-nowrap shrink-0"
                                      >
                                        <MessageSquare className="w-2.5 h-2.5 shrink-0" />
                                        <span>Conversar</span>
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-xs text-slate-300">
                                  {j.bairro}
                                  <div className="text-[10px] text-slate-500 mt-0.5">{j.cidade}</div>
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-xs">
                                  <span className={j.frequencia < 75 ? 'text-red-500' : j.frequencia < 85 ? 'text-amber-500' : 'text-emerald-400'}>
                                    {j.frequencia}%
                                  </span>
                                  <div className="text-[10px] font-normal text-slate-500 mt-0.5">{j.faltas_consecutivas} faltas</div>
                                </td>
                                <td className="py-2.5 px-3 italic truncate max-w-[130px] text-slate-300 text-xs">
                                  {j.vulnerabilidade_tipo}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${riskBadgeColor}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${riskBallColor}`} />
                                    {riskCalc.classificacao}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[10px]">
                                  <span className={`px-2 py-0.5 rounded ${statusColor} font-bold`}>
                                    {j.status}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex justify-end items-center gap-2">
                                    <button 
                                      id={`view-trajectory-${j.id}`}
                                      onClick={() => {
                                        setInfoJovemModal(j);
                                        showToast(`Abrindo informações detalhadas de ${j.nome}`);
                                      }}
                                      className="p-1 px-2 border border-slate-700 hover:border-emerald-500 rounded bg-slate-900 text-[10px] hover:text-emerald-400 transition font-mono whitespace-nowrap cursor-pointer">
                                      Mais Informações
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-slate-500">Nenhum jovem corresponde aos filtros em Pirapora.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* DOCK 3: REGISTRO DE NOVO JOVEM */}
          {activeTab === 'coord_cadastro' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
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
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
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
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono font-medium"
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
                            className="w-full bg-slate-955 border border-slate-800 text-sm p-2.5 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Território (Bairro)</label>
                          <select 
                            id="select-novo-jovem-bairro"
                            value={newJovem.bairro}
                            onChange={(e) => setNewJovem({...newJovem, bairro: e.target.value})}
                            className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-medium">
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
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
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
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Rendimento/Desempenho Geral</label>
                        <select 
                          id="select-novo-jovem-desempenho"
                          value={newJovem.desempenho}
                          onChange={(e) => setNewJovem({...newJovem, desempenho: e.target.value as any})}
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-medium"
                        >
                          <option value="bom">Bom Aproveitamento</option>
                          <option value="regular">Regular / Instável</option>
                          <option value="ruim">Ruim (Abaixo do esperado)</option>
                        </select>
                      </div>
                    </div>
                  </div>

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
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Vulnerabilidade Crítica Reconhecida</label>
                        <select 
                          id="select-novo-jovem-vulnerabilidade"
                          value={newJovem.vulnerabilidade_tipo}
                          onChange={(e) => setNewJovem({...newJovem, vulnerabilidade_tipo: e.target.value})}
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-medium">
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
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/65 p-4 md:p-6 rounded-xl border border-slate-850 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4 border-l-2 border-emerald-500 pl-2">Acompanhamento e Percepção Familiar (CRAS / Escuta Ativa)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Problemas Familiares Relatados (Ex: Conflitos, ausência, etc.)</label>
                        <input 
                          id="input-novo-jovem-problemas-familiares"
                          type="text"
                          placeholder="Ex: Sim (Conflitos constantes e fragilidade de vínculos) ou Não"
                          value={newJovem.problemas_familiares || ''}
                          onChange={(e) => setNewJovem({...newJovem, problemas_familiares: e.target.value})}
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Tem alguém com problema físico ou de saúde na família?</label>
                        <input 
                          id="input-novo-jovem-problema-fisico-saude"
                          type="text"
                          placeholder="Ex: Sim (Avó acamada dependente de cuidados) ou Não relatado"
                          value={newJovem.problema_fisico_saude || ''}
                          onChange={(e) => setNewJovem({...newJovem, problema_fisico_saude: e.target.value})}
                          className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Percepção Geral / Observações da Família</label>
                      <textarea 
                        id="textarea-novo-jovem-percepcao-observacoes"
                        placeholder="Descreva de forma ampla a situação de relacionamento familiar, rede de acolhimento e ambiente social protetivo..."
                        value={newJovem.percepcao_familia_obs || ''}
                        onChange={(e) => setNewJovem({...newJovem, percepcao_familia_obs: e.target.value})}
                        className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none h-24 resize-none leading-relaxed"
                      />
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
                  <div className="overflow-x-auto whitespace-nowrap bg-slate-950 p-4 rounded-lg text-xs md:text-sm border border-slate-850/60 font-bold text-emerald-400">
                    nome, data_nascimento, genero, bairro, cidade, frequencia_curso, renda_familiar, desempenho, faltas_consecutivas, vulnerabilidade_tipo, ultimo_contato
                  </div>
                </div>

                <textarea
                  id="textarea-csv-import"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Cole as colunas estruturadas ou linhas do CSV aqui... (A opção de importação NÃO está pré-preenchida para que você digite ou cole seu conteúdo)"
                  className="w-full bg-slate-905 border border-slate-800 text-sm md:text-base p-4 text-white rounded-lg focus:border-emerald-500 font-mono h-64 focus:outline-none resize-none leading-relaxed transition focus:ring-1 focus:ring-emerald-500 mb-2"
                />

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    id="btn-trigger-import-csv"
                    onClick={handleImportarCSV}
                    className="py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm md:text-base transition uppercase font-mono font-black tracking-wider shadow-lg shadow-emerald-950/20 cursor-pointer flex-1">
                    Carregar e Processar Planilha de Impacto ✓
                  </button>
                  <button 
                    id="btn-load-example-csv"
                    type="button"
                    onClick={() => setCsvText(
                      `nome,data_nascimento,genero,bairro,cidade,frequencia_curso,renda_familiar,desempenho,faltas_consecutivas,vulnerabilidade_tipo,ultimo_contato\n` +
                      `Gabriel Souza Bispo,2009-04-18,Masculino,São Geraldo,Pirapora,55,750,ruim,6,Evasão Recente,2026-05-12\n` +
                      `Lorena Martins Vieira,2010-07-01,Feminino,Cidade Jardim,Pirapora,84,1100,regular,2,Pobreza Extrema,2026-05-28\n` +
                      `Carlos Eduardo Melo,2008-11-22,Masculino,Santo Antônio,Pirapora,92,1500,bom,0,Nenhuma,2026-05-29\n` +
                      `Thays Cristine Santos,2011-02-14,Feminino,Vila Rica,Pirapora,35,500,ruim,12,Trabalho Infantil,2026-05-01`
                    )}
                    className="py-4 px-6 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 rounded-xl text-sm md:text-base border border-slate-800 font-mono cursor-pointer transition">
                    Preencher Exemplo
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-350">
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

          {/* Vista Switcher */}
          <div className="flex border-b border-slate-900 pb-1 gap-2 pt-4">
            <button
              id="btn-subtab-cursos-alunos"
              type="button"
              onClick={() => setCursosSubTab('alunos')}
              className={`px-4 py-2 font-sans font-bold text-xs rounded-t-lg transition-all duration-150 flex items-center gap-2 border-t border-x cursor-pointer ${cursosSubTab === 'alunos' ? 'bg-slate-900 text-emerald-400 border-slate-800' : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/20'}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Visão Geral por Aluno ({jovens.length})</span>
            </button>
            <button
              id="btn-subtab-cursos-lista"
              type="button"
              onClick={() => setCursosSubTab('lista')}
              className={`px-4 py-2 font-sans font-bold text-xs rounded-t-lg transition-all duration-150 flex items-center gap-2 border-t border-x cursor-pointer ${cursosSubTab === 'lista' ? 'bg-slate-900 text-emerald-400 border-slate-800' : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/20'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Todos os Minicursos ({cursosProgresso.length})</span>
            </button>
          </div>

          {cursosSubTab === 'alunos' ? (
            <div className="space-y-6">
              {/* Search box for students */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                <div className="w-full md:w-1/2 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar estudante por nome ou bairro..."
                    value={cursosSearch}
                    onChange={(e) => setCursosSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-10 pr-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="text-slate-400 text-xs font-sans text-right">
                  Mostrando <span className="text-white font-bold">{jovens.filter(j => j.nome.toLowerCase().includes(cursosSearch.toLowerCase()) || j.bairro.toLowerCase().includes(cursosSearch.toLowerCase())).length}</span> jovens participantes
                </div>
              </div>

              {/* Students Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const filtered = jovens.filter(j =>
                    j.nome.toLowerCase().includes(cursosSearch.toLowerCase()) ||
                    j.bairro.toLowerCase().includes(cursosSearch.toLowerCase())
                  );

                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-3 text-center py-12 bg-slate-900/30 rounded-xl border border-slate-850 text-slate-500 font-mono italic">
                        Nenhum jovem encontrado com o termo buscado.
                      </div>
                    );
                  }

                  return filtered.map(j => {
                    const pCursos = cursosProgresso.filter(cp => cp.jovem_id === j.id);
                    const total = pCursos.length;
                    const concluidos = pCursos.filter(cp => cp.status === 'Concluido').length;
                    const emAndamento = pCursos.filter(cp => cp.status === 'Em Andamento').length;
                    const iniciados = pCursos.filter(cp => cp.status === 'Iniciado').length;
                    const mediaProgresso = total > 0
                      ? Math.round(pCursos.reduce((sum, c) => sum + c.progresso_percentual, 0) / total)
                      : 0;
                    const concluidosList = pCursos.filter(cp => cp.status === 'Concluido');
                    const andamentoList = pCursos.filter(cp => cp.status !== 'Concluido');

                    return (
                      <div key={j.id} className="bg-slate-900 border border-slate-850 hover:border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between transition-all duration-200">
                        <div className="space-y-4">
                          {/* Student Card Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-black text-xs text-white border ${
                                j.nivel >= 3 ? 'bg-purple-950 border-purple-500 text-purple-400' :
                                j.nivel === 2 ? 'bg-blue-950 border-blue-500 text-blue-400' :
                                'bg-slate-900 border-slate-700 text-slate-400'
                              }`}>
                                NV{j.nivel}
                              </div>
                              <div>
                                <h4 className="font-sans font-bold text-slate-200 text-sm line-clamp-1">{j.nome}</h4>
                                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                  {j.bairro} • {j.idade} anos
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400 font-mono uppercase">
                              {j.score_engajamento} XP
                            </span>
                          </div>

                          {/* Student Progress Stats */}
                          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                              <span>APROVEITAMENTO GERAL:</span>
                              <span className="font-bold text-emerald-400">{mediaProgresso}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-955">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${mediaProgresso}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] font-sans text-slate-400 pt-1">
                              <span>🏁 {concluidos} concluídos</span>
                              <span>⏳ {emAndamento + iniciados} em andamento</span>
                            </div>
                          </div>

                          {/* Active Courses List */}
                          <div className="space-y-3 pt-1">
                            {/* CONCLUDED COURSES SECTION */}
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                                <span className="text-emerald-500">🏆</span> Cursos Concluídos ({concluidosList.length})
                              </p>
                              
                              {concluidosList.length === 0 ? (
                                <p className="text-[11px] text-slate-505 italic font-sans pl-1">
                                  Nenhum curso concluído ainda.
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 gap-1 pl-1">
                                  {concluidosList.map(c => (
                                    <div key={c.id} className="flex items-center gap-2 bg-slate-950/40 px-2 py-1.5 rounded border border-emerald-950/30 text-xs">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                      <div className="min-w-0 flex-1">
                                        <span className="text-[11px] text-slate-300 font-medium truncate block">{c.curso_titulo}</span>
                                      </div>
                                      <span className="text-[9px] font-mono text-emerald-500 bg-emerald-950/80 px-1 rounded border border-emerald-900/30 font-bold">100%</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* IN PROGRESS COURSES SECTION */}
                            <div className="space-y-1.5 pt-1">
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                                <span className="text-amber-500">⚡</span> Em Andamento / Iniciados ({andamentoList.length})
                              </p>
                              
                              {andamentoList.length === 0 ? (
                                <p className="text-[11px] text-slate-505 italic font-sans pl-1">
                                  Sem cursos em andamento no momento.
                                </p>
                              ) : (
                                <div className="space-y-1.5 pl-1 max-h-56 overflow-y-auto pr-1">
                                  {andamentoList.map(c => {
                                    const isEditing = editingProgressId === c.id;
                                    let stateBadge = 'bg-blue-950/80 text-blue-400 border-blue-900/20';
                                    if (c.status === 'Em Andamento') stateBadge = 'bg-slate-950 text-amber-450 border-amber-900/20';

                                    return (
                                      <div key={c.id} className="bg-slate-950 border border-slate-900 rounded p-2 text-slate-300 hover:border-slate-800 transition-all text-xs">
                                        {isEditing ? (
                                          <div className="space-y-2.5 p-0.5">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] text-emerald-400 font-bold line-clamp-1">Ajustar: {c.curso_titulo}</span>
                                              <button 
                                                type="button"
                                                onClick={() => setEditingProgressId(null)}
                                                className="text-slate-500 hover:text-slate-300 text-[10px] font-mono focus:outline-none cursor-pointer"
                                              >
                                                [Fechar]
                                              </button>
                                            </div>
                                            
                                            {/* Status Selector */}
                                            <div className="grid grid-cols-3 gap-1">
                                              {(['Iniciado', 'Em Andamento', 'Concluido'] as const).map(st => (
                                                <button
                                                  key={st}
                                                  type="button"
                                                  onClick={() => {
                                                    setEditingStatus(st);
                                                    if (st === 'Concluido') setEditingPercent(100);
                                                    else if (st === 'Iniciado' && editingPercent > 35) setEditingPercent(10);
                                                  }}
                                                  className={`text-[9px] font-sans py-1 rounded border capitalize transition-all cursor-pointer ${
                                                    editingStatus === st 
                                                      ? 'bg-emerald-950/90 border-emerald-500 text-white font-bold' 
                                                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                                                  }`}
                                                >
                                                  {st}
                                                </button>
                                              ))}
                                            </div>

                                            {/* Percentage Picker */}
                                            <div className="space-y-1">
                                              <div className="flex justify-between items-center text-[9px] font-mono text-slate-550">
                                                <span>PROGRESSO:</span>
                                                <span className="text-emerald-400 font-bold">{editingPercent}%</span>
                                              </div>
                                              <div className="flex gap-1.5 items-center">
                                                <input 
                                                  type="range" 
                                                  min="0" 
                                                  max="100" 
                                                  step="5"
                                                  value={editingPercent}
                                                  onChange={(e) => setEditingPercent(Number(e.target.value))}
                                                  className="flex-1 accent-emerald-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex gap-1">
                                                  <button 
                                                    type="button"
                                                    onClick={() => setEditingPercent(10)}
                                                    className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono"
                                                  >10%</button>
                                                  <button 
                                                    type="button"
                                                    onClick={() => setEditingPercent(50)}
                                                    className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono"
                                                  >50%</button>
                                                  <button 
                                                    type="button"
                                                    onClick={() => setEditingPercent(100)}
                                                    className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono"
                                                  >100%</button>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-1.5 pt-1">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  handleAtualizarCursoProgresso(
                                                    c.curso_id, 
                                                    c.curso_titulo, 
                                                    c.categoria, 
                                                    editingStatus, 
                                                    editingPercent, 
                                                    j.id, 
                                                    j.nome
                                                  );
                                                  setEditingProgressId(null);
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-sans font-bold px-3 py-1.5 transition cursor-pointer"
                                              >
                                                Confirmar
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-1.5">
                                            <div className="flex items-start justify-between gap-1">
                                              <span className="text-[11px] text-slate-300 font-medium line-clamp-1">{c.curso_titulo}</span>
                                              <div className="flex items-center gap-1 flex-shrink-0">
                                                <span className={`text-[8px] font-mono font-bold px-1 py-0.5 rounded border uppercase ${stateBadge}`}>
                                                  {c.status}
                                                </span>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setEditingProgressId(c.id);
                                                    setEditingStatus(c.status);
                                                    setEditingPercent(c.progresso_percentual);
                                                  }}
                                                  className="text-slate-500 hover:text-emerald-400 p-0.5 rounded transition cursor-pointer font-bold"
                                                  title="Ajustar progresso do estudante"
                                                >
                                                  <Edit className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                                <div 
                                                  className={`h-full ${c.status === 'Em Andamento' ? 'bg-amber-500' : 'bg-blue-500'}`} 
                                                  style={{ width: `${c.progresso_percentual}%` }} 
                                                />
                                              </div>
                                              <span className="text-[9px] font-mono text-slate-500">{c.progresso_percentual}%</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* COLLAPSIBLE DETAILED ACADEMIC MATRIX */}
                            <div className="pt-2 border-t border-slate-850/60">
                              <button
                                type="button"
                                onClick={() => setExpandedStudentId(expandedStudentId === j.id ? null : j.id)}
                                className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900/60 text-slate-400 hover:text-emerald-400 rounded-lg text-[10px] font-sans font-black flex items-center justify-center gap-1 transition cursor-pointer uppercase tracking-wider"
                              >
                                {expandedStudentId === j.id ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    <span>Fechar Ficha Acadêmica Geral</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    <span>Ver Ficha e Trilha Curricular Completa</span>
                                  </>
                                )}
                              </button>

                              {expandedStudentId === j.id && (
                                <div className="mt-3 bg-slate-950/80 p-3 rounded-lg border border-slate-850 space-y-3 animate-fade-in text-xs">
                                  <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                                    <span className="text-[10px] text-slate-450 font-mono font-black uppercase tracking-wider">Trilha Completa (8 Minicursos)</span>
                                    <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/20">{concluidos} / 8 concluídos</span>
                                  </div>

                                  {/* Matrix Grid */}
                                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-[11px]">
                                    {/* Descubra MEI */}
                                    <div className="space-y-1.5">
                                      <p className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase block">Módulos Descubra MEI</p>
                                      <div className="grid grid-cols-1 gap-1.5">
                                        {MEI_COURSES.map(course => {
                                          const studentCourse = pCursos.find(pc => pc.curso_id === course.id);
                                          const hasCompleted = studentCourse?.status === 'Concluido';
                                          const hasActive = studentCourse && studentCourse.status !== 'Concluido';

                                          return (
                                            <div 
                                              key={course.id} 
                                              className={`p-2 rounded border transition text-left flex flex-col gap-1.5 ${
                                                hasCompleted ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300' :
                                                hasActive ? 'bg-amber-950/20 border-amber-800/40 text-slate-300' : 
                                                'bg-slate-900/40 border-slate-900 hover:border-slate-850 text-slate-400'
                                              }`}
                                            >
                                              <div className="flex justify-between items-start gap-2">
                                                <span className="font-bold font-sans text-xs line-clamp-1 text-slate-200">{course.titulo}</span>
                                                {hasCompleted ? (
                                                  <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1 rounded uppercase font-bold font-mono">Feito ✓</span>
                                                ) : hasActive ? (
                                                  <span className="text-[8px] bg-amber-950 text-amber-450 border border-amber-800/60 px-1 rounded uppercase font-bold font-mono">{studentCourse.progresso_percentual}%</span>
                                                ) : (
                                                  <span className="text-[8px] bg-slate-950 text-slate-500 border border-slate-850 px-1 rounded uppercase font-mono">Pendente</span>
                                                )}
                                              </div>

                                              {studentCourse ? (
                                                <div className="flex items-center gap-1.5">
                                                  <div className="flex-1 bg-slate-900 h-1 rounded overflow-hidden">
                                                    <div 
                                                      className={`h-full ${hasCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                                      style={{ width: `${studentCourse.progresso_percentual}%` }} 
                                                    />
                                                  </div>
                                                  <button
                                                    onClick={() => {
                                                      setEditingProgressId(studentCourse.id);
                                                      setEditingStatus(studentCourse.status);
                                                      setEditingPercent(studentCourse.progresso_percentual);
                                                    }}
                                                    className="text-[9px] hover:text-emerald-400 px-1.5 py-0.5 rounded border border-transparent hover:border-slate-800 transition bg-slate-950 cursor-pointer"
                                                  >
                                                    Ajustar
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="flex justify-between items-center bg-slate-950 p-1 rounded">
                                                  <span className="text-[9px] text-slate-500 font-mono font-bold">Carga: {course.cargaHoraria}</span>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleAtualizarCursoProgresso(
                                                        course.id,
                                                        course.titulo,
                                                        'MEI',
                                                        'Iniciado',
                                                        10,
                                                        j.id,
                                                        j.nome
                                                      );
                                                      showToast(`✓ Estudante matriculado no curso "${course.titulo}" com 10% de progresso inicial.`);
                                                    }}
                                                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-slate-800 hover:border-emerald-500 text-[9px] font-sans rounded transition cursor-pointer font-bold"
                                                  >
                                                    + Matricular
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Descubra Jovem */}
                                    <div className="space-y-1.5 pt-1">
                                      <p className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase block">Módulos Descubra Jovem</p>
                                      <div className="grid grid-cols-1 gap-1.5">
                                        {DESCUBRA_JOVEM_COURSES.map(course => {
                                          const studentCourse = pCursos.find(pc => pc.curso_id === course.id);
                                          const hasCompleted = studentCourse?.status === 'Concluido';
                                          const hasActive = studentCourse && studentCourse.status !== 'Concluido';

                                          return (
                                            <div 
                                              key={course.id} 
                                              className={`p-2 rounded border transition text-left flex flex-col gap-1.5 ${
                                                hasCompleted ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300' :
                                                hasActive ? 'bg-blue-950/20 border-blue-850 text-slate-300' : 
                                                'bg-slate-900/40 border-slate-900 hover:border-slate-850 text-slate-400'
                                              }`}
                                            >
                                              <div className="flex justify-between items-start gap-2">
                                                <span className="font-bold font-sans text-xs line-clamp-1 text-slate-200">{course.titulo}</span>
                                                {hasCompleted ? (
                                                  <span className="text-[8px] bg-emerald-900/80 text-emerald-400 border border-emerald-800 px-1 rounded uppercase font-bold font-mono">Feito ✓</span>
                                                ) : hasActive ? (
                                                  <span className="text-[8px] bg-blue-950 text-blue-400 border border-blue-800/60 px-1 rounded uppercase font-bold font-mono">{studentCourse.progresso_percentual}%</span>
                                                ) : (
                                                  <span className="text-[8px] bg-slate-950 text-slate-500 border border-slate-850 px-1 rounded uppercase font-mono">Pendente</span>
                                                )}
                                              </div>

                                              {studentCourse ? (
                                                <div className="flex items-center gap-1.5">
                                                  <div className="flex-1 bg-slate-900 h-1 rounded overflow-hidden">
                                                    <div 
                                                      className={`h-full ${hasCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                                      style={{ width: `${studentCourse.progresso_percentual}%` }} 
                                                    />
                                                  </div>
                                                  <button
                                                    onClick={() => {
                                                      setEditingProgressId(studentCourse.id);
                                                      setEditingStatus(studentCourse.status);
                                                      setEditingPercent(studentCourse.progresso_percentual);
                                                    }}
                                                    className="text-[9px] hover:text-emerald-400 px-1.5 py-0.5 rounded border border-transparent hover:border-slate-800 transition bg-slate-950 cursor-pointer"
                                                  >
                                                    Ajustar
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="flex justify-between items-center bg-slate-950 p-1 rounded">
                                                  <span className="text-[9px] text-slate-500 font-mono font-bold">Carga: {course.cargaHoraria}</span>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleAtualizarCursoProgresso(
                                                        course.id,
                                                        course.titulo,
                                                        'Descubra Jovem',
                                                        'Iniciado',
                                                        10,
                                                        j.id,
                                                        j.nome
                                                      );
                                                      showToast(`✓ Estudante matriculado no curso "${course.titulo}" com 10% de progresso inicial.`);
                                                    }}
                                                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-slate-800 hover:border-emerald-500 text-[9px] font-sans rounded transition cursor-pointer font-bold"
                                                  >
                                                    + Matricular
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Active Feedback Triggers */}
                        <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between gap-2">
                          <div className="text-[10px] text-slate-505 font-mono">
                            Atualizado: {pCursos[0]?.data_atualizacao || 'Sem dados'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const phone = j.telefone || '38999812345';
                                let msg = `Olá ${j.nome}! Aqui é o Carlos, coordenador do Descubra Pirapora. Vi seu excelente andamento nos cursos, parabéns! Continue firme. 🚀`;
                                if (mediaProgresso < 40 && total > 0) {
                                  msg = `Olá ${j.nome}! Vi que você iniciou o curso "${pCursos[0]?.curso_titulo || 'Descubra'}" mas o progresso está em ${mediaProgresso}%. Precisa de alguma ajuda com internet ou transporte para continuar? Conte conosco!`;
                                }
                                showToast(`Canal Simulador WhatsApp Ativado! Mensagem enviada para ${j.nome}.`);
                                apiService.simularWhatsApp(j.id, msg).catch(() => {});
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition border border-emerald-500/10"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Incentivar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filter and search bar */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                <div className="w-full md:w-1/3 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar aluno por nome..."
                    value={cursosSearch}
                    onChange={(e) => setCursosSearch(e.target.value)}
                    className="w-full bg-slate-95 w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-10 pr-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1 font-semibold">Filtrar Categoria</label>
                    <select
                      value={cursosFilterCategoria}
                      onChange={(e) => setCursosFilterCategoria(e.target.value)}
                      className="bg-slate-95 w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="Todos">Todas as Categorias</option>
                      <option value="MEI">Descubra MEI</option>
                      <option value="Descubra Jovem">Descubra Jovem</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1 font-semibold">Filtrar Status</label>
                    <select
                      value={cursosFilterStatus}
                      onChange={(e) => setCursosFilterStatus(e.target.value)}
                      className="bg-slate-95 w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer font-medium"
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
                          if (cp.status === 'Concluido') statBadge = 'bg-emerald-950 text-emerald-400 border-emerald-950/30';

                          return (
                            <tr key={cp.id} className="hover:bg-slate-900/40 transition">
                              <td className="p-4 font-bold text-white">{cp.jovem_nome}</td>
                              <td className="p-4">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${catBadge}`}>
                                  {cp.categoria === 'MEI' ? 'Descubra MEI' : 'Descubra Jovem'}
                                </span>
                              </td>
                              <td className="p-4 font-mono font-bold text-slate-300">{cp.curso_titulo}</td>
                              <td className="p-4 w-44">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-505">
                                    <span>PROGRESSO:</span>
                                    <span className="font-bold text-slate-300">{cp.progresso_percentual}%</span>
                                  </div>
                                  <div className="w-full bg-slate-955 h-1.5 rounded-full overflow-hidden border border-slate-900">
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

      {/* MODAL / POPUP: ENCAMINHAMENTO DE JOVEM PARA ASSISTÊNCIA SOCIAL (CRAS/CREAS) */}
      {isEncaminharModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]"
            id="secao-encaminhamento-social"
          >
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
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 font-mono">
                      Classificação do Gatilho
                    </label>
                    <select
                      id="select-encaminhar-tipo"
                      value={encaminharTipo}
                      onChange={(e) => setEncaminharTipo(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-sm p-3 text-white rounded-lg focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                    >
                      <option value="Evasão Escolar">Abandono / Evasão Escolar</option>
                      <option value="Falta Consecutiva">Faltas Consecutivas na Qualificação</option>
                      <option value="Falta de Contato">Incomunicabilidade (Sem Contato)</option>
                      <option value="Mensagem WhatsApp">Gatilho Emocional (SOS Chat)</option>
                      <option value="Frequência Alerta">Extrema Vulnerabilidade Familiar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5 font-mono">
                      Gravidade do Alerta
                    </label>
                    <div className="grid grid-cols-3 gap-2 h-[46px]">
                      {(['baixo', 'medio', 'alto'] as const).map((g) => {
                        const labelStr = g === 'baixo' ? 'Baixo' : g === 'medio' ? 'Médio' : 'Alto';
                        const activeBgClass = g === 'baixo' ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : g === 'medio' ? 'bg-amber-950 text-amber-450 border-amber-500' : 'bg-rose-950 text-rose-450 border-rose-500';
                        
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
                    placeholder="Descreva detalhadamente a situação identificada pelo coordenador (ex: Jovem enfrenta ausência de transporte público para o curso, relatou insegurança alimentar em casa ou problemas familiares)..."
                    className="w-full bg-slate-955 border border-slate-850 text-sm p-3 text-white rounded-lg focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-sans"
                  />
                </div>
              </div>

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
                  className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 cursor-pointer font-mono uppercase border border-rose-500/10"
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

        let rBadge = 'bg-emerald-950 text-emerald-400 border-emerald-900';
        let rBall = 'bg-emerald-500';
        if (rCalc.classificacao === 'alto') {
          rBadge = 'bg-red-950 text-red-400 border-red-900';
          rBall = 'bg-red-600 animate-pulse';
        } else if (rCalc.classificacao === 'medio') {
          rBadge = 'bg-amber-950 text-amber-400 border-amber-900';
          rBall = 'bg-amber-500';
        }

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
              <button 
                id="btn-close-info-modal"
                type="button"
                onClick={() => setInfoJovemModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-900 p-2 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

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

              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
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
                      <div className="flex justify-between py-1.5 border-b border-slate-955">
                        <span className="text-slate-500">Localização:</span>
                        <span className="text-white font-medium text-right text-xs">{j.bairro}, {j.cidade}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-955">
                        <span className="text-slate-500">Renda Familiar:</span>
                        <span className="text-orange-400 font-bold">R$ {j.renda_familiar ?? 1000}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Escolaridade:</span>
                        <span className="text-white font-medium text-right max-w-[200px] truncate" title={j.escolaridade}>{j.escolaridade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-850 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2">
                      Indicadores Escolares & Sociais
                    </h4>

                    <div className="grid grid-cols-1 gap-3 text-xs md:text-sm font-mono text-slate-300">
                      <div className="flex justify-between py-1.5 border-b border-slate-955 items-center">
                        <span className="text-slate-500">Frequência Escolar:</span>
                        <span className={`font-bold text-base ${j.frequencia < 75 ? 'text-red-500' : j.frequencia < 85 ? 'text-amber-500' : 'text-emerald-400'}`}>
                          {j.frequencia}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-955">
                        <span className="text-slate-500">Faltas Consecutivas:</span>
                        <span className="text-white font-bold">{j.faltas_consecutivas} registradas</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-955">
                        <span className="text-slate-500">Desempenho Geral:</span>
                        <span className={`font-bold capitalize ${j.desempenho === 'bom' ? 'text-emerald-400' : j.desempenho === 'regular' ? 'text-amber-500' : 'text-red-550'}`}>
                          {j.desempenho}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-955">
                        <span className="text-slate-500">Vulnerabilidade Crítica:</span>
                        <span className="text-amber-450 font-semibold">{j.vulnerabilidade_tipo}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-955">
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

                {/* Percepção do Ambiente Familiar & Saúde */}
                <div id="secao-percepcao-familia-coord" className="bg-slate-900/30 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2 font-bold">
                    Percepção do Ambiente Familiar & Saúde (CRAS)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm font-mono text-slate-300">
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900/80">
                      <span className="block text-[10px] text-slate-500 uppercase font-black mb-1">Problemas Familiares Identificados</span>
                      <p className="text-white font-medium">{j.problemas_familiares || 'Não relatado.'}</p>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900/80">
                      <span className="block text-[10px] text-slate-500 uppercase font-black mb-1">Membro com Problema Físico / Saúde</span>
                      <p className="text-white font-medium">{j.problema_fisico_saude || 'Não relatado.'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900/80 text-xs md:text-sm font-mono">
                    <span className="block text-[10px] text-slate-500 uppercase font-black mb-1">Diagnóstico / Observações da Família</span>
                    <p className="text-slate-300 leading-relaxed italic">"{j.percepcao_familia_obs || 'Nenhuma observação complementar registrada.'}"</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 max-h-[320px] overflow-y-auto">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-2 mb-5">
                      Linha do Tempo Social / Trajetória Protetiva
                    </h4>

                    <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6 font-mono text-xs text-slate-305">
                      
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow" />
                        <span className="text-[10px] text-slate-505 font-black">Histórico Recente</span>
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
                          <p className="text-[10px] text-slate-505 mt-0.5"><b className="text-slate-500 uppercase">Técnico:</b> {at.assistente_nome}</p>
                          <p className="text-xs text-slate-300 bg-slate-955 p-3 rounded-lg border border-slate-850 mt-1.5 leading-relaxed italic">
                            "{at.relatorio}"
                          </p>
                          {at.encaminhamentos && (
                            <p className="text-[10px] text-emerald-400 font-extrabold mt-1">
                              → Encaminhado para: {at.encaminhamentos}
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-950 shadow" />
                        <span className="text-[10px] text-slate-505 font-black">05/03/2026</span>
                        <h5 className="font-bold text-white text-xs mt-0.5">Inclusão e Registro Inicial no Descubra+</h5>
                        <p className="text-xs text-slate-400 mt-1">
                          Parâmetros sociais consolidados do CRAS Pirapora aplicados no cadastro inicial do jovem.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-slate-900 pb-1 pt-5 mt-6 gap-3">
                <div className="flex gap-2.5">
                  <a 
                    href={`https://wa.me/55${j.telefone || '38999812345'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-emerald-600 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-white transition text-xs font-mono font-bold cursor-pointer font-bold shrink-0"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Conversar no WhatsApp
                  </a>

                  <button 
                    type="button"
                    onClick={() => {
                      setEncaminharJovemId(j.id);
                      setIsEncaminharModalOpen(true);
                      setInfoJovemModal(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-rose-900 bg-rose-950/40 border border-rose-900/60 rounded-lg text-rose-450 hover:text-white transition text-xs font-mono cursor-pointer font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400 shadow-sm" />
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
  );
}
