import React from 'react';
import { ShieldAlert, MessageSquare, Check, FileText } from 'lucide-react';
import { Alerta, Jovem } from '../types';

interface SocialAssistantDashboardProps {
  activeTab: string;
  alertas: Alerta[];
  jovens: Jovem[];
  currentUser: {
    id: string;
    nome: string;
    tipo: string;
  };
  newAtendimento: {
    jovem_id: string;
    tema: string;
    relatorio: string;
    encaminhamentos: string;
  };
  setNewAtendimento: (at: any) => void;
  handleResolverAlerta: (id: string) => void;
  handleRegistrarAtendimento: (e: React.FormEvent) => void;
  showToast: (msg: string) => void;
}

export default function SocialAssistantDashboard({
  activeTab,
  alertas,
  jovens,
  currentUser,
  newAtendimento,
  setNewAtendimento,
  handleResolverAlerta,
  handleRegistrarAtendimento,
  showToast
}: SocialAssistantDashboardProps) {
  return (
    <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-6" id="social-assistant-panels">
      
      {activeTab.startsWith('social_') && (
        <div className="space-y-6 animate-fade-in" id="tab-social-assistant">
          
          <div className="grid grid-cols-1 gap-6">

            {activeTab === 'social_fila' && (
              <div id="fila-alertas-sos-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
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
                            
                            <p className="text-sm md:text-base text-slate-300 italic mt-3 bg-slate-950 p-4 rounded-xl border border-slate-850 max-w-none leading-relaxed">
                              <b className="text-red-450 uppercase text-xs font-bold font-mono tracking-wider block mb-1">Gatilho de Risco Identificado:</b>
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
                                className="text-xs md:text-sm font-black font-mono px-4 py-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-slate-300 hover:text-orange-400 transition cursor-pointer text-center font-bold">
                                Tratar no Relatório ✓
                              </button>
                              <button 
                                id={`btn-resolve-alert-${a.id}`}
                                onClick={() => handleResolverAlerta(a.id)}
                                className="text-xs md:text-sm font-black font-mono px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer transition text-center shadow-lg shadow-emerald-950/20 uppercase tracking-wide font-bold">
                                Acolher e Deferir
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center text-sm md:text-base text-emerald-400 font-mono tracking-wide bg-emerald-950/30 p-3 rounded-lg border border-emerald-900 px-4">
                              <Check className="w-5 h-5 text-emerald-400 animate-bounce" />
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
              <div id="registrar-atendimento-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    <div>
                      <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-450">Selecionar Jovem Referenciado</label>
                      <select 
                        id="select-atendimento-jovem"
                        value={newAtendimento.jovem_id}
                        onChange={(e) => setNewAtendimento({...newAtendimento, jovem_id: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm md:text-base p-4 text-white rounded-xl font-mono focus:border-emerald-500 focus:outline-none font-medium shadow-inner">
                        {jovens.map(j => (
                          <option key={j.id} value={j.id}>{j.nome} ({j.bairro} - {j.cidade})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-450">Tema / Categoria do Registro</label>
                      <select 
                        id="select-atendimento-tema"
                        value={newAtendimento.tema}
                        onChange={(e) => setNewAtendimento({...newAtendimento, tema: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm md:text-base p-4 text-white rounded-xl focus:border-emerald-500 focus:outline-none font-medium shadow-inner">
                        <option value="Acompanhamento de Rotina">Acompanhamento de Rotina do Descubra</option>
                        <option value="Visita Domiciliar Preventiva">Visita Domiciliar Preventiva CRAS</option>
                        <option value="Denúncia de Trabalho Infantil">Denúncia de Exploração / Trabalho Infantil</option>
                        <option value="Suporte Psicológico Extremo">Suporte e Acolhimento Psicológico Extremo</option>
                        <option value="Auxílio Alimentação Liberado">Emissão de Auxílio Alimentação/Ponte</option>
                      </select>
                    </div>
                  </div>

                  <div className="font-sans">
                    <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-450">Parecer e Relatório Social Detalhado</label>
                    <textarea 
                      id="input-atendimento-relatorio"
                      required
                      rows={5}
                      placeholder="Digite os fatos socioeconômicos observados, conversas com os responsáveis e parecer do assistente municipal para a ficha permanente do jovem do Programa Descubra!..."
                      value={newAtendimento.relatorio}
                      onChange={(e) => setNewAtendimento({...newAtendimento, relatorio: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-850 text-sm md:text-base p-4 text-white rounded-xl focus:border-emerald-500 focus:outline-none h-36 resize-none leading-relaxed shadow-inner"
                    />
                  </div>

                  <div className="font-sans">
                    <label className="block text-sm md:text-base text-slate-300 font-black mb-2 uppercase tracking-wide font-mono text-emerald-455">Encaminhamentos Imediatos / Próximos Passos Coordenados</label>
                    <input 
                      id="input-atendimento-encaminhamentos"
                      type="text" 
                      required
                      placeholder="Ex: Encaminhar para curso técnico SENAI, deferir passes VT, acionar Bolsa Família municipal"
                      value={newAtendimento.encaminhamentos}
                      onChange={(e) => setNewAtendimento({...newAtendimento, encaminhamentos: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-850 text-sm md:text-base p-4 text-white rounded-xl focus:border-emerald-500 focus:outline-none font-medium shadow-inner"
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
  );
}
