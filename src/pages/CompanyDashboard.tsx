import React from 'react';
import { Plus, Compass } from 'lucide-react';
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
    <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-6" id="company-dashboard-panels">
      
      {activeTab.startsWith('empresa_') && (
        <div className="space-y-6 animate-fade-in" id="tab-company">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">

            {/* CREATE VAGA REGISTRATION FORM */}
            {activeTab === 'empresa_publicar' && (
              <div id="publicar-vaga-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                  <Plus className="w-7 h-7 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-white text-lg md:text-xl uppercase tracking-wide font-mono">
                      Lançar Nova Oportunidade Jovem Aprendiz
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">Publique uma vaga corporativa no sistema para que o algoritmo de matchmaking identifique instantaneamente jovens elegíveis pelo critério de proximidade.</p>
                  </div>
                </div>

                <form onSubmit={handleCriarVaga} className="space-y-6 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Título Atrativo da Vaga</label>
                      <input 
                        id="input-vaga-titulo"
                        type="text" 
                        required
                        placeholder="Ex: Aprendiz em Automação Industrial, Auxiliar de Almoxarifado"
                        value={newVaga.titulo}
                        onChange={(e) => setNewVaga({...newVaga, titulo: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm text-slate-400 font-semibold mb-2 font-mono text-emerald-450 uppercase tracking-wider">Habilidades Desejadas (separadas por vírgula)</label>
                      <input 
                        id="input-vaga-habilidades"
                        type="text" 
                        placeholder="Ex: Informática Básica, Excel, Trabalho em Equipe, Organização"
                        value={newVaga.habilidades}
                        onChange={(e) => setNewVaga({...newVaga, habilidades: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3 text-white rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Quantidade de Vagas Oferecidas</label>
                      <input 
                        id="input-vaga-qtd"
                        type="number"
                        min="1"
                        required
                        value={newVaga.quantidade}
                        onChange={(e) => setNewVaga({...newVaga, quantidade: parseInt(e.target.value) || 1})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3 text-white rounded-lg font-mono font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Cidade Sede da Atividade</label>
                      <select 
                        id="select-vaga-cidade"
                        value={newVaga.cidade}
                        onChange={(e) => setNewVaga({...newVaga, cidade: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3 text-white rounded-lg font-mono font-medium focus:border-emerald-500 focus:outline-none">
                        <option value="Pirapora">Pirapora (MG)</option>
                        <option value="Buritizeiro">Buritizeiro (MG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2 font-mono">Bairro Polo da Unidade</label>
                      <select 
                        id="select-vaga-bairro"
                        value={newVaga.bairro}
                        onChange={(e) => setNewVaga({...newVaga, bairro: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3 text-white rounded-lg font-mono font-medium">
                        <option value="Industrial">Bairro Industrial</option>
                        <option value="Centro">Centro</option>
                        <option value="Santo Antônio">Santo Antônio</option>
                        <option value="Planalto">Planalto</option>
                        <option value="São Geraldo">São Geraldo</option>
                        <option value="Vila Rica">Vila Rica</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Requisitos e Instruções Finais</label>
                      <textarea 
                        id="input-vaga-requisitos"
                        required
                        rows={3}
                        placeholder="Ex: Ensino Médio em andamento, preferencialmente morar na região do Santo Antônio ou Centro..."
                        value={newVaga.requisitos}
                        onChange={(e) => setNewVaga({...newVaga, requisitos: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3.5 text-white rounded-lg focus:border-emerald-500 focus:outline-none h-20 resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2 font-mono">Descrição Breve das Tarefas</label>
                      <textarea
                        id="input-vaga-descricao"
                        required
                        rows={3}
                        placeholder="Ex: Atuar na gerência administrativa local, auxiliar no controle de planilhas e atendimento geral..."
                        value={newVaga.descricao}
                        onChange={(e) => setNewVaga({...newVaga, descricao: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-850 text-sm p-3.5 text-white rounded-lg focus:border-emerald-500 focus:outline-none h-20 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="font-sans">
                    <label className="block text-xs md:text-sm text-slate-300 font-semibold mb-2">Assinatura da Empresa Parceira</label>
                    <select 
                      id="select-vaga-empresa"
                      value={newVaga.empresa_id}
                      onChange={(e) => setNewVaga({...newVaga, empresa_id: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-850 text-sm p-3 text-white rounded-lg font-mono font-medium">
                      <option value="empresa-1">Minas Ligas S.A. (Metalurgia/Logística)</option>
                      <option value="empresa-2">Liasa S.A. (Produção de Silício Metálico)</option>
                      <option value="empresa-3">Comercial Pirapora Ltda (Comércio/Varejo)</option>
                    </select>
                  </div>

                  <button 
                    id="btn-criar-vaga"
                    type="submit" 
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm md:text-base transition uppercase font-mono tracking-wider shadow-lg shadow-emerald-900/30 cursor-pointer">
                    Lançar Oportunidade no Barramento Descubra ✓
                  </button>
                  
                </form>
              </div>
            )}

            {/* INTERACTIVE ALGORITHM MATCHMAKING RESULT DESK (COMPANY DEMO) */}
            {activeTab === 'empresa_match' && (
              <div id="matchmaking-inteligente-card" className="col-span-12 max-w-5xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-3 mb-5 border-b border-slate-900 pb-4">
                    <Compass className="w-7 h-7 text-emerald-400" />
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
                          <div key={v.id} className="bg-slate-900/70 p-5 md:p-6 rounded-xl border border-slate-850 shadow-inner">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-950 pb-3 flex-wrap gap-2">
                              <div>
                                <span className="text-xs uppercase font-extrabold text-emerald-400 font-mono bg-emerald-950 px-3 py-1 rounded border border-emerald-900/30">
                                  {v.empresa_nome} (Polo da vaga: {v.bairro})
                                </span>
                                <h4 className="text-base md:text-lg font-bold text-white mt-2.5 uppercase font-mono">{v.titulo}</h4>
                              </div>
                              <span className="text-xs md:text-sm text-slate-400 font-mono font-bold bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">Qtd Autorizada: {v.quantidade}</span>
                            </div>

                            {/* MATCH SUGGESTIONS LIST PANEL */}
                            <div className="space-y-4 mt-4">
                              <span className="block text-xs text-slate-400 font-black uppercase font-mono tracking-wider">Aptidões e Proximidades Calculadas:</span>
                              
                              {jovens.filter(j => j.status !== 'aprendiz_contratado').map((j) => {
                                const distBonus = getProximityBonus(j.bairro, v.bairro);
                                
                                let pct = 60;
                                if (j.bairro === v.bairro) pct += 25;
                                if (j.score_empregabilidade > 65) pct += 10;
                                if (j.frequencia > 80) pct += 5;

                                return (
                                  <div key={j.id} className="bg-slate-950 p-4 md:p-5 rounded-lg border border-slate-850/80 flex flex-col transition hover:border-emerald-600/40">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                          <span className="font-extrabold text-white text-base md:text-lg">{j.nome}</span>
                                          <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-md font-mono font-bold tracking-wider ${distBonus.bg}`}>
                                            {distBonus.text}
                                          </span>
                                          <span className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono text-slate-400">
                                            {j.idade} anos | {j.genero}
                                          </span>
                                        </div>
                                        <p className="text-sm text-slate-405 font-mono mt-2 leading-relaxed">
                                          Bairro Residência: <b className="text-slate-300 font-bold">{j.bairro}</b> | Frequência Escolar: <b className="text-slate-300 font-bold">{j.frequencia}%</b> | Score Ativo: <b className="text-emerald-450 font-mono font-black">{j.score_empregabilidade} pts</b>
                                        </p>
                                      </div>

                                      {/* MATCH EMBLEM SCORE */}
                                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-0 border-slate-900 pt-3 sm:pt-0">
                                        <div className="text-left sm:text-right">
                                          <span className="block text-emerald-400 font-mono font-black text-base md:text-lg">{pct}% Match</span>
                                          <span className="text-[10px] text-slate-500 font-mono italic">Prioridade Algorítmica</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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

    </div>
  );
}
