import React from 'react';
import { X, ShieldAlert, MessageSquare } from 'lucide-react';
import { Jovem, Alerta, AcompanhamentoSocial } from '../types';
import { calcularRisco } from '../utils/calculadoraRisco';

interface StudentModalsProps {
  // Referral Modal
  isEncaminharModalOpen: boolean;
  setIsEncaminharModalOpen: (val: boolean) => void;
  encaminharJovemId: string;
  setEncaminharJovemId: (id: string) => void;
  encaminharMotivo: string;
  setEncaminharMotivo: (motivo: string) => void;
  encaminharTipo: string;
  setEncaminharTipo: (val: string) => void;
  encaminharGravidade: 'baixo' | 'medio' | 'alto';
  setEncaminharGravidade: (val: 'baixo' | 'medio' | 'alto') => void;
  handleEncaminharSocial: (e: React.FormEvent) => void;

  // Detail Modal
  infoJovemModal: Jovem | null;
  setInfoJovemModal: (j: Jovem | null) => void;
  atendimentos: AcompanhamentoSocial[];
  jovens: Jovem[];

  // Global methods
  showToast: (msg: string) => void;
}

export default function StudentModals({
  isEncaminharModalOpen,
  setIsEncaminharModalOpen,
  encaminharJovemId,
  setEncaminharJovemId,
  encaminharMotivo,
  setEncaminharMotivo,
  encaminharTipo,
  setEncaminharTipo,
  encaminharGravidade,
  setEncaminharGravidade,
  handleEncaminharSocial,

  infoJovemModal,
  setInfoJovemModal,
  atendimentos,
  jovens
}: StudentModalsProps) {

  return (
    <>
      {/* MODAL: ENCAMINHAMENTO DE JOVEM PARA ASSISTÊNCIA SOCIAL (CRAS/CREAS) */}
      {isEncaminharModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="bg-slate-950 border border-slate-800 w-full max-w-xl rounded-xl shadow-2xl p-4 md:p-5 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[85vh]"
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
              className="absolute top-3.5 right-3.5 text-slate-404 hover:text-white hover:bg-slate-900 p-1.5 rounded transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3.5 border-b border-slate-900 pb-2.5">
              <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-white text-sm md:text-base uppercase tracking-wide font-mono">
                  Encaminhar para Assistente Social (CRAS)
                </h3>
                <p className="text-[11px] text-slate-404 mt-0.5 font-sans">
                  Envie um alerta imediato ao CRAS Santo Antônio para intervenção domiciliar.
                </p>
              </div>
            </div>

            <form onSubmit={handleEncaminharSocial} className="space-y-3.5 text-xs">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-850 space-y-3.5">
                
                {/* JOVEM SELECTOR */}
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1 font-mono">
                    Escolher Jovem para Encaminhar
                  </label>
                  <select
                    id="select-encaminhar-jovem"
                    value={encaminharJovemId}
                    onChange={(e) => setEncaminharJovemId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2 text-white rounded focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                  >
                    <option value="">-- Selecione o Jovem do programa --</option>
                    {jovens.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nome} ({j.bairro}) - Risco atual: {calcularRisco(j).classificacao.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* TIPO DE GATILHO/VULNERABILIDADE */}
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1 font-mono">
                      Classificação do Gatilho
                    </label>
                    <select
                      id="select-encaminhar-tipo"
                      value={encaminharTipo}
                      onChange={(e) => setEncaminharTipo(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2 text-white rounded focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                    >
                      <option value="Evasão Escolar">Evasão Escolar</option>
                      <option value="Trabalho Infantil Detectado">Trabalho Infantil Detectado</option>
                      <option value="Insegurança Alimentar Extrema">Insegurança Alimentar Extrema</option>
                      <option value="Violência ou Coação Social">Violência ou Coação Social</option>
                      <option value="Saúde Mental Debilitada">Saúde Mental Debilitada</option>
                    </select>
                  </div>

                  {/* GRAVIDADE */}
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1 font-mono">
                      Gravidade da Ocorrência
                    </label>
                    <select
                      id="select-encaminhar-gravidade"
                      value={encaminharGravidade}
                      onChange={(e) => setEncaminharGravidade(e.target.value as any)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2 text-white rounded focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                    >
                      <option value="baixo">BAIXA (Acompanhamento rotineiro)</option>
                      <option value="medio">MÉDIA (Requer análise breve)</option>
                      <option value="alto">ALTA (Decreto de emergência no CRAS)</option>
                    </select>
                  </div>
                </div>

                {/* MOTIVO DETAILS TEXTAREA */}
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1 font-mono">
                    Motivos Socioeconômicos ou Sintomas Observados
                  </label>
                  <textarea
                    id="textarea-encaminhar-motivo"
                    value={encaminharMotivo}
                    onChange={(e) => setEncaminharMotivo(e.target.value)}
                    required
                    rows={2}
                    placeholder="Evidências de faltas sucessivas, trabalho na rua ou carência socioassistencial..."
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2 text-white rounded focus:border-rose-500 focus:outline-none h-16 resize-none leading-relaxed font-sans"
                  />
                </div>

              </div>

              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEncaminharModalOpen(false);
                    setEncaminharJovemId('');
                    setEncaminharMotivo('');
                  }}
                  className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 text-[10px] font-mono font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-encaminhar"
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-950/20"
                >
                  Confirmar e Enviar para Fila de Ação ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DO JOVEM (RESUMO DE INFORMAÇÕES E LINHA DO TEMPO) */}
      {infoJovemModal && (() => {
        const j = infoJovemModal;
        const rCalc = calcularRisco(j);
        const timelineRecords = atendimentos.filter(at => at.jovem_id === j.id);

        let rBadge = 'bg-emerald-950 text-emerald-400 border-emerald-900/30';
        let rBall = 'bg-emerald-500';
        if (rCalc.classificacao === 'alto') {
          rBadge = 'bg-red-950 text-red-400 border-red-900/30';
          rBall = 'bg-red-600 animate-pulse';
        } else if (rCalc.classificacao === 'medio') {
          rBadge = 'bg-amber-950 text-amber-400 border-amber-900/30';
          rBall = 'bg-amber-500';
        }

        let sBadge = 'bg-slate-900 text-slate-400 border-slate-800';
        if (j.status === 'aprendiz_contratado') sBadge = 'bg-emerald-600/10 text-emerald-400 border-emerald-500/25';
        else if (j.status === 'pré-aprendizagem') sBadge = 'bg-orange-500/10 text-orange-400 border-orange-500/25';
        else if (j.status === 'evadido') sBadge = 'bg-red-500/10 text-red-500 border-red-500/25';

        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div 
              className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-xl shadow-2xl p-4 md:p-5 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[92vh]"
              id="pop-up-resumo-jovem"
            >
              {/* Close button */}
              <button 
                id="btn-close-info-modal"
                type="button"
                onClick={() => setInfoJovemModal(null)}
                className="absolute top-3.5 right-3.5 text-slate-404 hover:text-white hover:bg-slate-900 p-1.5 rounded transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header: Name and Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-900">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-white text-base md:text-lg uppercase tracking-wide font-mono">
                      {j.nome}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${rBadge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rBall}`} />
                      RISCO {rCalc.classificacao.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    ID Estudante: {j.id.slice(0, 8)}... • Matrícula Ativa no Descubra Pirapora
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${sBadge} font-mono`}>
                    Status: {j.status}
                  </span>
                </div>
              </div>

              {/* Layout Content */}
              <div className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left Side: General Profile Info */}
                  <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-850 space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-1.5 font-bold">
                      Informações Pessoais & Contato
                    </h4>

                    <div className="grid grid-cols-1 gap-2 text-[11px] font-mono text-slate-350">
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Idade / Nasc:</span>
                        <span className="text-white font-medium">{j.idade} anos ({j.data_nasc})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Gênero / Raça:</span>
                        <span className="text-white font-medium">{j.genero} • {j.raca}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Telefone:</span>
                        <span className="text-emerald-400 font-bold">
                          {(j.telefone || '38999812345').replace(/^38/, '(38) ').replace(/^(\(\d{2}\)\s*)?(\d{5})(\d{4})$/, '$1$2-$3')}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Localização:</span>
                        <span className="text-white font-medium text-right">{j.bairro}, {j.cidade}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Renda Familiar:</span>
                        <span className="text-orange-400 font-bold">R$ {j.renda_familiar ?? 1000}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Escolaridade:</span>
                        <span className="text-white font-medium text-right max-w-[150px] truncate" title={j.escolaridade}>{j.escolaridade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Educational & Social indicators */}
                  <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-850 space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-1.5 font-bold">
                      Indicadores Escolares & Sociais
                    </h4>

                    <div className="grid grid-cols-1 gap-2 text-[11px] font-mono text-slate-350">
                      <div className="flex justify-between py-1 border-b border-slate-950 items-center">
                        <span className="text-slate-500">Frequência Escolar:</span>
                        <span className={`font-bold text-xs ${j.frequencia < 75 ? 'text-red-500' : j.frequencia < 85 ? 'text-amber-500' : 'text-emerald-400'}`}>
                          {j.frequencia}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Faltas Consecutivas:</span>
                        <span className="text-white font-bold">{j.faltas_consecutivas} registradas</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Desempenho Geral:</span>
                        <span className={`font-bold capitalize ${j.desempenho === 'bom' ? 'text-emerald-400' : j.desempenho === 'regular' ? 'text-amber-500' : 'text-red-500'}`}>
                          {j.desempenho}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Vulnerabilidade:</span>
                        <span className="text-amber-400 font-semibold">{j.vulnerabilidade_tipo}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-950">
                        <span className="text-slate-500">Encaminhado Por:</span>
                        <span className="text-slate-300 font-semibold">{j.encaminhado_por}</span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-slate-500">Pontuação Descubra+:</span>
                        <span className="text-amber-400 font-bold font-mono">{j.pontos_totais ?? 0} PTS (Nível {j.nivel ?? 1})</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Percepção do Ambiente Familiar & Saúde */}
                <div id="secao-percepcao-familia" className="bg-slate-900/30 p-3 rounded-lg border border-slate-850 space-y-2.5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-1.5 font-bold">
                    Percepção do Ambiente Familiar & Saúde (CRAS)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono text-slate-300">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900/80">
                      <span className="block text-[9px] text-slate-500 uppercase font-black mb-0.5">Problemas Familiares</span>
                      <p className="text-white font-medium">{j.problemas_familiares || 'Não relatado.'}</p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900/80">
                      <span className="block text-[9px] text-slate-500 uppercase font-black mb-0.5">Membro Doente / Tratamentos</span>
                      <p className="text-white font-medium">{j.problema_fisico_saude || 'Não relatado.'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-900/80 text-[11px] font-mono">
                    <span className="block text-[9px] text-slate-500 uppercase font-black mb-0.5">Diagnóstico / Observações Coordenadas</span>
                    <p className="text-slate-300 leading-relaxed italic">"{j.percepcao_familia_obs || 'Nenhuma observação complementar registrada.'}"</p>
                  </div>
                </div>
                
                {/* Timeline trajectory summary (highly compact max-h) */}
                <div className="w-full">
                  <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-850 max-h-[160px] overflow-y-auto">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-l-2 border-emerald-500 pl-1.5 mb-3.5 font-bold">
                      Linha do Tempo Social / Trajetória Protetiva
                    </h4>

                    <div className="relative border-l-2 border-slate-800 ml-2 pl-4 space-y-4 font-mono text-[11px] text-slate-350">
                      
                      <div className="relative">
                        <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow" />
                        <span className="text-[9px] text-slate-500 font-black">Histórico Recente</span>
                        <h5 className="font-bold text-white text-[11px] mt-0.5">Sob Monitoramento Ativo</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Frequência escolar de {j.frequencia}% analisada pelo algoritmo preditivo Descubra+ de Pirapora.
                        </p>
                      </div>

                      {timelineRecords.map((at) => (
                        <div key={at.id} className="relative">
                          <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-slate-950 shadow" />
                          <span className="text-[9px] text-orange-400 font-bold">{at.data}</span>
                          <h5 className="font-bold text-white text-[11px] mt-0.5">Atendimento: {at.tema}</h5>
                          <p className="text-[9px] text-slate-500 mt-0.5"><b className="text-slate-450 uppercase">Técnico:</b> {at.assistente_nome}</p>
                          <p className="text-[11px] text-slate-300 bg-slate-100/10 bg-slate-950 p-2 rounded border border-slate-850 mt-1 leading-relaxed italic">
                            "{at.relatorio}"
                          </p>
                          {at.encaminhamentos && (
                            <p className="text-[9px] text-emerald-400 font-extrabold mt-0.5">
                              → Encaminhado para: {at.encaminhamentos}
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="relative">
                        <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-slate-705 border-2 border-slate-950 shadow" />
                        <span className="text-[9px] text-slate-500 font-black">05/03/2026</span>
                        <h5 className="font-bold text-white text-[11px] mt-0.5">Inclusão de Cadastro no Descubra+</h5>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Parâmetros de vulnerabilidade social vinculados ao CRAS Pirapora na adesão.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between border-t border-slate-900/80 pt-3.5 mt-3.5 gap-2">
                <div className="flex gap-2">
                  <a 
                    href={`https://wa.me/55${j.telefone || '38999812345'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 hover:bg-emerald-600 bg-emerald-950/60 border border-emerald-500/30 rounded text-[11px] font-mono font-bold text-emerald-300 hover:text-white transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 hover:text-white shrink-0" />
                    WhatsApp
                  </a>

                  <button 
                    type="button"
                    onClick={() => {
                      setEncaminharJovemId(j.id);
                      setIsEncaminharModalOpen(true);
                      setInfoJovemModal(null);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 hover:bg-rose-900 font-bold bg-rose-950/40 border border-rose-900/60 rounded text-[11px] font-mono text-rose-350 hover:text-white transition cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 hover:text-white shrink-0" />
                    Encaminhar ao CRAS
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={() => setInfoJovemModal(null)}
                  className="px-4 py-1.5 rounded bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 text-[11px] font-mono font-bold transition cursor-pointer"
                >
                  Fechar Painel
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </>
  );
}
