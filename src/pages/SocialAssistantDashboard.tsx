import React from 'react';
import { ShieldAlert, MessageSquare, Check, FileText, Clock } from 'lucide-react';
import { Alerta, Jovem, AcompanhamentoSocial } from '../types';

interface SocialAssistantDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertas: Alerta[];
  jovens: Jovem[];
  currentUser: {
    id: string;
    nome: string;
    tipo: string;
  };
  newAtendimento: {
    jovem_id: string;
    alerta_id?: string;
    tema: string;
    relatorio: string;
    encaminhamentos: string;
  };
  setNewAtendimento: (at: any) => void;
  handleResolverAlerta: (id: string) => void;
  handleRegistrarAtendimento: (e: React.FormEvent) => void;
  showToast: (msg: string) => void;
  atendimentos: AcompanhamentoSocial[];
}

export default function SocialAssistantDashboard({
  activeTab,
  setActiveTab,
  alertas,
  jovens,
  currentUser,
  newAtendimento,
  setNewAtendimento,
  handleResolverAlerta,
  handleRegistrarAtendimento,
  showToast,
  atendimentos
}: SocialAssistantDashboardProps) {
  return (
    <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-4" id="social-assistant-panels">
      
      {activeTab.startsWith('social_') && (
        <div className="space-y-4 animate-fade-in" id="tab-social-assistant">
          
          <div className="grid grid-cols-1 gap-4">

            {activeTab === 'social_fila' && (
              <div id="fila-alertas-sos-card" className="col-span-12 bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
                <div className="flex items-center gap-2.5 mb-3.5 border-b border-slate-900 pb-2.5 text-red-500">
                  <ShieldAlert className="w-6 h-6 animate-pulse text-red-500" />
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base uppercase tracking-wide font-mono">
                      Fila de Emergências Sociais CRAS / CREAS (Pirapora)
                    </h3>
                    <p className="text-[11px] text-slate-404 mt-0.5">
                      Intervenção de urgência baseada no modelo preditivo municipal de risco de evasão.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
                  Abaixo estão as ocorrências em andamento geradas por diminuição de frequência de participação. Recomenda-se acolhimento preventivo imediato:
                </p>

                <div className="space-y-3.5">
                  {(() => {
                    const activeAlerts = alertas.filter(a => a.status !== 'resolvido');
                    return activeAlerts.length > 0 ? (
                      activeAlerts.map((a) => {
                        let statusLogo = 'bg-red-950 text-red-400 border-red-900/30';
                        if (a.status === 'em_atendimento') statusLogo = 'bg-amber-950 text-amber-400 border-amber-900/30';

                        return (
                          <div key={a.id} className="bg-slate-900/70 p-3.5 md:p-4 rounded-lg border border-slate-850 shadow-inner flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono uppercase border tracking-wider ${statusLogo}`}>
                                  {a.status.toUpperCase()}
                                </span>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs md:text-sm font-black text-white font-mono">{a.jovem_nome} (<span className="text-slate-400">{a.jovem_bairro}</span>)</h4>
                                  <a 
                                    href={`https://wa.me/55${(() => {
                                      const jComp = jovens.find(j => j.id === a.jovem_id);
                                      return jComp?.telefone || '38999812345';
                                    })()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Conversar com ${a.jovem_nome} no WhatsApp`}
                                    className="shrink-0 flex items-center justify-center w-6 h-6 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded transition border border-emerald-500/20 shadow-sm cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3 text-emerald-400 hover:text-inherit" />
                                  </a>
                                </div>
                              </div>
                              <span className="block text-[10px] text-slate-500 font-mono mt-1 font-bold">
                                Notificado em: {a.data_criado} • Celular: <span className="text-slate-400 font-bold">{(() => {
                                  const jComp = jovens.find(j => j.id === a.jovem_id);
                                  const rawPhone = jComp?.telefone || '38999812345';
                                  return `(38) ${rawPhone.replace(/^38/, '').replace(/^(\d{5})(\d{4})$/, '$1-$2')}`;
                                })()}</span>
                              </span>
                              
                              <p className="text-xs text-slate-300 italic mt-2.5 bg-slate-950 p-2.5 rounded border border-slate-850 max-w-none leading-relaxed">
                                <b className="text-red-450 uppercase text-[9px] font-bold font-mono tracking-wider block mb-0.5">Gatilho de Risco Identificado:</b>
                                "{a.descricao}"
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 shrink-0 items-stretch md:items-end justify-center pt-1 md:pt-0">
                              <button 
                                id={`btn-act-atendimento-${a.id}`}
                                onClick={() => {
                                  setNewAtendimento({
                                    jovem_id: a.jovem_id,
                                    alerta_id: a.id,
                                    tema: `Visita Emergencial - ${a.tipo}`,
                                    relatorio: '',
                                    encaminhamentos: ''
                                  });
                                  setActiveTab('social_registrar');
                                  showToast(`Aberto formulário de atendimento para ${a.jovem_nome}`);
                                }}
                                className="text-[10px] font-black font-mono px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer transition text-center shadow-lg shadow-emerald-950/20 uppercase tracking-wide font-bold">
                                Tratar no Relatório
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 py-6 text-center italic font-mono bg-slate-900/40 rounded-lg border border-slate-850">Parabéns! Nenhuma denúncia ou sinalização de evasão pendente no município de Pirapora.</p>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* REGISTER ATENDIMENTO SOCIAL PANEL */}
            {activeTab === 'social_registrar' && (() => {
              const linkedAlerta = newAtendimento.alerta_id
                ? alertas.find(a => a.id === newAtendimento.alerta_id)
                : alertas.find(a => a.jovem_id === newAtendimento.jovem_id && a.status !== 'resolvido');

              return (
                <div id="registrar-atendimento-card" className="col-span-12 bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
                  <div className="flex items-center gap-2.5 mb-3.5 border-b border-slate-900 pb-2.5">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm md:text-base uppercase tracking-wide font-mono">
                        Registrar Atendimento do CRAS (Evolução Social)
                      </h3>
                      <p className="text-[11px] text-slate-404 mt-0.5">
                        Ligue visitas comunitárias e evoluções diretamente no histórico assistencial do jovem.
                      </p>
                    </div>
                  </div>

                  {linkedAlerta && (
                    <div className="bg-slate-900 border border-amber-900/40 rounded-lg p-3.5 mb-4 shadow-md font-sans">
                      <div className="flex items-center gap-2 text-amber-500 font-bold mb-2">
                        <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                        <span className="text-xs uppercase tracking-wide font-mono">Motivo do Encaminhamento para o CRAS</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-2 text-xs">
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-amber-500/95 uppercase font-mono tracking-wider font-bold text-[10px] block mb-0.5">Tipo de Alerta:</strong>
                          {linkedAlerta.tipo}
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-amber-500/95 uppercase font-mono tracking-wider font-bold text-[10px] block mb-0.5">Gatilho de Risco Predito / Descrição:</strong>
                          "{linkedAlerta.descricao}"
                        </p>
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                          <span>Notificado em: <b className="text-slate-400">{linkedAlerta.data_criado}</b></span>
                          <span>Gravidade do Alerta: <b className="text-amber-500 uppercase">{linkedAlerta.gravidade}</b></span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const defaultParafer = `Foco em acolhimento e escuta ativa decorrente do encaminhamento referente ao alerta de [${linkedAlerta.tipo}]. Observou-se a seguinte ocorrência: "${linkedAlerta.descricao}". Jovem e família orientados sobre a importância do engajamento no programa.`;
                            setNewAtendimento({
                              ...newAtendimento,
                              relatorio: defaultParafer,
                              tema: `Visita Emergencial - ${linkedAlerta.tipo}`
                            });
                            showToast("Relato pré-preenchido com base no motivo do alerta!");
                          }}
                          className="text-[10px] font-black font-mono px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-amber-900/35 hover:border-amber-500 text-amber-400 hover:text-white rounded transition cursor-pointer uppercase tracking-wider font-bold"
                        >
                          Preencher Parecer com Dados do Alerta ✓
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleRegistrarAtendimento} className="space-y-4 w-full text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-sans">
                      <div>
                        <label className="block text-[11px] text-slate-350 font-bold mb-1 uppercase tracking-wide font-mono text-emerald-455">Selecionar Jovem Referenciado</label>
                        <select 
                          id="select-atendimento-jovem"
                          value={newAtendimento.jovem_id}
                          onChange={(e) => {
                            const selectedJovemId = e.target.value;
                            const matchingAlert = alertas.find(a => a.jovem_id === selectedJovemId && a.status !== 'resolvido');
                            setNewAtendimento({
                              ...newAtendimento,
                              jovem_id: selectedJovemId,
                              alerta_id: matchingAlert ? matchingAlert.id : '',
                              tema: matchingAlert ? `Visita Emergencial - ${matchingAlert.tipo}` : 'Acompanhamento de Rotina'
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-850 p-2 text-white rounded font-mono focus:border-emerald-500 focus:outline-none font-medium shadow-inner">
                          {jovens.map(j => (
                            <option key={j.id} value={j.id}>{j.nome} ({j.bairro})</option>
                          ))}
                        </select>
                      </div>

                    <div>
                      <label className="block text-[11px] text-slate-350 font-bold mb-1 uppercase tracking-wide font-mono text-emerald-455">Tema / Categoria do Registro</label>
                      <select 
                        id="select-atendimento-tema"
                        value={newAtendimento.tema}
                        onChange={(e) => setNewAtendimento({...newAtendimento, tema: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 p-2 text-white rounded focus:border-emerald-500 focus:outline-none font-medium shadow-inner">
                        <option value="Acompanhamento de Rotina">Acompanhamento de Rotina do Descubra</option>
                        <option value="Visita Domiciliar Preventiva">Visita Domiciliar Preventiva CRAS</option>
                        <option value="Denúncia de Trabalho Infantil">Denúncia de Exploração / Trabalho Infantil</option>
                        <option value="Suporte Psicológico Extremo">Suporte e Acolhimento Psicológico Extremo</option>
                        <option value="Auxílio Alimentação Liberado">Emissão de Auxílio Alimentação/Ponte</option>
                      </select>
                    </div>
                  </div>

                  <div className="font-sans">
                    <label className="block text-[11px] text-slate-350 font-bold mb-1 uppercase tracking-wide font-mono text-emerald-455">Parecer e Relatório Social Detalhado</label>
                    <textarea 
                      id="input-atendimento-relatorio"
                      required
                      rows={2}
                      placeholder="Digite os fatos socioeconômicos observados e o parecer..."
                      value={newAtendimento.relatorio}
                      onChange={(e) => setNewAtendimento({...newAtendimento, relatorio: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-850 p-2 text-white rounded focus:border-emerald-500 focus:outline-none h-16 resize-none leading-relaxed shadow-inner"
                    />
                  </div>

                  <div className="font-sans">
                    <label className="block text-[11px] text-slate-350 font-bold mb-1 uppercase tracking-wide font-mono text-emerald-455">Encaminhamentos Imediatos / Próximos Passos</label>
                    <input 
                      id="input-atendimento-encaminhamentos"
                      type="text" 
                      required
                      placeholder="Ex: Encaminhar para curso técnico, deferir passes VT, acionar Bolsa Família"
                      value={newAtendimento.encaminhamentos}
                      onChange={(e) => setNewAtendimento({...newAtendimento, encaminhamentos: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-850 p-2 text-white rounded focus:border-emerald-500 focus:outline-none font-medium shadow-inner"
                    />
                  </div>

                  <button 
                    id="btn-salvar-atendimento"
                    type="submit" 
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded text-xs transition uppercase font-mono tracking-wider shadow-lg shadow-emerald-950/30 cursor-pointer border border-emerald-500/20">
                    Registrar Ficha Socioassistencial do Jovem na Rede ✓
                  </button>
                </form>
              </div>
              );
            })()}

            {/* HISTÓRICO DE ATENDIMENTOS SOCIAL PANEL */}
            {activeTab === 'social_historico' && (
              <div id="historico-atendimento-card" className="col-span-12 bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
                <div className="flex items-center gap-2.5 mb-3.5 border-b border-slate-900 pb-2.5">
                  <Clock className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base uppercase tracking-wide font-mono">
                      Histórico Socioassistencial do Município (Pirapora)
                    </h3>
                    <p className="text-[11px] text-slate-404 mt-0.5">
                      Fichas, encaminhamentos e evoluções de acompanhamento preventivo registradas pela rede.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {atendimentos.length > 0 ? (
                    atendimentos.map((at) => (
                      <div key={at.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 shadow-inner flex flex-col gap-3">
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-950 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <h4 className="text-xs md:text-sm font-black text-white font-mono uppercase tracking-wide">
                              {at.jovem_nome}
                            </h4>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                            Ficha: {at.id} • {at.data}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-0.5">Tema / Operador(a):</span>
                            <span className="text-slate-250 font-sans font-semibold text-slate-100">
                              {at.tema} <span className="text-[10px] text-slate-400 font-mono">({at.assistente_nome})</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-0.5">Encaminhamentos / Próximos Passos:</span>
                            <span className="text-emerald-400 font-mono text-[11px] font-bold">
                              ➔ {at.encaminhamentos}
                            </span>
                          </div>
                        </div>

                        <div className="mt-1 bg-slate-950 p-3 rounded border border-slate-850">
                          <span className="text-[9px] text-slate-500 uppercase font-black font-mono tracking-wider block mb-1">Parecer e Relatório Técnico:</span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                            {at.relatorio}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center italic font-mono bg-slate-900/40 rounded-lg border border-slate-850 font-sans">Nenhum atendimento registrado no histórico até o momento.</p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
