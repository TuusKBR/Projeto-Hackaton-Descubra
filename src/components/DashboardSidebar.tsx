import React, { useState } from 'react';
import { 
  TrendingUp, Map, Users, Plus, FileSpreadsheet, BookOpen, User, 
  Clock, GraduationCap, HelpCircle, ShieldAlert, FileText, Compass,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Jovem } from '../types';

interface DashboardSidebarProps {
  currentUser: {
    id: string;
    nome: string;
    tipo: string;
    bairro: string;
    cidade: string;
    email: string;
  };
  setCurrentUser: (user: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedJovemId: string;
  setSelectedJovemId: (id: string) => void;
  jovens: Jovem[];
  showToast: (msg: string) => void;
}

export default function DashboardSidebar({
  currentUser,
  setCurrentUser,
  activeTab,
  setActiveTab,
  selectedJovemId,
  setSelectedJovemId,
  jovens,
  showToast
}: DashboardSidebarProps) {
  const [isGeoOpen, setIsGeoOpen] = useState(false);

  return (
    <aside className="w-full lg:w-[240px] shrink-0 flex flex-col gap-3">
      
      {/* USER INFO PROFILE WIDGET */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800" id="user-profile-card">
        <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2 font-mono">USUÁRIO ATIVO</h2>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center font-bold text-white text-base shadow-inner shrink-0">
            {currentUser.nome.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white leading-tight text-xs truncate">{currentUser.nome}</h3>
            <span className="inline-block px-1.5 py-0.5 text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950 rounded mt-0.5 font-mono">
              {currentUser.tipo === 'assistente_social' ? 'Assist. Social (CRAS)' : currentUser.tipo}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{currentUser.email}</p>
          </div>
        </div>

        {/* If simulating young, toggle list picker so judges can preview different danger risk scores */}
        {currentUser.tipo === 'jovem' && (
          <div className="mt-3 pt-3 border-t border-slate-900">
            <label className="block text-[10px] text-slate-400 font-medium mb-1">Selecionar outro Jovem:</label>
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
              className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-white uppercase font-mono cursor-pointer focus:outline-none focus:border-emerald-500">
              {jovens.map(j => (
                <option key={j.id} value={j.id}>{j.nome} ({j.bairro})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW SWITCH NAVIGATION NAV */}
      <nav className="flex flex-col gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800" id="desktop-side-nav">
         {currentUser.tipo === 'coordenador' && (
          <div className="flex flex-col gap-1" id="nav-options-coordenador">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-0.5 mb-1 font-mono">OPÇÕES DO COORDENADOR</h2>
            
            <button 
              id="nav-tab-coord"
              onClick={() => {
                setActiveTab('coord_geral');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'coord_geral' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Painel Geral</span>
            </button>

            <button 
              id="nav-sub-coord-heatmap"
              onClick={() => {
                setActiveTab('coord_mapa');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'coord_mapa' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Map className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mapa de Calor</span>
            </button>

            <button 
              id="nav-sub-coord-trajectory"
              onClick={() => {
                setActiveTab('coord_mesa');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'coord_mesa' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Monitoramento</span>
            </button>

            <button 
              id="nav-sub-coord-cursos"
              onClick={() => {
                setActiveTab('coord_cursos');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'coord_cursos' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cursos</span>
            </button>

            <button 
              id="nav-sub-coord-insert"
              onClick={() => {
                setActiveTab('coord_cadastro');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'coord_cadastro' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inserir Novo Jovem</span>
            </button>

            <button 
              id="nav-tab-import"
              onClick={() => {
                setActiveTab('coord_import');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'coord_import' ? 'bg-slate-850 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importação CSV</span>
            </button>
          </div>
        )}

        {currentUser.tipo === 'jovem' && (
          <div className="flex flex-col gap-1" id="nav-options-jovem">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-0.5 mb-1 font-mono">OPÇÕES DO ESTUDANTE</h2>
            
            <button 
              id="nav-tab-jovem"
              onClick={() => {
                setActiveTab('jovem_perfil');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'jovem_perfil' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Meu Perfil & Nível</span>
            </button>

            <button 
              id="nav-sub-jovem-timeline"
              onClick={() => {
                setActiveTab('jovem_timeline');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'jovem_timeline' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Linha do Tempo</span>
            </button>

            <button 
              id="nav-sub-jovem-descubra-mei"
              onClick={() => {
                setActiveTab('jovem_descubra_mei');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'jovem_descubra_mei' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descubra MEI</span>
            </button>

            <button 
              id="nav-sub-jovem-descubra-jovem"
              onClick={() => {
                setActiveTab('jovem_descubra_jovem');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'jovem_descubra_jovem' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descubra Jovem</span>
            </button>

            <button 
              id="nav-sub-jovem-suporte"
              onClick={() => {
                setActiveTab('jovem_suporte');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'jovem_suporte' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Requerer Apoio</span>
            </button>
          </div>
        )}

         {currentUser.tipo === 'empresa' && (
          <div className="flex flex-col gap-1" id="nav-options-empresa">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-0.5 mb-1 font-mono">OPÇÕES DA EMPRESA</h2>
            
            <button 
              id="nav-sub-empresa-matches"
              onClick={() => {
                setActiveTab('empresa_match');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'empresa_match' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Matchmaking Jovem</span>
            </button>

            <button 
              id="nav-sub-empresa-vagas-my"
              onClick={() => {
                setActiveTab('empresa_vagas');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'empresa_vagas' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Minhas Vagas</span>
            </button>

            <button 
              id="nav-sub-empresa-insert"
              onClick={() => {
                setActiveTab('empresa_publicar');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'empresa_publicar' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Publicar Vaga Ap.</span>
            </button>
          </div>
        )}

        {currentUser.tipo === 'assistente_social' && (
          <div className="flex flex-col gap-1" id="nav-options-social">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-0.5 mb-1 font-mono">OPÇÕES DO CRAS</h2>
            
            <button 
              id="nav-tab-social"
              onClick={() => {
                setActiveTab('social_fila');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'social_fila' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fila Emergências</span>
            </button>

            <button 
              id="nav-sub-social-register"
              onClick={() => {
                setActiveTab('social_registrar');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'social_registrar' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registrar Atend.</span>
            </button>

            <button 
              id="nav-sub-social-history"
              onClick={() => {
                setActiveTab('social_historico');
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-300 rounded-md text-xs font-bold transition duration-205 border-l-2 cursor-pointer ${activeTab === 'social_historico' ? 'bg-slate-800 border-emerald-500 text-white shadow-md' : 'border-transparent hover:bg-slate-900/60'}`}>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Histórico de Registros</span>
            </button>
          </div>
        )}
      </nav>

      {/* PIRAPORA GEOGRAPHICAL INSIGHT CARD */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-400">
        <button
          onClick={() => setIsGeoOpen(!isGeoOpen)}
          className="w-full flex items-center justify-between text-left font-semibold text-slate-300 uppercase tracking-wide text-[10px] font-mono hover:text-white transition duration-150 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Abrangência Territorial
          </span>
          {isGeoOpen ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
        </button>
        {isGeoOpen && (
          <div className="mt-2 text-[10px] leading-relaxed border-t border-slate-900 pt-2 transition-all duration-300">
            <p className="mb-2 text-slate-400">Monitoramento ativo das calhas urbanas do Rio São Francisco e periferias integrando:</p>
            <ul className="space-y-1 font-mono text-[9px] text-slate-300 list-disc list-inside">
              <li>Pirapora-MG (Sede)</li>
              <li>Buritizeiro (Conexão Ponte)</li>
              <li>Jequitaí (Núcleo Rural)</li>
            </ul>
          </div>
        )}
      </div>

    </aside>
  );
}
