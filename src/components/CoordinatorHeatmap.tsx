import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon, LocateFixed } from 'lucide-react';
import { Jovem } from '../types';
import { calcularRisco } from '../utils/calculadoraRisco';

const token = import.meta.env.VITE_MAPBOX_TOKEN?.trim() || '';
const center: [number, number] = [-44.9392, -17.3444];
const riskLevels = [
  { key: 'baixo', label: 'Baixo risco', color: '#34d399' },
  { key: 'medio', label: 'Médio risco', color: '#fbbf24' },
  { key: 'alto', label: 'Alto risco', color: '#f87171' },
] as const;
function countRisk(members: Jovem[]) {
  const counts = { baixo: 0, medio: 0, alto: 0 };
  members.forEach(j => { counts[calcularRisco(j).classificacao]++; });
  return counts;
}

export default function CoordinatorHeatmap({ jovens }: { jovens: Jovem[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('levels');
  const [bairro, setBairro] = useState('');
  const [risco, setRisco] = useState('');
  const [selected, setSelected] = useState('');
  const [attempt, setAttempt] = useState(0);
  const keyOf = (j: Jovem) => JSON.stringify([j.cidade, j.bairro]);
  const bairros = useMemo(() => Array.from(new Set(jovens.map(keyOf))).sort(), [jovens]);
  const filtered = useMemo(() => jovens.filter(j => (!bairro || keyOf(j) === bairro) &&
    (!risco || calcularRisco(j).classificacao === risco)), [jovens, bairro, risco]);
  const located = useMemo(() => filtered.filter(j => Number.isFinite(j.lat) && Number.isFinite(j.lng) &&
    Math.abs(j.lat) <= 85 && Math.abs(j.lng) <= 180 && !(j.lat === 0 && j.lng === 0)), [filtered]);
  const groups = useMemo(() => {
    const result = new globalThis.Map<string, Jovem[]>();
    located.forEach(j => result.set(keyOf(j), [...(result.get(keyOf(j)) || []), j]));
    return Array.from(result, ([key, members]) => ({ key, members, risks: countRisk(members),
      label: `${members[0].bairro} · ${members[0].cidade}`,
      lng: members.reduce((n, j) => n + j.lng, 0) / members.length,
      lat: members.reduce((n, j) => n + j.lat, 0) / members.length,
    })).sort((a, b) => b.members.length - a.members.length);
  }, [located]);
  const points = useMemo(() => ({ type: 'FeatureCollection' as const, features: located.map(j => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [j.lng, j.lat] },
    properties: { weight: mode === 'density' ? 1 : Math.min(1, calcularRisco(j).pontuacao / 185) },
  })) }), [located, mode]);
  const neighborhoods = useMemo(() => ({ type: 'FeatureCollection' as const, features: groups.map(g => ({
    type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: [g.lng, g.lat] },
    properties: { key: g.key, count: g.members.length },
  })) }), [groups]);
  const detail = groups.find(g => g.key === selected);
  const totals = useMemo(() => countRisk(located), [located]);

  useEffect(() => {
    if (!token || !container.current) return;
    setError('');
    setReady(false);
    let instance: mapboxgl.Map;
    let observer: ResizeObserver | undefined;
    try {
      instance = new mapboxgl.Map({ container: container.current, accessToken: token,
        style: 'mapbox://styles/mapbox/dark-v11', center, zoom: 12 });
      map.current = instance;
      instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      instance.on('error', () => setError('Não foi possível carregar todos os recursos do mapa. Verifique a conexão, o token Mapbox e os domínios autorizados na conta.'));
      instance.on('load', () => {
        instance.addSource('jovens', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        instance.addLayer({ id: 'heat', type: 'heatmap', source: 'jovens', paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1.1,
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, 20, 14, 55, 18, 85],
          'heatmap-opacity': 0.8,
          'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(16,185,129,0)', 0.15, '#10b981', 0.4, '#22d3ee', 0.6, '#facc15', 0.8, '#fb923c', 1, '#ef4444'],
        } });
        instance.addSource('bairros', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        instance.addLayer({ id: 'bairros', type: 'circle', source: 'bairros', paint: {
          'circle-radius': 15, 'circle-color': '#0f172a', 'circle-stroke-color': '#34d399', 'circle-stroke-width': 2,
        } });
        instance.addLayer({ id: 'counts', type: 'symbol', source: 'bairros', layout: {
          'text-field': ['to-string', ['get', 'count']], 'text-size': 12, 'text-allow-overlap': true,
        }, paint: { 'text-color': '#ffffff' } });
        instance.on('click', 'bairros', e => setSelected(e.features?.[0]?.properties?.key || ''));
        instance.on('mouseenter', 'bairros', () => { instance.getCanvas().style.cursor = 'pointer'; });
        instance.on('mouseleave', 'bairros', () => { instance.getCanvas().style.cursor = ''; });
        setError('');
        setReady(true);
      });
      observer = new ResizeObserver(() => instance.resize());
      observer.observe(container.current);
    } catch {
      setError('Não foi possível iniciar o mapa. Verifique se o navegador oferece suporte a WebGL.');
    }
    return () => { observer?.disconnect(); instance?.remove(); map.current = null; };
  }, [attempt]);

  useEffect(() => {
    if (!ready || !map.current) return;
    (map.current.getSource('jovens') as GeoJSONSource).setData(points);
    (map.current.getSource('bairros') as GeoJSONSource).setData(neighborhoods);
  }, [ready, points, neighborhoods]);

  useEffect(() => {
    const instance = map.current;
    if (!ready || !instance) return;
    const visibility = mode === 'levels' ? 'none' : 'visible';
    ['heat', 'bairros', 'counts'].forEach(id => instance.setLayoutProperty(id, 'visibility', visibility));
    if (mode !== 'levels') return;

    // One proportional ring per neighborhood keeps overlapping reference coordinates readable.
    const markers = groups.map(group => {
      const greenEnd = group.risks.baixo / group.members.length * 100;
      const yellowEnd = greenEnd + group.risks.medio / group.members.length * 100;
      const button = document.createElement('button');
      button.type = 'button';
      const description = `${group.label}: ${group.members.length} jovens; ${group.risks.baixo} em baixo risco, ${group.risks.medio} em médio risco e ${group.risks.alto} em alto risco`;
      button.setAttribute('aria-label', description);
      button.setAttribute('aria-pressed', String(selected === group.key));
      button.title = description;
      button.style.cssText = 'width:48px;height:48px;border:2px solid #0f172a;border-radius:50%;padding:5px;cursor:pointer;box-shadow:0 3px 12px #0008;';
      button.style.background = `conic-gradient(#34d399 0% ${greenEnd}%, #fbbf24 ${greenEnd}% ${yellowEnd}%, #f87171 ${yellowEnd}% 100%)`;
      if (selected === group.key) button.style.borderColor = '#ffffff';
      const count = document.createElement('span');
      count.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;background:#0f172a;color:white;font:bold 13px system-ui;';
      count.textContent = String(group.members.length);
      button.appendChild(count);
      button.addEventListener('click', () => setSelected(group.key));
      const marker = new mapboxgl.Marker({ element: button }).setLngLat([group.lng, group.lat]).addTo(instance);
      button.setAttribute('role', 'button');
      return marker;
    });
    return () => { markers.forEach(marker => marker.remove()); };
  }, [ready, mode, groups, selected]);

  const fit = () => {
    if (!map.current || !located.length) return;
    const bounds = new mapboxgl.LngLatBounds();
    located.forEach(j => bounds.extend([j.lng, j.lat]));
    map.current.fitBounds(bounds, { padding: 65, maxZoom: 13, duration: 700 });
  };
  useEffect(() => { if (ready) fit(); }, [ready, located]);

  const selectGroup = (key: string) => {
    setSelected(key);
    const group = groups.find(g => g.key === key);
    if (group) map.current?.flyTo({ center: [group.lng, group.lat], zoom: 14 });
  };
  const selectClass = 'bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 max-w-full';
  return (
    <section id="mapa-calor-card" className="lg:col-span-12 w-full min-w-0 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      <header className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3"><MapIcon className="text-emerald-400 w-7 h-7" /><div>
          <h3 className="text-xl font-bold text-white">Mapa de calor de Pirapora e região</h3>
          <p className="text-sm text-slate-400 mt-1">Distribuição territorial dos jovens acompanhados pelo programa</p>
        </div></div>
        <div className="flex flex-wrap gap-3 mt-5">
          <label className="text-xs text-slate-400 flex flex-col gap-1">Visualização<select className={selectClass} value={mode} onChange={e => setMode(e.target.value)}>
            <option value="levels">Níveis de risco por bairro</option>
            <option value="density">Concentração de jovens</option><option value="risk">Concentração ponderada por risco</option>
          </select></label>
          <label className="text-xs text-slate-400 flex flex-col gap-1">Bairro<select className={selectClass} value={bairro} onChange={e => { setBairro(e.target.value); setSelected(''); }}>
            <option value="">Todos os bairros</option>{bairros.map(key => { const [city, name] = JSON.parse(key); return <option key={key} value={key}>{name} · {city}</option>; })}
          </select></label>
          <label className="text-xs text-slate-400 flex flex-col gap-1">Risco de evasão<select className={selectClass} value={risco} onChange={e => { setRisco(e.target.value); setSelected(''); }}>
            <option value="">Todos os níveis</option><option value="baixo">Baixo</option><option value="medio">Médio</option><option value="alto">Alto</option>
          </select></label>
        </div>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3 text-sm border-b border-slate-800 text-slate-400">
            <span><b className="text-white">{located.length}</b> jovens no mapa</span><span><b className="text-white">{groups.length}</b> bairros</span>
            {riskLevels.map(level => <span key={level.key}><b style={{ color: level.color }}>{totals[level.key]}</b> {level.label.toLowerCase()}</span>)}
          </div>
          <div className="relative bg-slate-900">
            <div ref={container} className="h-[420px] md:h-[560px]" role="region" aria-label="Mapa interativo de distribuição e risco dos jovens" />
            {!token ? <div className="absolute inset-0 flex items-center justify-center p-8"><div className="max-w-md text-center">
              <MapIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" /><h4 className="text-white font-bold text-lg">Configure o mapa Mapbox</h4>
              <p className="text-slate-300 text-sm mt-3">Adicione seu token público em <code>.env.local</code>:</p>
              <code className="block bg-slate-950 rounded-lg p-3 my-3 text-emerald-400 text-xs break-all">VITE_MAPBOX_TOKEN=pk.seu_token</code>
              <p className="text-slate-400 text-sm">Depois, reinicie o servidor com npm run dev. Os indicadores dos bairros já estão disponíveis ao lado.</p>
            </div></div> : <>
              {!ready && !error && <p role="status" className="absolute top-4 left-4 bg-slate-950 p-3 rounded-lg text-sm text-slate-200">Carregando mapa…</p>}
              <button type="button" onClick={fit} disabled={!ready || !located.length} className="absolute top-4 left-4 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 disabled:hidden flex gap-2 items-center text-xs"><LocateFixed size={16} />Enquadrar dados</button>
            </>}
            {error && <div role="alert" className="absolute bottom-12 left-4 right-4 bg-slate-950 border border-amber-500/50 p-4 rounded-lg text-sm text-amber-200">{error}<button type="button" className="block mt-2 underline" onClick={() => setAttempt(n => n + 1)}>Tentar novamente</button></div>}
          </div>
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            {mode === 'levels' ? <>
              <div className="flex flex-wrap gap-4">{riskLevels.map(level => <span key={level.key} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: level.color }} />{level.label}</span>)}</div>
              <p>Cada círculo mostra o total de jovens do bairro. As faixas coloridas representam a proporção em cada nível de risco, incluindo os jovens de baixo risco. Selecione um bairro para ver as quantidades.</p>
            </> : <>
              <div className="flex items-center gap-3"><span>Menor intensidade</span><div className="h-2 rounded-full flex-1 max-w-48" style={{ background: 'linear-gradient(to right, #10b981, #22d3ee, #facc15, #fb923c, #ef4444)' }} /><span>Maior intensidade</span></div>
              <p>{mode === 'density' ? 'A intensidade representa a concentração de jovens na área, não o nível de risco.' : 'A intensidade combina a concentração de jovens e a pontuação de risco de evasão do sistema.'} A escala é relativa e varia com o zoom.</p>
            </>}
            <p>Localização aproximada: cadastros e importações podem utilizar coordenadas de referência do bairro, não endereços residenciais.</p>
            {filtered.length > located.length && <p className="text-amber-300">{filtered.length - located.length} cadastro(s) sem coordenadas válidas não aparecem no mapa.</p>}
          </div>
        </div>
        <aside className="p-4 border-t xl:border-t-0 xl:border-l border-slate-800">
          <h4 className="text-white font-semibold">Explorar bairros</h4><p className="text-xs text-slate-400 mt-1 mb-4">Selecione no mapa ou na lista para ver os indicadores do recorte atual.</p>
          {!groups.length && <p role="status" className="text-sm text-slate-400">Nenhum jovem com localização para os filtros selecionados.</p>}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {groups.map(g => <button key={g.key} type="button" aria-pressed={selected === g.key} onClick={() => selectGroup(g.key)} className={`w-full text-left p-3 rounded-lg border flex items-center justify-between gap-2 text-sm ${selected === g.key ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 text-slate-300 hover:bg-slate-900'}`}><span>{g.label}</span><b>{g.members.length}</b></button>)}
          </div>
          {detail && <div className="mt-5 p-4 rounded-lg bg-slate-900 border border-slate-700">
            <h5 className="font-semibold text-emerald-400 mb-3">{detail.label}</h5>
            <dl className="text-sm space-y-3 text-slate-400">
              <div><dt>Jovens monitorados</dt><dd className="text-white font-bold">{detail.members.length}</dd></div>
              <div><dt>Taxa de contratação</dt><dd className="text-white font-bold">{Math.round(detail.members.filter(j => j.status === 'aprendiz_contratado').length / detail.members.length * 100)}%</dd></div>
              <div><dt>Score médio de empregabilidade</dt><dd className="text-white font-bold">{Math.round(detail.members.reduce((n, j) => n + (j.score_empregabilidade ?? 0), 0) / detail.members.length)}</dd></div>
              {riskLevels.map(level => <div key={level.key} className="flex items-center justify-between gap-2"><dt>{level.label}</dt><dd className="font-bold" style={{ color: level.color }}>{detail.risks[level.key]}</dd></div>)}
            </dl>
          </div>}
        </aside>
      </div>
    </section>
  );
}
