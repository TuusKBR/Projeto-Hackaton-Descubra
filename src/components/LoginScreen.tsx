import React from 'react';
import { Compass, FileSpreadsheet, ShieldAlert, Building, User } from 'lucide-react';
import { Jovem } from '../types';

interface LoginScreenProps {
  handleLoginAs: (role: 'coordenador' | 'jovem' | 'empresa' | 'assistente_social') => void;
  selectedJovemId: string;
  setSelectedJovemId: (id: string) => void;
  jovens: Jovem[];
}

export default function LoginScreen({
  handleLoginAs,
  selectedJovemId,
  setSelectedJovemId,
  jovens
}: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center items-center py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="login-screen-view">
      {/* Decorative glow gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full space-y-4 z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex p-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shadow-xl shadow-emerald-900/40">
            <Compass className="w-7 h-7 animate-spin-slow" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 rounded-full py-0.5">SISTEMA INTEGRADO</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-600 text-white rounded-full">HACKATHON PIRAPORA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans mt-2">
              TRAJETÓRIA DESCUBRA+
            </h1>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Inclusão profissional pragmática de jovens vulneráveis por proximidade territorial, incentivos Renda Ponte e combate à evasão escolar no Programa Descubra!.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/85 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm space-y-4">
          <div className="text-center">
            <h2 className="text-sm font-bold text-white">Como deseja acessar o sistema?</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Selecione uma conta de demonstração para carregar os painéis interativos de simulação sem senhas complexas:</p>
          </div>

          {/* Grid of login buttons/cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Coordenador Profile card */}
            <button 
              id="login-role-coordenador"
              onClick={() => handleLoginAs('coordenador')}
              className="group text-left p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-amber-950/10 cursor-pointer text-slate-100">
              <div className="space-y-3 w-full">
                <div className="flex justify-between items-start">
                  <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg group-hover:bg-amber-500/20 transition">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold bg-amber-950 px-1.5 py-0.5 rounded">Geral e Escolas</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">Coordenador Geral</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Acompanhar relatórios de matrículas, gráficos de engajamento, status de cotas e classificar o mapa de risco geral de evasão.
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300">
                <span className="font-mono text-[11px]">👤 Carlos Mendes</span>
                <span className="font-semibold text-amber-500">Acessar &rarr;</span>
              </div>
            </button>

            {/* Assistente Social card */}
            <button 
              id="login-role-assistente"
              onClick={() => handleLoginAs('assistente_social')}
              className="group text-left p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-red-950/10 cursor-pointer text-slate-100">
              <div className="space-y-3 w-full">
                <div className="flex justify-between items-start">
                  <div className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg group-hover:bg-red-500/20 transition">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-red-500 font-bold bg-red-950 px-1.5 py-0.5 rounded">CRAS / CREAS</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition">Assistente Social</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fila de vulnerabilidades do CRAS Santo Antônio, registros de visitas, atendimentos de rotina e controle de alertas SOS de gravidade.
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300">
                <span className="font-mono text-[11px]">👤 Ana Paula Silva</span>
                <span className="font-semibold text-red-500">Acessar &rarr;</span>
              </div>
            </button>

            {/* Empresa Siderurgica / Industrial Card */}
            <button 
              id="login-role-empresa"
              onClick={() => handleLoginAs('empresa')}
              className="group text-left p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-blue-950/10 cursor-pointer text-slate-100">
              <div className="space-y-3 w-full">
                <div className="flex justify-between items-start">
                  <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-blue-500 font-bold bg-blue-950 px-1.5 py-0.5 rounded">Indústrias Parceiras</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">Empresa Parceira</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Anunciar novas vagas profissionais de jovem aprendiz, patrocinar passes de transporte por doação e verificar matchs geoespaciais automáticos.
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300">
                <span className="font-mono text-[11px]">🏭 Minas Ligas S.A.</span>
                <span className="font-semibold text-blue-500">Acessar &rarr;</span>
              </div>
            </button>

            {/* Jovem Participante Card with selection */}
            <div 
              id="login-role-jovem-container"
              onClick={() => handleLoginAs('jovem')}
              className="group text-left p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/65 hover:border-emerald-500/50 rounded-xl transition-all duration-300 flex flex-col justify-between h-full hover:shadow-lg hover:shadow-emerald-950/10 cursor-pointer text-slate-100">
              <div className="space-y-3 w-full">
                <div className="flex justify-between items-start">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-500 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">Jovens</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Jovem Participante</h3>
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
              <div className="mt-2 pt-1.5 border-t border-slate-900/60 w-full flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px] text-slate-500">Selecione e clique para entrar</span>
                <span className="font-semibold text-emerald-500">Acessar &rarr;</span>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center text-xs text-slate-500 font-mono space-y-1">
          <p>Secretaria Municipal de Assistência Social e Inclusão - Pirapora, MG</p>
          <p className="text-[10px]">Desenvolvido com foco no combate à evasão e subsistência digna no Programa Descubra!</p>
        </div>
      </div>
    </div>
  );
}
