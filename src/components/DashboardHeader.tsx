import React from 'react';
import { Compass, X, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  setIsLoggedIn: (login: boolean) => void;
  toast: string | null;
  handleResetDb: () => void;
  showToast: (msg: string) => void;
}

export default function DashboardHeader({
  setIsLoggedIn,
  toast,
  handleResetDb,
  showToast
}: DashboardHeaderProps) {
  return (
    <>
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-40 px-4 py-2" id="main-header">
        <div className="w-full max-w-none px-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 text-white rounded shadow-md shadow-emerald-900/35">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white leading-tight">TRAJETÓRIA DESCUBRA+</h1>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-orange-600 text-white rounded-full">HACKATHON PIRAPORA</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Proteção social, Renda Ponte e Inserção de Jovens Aprendizes em Pirapora, Buritizeiro e Jequitaí</p>
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
              className="px-2.5 py-1 text-[10px] rounded-lg font-bold transition duration-200 hover:bg-red-800/80 hover:text-red-100 text-red-400 bg-red-950/30 border border-red-900/30 shadow-sm flex items-center gap-1 cursor-pointer">
              <span>Sair / Trocar Conta</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* QUICK STATUS NOTIFICATION TOAST */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-700 border border-emerald-500 text-white rounded-xl shadow-2xl p-4 max-w-sm flex gap-3 animate-bounce shadow-emerald-9900/40 border-l-4">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
          <div>
            <p className="text-sm font-medium">{toast}</p>
          </div>
        </div>
      )}

      {/* RE-ESTABLISH AND RESET HARDCODE DATA DECK */}
      <div className="bg-slate-950 px-4 py-2 text-xs border-b border-slate-800/40 flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Hora Local: 2026-05-30 18:30 UTC</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline text-emerald-400">● Conexão Segura Supabase Mock API Ativa</span>
        </div>
        <button 
          id="btn-restaurar-dados"
          onClick={handleResetDb} 
          className="hover:text-amber-400 flex items-center gap-1 transition text-[11px] text-slate-400 font-medium cursor-pointer">
          <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
          Restaurar Banco de Dados Simulado
        </button>
      </div>
    </>
  );
}
