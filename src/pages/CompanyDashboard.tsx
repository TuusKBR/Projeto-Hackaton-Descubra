import React, { useState } from 'react';
import { Plus, Compass, X, Award, Sparkles, Check, Users, Search, MessageSquare } from 'lucide-react';
import { Vaga, Jovem } from '../types';

interface CompanyDashboardProps {
  activeTab: string;
  vagas: Vaga[];
  jovens: Jovem[];
  newVaga: {
    titulo: string;
    habilidades: string;
    quantidade: number;
    cidade: string;
    bairro: string;
    requisitos: string;
    descricao: string;
    empresa_id: string;
  };
  setNewVaga: (vaga: any) => void;
  handleCriarVaga: (e: React.FormEvent) => void;
}

export default function CompanyDashboard({
  activeTab,
  vagas,
  jovens,
  newVaga,
  setNewVaga,
  handleCriarVaga
}: CompanyDashboardProps) {
  
  const [selectedVacancyForMatch, setSelectedVacancyForMatch] = useState<Vaga | null>(null);
  
  // Calculate coordinates distance helper for frontend matches rendering
  const getProximityBonus = (b1: string, b2: string) => {
    if (b1 === b2) return { text: 'Mesmo Bairro', bg: 'bg-emerald-950/70 text-emerald-400 border border-emerald-900/40' };
    const proximas: { [key: string]: string[] } = {
      'Santo Antônio': ['Centro', 'São Geraldo', 'Vila Rica'],
      'Planalto': ['Centro', 'Industrial'],
      'São Geraldo': ['Santo Antônio', 'Centro', 'Vila Rica'],
      'Vila Rica': ['Santo Antônio', 'São Geraldo', 'Cidade Jardim'],
      'Centro': ['Santo Antônio', 'Planalto', 'São Geraldo', 'Industrial'],
      'Industrial': ['Planalto', 'Centro']
    };
    if (proximas[b1]?.includes(b2)) return { text: 'Região Próxima', bg: 'bg-teal-950/70 text-teal-300 border border-teal-900/40' };
    return { text: 'Outra Região', bg: 'bg-slate-900 text-slate-400 border border-slate-800' };
  };

  return (
    <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-4" id="company-dashboard-panels">
      
      {activeTab.startsWith('empresa_') && (
        <div className="space-y-4 animate-fade-in" id="tab-company">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-fade-in">
 
             {/* CREATE VAGA REGISTRATION FORM */}
             {activeTab === 'empresa_publicar' && (
               <div id="publicar-vaga-card" className="col-span-12 bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
                 <div className="flex items-center gap-2.5 mb-3 border-b border-slate-900 pb-2.5">
                   <Plus className="w-6 h-6 text-emerald-400" />
                   <div>
                     <h3 className="font-bold text-white text-sm md:text-base uppercase tracking-wide font-mono">
                       Lançar Nova Oportunidade Jovem Aprendiz
                     </h3>
                     <p className="text-[11px] text-slate-404 mt-0.5">Publique uma vaga corporativa para matchmaking imediato.</p>
                   </div>
                 </div>
 
                 <form onSubmit={handleCriarVaga} className="space-y-4 w-full">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-sans">
                     <div>
                       <label className="block text-[11px] text-slate-300 font-semibold mb-1">Título Atrativo da Vaga</label>
                       <input 
                         id="input-vaga-titulo"
                         type="text" 
                         required
                         placeholder="Ex: Aprendiz em Automação, Auxiliar de Almoxarifado"
                         value={newVaga.titulo}
                         onChange={(e) => setNewVaga({...newVaga, titulo: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-2 text-white rounded focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                       />
                     </div>
 
                     <div>
                       <label className="block text-[11px] text-slate-400 font-semibold mb-1 font-mono text-emerald-450 uppercase tracking-wider">Habilidades Desejadas</label>
                       <input 
                         id="input-vaga-habilidades"
                         type="text" 
                         placeholder="Ex: Informática Básica, Excel, Trabalho em Equipe"
                         value={newVaga.habilidades}
                         onChange={(e) => setNewVaga({...newVaga, habilidades: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-2 text-white rounded focus:border-emerald-500 focus:outline-none font-mono"
                       />
                     </div>
                   </div>
 
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-sans">
                     <div>
                       <label className="block text-[11px] text-slate-300 font-semibold mb-1">Quantidade de Vagas Oferecidas</label>
                       <input 
                         id="input-vaga-qtd"
                         type="number"
                         min="1"
                         required
                         value={newVaga.quantidade}
                         onChange={(e) => setNewVaga({...newVaga, quantidade: parseInt(e.target.value) || 1})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-2 text-white rounded font-mono font-bold focus:border-emerald-500 focus:outline-none"
                       />
                     </div>
 
                     <div>
                       <label className="block text-[11px] text-slate-300 font-semibold mb-1">Cidade Sede da Atividade</label>
                       <select 
                         id="select-vaga-cidade"
                         value={newVaga.cidade}
                         onChange={(e) => setNewVaga({...newVaga, cidade: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-1.5 text-white rounded font-mono font-medium focus:border-emerald-500 focus:outline-none">
                         <option value="Pirapora">Pirapora (MG)</option>
                         <option value="Buritizeiro">Buritizeiro (MG)</option>
                       </select>
                     </div>
 
                     <div>
                       <label className="block text-[11px] text-slate-300 font-semibold mb-1 font-mono">Bairro Polo da Unidade</label>
                       <select 
                         id="select-vaga-bairro"
                         value={newVaga.bairro}
                         onChange={(e) => setNewVaga({...newVaga, bairro: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-1.5 text-white rounded font-mono font-medium">
                         <option value="Industrial">Bairro Industrial</option>
                         <option value="Centro">Centro</option>
                         <option value="Santo Antônio">Santo Antônio</option>
                         <option value="Planalto">Planalto</option>
                         <option value="São Geraldo">São Geraldo</option>
                         <option value="Vila Rica">Vila Rica</option>
                       </select>
                     </div>
                   </div>
 
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-sans">
                     <div>
                       <label className="block text-[11px] text-slate-300 font-semibold mb-1">Requisitos e Instruções Finais</label>
                       <textarea 
                         id="input-vaga-requisitos"
                         required
                         rows={2}
                         placeholder="Ex: Ensino Médio em andamento, preferencialmente morar na região..."
                         value={newVaga.requisitos}
                         onChange={(e) => setNewVaga({...newVaga, requisitos: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-2 text-white rounded focus:border-emerald-500 focus:outline-none h-14 resize-none leading-relaxed"
                       />
                     </div>
 
                     <div>
                       <label className="block text-[11px] text-slate-300 font-semibold mb-1 font-mono">Descrição Breve das Tarefas</label>
                       <textarea
                         id="input-vaga-descricao"
                         required
                         rows={2}
                         placeholder="Ex: Auxiliar no controle de planilhas e atendimento geral..."
                         value={newVaga.descricao}
                         onChange={(e) => setNewVaga({...newVaga, descricao: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-850 text-xs p-2 text-white rounded focus:border-emerald-500 focus:outline-none h-14 resize-none leading-relaxed"
                       />
                     </div>
                   </div>
 
                   <div className="font-sans">
                     <label className="block text-[11px] text-slate-300 font-semibold mb-1">Assinatura da Empresa Parceira</label>
                     <select 
                       id="select-vaga-empresa"
                       value={newVaga.empresa_id}
                       onChange={(e) => setNewVaga({...newVaga, empresa_id: e.target.value})}
                       className="w-full bg-slate-900 border border-slate-850 text-xs p-1.5 text-white rounded font-mono font-medium">
                       <option value="empresa-1">Minas Ligas S.A. (Metalurgia/Logística)</option>
                       <option value="empresa-2">Liasa S.A. (Produção de Silicon Metálico)</option>
                       <option value="empresa-3">Comercial Pirapora Ltda (Comércio/Varejo)</option>
                     </select>
                   </div>
 
                   <button 
                     id="btn-criar-vaga"
                     type="submit" 
                     className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs transition uppercase font-mono tracking-wider shadow-lg shadow-emerald-900/30 cursor-pointer">
                     Lançar Oportunidade no Barramento Descubra ✓
                   </button>
                   
                 </form>
               </div>
             )}

            {/* INTERACTIVE ALGORITHM MATCHMAKING RESULT DESK (COMPANY DEMO) */}
            {activeTab === 'empresa_match' && (
              <div id="matchmaking-inteligente-card" className="col-span-12 bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                    <Compass className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-xl md:text-2xl uppercase tracking-wide font-mono">
                        Algoritmo de Compatibilidade da Vaga (Matchmaking Municipal)
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400 mt-1">
                        Sugestões automatizadas refinadas por inteligência geográfica: prioriza o menor custo de deslocamento urbano e proximidade do CRAS correspondente.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {vagas.length === 0 ? (
                      <div className="text-center py-16 bg-slate-900/30 rounded-xl border border-slate-850 border-dashed text-slate-500 font-mono text-sm leading-relaxed">
                        Nenhuma vaga publicada disponível para matchmaking. Lance uma vaga primeiro!
                      </div>
                    ) : (
                      vagas.map((v) => {
                        return (
                          <div key={v.id} className="bg-slate-900/70 p-3.5 md:p-4 rounded-lg border border-slate-850 shadow-inner">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-950 pb-3 flex-wrap gap-2">
                              <div>
                                <span className="text-xs uppercase font-extrabold text-emerald-400 font-mono bg-emerald-950 px-3 py-1 rounded border border-emerald-900/30">
                                  {v.empresa_nome} (Polo da vaga: {v.bairro})
                                </span>
                                <h4 className="text-sm md:text-base font-bold text-white mt-1.5 uppercase font-mono">{v.titulo}</h4>
                              </div>
                              <span className="text-xs md:text-sm text-slate-400 font-mono font-bold bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">Qtd Autorizada: {v.quantidade}</span>
                            </div>

                            {/* MATCH SUGGESTIONS LIST PANEL */}
                            <div className="space-y-3 mt-3 bg-slate-950/40 p-3 border border-slate-900 rounded-md">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-0.5">
                                  <span className="block text-xs text-slate-400 font-black uppercase font-mono tracking-wider">Aptidões e Proximidades Computadas:</span>
                                  <p className="text-xs text-slate-500 font-sans">
                                    Encontramos {jovens.filter(j => j.status !== 'aprendiz_contratado').length} jovens aptos no cadastro ativo municipal de Pirapora.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  id={`btn-ver-recomendacoes-${v.id}`}
                                  onClick={() => setSelectedVacancyForMatch(v)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-mono font-black text-xs uppercase text-white rounded transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center"
                                >
                                  <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                                  Ver Recomendações
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* POPUP MODAL: RECOMENDAÇÕES DA VAGA (TOP 3 RANK + 5 SUPOSTOSEOUTROS) */}
      {selectedVacancyForMatch && (() => {
        const v = selectedVacancyForMatch;
        const candidates = jovens
          .filter(j => j.status !== 'aprendiz_contratado')
          .map(j => {
            const distBonus = getProximityBonus(j.bairro, v.bairro);
            let pct = 60;
            if (j.bairro === v.bairro) pct += 25;
            if (j.score_empregabilidade > 65) pct += 10;
            if (j.frequencia > 80) pct += 5;
            return { ...j, pct, distBonus };
          })
          .sort((a, b) => {
            if (b.pct !== a.pct) return b.pct - a.pct;
            return b.score_empregabilidade - a.score_empregabilidade;
          });

        const top3 = candidates.slice(0, 3);
        const supplemental5 = candidates.slice(3, 8);

        return (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div 
              className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-xl shadow-2xl p-4 md:p-5 relative overflow-y-auto max-h-[85vh] duration-200"
              id="pop-up-recomendacoes-vaga"
            >
              {/* Close button */}
              <button 
                id="btn-close-recomendacoes-modal"
                type="button"
                onClick={() => setSelectedVacancyForMatch(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-900 p-2 rounded-lg transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Section */}
              <div className="border-b border-slate-900 pb-5 mb-6">
                <span className="text-[10px] md:text-xs font-black uppercase text-emerald-400 font-mono tracking-widest bg-emerald-950/50 px-3 py-1 rounded border border-emerald-900/30">
                  {v.empresa_nome}
                </span>
                <h3 className="font-bold text-white text-xl md:text-2xl mt-3 uppercase tracking-wide font-mono">
                  Recomendações para a Vaga: {v.titulo}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                  Polo de Atribuição: <strong className="text-slate-300">{v.bairro}</strong> • Critérios Inteligentes: Proximidade geográfica (menor custo de transporte), Score de Empregabilidade e Frequência das Microtarefas.
                </p>
              </div>

              {candidates.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-slate-800/80 text-slate-500 font-mono text-sm leading-relaxed">
                  Nenhum jovem qualificado ou cadastrado no momento para esta vaga.
                </div>
              ) : (
                <div className="space-y-8">
                  {/* SECTION 1: TOP 3 RANKING */}
                  <div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 border-l-2 border-amber-500 pl-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Top 3 Jovens Recomendados (Rank de Compatibilidade)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {top3.map((j, idx) => {
                        // Medals customization
                        let medalBg = 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50';
                        let medalTitle = '🏆 1º Lugar';
                        let medalText = 'text-amber-400';
                        
                        if (idx === 1) {
                          medalBg = 'border-slate-500/30 bg-slate-900/40 hover:border-slate-400/50';
                          medalTitle = '🥈 2º Lugar';
                          medalText = 'text-slate-300';
                        } else if (idx === 2) {
                          medalBg = 'border-orange-500/30 bg-orange-950/10 hover:border-orange-500/50';
                          medalTitle = '🥉 3º Lugar';
                          medalText = 'text-orange-400';
                        }

                        return (
                          <div 
                            key={j.id} 
                            className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${medalBg}`}
                          >
                            <div className="absolute top-0 right-0 p-3 bg-slate-900/40 border-l border-b border-inherit rounded-bl-xl font-mono font-black text-xs text-white">
                              {j.pct}% Match
                            </div>

                            <div className="space-y-3.5">
                              <span className={`block text-[10px] font-black font-mono tracking-widest uppercase ${medalText}`}>
                                {medalTitle}
                              </span>
                              
                              <div>
                                <h5 className="font-extrabold text-white text-sm md:text-base tracking-tight leading-tight group-hover:text-amber-300">{j.nome}</h5>
                                <span className="text-[10px] text-slate-505 font-mono">
                                  {j.idade} anos • {j.genero}
                                </span>
                              </div>

                              <div className="space-y-1 text-[11px] font-mono text-slate-350 bg-slate-955/70 p-2.5 rounded border border-slate-900">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 leading-tight">Bairro:</span>
                                  <span className="text-white font-bold max-w-[100px] truncate leading-tight" title={j.bairro}>{j.bairro}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 leading-tight">Proximidade:</span>
                                  <span className="text-emerald-450 font-semibold leading-tight">{j.distBonus.text}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 leading-tight">Frequência:</span>
                                  <span className="text-slate-300 leading-tight">{j.frequencia}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 leading-tight">Score Ativo:</span>
                                  <span className="text-emerald-400 font-bold leading-tight">{j.score_empregabilidade} pts</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-900">
                              <a 
                                href={`https://wa.me/55${j.telefone || '38999812345'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 px-3 bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-400 text-xs text-slate-300 rounded font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Contatar Candidato
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 2: SUPPLEMENTAL 5 RECOMENDADOS */}
                  {supplemental5.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 border-l-2 border-emerald-500 pl-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        Próximas 5 Alternativas de Impacto Recomendadas
                      </h4>

                      <div className="space-y-2.5">
                        {supplemental5.map((j) => {
                          return (
                            <div 
                              key={j.id} 
                              className="bg-slate-900/30 hover:bg-slate-900/60 p-2.5 md:p-3 border border-slate-850 rounded-lg transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <span className="font-extrabold text-white text-sm md:text-base leading-tight">{j.nome}</span>
                                  <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded font-mono font-black ${j.distBonus.bg}`}>
                                    {j.distBonus.text}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {j.idade} anos | {j.genero}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-405 mt-1.5">
                                  Residência: <strong className="text-slate-300">{j.bairro}</strong> • Frequência: <strong className="text-slate-300">{j.frequencia}%</strong> • Score: <strong className="text-emerald-450">{j.score_empregabilidade} pts</strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-4 border-t sm:border-0 border-slate-900 pt-2 sm:pt-0 justify-between sm:justify-start">
                                <div className="text-left sm:text-right">
                                  <span className="block text-emerald-450 font-black text-sm">{j.pct}% Match</span>
                                  <span className="text-[8px] text-slate-500 uppercase tracking-wider block">Compatibilidade</span>
                                </div>
                                <a 
                                  href={`https://wa.me/55${j.telefone || '38999812345'}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/50 hover:text-emerald-400 text-[11px] text-slate-400 rounded transition flex items-center gap-1.5 cursor-pointer font-bold"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Chamar
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal footer back to context action */}
              <div className="mt-8 pt-4 border-t border-slate-900 flex justify-end">
                <button
                  type="button"
                  id="btn-close-modal-bottom"
                  onClick={() => setSelectedVacancyForMatch(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Fechar Recomendações
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
