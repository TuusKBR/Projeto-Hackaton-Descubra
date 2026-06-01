import React from 'react';
import { 
  Award, Clock, HelpCircle, BookOpen, GraduationCap, ArrowRight 
} from 'lucide-react';
import { Jovem, Alerta, ProgressoCurso } from '../types';
import { MEI_COURSES, DESCUBRA_JOVEM_COURSES } from '../data';

interface YouthPortalProps {
  activeTab: string;
  currentUser: {
    id: string;
    nome: string;
    tipo: string;
    bairro: string;
    cidade: string;
    email: string;
  };
  youngActiveObj: Jovem | null;
  atendimentos: any[];
  alertas: Alerta[];
  cursosProgresso: ProgressoCurso[];
  tipoAjuda: string;
  setTipoAjuda: (val: string) => void;
  descricaoAjuda: string;
  setDescricaoAjuda: (val: string) => void;
  handleCriarRequerimentoAjuda: (e: React.FormEvent) => void;
  handleAtualizarCursoProgresso: (cursoId: string, cursoTitulo: string, categoria: 'MEI' | 'Descubra Jovem', status: 'Iniciado' | 'Em Andamento' | 'Concluido', progressoPercentual: number) => void;
}

export default function YouthPortal({
  activeTab,
  currentUser,
  youngActiveObj,
  atendimentos,
  alertas,
  cursosProgresso,
  tipoAjuda,
  setTipoAjuda,
  descricaoAjuda,
  setDescricaoAjuda,
  handleCriarRequerimentoAjuda,
  handleAtualizarCursoProgresso
}: YouthPortalProps) {
  return (
    <div className="flex-1 flex flex-col gap-4" id="young-portal-panels">
      
      {activeTab.startsWith('jovem_') && (
        <div className="space-y-4 animate-fade-in" id="tab-young">
          
          {/* 1. SEU MEU PERFIL & NÍVEL HERO */}
          {activeTab === 'jovem_perfil' && (
            <div className="bg-slate-950 p-4 md:p-5 rounded-xl border-2 border-emerald-500/20 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-xl shadow-slate-950/50" id="young-hero-metrics">
              
              {/* Score Empregabilidade Progress Ring indicator */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-900" id="employability-score-card">
                <span className="text-[10px] md:text-xs font-black text-slate-400 tracking-wider uppercase font-mono mb-2">Score Empregabilidade Ativo</span>
                <div className="relative w-32 h-32 flex items-center justify-center bg-slate-900 rounded-full border-4 border-emerald-400 shadow-2xl shadow-emerald-950/40 ring-4 ring-emerald-500/10">
                  <div className="text-center">
                    <span className="text-3xl font-black text-white font-mono tracking-tighter">{youngActiveObj?.score_empregabilidade || 50}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono uppercase tracking-wider font-bold">Pontos</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-emerald-400 bg-emerald-950/65 px-3 py-1 rounded-lg font-mono font-black uppercase tracking-wider border border-emerald-900">
                    Perfil Ativo ✓
                  </span>
                </div>
              </div>

              {/* LEVEL SHELF GAMEFICACAO */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center gap-3 flex-wrap border-b border-slate-900 pb-2">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans">{youngActiveObj?.nome}</h2>
                    <p className="text-[10px] text-slate-300 font-mono mt-0.5 font-medium bg-slate-900 px-2.5 py-0.5 rounded border border-slate-850 inline-block">Nível {youngActiveObj?.nivel || 1} • {youngActiveObj?.pontos_totais || 50} XP acumulado</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-bold font-mono uppercase shrink-0 tracking-wider shadow-md">
                    {youngActiveObj?.status === 'aprendiz_contratado' ? 'CONTRATADO ✓' : 'DISPONÍVEL'}
                  </span>
                </div>

                {/* Level progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                    <span className="font-semibold">Progresso de Nível de Trajetória</span>
                    <span className="font-black text-emerald-400">{youngActiveObj?.pontos_totais || 50} / {((youngActiveObj?.nivel || 1) + 1) * 200} XP</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow shadow-emerald-400/50" 
                      style={{ width: `${Math.min(100, (((youngActiveObj?.pontos_totais || 50) % 200) / 200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Badges conquistadas */}
                <div>
                  <span className="block text-[10px] md:text-xs text-slate-300 font-bold uppercase tracking-wider mb-2 font-mono">Conquistas e Selos Relatados:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {youngActiveObj?.badges && youngActiveObj.badges.map((b: string) => (
                      <span key={b} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-orange-400 bg-orange-950/40 border border-orange-900/60 rounded-lg shadow font-mono">
                        <Award className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        {b}
                      </span>
                    ))}
                    {(!youngActiveObj?.badges || youngActiveObj.badges.length === 0) && (
                      <p className="text-xs text-slate-500 italic font-mono">Conclua microtarefas ou garanta entrevistas de emprego para desbloquear badges!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. LINHA DE TIEMPO INTERCONECTADA */}
          {activeTab === 'jovem_timeline' && (
            <div id="linha-tempo-card" className="bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-3 border-b border-slate-900 pb-2.5">
                <Clock className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-base md:text-lg uppercase tracking-wide font-mono">
                    Sua Linha do Tempo de Trajetória Protetiva
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Acompanhe todos os marcos e ações coordenadas pelo CRAS Pirapora para assegurar sua permanência escolar e desenvolvimento profissional.
                  </p>
                </div>
              </div>

              <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6 mt-4 mb-2">
                
                {/* Item 1 - Today */}
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-md ring-2 ring-emerald-500/20" />
                  <span className="text-[10px] md:text-xs text-slate-400 font-mono font-black block mb-0.5">30 de Maio de 2026</span>
                  <h4 className="text-xs md:text-sm font-bold text-white uppercase font-mono">Trajetória Monitorada por "Descubra+"</h4>
                  <p className="text-xs text-slate-305 italic font-medium leading-relaxed mt-1.5">
                    Sua frequência escolar, submissão de microtarefas e engajamento geral no curso protetivo estão sob monitoramento de impacto. Seu perfil está sendo otimizado para matchmaking com vagas de Jovem Aprendiz locais.
                  </p>
                </div>

                {/* Item 2 - Social actions on this youth */}
                {atendimentos.filter(a => a.jovem_id === currentUser.id).map((at) => (
                  <div key={at.id} className="relative">
                    <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-slate-950 shadow-md ring-2 ring-orange-500/20" />
                    <span className="text-[10px] md:text-xs text-slate-400 font-mono font-black block mb-0.5">{at.data}</span>
                    <h4 className="text-xs md:text-sm font-bold text-white uppercase font-mono">Lançado Atendimento: {at.tema}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono"><b className="text-slate-300 uppercase">Profissional Responsável:</b> {at.assistente_nome}</p>
                    <p className="text-xs text-slate-305 italic mt-2 bg-slate-900 p-3 rounded-lg border border-slate-850 leading-relaxed font-sans shadow-inner">
                      <b className="text-orange-500 uppercase text-[9px] block mb-1 font-bold font-mono">Relato de Acompanhamento:</b>
                      "{at.relatorio}"
                    </p>
                    <p className="text-xs text-emerald-400 font-extrabold mt-2 flex items-center gap-1.5 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/40 font-mono">
                      <span>✓ Encaminhamento Ativo:</span>
                      <span className="text-white">{at.encaminhamentos}</span>
                    </p>
                  </div>
                ))}

                {/* Base original registration */}
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-slate-700 border-2 border-slate-950 shadow-md ring-2 ring-slate-700/20" />
                  <span className="text-[10px] md:text-xs text-slate-400 font-mono font-black block mb-0.5">05 de Março de 2026</span>
                  <h4 className="text-xs md:text-sm font-bold text-white uppercase font-mono">Inclusão Eletrônica no Programa Descubra Pirapora</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1.5">
                    O jovem foi oficialmente referenciado e incluído na base de monitoramento de evasão escolar do município parceiro com a aplicação dos termos de risco iniciais.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* 3. PORTAL DE REQUERIMENTOS DE SUPORTE */}
          {activeTab === 'jovem_suporte' && (
            <div id="requerimentos-apoio-card" className="bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2.5 mb-3 border-b border-slate-900 pb-2.5">
                  <HelpCircle className="w-7 h-7 text-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg uppercase tracking-wide font-mono">
                      Portal de Requerimentos de Apoio (CRAS / Assistência Social)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Solicite auxílio para superar obstáculos no seu processo de aprendizagem e contratação. Sua solicitação é enviada diretamente ao assistente social responsável.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Left Form */}
                  <form onSubmit={handleCriarRequerimentoAjuda} className="md:col-span-6 bg-slate-900/60 p-4 rounded-lg border border-slate-855 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider font-mono mb-1 border-l-2 border-emerald-500 pl-1.5">
                      Novo Requerimento
                    </h4>

                    <div>
                      <label className="block text-xs text-slate-305 font-semibold mb-1 font-mono uppercase tracking-wide">
                        Tipo de Apoio Necessário
                      </label>
                      <select
                        id="select-tipo-ajuda"
                        value={tipoAjuda}
                        onChange={(e) => setTipoAjuda(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs p-2 text-white rounded font-mono focus:border-emerald-500 font-medium"
                      >
                        <option value="transporte">🚗 Passe / Auxílio Transporte (Passagens para curso/estágio)</option>
                        <option value="alimentacao">🍎 Alimentação / Cesta Básica (Insegurança alimentar na família)</option>
                        <option value="saude_mental">🧠 Apoio à Saúde / Assistência Psicológica (Acolhimento emocional)</option>
                        <option value="material_didatico">📚 Material de Estudo / Vestuário (Cadernos, livros ou uniforme)</option>
                        <option value="outro">⚠️ Outra Urgência Familiar (Descrever detalhadamente)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-305 font-semibold mb-1 font-mono uppercase tracking-wide">
                        Por que você precisa deste apoio? (Justificativa)
                      </label>
                      <textarea
                        id="textarea-descricao-ajuda"
                        required
                        rows={4}
                        placeholder="Descrever detalhadamente sua necessidade atual..."
                        value={descricaoAjuda}
                        onChange={(e) => setDescricaoAjuda(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 text-white rounded focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition leading-relaxed font-sans"
                      />
                    </div>

                    <button
                      id="btn-submit-requerimento"
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-950/20"
                    >
                      Enviar Requerimento de Apoio ✓
                    </button>
                  </form>

                  {/* Right History list */}
                  <div className="md:col-span-6 space-y-3">
                    <h4 className="text-[10px] font-black text-slate-305 uppercase tracking-wider font-mono border-l-2 border-emerald-500 pl-1.5">
                      Seus Requerimentos Ativos ({alertas.filter(a => a.jovem_id === currentUser.id && a.tipo === 'Solicitação de Apoio').length})
                    </h4>

                    <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                      {(() => {
                        const userReqs = alertas.filter(a => a.jovem_id === currentUser.id && a.tipo === 'Solicitação de Apoio');
                        if (userReqs.length === 0) {
                          return (
                            <div className="text-center py-8 px-3 rounded border border-dashed border-slate-800 bg-slate-900/30 text-slate-500 font-mono text-[10px]">
                              Nenhum requerimento ativo cadastrado. Se precisar de apoio, preencha o formulário ao lado.
                            </div>
                          );
                        }

                        return userReqs.map((req) => {
                          const typeMatch = req.descricao.match(/^\[REQ: ([^\]]+)\]/);
                          const cleanDesc = req.descricao.replace(/^\[REQ: [^\]]+\]\s*/, '');
                          const displayType = typeMatch ? typeMatch[1].toUpperCase() : 'OUTRO';

                          const isResolved = req.status === 'resolvido';
                          const statusColor = isResolved 
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/50' 
                            : req.status === 'em_atendimento' 
                              ? 'bg-amber-950/80 text-amber-400 border-amber-900/50' 
                              : 'bg-slate-900/80 text-slate-400 border-slate-800';

                          return (
                            <div key={req.id} className="bg-slate-900/60 p-3 rounded border border-slate-850 space-y-2 text-xs">
                              <div className="flex justify-between items-center gap-2 flex-wrap text-[10px]">
                                <span className="font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/30">
                                  {displayType}
                                </span>
                                <span className="text-slate-505 font-mono">
                                  Enviado: <b>{req.data_criado}</b>
                                </span>
                              </div>

                              <p className="text-slate-300 leading-relaxed font-sans text-xs italic">
                                "{cleanDesc}"
                              </p>

                              <div className="pt-1.5 border-t border-slate-950/50 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded">
                                  <span className="text-[10px] text-slate-500 font-mono font-bold">STATUS DO CRAS:</span>
                                  <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusColor}`}>
                                    {req.status === 'resolvido' ? 'Atendido' : req.status === 'em_atendimento' ? 'Em Análise' : 'Aguardando'}
                                  </span>
                                </div>
                                
                                {isResolved && (
                                  <div className="bg-emerald-950/30 border border-emerald-900/30 p-2 rounded space-y-0.5">
                                    <span className="block font-sans font-bold text-emerald-400 text-[9px] uppercase tracking-wide">feedback de atendimento social:</span>
                                    <p className="text-slate-300 text-[10px] leading-relaxed">
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

          {/* 4. CURSO DESCUBRA MEI */}
          {activeTab === 'jovem_descubra_mei' && (
            <div id="descubra-mei-card" className="bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-slate-900 pb-3 font-sans">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="text-sm md:text-base font-bold tracking-tight text-white flex items-center">
                        Descubra MEI <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900/30 ml-1.5 font-mono font-bold">Público: 18+</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Trilha de Empreendedorismo e Gestão Autônoma para o Jovem de Pirapora-MG
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-805 text-[10px] text-right font-mono">
                    <span className="block text-slate-500 text-[9px]">SEU SCORE EMPREENDEDOR:</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {youngActiveObj ? youngActiveObj.score_empregabilidade : 0}% APTO
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 mb-4 leading-relaxed text-xs text-slate-300">
                  <p className="mb-1">
                    💡 O empreendedorismo autônomo (MEI) permite criar as suas próprias oportunidades de renda, prestar serviços na comunidade local e desenvolver autonomia financeira em Pirapora.
                  </p>
                </div>

                <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-3">Minicursos Disponíveis</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {MEI_COURSES.map((curso) => {
                    const prog = cursosProgresso.find(cp => cp.jovem_id === currentUser.id && cp.curso_id === curso.id);
                    const progressPercent = prog ? prog.progresso_percentual : 0;
                    const status = prog ? prog.status : 'Não Iniciado';

                    let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';
                    if (status === 'Iniciado') badgeColor = 'bg-blue-950/80 text-blue-400 border-blue-900/30';
                    if (status === 'Em Andamento') badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-900/30';
                    if (status === 'Concluido') badgeColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30';

                    return (
                      <div key={curso.id} className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-850 flex flex-col justify-between hover:border-slate-800/80 transition duration-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <h5 className="font-sans font-bold text-xs text-slate-200">{curso.titulo}</h5>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeColor} whitespace-nowrap`}>
                              {status === 'Concluido' ? 'Concluído ✓' : status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                            {curso.descricao}
                          </p>

                          <div className="text-[10px] font-mono text-slate-500 space-y-0.5 bg-slate-950/35 p-2 rounded border border-slate-900">
                            <div>CARGA: {curso.cargaHoraria}</div>
                            <div>
                              <span>CONTEÚDOS: </span>
                              <span className="text-slate-400 font-sans">{curso.conteudo.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-slate-900 space-y-3">
                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-mono font-black">
                              <span className="text-slate-500 uppercase">Progresso:</span>
                              <span className="text-slate-300 font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden p-0.5">
                              <div 
                                className={`h-full transition-all duration-350 rounded-full ${status === 'Concluido' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <a 
                              href={curso.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={() => {
                                if (status === 'Não Iniciado') {
                                  handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Iniciado', 10);
                                }
                              }}
                              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 rounded text-xs font-mono font-bold uppercase transition border border-slate-800 text-center flex items-center justify-center gap-1 cursor-pointer font-bold"
                            >
                              Assistir Aula Oficial ↗
                            </a>

                            <div className="grid grid-cols-3 gap-1 font-mono text-[9px]">
                              <button
                                onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Iniciado', 10)}
                                disabled={status === 'Concluido'}
                                className={`py-1 rounded font-bold uppercase transition border cursor-pointer ${status === 'Iniciado' ? 'bg-blue-900 border-blue-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                              >
                                10%
                              </button>
                              <button
                                onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Em Andamento', 50)}
                                disabled={status === 'Concluido'}
                                className={`py-1 rounded font-bold uppercase transition border cursor-pointer ${status === 'Em Andamento' ? 'bg-amber-900 border-amber-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                              >
                                50%
                              </button>
                              <button
                                onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'MEI', 'Concluido', 100)}
                                className={`py-1 rounded font-bold uppercase transition border cursor-pointer ${status === 'Concluido' ? 'bg-emerald-950 border-emerald-555 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                              >
                                Concluir
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

          {/* 5. SEU CURSO DESCUBRA JOVEM */}
          {activeTab === 'jovem_descubra_jovem' && (
            <div id="descubra-jovem-card" className="bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div className="w-full font-sans">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="text-sm md:text-base font-bold tracking-tight text-white flex items-center">
                        Descubra Jovem <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900/30 ml-1.5 font-mono font-bold">Público: 14 aos 18 anos</span>
                      </h3>
                      <p className="text-[10px] text-slate-405 mt-0.5">
                        Trilha de Desenvolvimento Humano, Pré-Aprendizagem e Cidadania para Jovens de Pirapora-MG
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-[10px] text-right font-mono">
                    <span className="block text-slate-500 text-[9px]">SEU SCORE SOCIAL & NÍVEL:</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {youngActiveObj ? `Nível ${youngActiveObj.nivel} (${youngActiveObj.pontos_totais} XP)` : 'Nível 1'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 mb-4 leading-relaxed text-xs text-slate-300">
                  <p className="mb-1">
                    🌟 <b>Encontre sua direção!</b> Esta trilha oferece capacitação em soft skills (inteligência emocional), matemática aplicada (raciocínio lógico) e cidadania para construir perspectivas no mercado formal de trabalho.
                  </p>
                </div>

                <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-3">Trilhas de Apoio Formativas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {DESCUBRA_JOVEM_COURSES.map((curso) => {
                    const prog = cursosProgresso.find(cp => cp.jovem_id === currentUser.id && cp.curso_id === curso.id);
                    const progressPercent = prog ? prog.progresso_percentual : 0;
                    const status = prog ? prog.status : 'Não Iniciado';

                    let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';
                    if (status === 'Iniciado') badgeColor = 'bg-blue-950/80 text-blue-400 border-blue-900/30';
                    if (status === 'Em Andamento') badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-900/30';
                    if (status === 'Concluido') badgeColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-900/30';

                    return (
                      <div key={curso.id} className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-850 flex flex-col justify-between hover:border-slate-800/80 transition duration-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <h5 className="font-sans font-bold text-xs text-slate-200">{curso.titulo}</h5>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeColor} whitespace-nowrap`}>
                              {status === 'Concluido' ? 'Concluído ✓' : status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                            {curso.descricao}
                          </p>

                          <div className="text-[10px] font-mono text-slate-500 space-y-0.5 bg-slate-950/35 p-2 rounded border border-slate-900">
                            <div>CARGA: {curso.cargaHoraria}</div>
                            <div>
                              <span>CONTEÚDOS: </span>
                              <span className="text-slate-400 font-sans">{curso.conteudo.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-slate-900 space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-mono font-black">
                              <span className="text-slate-500 uppercase">Progresso:</span>
                              <span className="text-slate-300 font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden p-0.5">
                              <div 
                                className={`h-full transition-all duration-350 rounded-full ${status === 'Concluido' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <a 
                              href={curso.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={() => {
                                if (status === 'Não Iniciado') {
                                  handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Iniciado', 10);
                                }
                              }}
                              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-305 rounded text-xs font-mono font-bold uppercase transition border border-slate-800 text-center flex items-center justify-center gap-1 cursor-pointer font-bold"
                            >
                              Assistir Aula Oficial ↗
                            </a>

                            <div className="grid grid-cols-3 gap-1 font-mono text-[9px]">
                              <button
                                onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Iniciado', 10)}
                                disabled={status === 'Concluido'}
                                className={`py-1 rounded font-bold uppercase transition border cursor-pointer ${status === 'Iniciado' ? 'bg-blue-900 border-blue-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                              >
                                10%
                              </button>
                              <button
                                onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Em Andamento', 50)}
                                disabled={status === 'Concluido'}
                                className={`py-1 rounded font-bold uppercase transition border cursor-pointer ${status === 'Em Andamento' ? 'bg-amber-900 border-amber-700 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                              >
                                50%
                              </button>
                              <button
                                onClick={() => handleAtualizarCursoProgresso(curso.id, curso.titulo, 'Descubra Jovem', 'Concluido', 100)}
                                className={`py-1 rounded font-bold uppercase transition border cursor-pointer ${status === 'Concluido' ? 'bg-emerald-950 border-emerald-555 text-white' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                              >
                                Concluir
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

        </div>
      )}

    </div>
  );
}
