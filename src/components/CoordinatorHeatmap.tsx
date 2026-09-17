import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './CoordinatorHeatmap.css';
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
  const popupHost = useMemo(() => document.createElement('div'), []);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positioningPopup = useRef(false);
  const pinned = useRef(false);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    if (positioningPopup.current || pinned.current) return;
    closeTimer.current = setTimeout(() => setSelected(''), 350);
  }, [cancelClose]);
  const openDetails = useCallback((key: string) => {
    cancelClose();
    setSelected(key);
  }, [cancelClose]);
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
        instance.on('click', 'bairros', e => { pinned.current = false; openDetails(e.features?.[0]?.properties?.key || ''); });
        instance.on('mouseenter', 'bairros', () => { instance.getCanvas().style.cursor = 'pointer'; cancelClose(); });
        instance.on('mouseleave', 'bairros', () => {
          instance.getCanvas().style.cursor = '';
          if (window.matchMedia('(hover: hover)').matches) scheduleClose();
        });
        instance.on('click', e => {
          if (!instance.queryRenderedFeatures(e.point, { layers: ['bairros'] }).length) { pinned.current = false; setSelected(''); }
        });
        setError('');
        setReady(true);
      });
      observer = new ResizeObserver(() => instance.resize());
      observer.observe(container.current);
    } catch {
      setError('Não foi possível iniciar o mapa. Verifique se o navegador oferece suporte a WebGL.');
    }
    return () => { cancelClose(); observer?.disconnect(); instance?.remove(); map.current = null; };
  }, [attempt]);

  useEffect(() => {
    if (!ready || !map.current) return;
    (map.current.getSource('jovens') as GeoJSONSource).setData(points);
    (map.current.getSource('bairros') as GeoJSONSource).setData(neighborhoods);
  }, [ready, points, neighborhoods]);

  useEffect(() => {
    if (!ready || !map.current || !detail) return;
    const instance = map.current;
    instance.stop();
    instance.flyTo({ center: [detail.lng, detail.lat], zoom: 14, duration: 700 });
    const point = instance.project([detail.lng, detail.lat]);
    const anchor = point.y < instance.getContainer().clientHeight / 2 ? 'top' : 'bottom';
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false,
      focusAfterOpen: false, anchor, maxWidth: '280px', offset: 28, className: 'coordinator-map-popup' })
      .setLngLat([detail.lng, detail.lat]).setDOMContent(popupHost).addTo(instance);
    const element = popup.getElement();
    const content = element.querySelector<HTMLElement>('.mapboxgl-popup-content')!;
    let frame = 0;
    const finishPositioning = () => { positioningPopup.current = false; };
    const keepVisible = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mapElement = instance.getContainer();
        content.style.maxHeight = `${Math.min(350, Math.max(120, mapElement.clientHeight - 100))}px`;
        content.style.width = `${Math.min(280, Math.max(160, mapElement.clientWidth - 48))}px`;
        // Measure the rendered portal, rather than the empty popup at creation time.
        const bounds = mapElement.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        const margin = 20;
        const dx = box.left < bounds.left + margin ? box.left - bounds.left - margin
          : Math.max(0, box.right - bounds.right + margin);
        const dy = box.top < bounds.top + margin ? box.top - bounds.top - margin
          : Math.max(0, box.bottom - bounds.bottom + margin);
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        cancelClose();
        positioningPopup.current = true;
        instance.off('moveend', finishPositioning);
        instance.once('moveend', finishPositioning);
        instance.panBy([dx * mapElement.clientWidth / bounds.width, dy * mapElement.clientHeight / bounds.height], {
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280,
        });
      });
    };
    const observer = new ResizeObserver(keepVisible);
    observer.observe(popupHost);
    instance.on('resize', keepVisible);
    keepVisible();
    const leavePopup = (event: PointerEvent) => { if (event.pointerType === 'mouse') scheduleClose(); };
    element.addEventListener('pointerenter', cancelClose);
    element.addEventListener('pointerleave', leavePopup);
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { pinned.current = false; setSelected(''); } };
    document.addEventListener('keydown', escape);
    return () => {
      cancelClose();
      cancelAnimationFrame(frame);
      observer.disconnect();
      instance.off('resize', keepVisible);
      instance.off('moveend', finishPositioning);
      positioningPopup.current = false;
      element.removeEventListener('pointerenter', cancelClose);
      element.removeEventListener('pointerleave', leavePopup);
      document.removeEventListener('keydown', escape);
      popup.remove();
    };
  }, [ready, detail, mode, popupHost, cancelClose, scheduleClose]);

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
      button.setAttribute('aria-haspopup', 'dialog');
      button.style.cssText = 'width:48px;height:48px;border:2px solid #0f172a;border-radius:50%;padding:5px;cursor:pointer;box-shadow:0 3px 12px #0008;';
      button.style.background = `conic-gradient(#34d399 0% ${greenEnd}%, #fbbf24 ${greenEnd}% ${yellowEnd}%, #f87171 ${yellowEnd}% 100%)`;
      const count = document.createElement('span');
      count.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;background:#0f172a;color:white;font:bold 13px system-ui;';
      count.textContent = String(group.members.length);
      button.appendChild(count);
      button.addEventListener('click', event => { event.stopPropagation(); openDetails(group.key); });
      button.addEventListener('pointerenter', cancelClose);
      button.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') scheduleClose(); });
      const marker = new mapboxgl.Marker({ element: button }).setLngLat([group.lng, group.lat]).addTo(instance);
      button.setAttribute('role', 'button');
      return marker;
    });
    return () => { markers.forEach(marker => marker.remove()); };
  }, [ready, mode, groups, openDetails, cancelClose, scheduleClose]);

  const fit = () => {
    if (!map.current || !located.length) return;
    const bounds = new mapboxgl.LngLatBounds();
    located.forEach(j => bounds.extend([j.lng, j.lat]));
    map.current.fitBounds(bounds, { padding: 65, maxZoom: 13, duration: 700 });
  };
  useEffect(() => { if (ready) fit(); }, [ready, located]);

  const selectClass = 'bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 max-w-full';
  return (
    <section id="mapa-calor-card" className="lg:col-span-12 w-[calc(100%-1.5rem)] mx-auto bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      <header className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3"><MapIcon className="text-emerald-400 w-7 h-7" /><div>
          <h3 className="text-xl font-bold text-white">Mapa de calor de Pirapora e região</h3>
          <p className="text-sm text-slate-400 mt-1">Distribuição territorial dos jovens acompanhados pelo programa</p>
        </div></div>
        <div className="flex flex-wrap gap-3 mt-5">
          <label className="text-xs text-slate-400 flex flex-col gap-1">Visualização<select className={selectClass} value={mode} onChange={e => { pinned.current = false; setMode(e.target.value); setSelected(''); }}>
            <option value="levels">Níveis de risco por bairro</option>
            <option value="density">Concentração de jovens</option><option value="risk">Concentração ponderada por risco</option>
          </select></label>
          <label className="text-xs text-slate-400 flex flex-col gap-1">Bairro<select className={selectClass} value={bairro} onChange={e => { const val = e.target.value; pinned.current = !!val; setBairro(val); setSelected(val ? groups.find(g => g.key === val)?.key || '' : ''); document.getElementById('mapa-calor-mapa')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>
            <option value="">Todos os bairros</option>{bairros.map(key => { const [city, name] = JSON.parse(key); return <option key={key} value={key}>{name} · {city}</option>; })}
          </select></label>
          <label className="text-xs text-slate-400 flex flex-col gap-1">Risco de evasão<select className={selectClass} value={risco} onChange={e => { pinned.current = false; setRisco(e.target.value); setSelected(''); }}>
            <option value="">Todos os níveis</option><option value="baixo">Baixo</option><option value="medio">Médio</option><option value="alto">Alto</option>
          </select></label>
        </div>
      </header>
      <div className="grid grid-cols-1">
          <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3 text-sm border-b border-slate-800 text-slate-400">
            <span><b className="text-white">{located.length}</b> jovens no mapa</span><span><b className="text-white">{groups.length}</b> bairros</span>
            {riskLevels.map(level => <span key={level.key}><b style={{ color: level.color }}>{totals[level.key]}</b> {level.label.toLowerCase()}</span>)}
          </div>
          <div className="relative bg-slate-900">
            <div id="mapa-calor-mapa" ref={container} className="h-[360px] md:h-[480px]" role="region" aria-label="Mapa interativo de distribuição e risco dos jovens" />
            {!token ? <div className="absolute inset-0 flex items-center justify-center p-8"><div className="max-w-md text-center">
              <MapIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" /><h4 className="text-white font-bold text-lg">Configure o mapa Mapbox</h4>
              <p className="text-slate-300 text-sm mt-3">Adicione seu token público em <code>.env.local</code>:</p>
              <code className="block bg-slate-950 rounded-lg p-3 my-3 text-emerald-400 text-xs break-all">VITE_MAPBOX_TOKEN=pk.seu_token</code>
              <p className="text-slate-400 text-sm">Depois, reinicie o servidor com npm run dev para consultar os indicadores nos marcadores do mapa.</p>
            </div></div> : <>
              {!ready && !error && <p role="status" className="absolute top-4 left-4 bg-slate-950 p-3 rounded-lg text-sm text-slate-200">Carregando mapa…</p>}
              <button type="button" onClick={fit} disabled={!ready || !located.length} className="absolute top-4 left-4 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 disabled:hidden flex gap-2 items-center text-xs"><LocateFixed size={16} />Enquadrar dados</button>
            </>}
            {error && <div role="alert" className="absolute bottom-12 left-4 right-4 bg-slate-950 border border-amber-500/50 p-4 rounded-lg text-sm text-amber-200">{error}<button type="button" className="block mt-2 underline" onClick={() => setAttempt(n => n + 1)}>Tentar novamente</button></div>}
          </div>
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            {mode === 'levels' ? <>
              <div className="flex flex-wrap gap-4">{riskLevels.map(level => <span key={level.key} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: level.color }} />{level.label}</span>)}</div>
              <p>Cada círculo mostra o total de jovens do bairro. As faixas coloridas representam a proporção em cada nível de risco, incluindo os jovens de baixo risco. Selecione um bairro no filtro acima ou clique no mapa para ver as quantidades.</p>
            </> : <>
              <div className="flex items-center gap-3"><span>Menor intensidade</span><div className="h-2 rounded-full flex-1 max-w-48" style={{ background: 'linear-gradient(to right, #10b981, #22d3ee, #facc15, #fb923c, #ef4444)' }} /><span>Maior intensidade</span></div>
              <p>{mode === 'density' ? 'A intensidade representa a concentração de jovens na área, não o nível de risco.' : 'A intensidade combina a concentração de jovens e a pontuação de risco de evasão do sistema.'} A escala é relativa e varia com o zoom.</p>
            </>}
            <p>Localização aproximada: cadastros e importações podem utilizar coordenadas de referência do bairro, não endereços residenciais.</p>
            {filtered.length > located.length && <p className="text-amber-300">{filtered.length - located.length} cadastro(s) sem coordenadas válidas não aparecem no mapa.</p>}
          </div>
      </div>
      {ready && detail && createPortal(
          <div role="dialog" aria-label={`Indicadores de ${detail.label}`} className="p-4 text-left">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h5 className="font-semibold text-emerald-400 text-base">{detail.label}</h5>
              <button type="button" aria-label="Fechar indicadores do bairro" onClick={() => { cancelClose(); pinned.current = false; setSelected(''); }} className="shrink-0 w-7 h-7 rounded text-slate-300 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-400 text-xl leading-none">×</button>
            </div>
            <dl className="text-sm space-y-3 text-slate-400">
              <div><dt>Jovens monitorados</dt><dd className="text-white font-bold">{detail.members.length}</dd></div>
              <div><dt>Taxa de contratação</dt><dd className="text-white font-bold">{Math.round(detail.members.filter(j => j.status === 'aprendiz_contratado').length / detail.members.length * 100)}%</dd></div>
              <div><dt>Score médio de empregabilidade</dt><dd className="text-white font-bold">{Math.round(detail.members.reduce((n, j) => n + (j.score_empregabilidade ?? 0), 0) / detail.members.length)}</dd></div>
              {riskLevels.map(level => <div key={level.key} className="flex items-center justify-between gap-2"><dt>{level.label}</dt><dd className="font-bold" style={{ color: level.color }}>{detail.risks[level.key]}</dd></div>)}
            </dl>
          </div>, popupHost)}
    </section>
  );
}
