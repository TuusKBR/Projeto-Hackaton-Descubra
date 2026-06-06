import React, { useState, useEffect } from 'react';
import { Compass, FileSpreadsheet, ShieldAlert, Building, User, Lock, Mail, Eye, EyeOff, Sparkles } from 'lucide-react';
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
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeShortcut, setActiveShortcut] = useState<'coordenador' | 'jovem' | 'empresa' | 'assistente_social' | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive Jovem values dynamically
  const selectedYouth = jovens.find(j => j.id === selectedJovemId) || jovens[0];
  const selectedYouthEmail = selectedYouth 
    ? (selectedYouth.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '') + '@descubra.com') 
    : 'joao.victor@descubra.com';

  // Handle auto-prefill action
  const handlePrefill = (role: 'coordenador' | 'jovem' | 'empresa' | 'assistente_social', shouldClose = true) => {
    setActiveShortcut(role);
    setFormError(null);

    if (role === 'coordenador') {
      setUsername('coordenador@descubra.com');
      setPassword('coordenador123');
    } else if (role === 'assistente_social') {
      setUsername('anapaula.cras@pirapora.mg.gov.br');
      setPassword('assistente123');
    } else if (role === 'empresa') {
      setUsername('rh@minasligas.com.br');
      setPassword('empresa123');
    } else if (role === 'jovem') {
      setUsername(selectedYouthEmail);
      setPassword('jovem123');
    }

    if (shouldClose) {
      setIsModalOpen(false);
    }
  };

  // Sync youth email if selected youth changes and active shortcut is Jovem
  useEffect(() => {
    if (activeShortcut === 'jovem') {
      setUsername(selectedYouthEmail);
    }
  }, [selectedJovemId, selectedYouthEmail, activeShortcut]);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password;

    if (!enteredUser) {
      setFormError('Por favor, informe seu usuário ou e-mail de acesso.');
      return;
    }
    if (!enteredPass) {
      setFormError('Informe a sua senha para continuar.');
      return;
    }

    setFormError(null);
    setLoginSuccess(true);

    // Validate credentials in absolute strict mode
    setTimeout(() => {
      let targetRole: 'coordenador' | 'jovem' | 'empresa' | 'assistente_social' | null = null;
      let matchedJovemId: string | null = null;

      // 1. Check Coordenador
      if (enteredUser === 'coordenador@descubra.com') {
        if (enteredPass === 'coordenador123') {
          targetRole = 'coordenador';
        } else {
          setFormError('Senha incorreta para o Portal do Coordenador.');
          setLoginSuccess(false);
          return;
        }
      }
      // 2. Check Assistente Social
      else if (enteredUser === 'anapaula.cras@pirapora.mg.gov.br') {
        if (enteredPass === 'assistente123') {
          targetRole = 'assistente_social';
        } else {
          setFormError('Senha incorreta para o Portal do Assistente Social.');
          setLoginSuccess(false);
          return;
        }
      }
      // 3. Check Empresa
      else if (enteredUser === 'rh@minasligas.com.br') {
        if (enteredPass === 'empresa123') {
          targetRole = 'empresa';
        } else {
          setFormError('Senha incorreta para o Portal da Empresa Parceira.');
          setLoginSuccess(false);
          return;
        }
      }
      // 4. Check Jovem Accounts
      else {
        // Find if this email matches any youth
        const foundYouth = jovens.find(j => {
          const email = j.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '') + '@descubra.com';
          return email === enteredUser;
        });

        if (foundYouth) {
          if (enteredPass === 'jovem123') {
            targetRole = 'jovem';
            matchedJovemId = foundYouth.id;
          } else {
            setFormError('Senha incorreta para o Portal do Jovem.');
            setLoginSuccess(false);
            return;
          }
        } else if (enteredUser === 'jovem@descubra.com') {
          if (enteredPass === 'jovem123') {
            targetRole = 'jovem';
            matchedJovemId = selectedJovemId || (jovens[0] ? jovens[0].id : null);
          } else {
            setFormError('Senha incorreta para o Portal do Jovem.');
            setLoginSuccess(false);
            return;
          }
        }
      }

      // If we matched a valid portal role
      if (targetRole) {
        if (targetRole === 'jovem' && matchedJovemId) {
          setSelectedJovemId(matchedJovemId);
        }
        handleLoginAs(targetRole);
      } else {
        setFormError('Usuário ou e-mail de acesso não cadastrado no sistema.');
        setLoginSuccess(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-center items-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in" id="login-screen-view">
      {/* Decorative glow gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full space-y-3.5 z-10 flex flex-col">
        {/* Title area */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-1 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shadow-xl shadow-emerald-900/40">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-extrabold bg-emerald-950/60 border border-emerald-800/40 px-2 rounded-full py-0.5">SISTEMA INTEGRADO</span>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-orange-600 text-white rounded-full">HACKATHON PIRAPORA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans mt-1">
              TRAJETÓRIA DESCUBRA+
            </h1>
            <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
              Inclusão profissional pragmática de jovens vulneráveis por proximidade territorial, incentivos Renda Ponte e combate à evasão escolar no Programa Descubra!.
            </p>
          </div>
        </div>

        {/* Centered Login Container */}
        <div className="max-w-md w-full mx-auto">
          
          {/* LOGIN FORM CARD */}
          <div className="bg-slate-900/85 border border-slate-800/85 rounded-2xl p-4.5 shadow-2xl flex flex-col justify-between backdrop-blur-sm relative">
            <div>
              <div className="mb-3.5">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono border-l-2 border-emerald-500 pl-2">Acessar Conta</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Informe suas credenciais ou selecione um perfil de simulação abaixo.</p>
              </div>

              {/* SIMULATION MODE TRIGGER BANNER */}
              <div className="mb-3.5 bg-slate-950 border border-slate-800/70 p-2.5 rounded-xl flex items-center justify-between gap-2 text-left">
                <div className="font-mono text-left">
                  <span className="block font-black text-emerald-400 uppercase tracking-widest text-[9px] mb-0.5">🚀 SIMULAÇÃO ATIVA</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">Escolha um perfil para autopreencher os acessos.</span>
                </div>
                <button
                  type="button"
                  id="btn-open-shortcut-modal"
                  onClick={() => setIsModalOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black rounded uppercase tracking-wider text-[9px] transition-all cursor-pointer shadow shadow-emerald-950/40 select-none shrink-0"
                >
                  Escolher Perfil
                </button>
              </div>

              {formError && (
                <div className="p-2.5 mb-3 bg-red-950/70 border border-red-900/50 rounded-lg text-[11px] text-red-350 flex gap-2 items-start font-sans">
                  <ShieldAlert className="w-4 h-4 text-red-450 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Username Input */}
                <div className="space-y-1">
                  <label htmlFor="login-username" className="block text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wide">
                    Usuário ou E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setActiveShortcut(null);
                        setFormError(null);
                      }}
                      placeholder="ex: coordenador@descubra.com"
                      className="block w-full pl-8.5 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="login-password" className="block text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wide">
                      Senha Corporativa
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setActiveShortcut(null);
                        setFormError(null);
                      }}
                      placeholder="••••••••••••"
                      className="block w-full pl-8.5 pr-9 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={loginSuccess}
                  className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs transition-colors uppercase font-mono tracking-wider shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginSuccess ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-white rounded-full animate-spin"></div>
                      Autenticando na Rede...
                    </>
                  ) : (
                    <>
                      Entrar no Sistema &rarr;
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 text-center text-[10px] text-slate-500 font-mono">
              <p>Segurança assistida por criptografia municipal HTTPS.</p>
            </div>
          </div>
        </div>

        {/* POPUP MODAL: SELECIONAR PERFIL DE SIMULAÇÃO */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div 
              className="bg-slate-950 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-5 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]"
              id="modal-escolha-sistema"
            >
              {/* Close button */}
              <button 
                id="btn-close-shortcut-modal"
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-900 p-1.5 rounded transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-4 flex items-center gap-2 border-b border-slate-900 pb-3">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
                <div className="text-left">
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">
                    Atalhos de Simulação
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Selecione um dos portais abaixo. Ele irá carregar automaticamente as credenciais para o teste rápido:
                  </p>
                </div>
              </div>

              {/* Grid of micro cards for prefill inside the Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
                {/* 1. Coordenador */}
                <button
                  type="button"
                  id="login-role-coordenador-modal"
                  onClick={() => handlePrefill('coordenador')}
                  className={`group text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full cursor-pointer bg-slate-900/60 ${
                    activeShortcut === 'coordenador'
                      ? 'border-amber-500 ring-1 ring-amber-500/40 hover:bg-slate-800'
                      : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 rounded text-amber-400 ${activeShortcut === 'coordenador' ? 'bg-amber-950/60' : 'bg-amber-950/20'}`}>
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-amber-500 bg-amber-950 px-1.5 py-0.2 rounded">Cotas & Escolas</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">Portal Coordenador</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Mesa Geral, mapas de risco mestre municipal, importação CSV e estatísticas.</p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-1.5 border-t border-slate-950 w-full flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Carlos Mendes</span>
                    <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">Preencher &rarr;</span>
                  </div>
                </button>

                {/* 2. Assistente Social */}
                <button
                  type="button"
                  id="login-role-assistente-modal"
                  onClick={() => handlePrefill('assistente_social')}
                  className={`group text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full cursor-pointer bg-slate-900/60 ${
                    activeShortcut === 'assistente_social'
                      ? 'border-red-500 ring-1 ring-red-500/40 hover:bg-slate-800'
                      : 'border-slate-800 hover:border-red-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 rounded text-red-400 ${activeShortcut === 'assistente_social' ? 'bg-red-950/60' : 'bg-red-950/20'}`}>
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-red-500 bg-red-950 px-1.5 py-0.2 rounded">CRAS / SOS</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition">Assistente Social</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Fila de emergências protetivas do CRAS Santo Antônio e registros de visitas.</p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-1.5 border-t border-slate-950 w-full flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Ana Paula Silva</span>
                    <span className="text-red-500 font-bold group-hover:translate-x-0.5 transition-transform">Preencher &rarr;</span>
                  </div>
                </button>

                {/* 3. Empresa Parceira */}
                <button
                  type="button"
                  id="login-role-empresa-modal"
                  onClick={() => handlePrefill('empresa')}
                  className={`group text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full cursor-pointer bg-slate-900/60 ${
                    activeShortcut === 'empresa'
                      ? 'border-blue-500 ring-1 ring-blue-500/40 hover:bg-slate-800'
                      : 'border-slate-800 hover:border-blue-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 rounded text-blue-400 ${activeShortcut === 'empresa' ? 'bg-blue-950/60' : 'bg-blue-950/20'}`}>
                        <Building className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-blue-500 bg-blue-950 px-1.5 py-0.2 rounded">Setor Privado</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">Empresa Parceira</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Cadastrar e lançar vagas corporativas, doação de Renda Ponte, matches geo.</p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-1.5 border-t border-slate-950 w-full flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Minas Ligas S.A.</span>
                    <span className="text-blue-500 font-bold group-hover:translate-x-0.5 transition-transform">Preencher &rarr;</span>
                  </div>
                </button>

                {/* 4. Jovem Aprendiz */}
                <button
                  type="button"
                  id="login-role-jovem-modal"
                  onClick={() => handlePrefill('jovem')}
                  className={`group text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full cursor-pointer bg-slate-900/60 ${
                    activeShortcut === 'jovem'
                      ? 'border-emerald-500 ring-1 ring-emerald-500/40 hover:bg-slate-800'
                      : 'border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 rounded text-emerald-400 ${activeShortcut === 'jovem' ? 'bg-emerald-950/60' : 'bg-emerald-950/20'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-emerald-500 bg-emerald-950 px-1.5 py-0.2 rounded">Trilhas Jovem</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Portal do Jovem</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Renda Ponte, pedido de socorro, passagem via QR Code e trilha de engajamento.</p>
                    </div>
                  </div>

                  {/* Choice dropdown injection for Jovem */}
                  <div className="mt-2.5 pt-1 border-t border-slate-950 text-[10px]" onClick={(e) => e.stopPropagation()}>
                    <span className="block text-slate-500 font-mono mb-1 text-[9px] font-bold">Simular Jovem Aprendiz:</span>
                    <select
                      id="login-youth-picker-modal"
                      value={selectedJovemId}
                      onChange={(e) => {
                        setSelectedJovemId(e.target.value);
                        // Also re-fill if we currently have Jovem selected (without closing modal immediately)
                        if (activeShortcut === 'jovem') {
                          setTimeout(() => handlePrefill('jovem', false), 50);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-white uppercase font-mono focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                    >
                      {jovens.length > 0 ? (
                        jovens.map(j => (
                          <option key={j.id} value={j.id}>{j.nome.split(' ')[0]} ({j.bairro})</option>
                        ))
                      ) : (
                        <>
                          <option value="00000000-0000-0000-b000-000000000001">João (S. Antônio)</option>
                          <option value="00000000-0000-0000-b000-000000000002">Maria (Planalto)</option>
                        </>
                      )}
                    </select>
                  </div>
                </button>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-900/60 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-300 text-[10px] font-mono font-bold transition cursor-pointer"
                >
                  Voltar para Tela de Login Base
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer info box */}
        <div className="text-center text-[10px] text-slate-550 font-mono space-y-0.5 pt-1">
          <p>Plataforma Desenvolvida - Secretaria Municipal Extraordinária de Pirapora e Parcerias Locais</p>
          <p className="text-slate-600">Minas Ligas S.A., Liasa S.A. e Rede Socioassistencial do Médio São Francisco</p>
        </div>

      </div>
    </div>
  );
}
