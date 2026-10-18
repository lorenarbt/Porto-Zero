/* ============================================================
   PORTO ZERO · Dashboard (protótipo)
   Todos os dados são de exemplo, gerados no navegador.
   ============================================================ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = n => n.toLocaleString('pt-BR');
const nf2 = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf1 = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const sum = a => a.reduce((x, y) => x + y.qty, 0);

/* ---------- Datas ---------- */
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const pd = s => { const [a, b, c] = s.split('-').map(Number); return new Date(Date.UTC(a, b - 1, c)); };
const iso = d => d.toISOString().slice(0, 10);
const addD = (s, n) => iso(new Date(pd(s).getTime() + n * 864e5));
const diffD = (a, b) => Math.round((pd(b) - pd(a)) / 864e5);
const fd = s => { const d = pd(s); return d.getUTCDate() + ' ' + MES[d.getUTCMonth()]; };
const fdy = s => fd(s) + ' ' + pd(s).getUTCFullYear();
const hm = ms => { const d = new Date(ms); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
const fdm = ms => fd(iso(new Date(ms)));
const rng = r => r.s == r.e ? fdy(r.s) : (pd(r.s).getUTCFullYear() == pd(r.e).getUTCFullYear() ? fd(r.s) + ' – ' + fdy(r.e) : fdy(r.s) + ' – ' + fdy(r.e));
const nDias = r => diffD(r.s, r.e) + 1;

/* ---------- Portos e frotas de exemplo ---------- */
const fl = a => a.map(x => ({ n: x[0], k: x[1], c: x[2], co: x[3], b: x[4], m: x[5], ev: x[6], rv: x[7] }));
const PORTS = [
  { id: 'rtm', name: 'Porto de Roterdã', country: 'Países Baixos', tz: 'CEST (UTC+2)', cos: ['Northline Cargo', 'Seaway Bulk', 'Atlas Logistics'],
    fleet: fl([['Northern Star', 'Contêiner', 'NS-2619', 0, 12000, 13500, 3, 0], ['Baltic Trader', 'Granel sólido', 'BT-2619', 1, 14500, 13800, 2, 0], ['Ocean Meridian', 'Contêiner', 'OM-2619', 2, 18000, 19800, 3, 1], ['Coastal Spirit', 'Contêiner', 'CS-2619', 0, 8000, 8600, 3, 0], ['Pacific Horizon', 'Granel sólido', 'PH-2619', 1, 16000, 15200, 1, 0], ['Atlantic Dawn', 'Contêiner', 'AD-2619', 2, 10000, 10900, 3, 1]]) },
  { id: 'ssz', name: 'Porto de Santos', country: 'Brasil', tz: 'BRT (UTC−3)', cos: ['Litoral Cargas', 'Serra Granéis', 'Atlântico Logística'],
    fleet: fl([['Rio Santos', 'Contêiner', 'RS-2619', 0, 15000, 16200, 3, 0], ['Serra Azul', 'Granel sólido', 'SA-2619', 1, 13200, 12800, 2, 0], ['Paraty Star', 'Contêiner', 'PS-2619', 2, 9500, 10400, 3, 1], ['Guarujá Express', 'Contêiner', 'GE-2619', 0, 11800, 12600, 3, 0], ['Tupi Voyager', 'Granel sólido', 'TV-2619', 1, 17200, 18900, 3, 0], ['Brisa do Sul', 'Contêiner', 'BS-2619', 2, 7600, 7400, 1, 0]]) },
  { id: 'bts', name: 'Baía de Todos os Santos', country: 'Brasil', tz: 'BRT (UTC−3)', cos: ['Bahia Cargas', 'Recôncavo Granéis', 'Aratu Logística'],
    fleet: fl([['Itaparica Bay', 'Contêiner', 'IB-2619', 0, 9800, 10700, 3, 0], ['Aratu Star', 'Granel sólido', 'AS-2619', 1, 12400, 13100, 3, 1], ['Todos os Santos', 'Contêiner', 'TS-2619', 2, 14100, 13600, 2, 0], ['Maré Cheia', 'Granel sólido', 'MC-2619', 1, 15800, 17500, 3, 0], ['Salvador Express', 'Contêiner', 'SE-2619', 0, 8700, 9400, 3, 0], ['Recôncavo', 'Contêiner', 'RE-2619', 2, 10900, 11200, 1, 0]]) },
  { id: 'pgu', name: 'Porto de Paranaguá', country: 'Brasil', tz: 'BRT (UTC−3)', cos: ['Paraná Cargas', 'Graciosa Granéis', 'Costa Sul Logística'],
    fleet: fl([['Ilha do Mel', 'Granel sólido', 'IM-2619', 1, 16800, 18000, 3, 0], ['Graciosa', 'Contêiner', 'GR-2619', 0, 9300, 9900, 3, 0], ['Iguaçu Star', 'Granel sólido', 'IS-2619', 1, 14200, 13700, 2, 1], ['Mar de Dentro', 'Contêiner', 'MD-2619', 2, 11500, 12300, 3, 0], ['Serra Verde', 'Contêiner', 'SV-2619', 0, 8200, 8000, 1, 0], ['Paranaguá Sul', 'Granel sólido', 'PA-2619', 2, 13300, 14400, 3, 0]]) }
];
const DIR = [
  { n: 'Wilsonson', i: 'W', ports: ['rtm', 'ssz', 'bts', 'pgu'], t: [0, 1] },
  { n: 'BTP', i: 'BTP', ports: ['ssz', 'pgu'], t: [0] },
  { n: 'Santos Brasil', i: 'SB', ports: ['ssz'], t: [1] },
  { n: 'Aratu Verde', i: 'AV', ports: ['bts'], t: [0, 1] },
  { n: 'Recôncavo Ambiental', i: 'RA', ports: ['bts'], t: [0] },
  { n: 'Delta Verde', i: 'DV', ports: ['rtm'], t: [0] },
  { n: 'Litoral Sul Ambiental', i: 'LS', ports: ['pgu'], t: [1] }
];
const TOPS = [['▣', 'Consulta sobre certificação ambiental'], ['❦', 'Consulta sobre elegibilidade a créditos verdes']];
const SCOPE = [['Análise de certificação', 'Confirmar o esquema disponível e o revisor independente; a aprovação é condicional.'], ['Análise separada de elegibilidade a créditos verdes', 'Confirmar o programa aplicável e os critérios; o desempenho do diesel por si só não basta.']];

/* ---------- Estado ---------- */
const DEFAULT = () => ({
  port: 'rtm', range: { ops: { s: '2026-10-19', e: '2026-10-19' }, fuel: { s: '2026-10-12', e: '2026-10-18' } },
  co: '', st: '', sortDesc: false, vessel: null, factor: 2.68, edits: {}, reviewed: {}, extra: {},
  dirCo: '', dirTopic: '', company: 'Wilsonson', topics: [true, true], credit: '', recipient: '',
  requests: [{ id: 'GR-2026-014', co: 'Wilsonson', vn: 'Northern Star', vc: 'NS-2619', ctx: 'Países Baixos / Porto de Roterdã', ts: '19 out 2026 · 09:20 UTC', res: '11,1% abaixo da referência ilustrativa', files: 3 }],
  reqIdx: 0
});
let state = DEFAULT(), cur = 'ops';
try { const sv = JSON.parse(sessionStorage.getItem('portozero') || 'null'); if (sv && sv.state) { state = Object.assign(DEFAULT(), sv.state); cur = sv.id || 'ops'; } } catch (e) { }
const save = () => { try { sessionStorage.setItem('portozero', JSON.stringify({ id: cur, state })); } catch (e) { } };
const port = () => PORTS.find(x => x.id == state.port) || PORTS[0];
const fmtFac = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });

/* ---------- Geração determinística das escalas ---------- */
const rnd = seed => { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
const H1 = 3600e3;
const win = (a, d) => { const x = a + H1, y = d - 2 * H1; return fdm(x) == fdm(y) ? fdm(x) + ' · ' + hm(x) + '–' + hm(y) : fdm(x) + ' ' + hm(x) + ' → ' + fdm(y) + ' ' + hm(y); };
function mkCall(p, v, day, h, stay, o) {
  const a = pd(day).getTime() + h * H1, d = a + stay * H1;
  return { v: v.n, k: v.k, c: v.c, berth: o.berth, a, d, stay, co: p.cos[v.co], op: o.op, cg: o.cg, qty: o.qty, u: v.k == 'Contêiner' ? 'TEU' : 't', win: win(a, d) };
}
const BASE19 = [[0, 'A1', 4, 12, 'Descarga', 'Contêineres', 640], [1, 'B1', 7, 18, 'Descarga', 'Grãos', 14000], [2, 'A2', 10, 24, 'Descarga', 'Contêineres', 900], [3, 'A3', 13, 10, 'Carga', 'Contêineres', 340], [4, 'B2', 17, 20, 'Carga', 'Minério de ferro', 12000], [5, 'A1', 21, 12, 'Carga', 'Contêineres', 420]];
function daySched(p, day) {
  if (p.id == 'rtm' && day == '2026-10-19') return BASE19.map(x => mkCall(p, p.fleet[x[0]], day, x[2], x[3], { berth: x[1], op: x[4], cg: x[5], qty: x[6] }));
  const r = rnd(diffD('2025-01-01', day) * 131 + PORTS.indexOf(p) * 7919 + 17), n = 3 + Math.floor(r() * 4);
  const idx = p.fleet.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx.slice(0, n).map((vi, i) => {
    const v = p.fleet[vi], h = Math.min(22, Math.floor(1 + i * (21 / n) + r() * 2)), stay = 8 + Math.floor(r() * 19);
    const cont = v.k == 'Contêiner', desc = r() < .5;
    const berth = cont ? 'A' + (1 + Math.floor(r() * 3)) : 'B' + (1 + Math.floor(r() * 2));
    const cg = cont ? 'Contêineres' : (desc ? ['Grãos', 'Fertilizantes', 'Açúcar'] : ['Minério de ferro', 'Soja', 'Farelo de soja'])[Math.floor(r() * 3)];
    const qty = cont ? Math.round((300 + r() * 650) / 10) * 10 : Math.round((8000 + r() * 18000) / 500) * 500;
    return mkCall(p, v, day, h, stay, { berth, op: desc ? 'Descarga' : 'Carga', cg, qty });
  });
}
function callsFor() {
  const p = port(), r = state.range.ops; let out = [];
  for (let d = r.s; d <= r.e; d = addD(d, 1)) out = out.concat(daySched(p, d));
  if (state.co) out = out.filter(c => c.co == state.co);
  out.sort((x, y) => state.sortDesc ? y.a - x.a : x.a - y.a);
  return out;
}
let lastCalls = [];

/* ---------- Dados de combustível ---------- */
function fuelData() {
  const p = port(), r = state.range.fuel, days = nDias(r);
  return p.fleet.map(v => {
    const key = p.id + '|' + v.c, ek = key + '|' + r.s + '|' + r.e;
    const base = Math.round(v.b * days / 7 / 100) * 100, bm = Math.round(v.m * days / 7 / 100) * 100;
    return Object.assign({}, v, { key, ek, days, bm, l: state.edits[ek] != null ? state.edits[ek] : base, evn: v.ev + (state.extra[key] || []).length });
  });
}
const curV = () => { const f = fuelData(); return f.find(x => x.c == state.vessel) || f[0]; };
const isRev = f => f.rv || state.reviewed[f.key];
const stat = f => f.evn < 3 ? ['Evidências ausentes', 'a'] : isRev(f) ? ['Em revisão', 'g'] : ['Pronto para revisão', ''];
const calc = l => { const kg = l * state.factor, t = nf2(kg / 1000); return [`${nf(l)} L × ${fmtFac(state.factor)} kg CO₂/L`, `= ${t} t de CO₂`, `${nf(Math.round(kg))} kg de CO₂ ÷ 1.000 = ${t} toneladas métricas`]; };
const co2 = l => nf2(l * state.factor / 1000);

/* ---------- Componentes ---------- */
const B = (t, k = '') => `<span class="badge ${k}">${t}</span>`;
const P = (h, c = '') => `<section class="card ${c}">${h}</section>`;
const D = (a, b) => `<div class="det"><span>${a}</span><b>${b}</b></div>`;
const at = (o, t) => o.go ? `data-go="${o.go}"${o.v ? ` data-v="${esc(o.v)}"` : ''}${o.co ? ` data-co="${esc(o.co)}"` : ''}` : o.do ? `data-do="${o.do}"${o.i != null ? ` data-i="${o.i}"` : ''}${o.n ? ` data-n="${esc(o.n)}" data-s="${esc(o.s || '')}"` : ''}` : `data-toast="${esc(t)}"`;
const btn = (t, o = {}) => `<button class="btn ${o.p ? 'p' : ''}" ${at(o, t)}${o.st ? ` style="${o.st}"` : ''}>${t}${o.x ? ' ' + o.x : ''}</button>`;
const lk = (t, o = {}) => `<button class="link" ${at(o, t)}>${t}</button>`;
const N = (t, d, i = 'ⓘ') => `<div class="note"><span>${i}</span><div><b>${t}</b>${d}</div></div>`;
const H = (t, b, d, a = '') => `<div class="row sp"><div style="display:flex;flex-direction:column;gap:8px;flex:1"><div class="row wrap"><h1>${t}</h1>${B(b)}</div><p class="mut">${d}</p></div>${a}</div>`;
const C = (l, r) => `<div class="row sp sm"><span class="mut">${l}</span><b class="tl">${r}</b></div>`;
const F = (l, r = 'Não é uma certificação nem uma determinação de crédito.') => `<div class="foot"><span>${l}</span><span>${r}</span></div>`;
const S = (a, i) => `<div class="steps">${a.map((t, k) => `<div class="st ${k == i ? 'on' : ''}"><i>${k + 1}</i>${t}${k < a.length - 1 ? '<s>→</s>' : ''}</div>`).join('')}</div>`;
const M = (l, v, c, i) => `<div class="metric"><div><span class="sm mut">${l}</span><strong>${v}</strong><span class="xs mut">${c}</span></div><div class="sym">${i}</div></div>`;
const fld = (l, v, s = '') => `<div class="fld"><label>${l}</label><div class="inp" style="display:flex;align-items:center">${v}</div>${s ? `<small>${s}</small>` : ''}</div>`;
const opt = (v, t, c) => `<option value="${esc(v)}" ${v == c ? 'selected' : ''}>${t}</option>`;
const calBtn = t => `<button class="btn" data-calopen="${t}" aria-haspopup="dialog">▦ ${rng(state.range[t])} ⌄</button>`;
const ini = n => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const NOTE1 = 'Todas as quantidades e referências são dados de exemplo · Apenas CO₂ direto do diesel consumido a bordo.', NOTE2 = 'Somente demonstração · Nenhuma consulta, aprovação ou emissão real junto a fornecedores.';
const WF1 = ['Monitorar navios', 'Revisar dados de combustível', 'Avaliar emissões'], WF2 = ['Encontrar uma empresa', 'Preparar solicitação', 'Acompanhar análises'];
const ctxBr = () => port().country + ' / ' + port().name;

/* ---------- Telas: operações ---------- */
function opsRows(calls) {
  if (!calls.length) return `<div class="tr o" style="min-height:90px"><span class="mut">Nenhuma chegada encontrada para os filtros selecionados.</span></div>`;
  return calls.map((c, i) => `<div class="tr o rowlink" data-do="vessel" data-i="${i}" tabindex="0" role="button" aria-label="Ver detalhes de ${esc(c.v)}"><div><b>${c.v}</b><small>${c.k} · ${c.c}</small></div><div>${B(c.berth, 'g')}</div><div><b style="color:var(--ink2)">${hm(c.a)}</b><small>${fdm(c.a)} ${pd(iso(new Date(c.a))).getUTCFullYear()}</small></div><div><b style="color:var(--ink2)">${hm(c.d)}</b><small>${fdm(c.d)} ${pd(iso(new Date(c.d))).getUTCFullYear()}</small></div><div class="tl">${c.stay} h</div><div>${c.co}</div></div>`).join('');
}
function cargoCards(calls) {
  const cards = port().cos.map(co => {
    const cs = calls.filter(c => c.co == co); if (!cs.length) return '';
    const teu = sum(cs.filter(c => c.u == 'TEU')), t = sum(cs.filter(c => c.u == 't'));
    const tot = [teu && nf(teu) + ' TEU', t && nf(t) + ' t'].filter(Boolean).join(' · ');
    return `<div class="cc"><div class="row"><div class="mono s">${ini(co)}</div><div style="flex:1"><b style="color:var(--ink)">${co}</b><div class="xs mut">${cs.length} ${cs.length == 1 ? 'escala' : 'escalas'} de navios</div></div><b style="color:var(--ink);font-size:15px;text-align:right">${tot}</b></div>${cs.slice(0, 4).map(o => `<div class="op" style="margin-top:16px"><div class="row sp"><b>${o.v}</b><b style="color:var(--ink)">${nf(o.qty)} ${o.u}</b></div><span class="sm">${o.op == 'Carga' ? '↗' : '↙'} ${o.op} · ${o.cg}</span><span class="xs mut">${o.win}</span></div>`).join('')}${cs.length > 4 ? `<div class="op xs mut" style="margin-top:0">+ ${cs.length - 4} outras operações no período</div>` : ''}</div>`;
  }).join('');
  return cards || `<p class="mut">Nenhuma operação de carga para os filtros selecionados.</p>`;
}
function dirCards() {
  const list = DIR.filter(c => c.ports.includes(state.port) && (!state.dirCo || c.n == state.dirCo) && (state.dirTopic === '' || c.t.includes(+state.dirTopic)));
  if (!list.length) return `<p class="mut">Nenhuma empresa de exemplo para os filtros selecionados.</p>`;
  return list.map(c => P(`<div class="row"><div class="mono">${c.i}</div><div><h2>${c.n}</h2><div class="xs mut">Empresa de exemplo fornecida pelo usuário</div></div></div>${B('Ilustrativo / não verificado', 'a')}<div style="display:flex;flex-direction:column;gap:12px"><b class="sm mut">TEMAS DE CONSULTA DE EXEMPLO · SERVIÇOS NÃO VERIFICADOS</b>${c.t.map(i => `<span>${TOPS[i][0]} ${TOPS[i][1]}</span>`).join('')}</div><p class="mut">Capacidades, área de atuação, independência e programas aplicáveis precisam ser confirmados.</p>${btn('Ver empresa e preparar solicitação', { go: 's22', co: c.n, x: '→', st: 'align-self:flex-start' })}`)).join('');
}

const V = {
  ops: () => {
    const p = port(), r = state.range.ops, calls = callsFor(); lastCalls = calls;
    const avg = calls.length ? Math.round(calls.reduce((x, c) => x + c.stay, 0) / calls.length) : 0;
    const gr = new Set(calls.map(c => c.co)).size, n = nDias(r);
    return `<div class="row sp wrap"><div><div class="row wrap"><h1>Chegadas de navios e cargas</h1>${B('Dados de exemplo')}</div><p class="mut">Planeje as estadias no porto e coordene as operações de carga, empresa por empresa.</p></div>${btn('Exportar cronograma', { do: 'export', x: '⤓' })}</div>
<div class="row sp wrap"><div class="row wrap sm mut">Data de chegada ${calBtn('ops')} <button class="btn" data-shift="-1" aria-label="Período anterior">‹</button><button class="btn" data-shift="1" aria-label="Próximo período">›</button> ${n == 1 ? DIA[pd(r.s).getUTCDay()] + ' · 00:00–23:59' : n + ' dias · ' + fd(r.s) + ' – ' + fd(r.e)}</div><select class="btn" id="cof" data-act="cof" aria-label="Empresa de carga"><option value="">Todas as empresas de carga</option>${p.cos.map(c => opt(c, c, state.co)).join('')}</select></div>
<div class="g3">${M('Chegadas programadas', calls.length, n == 1 ? 'navios em ' + fd(r.s) : 'navios no período', '⛴')}${M('Estadia média planejada', avg + ' h', 'da chegada à saída', '◷')}${M('Empresas de carga', gr, calls.length + ' escalas no período', '▣')}</div>
${P(`<div class="ph"><div class="row"><h2>Cronograma de chegadas</h2><span class="sm mut">${calls.length} ${calls.length == 1 ? 'navio' : 'navios'}</span></div><span class="sm mut">◷ Horário local · ${p.tz} · ${p.name}</span></div><div class="tw"><div class="tbl"><div class="tr o h"><span>Navio</span><span>Berço</span><span class="th-s" data-do="sort" role="button" tabindex="0">Chegada planejada ${state.sortDesc ? '↓' : '↑'}</span><span>Saída planejada</span><span>Estadia planejada no porto</span><span>Empresa de carga</span></div><div id="rows">${opsRows(calls)}</div></div></div><div class="tf"><span>Exibindo ${calls.length} ${calls.length == 1 ? 'chegada' : 'chegadas'} · ${rng(r)}</span><span>Clique em um navio para ver os detalhes. As saídas podem ocorrer no dia seguinte.</span></div>`, 'flush')}
<div class="row sp"><div><h2>Operações de carga por empresa</h2><span class="sm mut">Janelas de movimentação planejadas para as chegadas de navios selecionadas.</span></div><span class="xs mut">TEU = unidades de contêiner · t = toneladas métricas</span></div><div class="g3" id="cargo">${cargoCards(calls)}</div>
${F('Dados de exemplo apenas para ilustração. Todos os horários são locais de ' + p.name + ' (' + p.tz + ').', 'Estadia planejada = saída − chegada')}`;
  },
  s11: () => {
    const f = fuelData(), r = state.range.fuel, list = f.filter(x => !state.st || stat(x)[0] == state.st), cv = curV();
    const totL = f.reduce((a, x) => a + x.l, 0), miss = f.filter(x => x.evn < 3).length;
    return `${C('Operações portuárias / Monitoramento ambiental', 'Fluxo 1 · Etapa 1 de 3')}${H('Diesel e CO₂ dos navios', 'Dados de exemplo', 'Verifique o consumo de combustível informado e as evidências de apoio antes de uma avaliação operacional.', btn('Novo registro de combustível', { go: 's12', v: cv.c, p: 1, x: '+' }))}${S(WF1, 0)}
<div class="row sp wrap"><div class="row sm mut wrap">Período de medição ${calBtn('fuel')} ${nDias(r)} dias · todos os navios</div><select class="btn" id="stf" data-act="stf" aria-label="Status da revisão">${opt('', 'Todos os status de revisão', state.st)}${['Pronto para revisão', 'Evidências ausentes', 'Em revisão'].map(s => opt(s, s, state.st)).join('')}</select></div>
<div class="g3">${M('Diesel informado', nf(totL) + ' L', f.length + ' navios · ' + port().name, '⛽')}${M('CO₂ direto estimado', co2(totL) + ' t', 'Fator ilustrativo · ' + fmtFac(state.factor) + ' kg CO₂/L', '☁')}${M('Evidências a completar', miss + (miss == 1 ? ' navio' : ' navios'), 'Evidência ausente ≠ não conformidade', '▤')}</div>
${P(`<div class="ph"><h2>Consumo por navio</h2><span class="sm mut">${list.length} ${list.length == 1 ? 'registro' : 'registros'} de exemplo</span></div><div class="tw"><div class="tbl"><div class="tr v h"><span>Navio</span><span>Diesel consumido</span><span>CO₂ estimado</span><span>Evidências</span><span>Status da revisão</span><span>Ação</span></div>${list.length ? list.map(x => { const s = stat(x); return `<div class="tr v ${x.c == cv.c ? 'hl' : ''}"><div><b>${x.n}</b><small>${x.k} · ${x.c}</small></div><b style="font-weight:500;color:var(--ink2)">${nf(x.l)} L</b><span>${co2(x.l)} t</span><span class="mut">${x.evn <= 3 ? x.evn + ' / 3 anexados' : x.evn + ' anexados'}</span><div>${B(s[0], s[1])}</div>${lk(x.evn < 3 ? 'Adicionar evidências →' : isRev(x) ? 'Ver registro →' : 'Revisar combustível →', { go: 's12', v: x.c })}</div>`; }).join('') : `<div class="tr v" style="min-height:90px"><span class="mut">Nenhum navio com este status.</span></div>`}</div></div><div class="tf"><span>${fd(r.s)} 00:00 → ${fd(addD(r.e, 1))} 00:00 ${pd(addD(r.e, 1)).getUTCFullYear()} UTC</span><span>Volumes informados · não verificados de forma independente</span></div>`, 'flush')}
${N('Um limite claro: operações em primeiro lugar', 'O fator configurável estima apenas o CO₂ direto da combustão de diesel a bordo; as emissões a montante (produção e transporte do combustível) e outros gases ficam de fora. A avaliação de referência, a certificação por terceiros e a elegibilidade a créditos verdes são análises separadas.')}${F(NOTE1)}`;
  },
  s12: () => {
    const v = curV(), c = calc(v.l), P0 = v.c.split('-')[0], ex = state.extra[v.key] || [], r = state.range.fuel;
    const files = [['Registro de combustível do motor', P0 + '_fuel-log.pdf', '1,8 MB'], ['Leituras de medidores', P0 + '_meter-readings.csv', '46 KB'], ['Declaração do chefe de máquinas', P0 + '_engineer-declaration.pdf', '320 KB']];
    return `${C('Operações portuárias / Monitoramento ambiental', 'Fluxo 1 · Etapa 2 de 3')}${H('Revisar consumo de combustível', 'Dados de exemplo', `${v.n} · ${v.c} · Confirme o limite do relatório, as quantidades e as evidências.`, btn('Voltar aos navios', { go: 's11', x: '←' }))}${S(WF1, 1)}
<div class="split"><div class="col">${P(`<div class="row sp"><h2>Registro de combustível</h2>${B('Rascunho · ' + stat(v)[0].toLowerCase())}</div><div class="f2">${fld('Navio', v.n + ' · ' + v.c)}${fld('Tipo de combustível', 'Diesel')}</div><div class="f2">${fld('Início do período · UTC', fdy(r.s) + ' · 00:00')}${fld('Fim do período · UTC (exclusivo)', fdy(addD(r.e, 1)) + ' · 00:00')}</div><div class="f2"><div class="fld"><label for="lit">Diesel consumido</label><input class="inp" id="lit" value="${nf(v.l)}" inputmode="numeric" data-act="lit"><small>Volume consumido, não o volume comprado ou abastecido.</small></div>${fld('Unidade', 'L · litros', 'A base de volume deve corresponder ao fator de emissão.')}</div>`)}
${P(`<div class="row sp"><h2>Evidências de apoio</h2>${B(v.evn <= 3 ? v.evn + ' / 3 anexados' : v.evn + ' anexados', v.evn < 3 ? 'a' : '')}</div>${files.map((f, i) => i < v.ev ? `<div class="file">▤<div><b>${f[0]}</b><span class="xs mut">${f[1]} · ${f[2]}</span></div>${lk('Visualizar', { do: 'preview', n: f[0] + ' — ' + f[1], s: f[2] })}</div>` : `<div class="file"><span class="mut">◌</span><div><b>${f[0]}</b><span class="xs mut">Pendente · ainda não anexado</span></div>${lk('Anexar', { do: 'upload' })}</div>`).join('')}${ex.map(f => `<div class="file">▤<div><b>Arquivo adicional</b><span class="xs mut">${esc(f.name)} · ${f.size}</span></div>${lk('Visualizar', { do: 'preview', n: 'Arquivo adicional — ' + f.name, s: f.size })}</div>`).join('')}<input type="file" id="fileinp" data-act="file" accept=".pdf,.csv,.jpg,.jpeg,.png" hidden><div class="up" data-do="upload" role="button" tabindex="0">⤒ Adicionar ou substituir evidências <span class="xs mut">&nbsp; PDF, CSV, JPG · até 10 MB · o arquivo não sai do seu navegador</span></div>`)}</div>
<div class="col">${P(`<h2>Emissões estimadas</h2>${B('Fator configurável ilustrativo')}<div class="calc"><b class="tl" style="font-size:15px" id="c1">${c[0]}</b><big id="c2">${c[1]}</big><span class="sm" id="c3">${c[2]}</span></div><p class="mut" style="font-size:13px">Fator de exemplo com base no volume de diesel, não um padrão acreditado. Confirme a especificação do combustível e substitua o fator por uma base adequada antes de qualquer uso externo.</p>${lk('Configurar fator →', { do: 'factor' })}`)}
${P(`<h2>Limite do relatório</h2>${D('Duração', nDias(r) + ' dias · ' + nDias(r) * 24 + ' horas')}${D('Contexto operacional', 'Registro de relatório · ' + port().name)}<p style="font-size:13px">Apenas CO₂ direto da combustão de diesel a bordo. Exclui a produção e o transporte do combustível, outros combustíveis e gases que não sejam CO₂. Os anexos estão presentes, mas não foram verificados de forma independente.</p>`)}</div></div>
<div class="row sp wrap"><p class="mut" style="font-size:13px;flex:1">A revisão deste registro cria apenas uma avaliação operacional provisória.</p><div class="row">${btn('Salvar rascunho', { do: 'draft' })}${btn('Continuar para a avaliação', { go: 's13', p: 1, x: '→' })}</div></div>${F(NOTE1)}`;
  },
  s13: () => {
    const v = curV(), r = state.range.fuel, pct = (v.bm - v.l) / v.bm * 100, below = pct >= 0, ap = nf1(Math.abs(pct)) + '% ' + (below ? 'abaixo' : 'acima');
    const scale = Math.round(Math.max(v.l, v.bm) * 1.2889 / 100) * 100, rev = isRev(v), ex = state.extra[v.key] || [];
    const labels = ['Registro de combustível do motor', 'Leituras de medidores', 'Declaração do engenheiro'];
    return `${C('Operações portuárias / Monitoramento ambiental', 'Fluxo 1 · Etapa 3 de 3')}${H('Avaliação de emissões do navio', 'Dados de exemplo', `${v.n} · ${v.c} · ${fd(r.s)} 00:00 → ${fd(addD(r.e, 1))} 00:00 ${pd(addD(r.e, 1)).getUTCFullYear()} UTC`, btn('Editar registro de combustível', { go: 's12' }))}${S(WF1, 2)}
${N('Resultado provisório · apenas referência operacional', below ? 'O diesel informado está abaixo da referência ilustrativa. Isso não é conformidade regulatória, aprovação de certificação nem prova de elegibilidade a créditos verdes. Ainda é necessária uma revisão independente.' : 'O diesel informado está acima da referência ilustrativa. Isso, por si só, não indica não conformidade: vale investigar causas operacionais e completar as evidências. Ainda é necessária uma revisão independente.')}
<div class="g3">${M('Diesel real informado', nf(v.l) + ' L', 'período de medição de ' + nDias(r) + ' dias', '⛽')}${M('CO₂ direto estimado', co2(v.l) + ' t', `${nf(v.l)} L × ${fmtFac(state.factor)} kg CO₂/L ÷ 1.000`, '☁')}${M('Em relação à referência de exemplo', ap, nf(Math.abs(v.bm - v.l)) + ' L ' + (below ? 'abaixo' : 'acima') + ' · não é uma quantidade de crédito', '▥')}</div>
<div class="split"><div class="col">${P(`<div class="row sp"><h2>Comparação com a referência de diesel</h2>${B('Referência ilustrativa', 'g')}</div><p class="mut" style="font-size:13px">Uma referência de ${nf(v.bm)} L configurada manualmente para o mesmo navio e o mesmo período de ${nDias(r)} dias. Não é um limite legal nem um padrão de frota validado.</p>${[['Real · informado', v.l, 'var(--teal)'], ['Referência de exemplo', v.bm, '#aabfcb']].map(b => `<div class="fld" style="gap:8px"><div class="row sp" style="font-size:13px"><span>${b[0]}</span><b style="color:var(--ink)">${nf(b[1])} L</b></div><div class="bar"><i style="width:${Math.min(100, b[1] / scale * 100).toFixed(2)}%;background:${b[2]}"></i></div></div>`).join('')}<div class="row sp xs mut"><span>0 L</span><span>${nf(scale)} L · escala de exibição</span></div><p class="mut sm">(${nf(v.bm)} − ${nf(v.l)}) ÷ ${nf(v.bm)} × 100 = ${ap} da referência de exemplo.</p>`)}
${P(`<h2>Cálculo e limite</h2>${D('Base do fator', `${fmtFac(state.factor)} kg de CO₂ por litro de diesel · ilustrativo e configurável`)}${D('Escopo do CO₂ direto', 'Apenas combustão de diesel a bordo; exclui emissões a montante e outros gases.')}${D('Responsável pela referência', 'Operações do porto · configuração de exemplo, sujeita a revisão')}`)}</div>
<div class="col">${P(`<div class="row sp"><h2>Completude das evidências</h2>${B(v.evn <= 3 ? v.evn + ' / 3' : v.evn + ' anexados', v.evn < 3 ? 'a' : '')}</div>${labels.map((t, i) => i < v.ev ? `<div class="row" style="font-size:13px"><span class="tl">✓</span>${t} anexado(a)</div>` : `<div class="row" style="font-size:13px"><span class="mut">○</span><span class="mut">${t} · pendente</span></div>`).join('')}${ex.map(f => `<div class="row" style="font-size:13px"><span class="tl">✓</span>${esc(f.name)} anexado</div>`).join('')}<p class="mut sm">Anexos completos não confirmam a exatidão dos dados. Arquivos ausentes são uma lacuna de dados, não uma não conformidade.</p>`)}
${P(`<h2>Status da revisão</h2>${rev ? B('Revisão independente solicitada') : B('Aguardando revisão independente', 'a')}${D('Revisor designado', 'Ainda não designado')}<p style="font-size:13px">Valide a conciliação dos medidores, as evidências e a base do fator antes de aceitar esta avaliação.</p><span class="sm mut">Nenhum certificado ou crédito verde emitido.</span>`)}</div></div>
<div class="row sp wrap">${btn('Voltar ao registro de combustível', { go: 's12', x: '←' })}<div class="row">${btn(rev ? 'Revisão solicitada ✓' : 'Solicitar revisão independente', { do: 'review' })}${btn('Explorar serviços verdes', { go: 's21', p: 1, x: '→' })}</div></div>${F(NOTE1)}`;
  },
  s21: () => {
    const p = port(), list = DIR.filter(c => c.ports.includes(p.id)), n = list.filter(c => (!state.dirCo || c.n == state.dirCo) && (state.dirTopic === '' || c.t.includes(+state.dirTopic))).length;
    return `${C('Cliente do navio / Serviços verdes', 'Fluxo 2 · Etapa 1 de 3')}${H('Encontrar uma empresa portuária', 'Fluxo ilustrativo', 'Explore empresas de exemplo para uma consulta de certificação ou de elegibilidade a créditos verdes.', btn('Minhas solicitações · ' + state.requests.length, { go: 's23' }))}${S(WF2, 0)}
${N('Contexto da busca: ' + ctxBr(), 'Os nomes e temas de consulta de exemplo não confirmam que alguma empresa atenda este porto, ofereça certificação ou emita créditos de carbono.')}
${P(`<div class="f2" style="grid-template-columns:repeat(3,1fr)"><div class="fld"><label for="dport">País / porto</label><select class="sel" id="dport" data-act="port">${PORTS.map(x => opt(x.id, x.country + ' / ' + x.name, state.port)).join('')}</select></div><div class="fld"><label for="dco">Empresa</label><select class="sel" id="dco" data-act="dco">${opt('', 'Todas as empresas', state.dirCo)}${list.map(c => opt(c.n, c.n, state.dirCo)).join('')}</select></div><div class="fld"><label for="dtp">Serviço / tema da consulta</label><select class="sel" id="dtp" data-act="dtp">${opt('', 'Todas as consultas ambientais', state.dirTopic)}${TOPS.map((t, i) => opt(String(i), t[1].replace('Consulta sobre ', '').replace(/^./, m => m.toUpperCase()), state.dirTopic)).join('')}</select></div></div><div class="row sp sm"><span class="mut">Os filtros organizam temas de consulta ilustrativos, não ofertas confirmadas de fornecedores.</span><button class="link" data-do="reset">Limpar filtros</button></div>`)}
<div class="row sp"><h2>Empresas de exemplo</h2><span class="sm mut">${n} ${n == 1 ? 'listagem' : 'listagens'} · capacidades a confirmar</span></div><div class="g3" id="dir">${dirCards()}</div>
${P(`<h2>Três decisões separadas</h2><div class="g3" style="gap:32px">${[['Avaliação operacional', 'Compara o uso de diesel com uma referência ilustrativa. Não é uma certificação.'], ['Certificação por terceiros', 'Exige um revisor independente adequado e um esquema de certificação definido.'], ['Elegibilidade a créditos verdes', 'Exige um programa aplicável, evidências adicionais e sua própria análise de elegibilidade.']].map(d => `<div><b class="tl">${d[0]}</b><p class="mut" style="font-size:13px;margin-top:8px">${d[1]}</p></div>`).join('')}</div>`)}${F(NOTE2, 'As capacidades das empresas exigem confirmação.')}`;
  },
  s22: () => {
    const v = curV(), r = state.range.fuel, co = state.company, d = DIR.find(x => x.n == co) || { i: ini(co) }, pct = (v.bm - v.l) / v.bm * 100;
    return `${C('Cliente do navio / Serviços verdes', 'Fluxo 2 · Etapa 2 de 3')}${H(co + ' · preparar uma consulta', 'Fluxo ilustrativo', 'Confirme as capacidades do fornecedor antes de solicitar análises independentes de certificação e de programas de crédito.', btn('Voltar ao diretório', { go: 's21', x: '←' }))}${S(WF2, 1)}
<div class="split r"><div class="col">${P(`<div class="row"><div class="mono">${d.i}</div><div><h2>${co}</h2><div class="xs mut">Exemplo fornecido pelo usuário</div></div></div>${B('Ilustrativo / não verificado', 'a')}${D('Contexto da busca', ctxBr())}<p class="mut" style="font-size:13px">Área de atuação, serviços ambientais, acreditação e capacidade de coordenar uma revisão independente não estão confirmados. Nenhum contato verificado está listado.</p>`)}
${P(`<h2>Evidências vinculadas do navio</h2>${D('Navio', v.n + ' · ' + v.c)}${D('Período do relatório', rng(r).replace(' – ', '–') + ' · UTC')}${D('Diesel informado', nf(v.l) + ' L')}${D('CO₂ direto estimado', co2(v.l) + ' t · fator ilustrativo')}<div>${B(v.evn + ' anexos · não verificados', 'g')}</div><p class="mut sm">Registro de relatório de ${port().name}. Esta consulta não altera seu limite de relatório.</p>`)}</div>
<div class="col">${P(`<h2>Escopo da solicitação</h2>${fld('Navio / avaliação', v.n + ' · ' + v.c + ' / Avaliação provisória')}<b class="sm">Temas da consulta</b>${SCOPE.map((s, i) => `<div class="chk" data-act="chk" data-i="${i}" role="checkbox" tabindex="0" aria-checked="${state.topics[i]}"><div class="cb ${state.topics[i] ? '' : 'off'}">✓</div><div><b style="font-weight:500">${s[0]}</b><div class="sm mut">${s[1]}</div></div></div>`).join('')}<div class="f2"><div class="fld"><label for="credit">Programa de crédito</label><input class="inp" id="credit" data-act="credit" placeholder="Não selecionado · confirmação necessária" value="${esc(state.credit)}"></div><div class="fld"><label for="recipient">Destinatário / revisor independente</label><input class="inp" id="recipient" data-act="recipient" placeholder="A confirmar com o fornecedor" value="${esc(state.recipient)}"></div></div>`)}
${P(`<div class="row sp"><h2>Evidências a incluir</h2>${lk('Revisar anexos →', { go: 's12' })}</div><p style="font-size:13px">Registro de combustível, leituras de medidores e declaração do chefe de máquinas · ${v.evn} ${v.evn == 1 ? 'arquivo' : 'arquivos'}. Inclui a avaliação operacional de exemplo e as divulgações de seu fator e de sua referência ilustrativos.</p><p class="mut sm">A metodologia do programa, a linha de base, a adicionalidade e outras documentações necessárias ainda não foram definidas. O revisor que receber o pedido pode solicitar mais evidências.</p>`)}</div></div>
${N('Solicite uma avaliação, não uma premiação', 'Um consumo de diesel abaixo da referência não qualifica automaticamente um navio para certificação ou créditos de carbono. Qualquer aprovação ou emissão depende de revisão independente e dos critérios do esquema ou programa aplicável.')}
<div class="row sp wrap"><p class="mut sm" style="flex:1">Envio apenas de demonstração. Confirme o destinatário e obtenha permissão antes de compartilhar qualquer evidência real.</p><div class="row">${btn('Salvar rascunho', { do: 'draft' })}${btn('Enviar consulta de demonstração', { do: 'submit', p: 1, x: '→' })}</div></div>${F(NOTE2, 'As capacidades das empresas exigem confirmação.')}`;
  },
  s23: () => {
    const R = state.requests[state.reqIdx] || state.requests[0];
    return `${C('Cliente do navio / Serviços verdes', 'Fluxo 2 · Etapa 3 de 3')}${H('Acompanhe sua consulta ambiental', 'Fluxo ilustrativo', `Solicitação de demonstração ${R.id} · ${R.vn} · Empresa de exemplo ${R.co}`, `<div class="row wrap">${state.requests.length > 1 ? `<select class="btn" data-act="req" aria-label="Solicitação">${state.requests.map((q, i) => opt(String(i), q.id + ' · ' + q.co, String(state.reqIdx))).join('')}</select>` : ''}${btn('Todas as solicitações', { go: 's21' })}</div>`)}${S(WF2, 2)}
${N('Consulta de demonstração registrada · aguardando confirmação do fornecedor', `Nenhuma solicitação real foi enviada. As capacidades e os dados do destinatário da ${R.co} ainda precisam ser confirmados. A verificação independente, a análise de certificação e a elegibilidade a créditos verdes são etapas separadas e condicionais.`)}
<div class="split"><div>${P(`<div class="row sp"><h2>Andamento da análise</h2>${B('Ação necessária', 'a')}</div>${[['✓', 'Envio', 'Registrado · demonstração', '', `Escopo da consulta e ${R.files} arquivos de apoio salvos junto com a avaliação provisória do navio.`, R.ts + ' · Cliente do navio · Sem entrega externa'], ['◷', 'Verificação independente', 'Não iniciada', 'a', 'Confirmar um fornecedor capaz e designar um revisor independente adequado para validar os dados de combustível, as evidências e a base de cálculo.', 'Aguardando confirmação do destinatário · Nenhum verificador designado'], ['◌', 'Análise de certificação', 'Não iniciada', 'g', 'Um terceiro adequado deve avaliar o registro verificado com base em um esquema de certificação definido. A aprovação não é garantida.', 'Esquema não selecionado · Certificado não emitido'], ['◌', 'Análise de elegibilidade a créditos verdes', 'Não iniciada', 'g', 'Avaliação separada em um programa de crédito aplicável, incluindo sua metodologia, linha de base, adicionalidade e outros critérios.', 'Programa não selecionado · Elegibilidade indeterminada · Nenhum crédito emitido']].map((s, i) => `<div class="stg"><div class="stm" style="${i < 2 ? `background:var(--${i ? 'amb' : 'tb'})` : ''}">${s[0]}</div><div><div class="row sp"><b style="color:var(--ink);font-size:15px">${s[1]}</b>${B(s[2], s[3])}</div><p style="font-size:13px">${s[4]}</p><span class="xs mut">${s[5]}</span></div></div>`).join('')}`)}</div>
<div class="col">${P(`<h2>Resumo da solicitação</h2>${D('Empresa de exemplo', R.co + ' · não verificada')}${D('Contexto da busca', R.ctx)}${D('Navio', R.vn + ' · ' + R.vc)}${D('Evidências', R.files + ' arquivos anexados; não verificados')}${D('Operacional', R.res)}${lk('Ver evidências enviadas →', { go: 's12', v: R.vc })}`)}
${P(`<div class="row"><span class="tl">▢</span><h2>Seu próximo passo</h2></div><p style="font-size:13px">Confirme se a empresa pode apoiar as análises solicitadas, qual é sua área de atuação e qual é o papel do revisor independente. Em seguida, identifique um esquema de certificação e um programa de crédito separado.</p>${btn('Revisar destinatário e solicitação', { go: 's22', co: R.co, p: 1, st: 'align-self:flex-start' })}<span class="mut sm">Não há datas de aprovação nem estimativas de emissão disponíveis.</span>`)}</div></div>
${P(`<div class="row wrap" style="gap:24px"><div style="flex:1"><span class="sm mut">Certificação</span><br><b style="color:var(--ink);font-size:15px">Não avaliada · nenhum certificado emitido</b></div><div style="flex:1"><span class="sm mut">Elegibilidade a créditos verdes</span><br><b style="color:var(--ink);font-size:15px">Indeterminada · nenhum crédito emitido</b></div>${btn('Voltar ao diretório', { go: 's21', x: '→' })}</div>`)}${F(NOTE2, 'As capacidades das empresas exigem confirmação.')}`;
  }
};
const TAB = { ops: 0, s11: 1, s12: 1, s13: 1, s21: 2, s22: 2, s23: 2 }, TGO = ['ops', 's11', 's21'], TN = ['Operações portuárias', 'Diesel e CO₂', 'Serviços verdes'];

function show(id, keep) {
  cur = id; closePop();
  $('#app').innerHTML = `<nav><a class="brand" href="index.html" title="Voltar ao site Porto Zero"><img src="assets/logo-emblem-light.png" alt=""><span>PORTO <b>ZERO</b></span></a><div class="tabs">${TN.map((t, i) => `<button class="tab ${TAB[id] == i ? 'on' : ''}" data-go="${TGO[i]}">${t}</button>`).join('')}</div><label class="ctx"><img src="images/map-pin.svg" alt=""><select id="portsel" data-act="port" aria-label="Porto">${PORTS.map(x => opt(x.id, x.name, state.port)).join('')}</select></label><div class="av">${TAB[id] == 2 ? 'CN' : 'JD'}</div></nav><main>${V[id]()}</main>`;
  if (!keep) scrollTo(0, 0);
  save();
}

/* ---------- Toast e modal ---------- */
let tt;
function toast(t, raw) { const e = $('#toast'); e.textContent = raw ? t : t + ' — apenas demonstração'; e.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('on'), 2200); }
function openModal(html) { closeModal(); const m = document.createElement('div'); m.className = 'mbg'; m.id = 'modal'; m.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(m); const f = m.querySelector('input,button'); if (f) f.focus(); }
function closeModal() { const m = $('#modal'); if (m) m.remove(); }

/* ---------- Calendário (seleção de período) ---------- */
let pop = null, cal = null;
const PRESETS = {
  ops: [['Dia 19 out', '2026-10-19', '2026-10-19'], ['Próximos 7 dias', '2026-10-19', '2026-10-25'], ['Próximos 14 dias', '2026-10-19', '2026-11-01']],
  fuel: [['Últimos 7 dias', '2026-10-12', '2026-10-18'], ['Últimos 14 dias', '2026-10-05', '2026-10-18'], ['Últimos 30 dias', '2026-09-19', '2026-10-18']]
};
function openCal(target, el) {
  if (pop && cal && cal.target == target) { closePop(); return; }
  closePop();
  const r = state.range[target], d = pd(r.s);
  cal = { target, el, s: r.s, e: r.e, picking: false, vy: d.getUTCFullYear(), vm: d.getUTCMonth(), max: target == 'ops' ? 14 : 31 };
  pop = document.createElement('div'); pop.id = 'pop'; pop.className = 'pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Selecionar período');
  document.body.appendChild(pop); renderCal(); placePop();
}
function placePop() {
  if (!pop || !cal) return; const b = cal.el.getBoundingClientRect(), w = pop.offsetWidth;
  pop.style.top = (window.scrollY + b.bottom + 8) + 'px';
  pop.style.left = Math.max(8, Math.min(window.scrollX + b.left, window.scrollX + document.documentElement.clientWidth - w - 8)) + 'px';
}
function closePop() { if (pop) pop.remove(); pop = null; cal = null; }
function renderCal() {
  const first = new Date(Date.UTC(cal.vy, cal.vm, 1)), start = addD(iso(first), -first.getUTCDay()), n = nDias({ s: cal.s, e: cal.e });
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = addD(start, i), m = pd(d).getUTCMonth(), cl = [m != cal.vm ? 'out' : '', d >= cal.s && d <= cal.e ? 'in' : '', d == cal.s ? 'st' : '', d == cal.e ? 'en' : ''].join(' ');
    cells += `<button class="cd ${cl}" data-d="${d}" aria-label="${fdy(d)}" ${d >= cal.s && d <= cal.e ? 'aria-pressed="true"' : ''}>${pd(d).getUTCDate()}</button>`;
  }
  pop.innerHTML = `<div class="cal-h"><button class="cal-n" data-cal="prev" aria-label="Mês anterior">‹</button><b>${MESL[cal.vm]} ${cal.vy}</b><button class="cal-n" data-cal="next" aria-label="Próximo mês">›</button></div>
<div class="cal-w">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(x => `<span>${x}</span>`).join('')}</div><div class="cal-g">${cells}</div>
<div class="cal-p">${PRESETS[cal.target].map((p, i) => `<button class="chip" data-cal="preset" data-i="${i}">${p[0]}</button>`).join('')}</div>
<div class="cal-f"><span>${cal.picking ? 'Selecione a data final' : rng(cal) + ' · ' + n + (n == 1 ? ' dia' : ' dias')}</span><div class="row"><button class="btn" data-cal="cancel">Cancelar</button><button class="btn p" data-cal="apply">Aplicar</button></div></div>
<div class="xs mut">Período máximo: ${cal.max} dias.</div>`;
}
function pickDay(d) {
  if (!cal.picking) { cal.s = cal.e = d; cal.picking = true; }
  else {
    if (d < cal.s) { cal.e = cal.s; cal.s = d; } else cal.e = d;
    if (nDias(cal) > cal.max) { cal.e = addD(cal.s, cal.max - 1); toast('Período máximo de ' + cal.max + ' dias', 1); }
    cal.picking = false;
  }
  const dm = pd(d); if (dm.getUTCMonth() != cal.vm) { cal.vm = dm.getUTCMonth(); cal.vy = dm.getUTCFullYear(); }
  renderCal();
}
function calAct(a, i) {
  if (a == 'prev' || a == 'next') { cal.vm += a == 'next' ? 1 : -1; if (cal.vm > 11) { cal.vm = 0; cal.vy++; } if (cal.vm < 0) { cal.vm = 11; cal.vy--; } renderCal(); placePop(); }
  else if (a == 'cancel') closePop();
  else if (a == 'preset') { const p = PRESETS[cal.target][+i]; state.range[cal.target] = { s: p[1], e: p[2] }; closePop(); show(cur, true); }
  else if (a == 'apply') { state.range[cal.target] = { s: cal.s, e: cal.e }; closePop(); show(cur, true); toast('Período aplicado: ' + rng(state.range[cur == 'ops' ? 'ops' : 'fuel']), 1); }
}
function shift(dir) { const r = state.range.ops, n = nDias(r); state.range.ops = { s: addD(r.s, dir * n), e: addD(r.e, dir * n) }; show(cur, true); }

/* ---------- Ações ---------- */
function exportCsv() {
  const p = port(), head = ['Navio', 'Tipo', 'Código', 'Berço', 'Chegada', 'Saída', 'Estadia (h)', 'Empresa de carga', 'Operação', 'Carga', 'Quantidade', 'Unidade', 'Porto'];
  const rows = lastCalls.map(c => [c.v, c.k, c.c, c.berth, fdm(c.a) + ' ' + hm(c.a), fdm(c.d) + ' ' + hm(c.d), c.stay, c.co, c.op, c.cg, c.qty, c.u, p.name]);
  const csv = '\ufeff' + [head].concat(rows).map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'cronograma-porto-zero-' + state.range.ops.s + (state.range.ops.e != state.range.ops.s ? '_a_' + state.range.ops.e : '') + '.csv';
  document.body.appendChild(a); a.click(); a.remove(); toast('Cronograma exportado (' + rows.length + ' chegadas)', 1);
}
function openVessel(i) {
  const c = lastCalls[i]; if (!c) return;
  openModal(`<div class="row sp"><h2>${c.v}</h2>${B(c.berth, 'g')}</div><p class="mut" style="font-size:13px">${c.k} · ${c.c} · ${port().name}</p>${D('Chegada planejada', fdm(c.a) + ' · ' + hm(c.a))}${D('Saída planejada', fdm(c.d) + ' · ' + hm(c.d))}${D('Estadia planejada', c.stay + ' h')}${D('Empresa de carga', c.co)}${D('Operação', `${c.op} · ${c.cg}`)}${D('Quantidade', nf(c.qty) + ' ' + c.u)}${D('Janela de movimentação', c.win)}<div class="modal-a">${btn('Fechar', { do: 'close' })}${btn('Ver combustível do navio', { go: 's12', v: c.c, p: 1, x: '→' })}</div>`);
}
function openFactor() {
  openModal(`<h2>Configurar fator de emissão</h2><p class="mut" style="font-size:13px">Fator ilustrativo em kg de CO₂ por litro de diesel. Substitua por uma base adequada antes de qualquer uso externo.</p><div class="fld"><label for="fac">Fator (kg CO₂/L)</label><input class="inp" id="fac" value="${fmtFac(state.factor)}" inputmode="decimal"></div><div class="modal-a">${btn('Restaurar 2,68', { do: 'reset-factor' })}${btn('Cancelar', { do: 'close' })}${btn('Aplicar', { do: 'apply-factor', p: 1 })}</div>`);
}
function submitReq() {
  if (!state.topics.some(Boolean)) { toast('Selecione ao menos um tema de consulta', 1); return; }
  const v = curV(), pct = (v.bm - v.l) / v.bm * 100, now = new Date(), id = 'GR-2026-0' + (14 + state.requests.length);
  state.requests.push({ id, co: state.company, vn: v.n, vc: v.c, ctx: ctxBr(), ts: fdy(iso(now)) + ' · ' + hm(now.getTime()) + ' UTC', res: nf1(Math.abs(pct)) + '% ' + (pct >= 0 ? 'abaixo' : 'acima') + ' da referência ilustrativa', files: v.evn });
  state.reqIdx = state.requests.length - 1; show('s23'); toast('Consulta de demonstração ' + id + ' registrada', 1);
}
function doAct(a, el) {
  const v = () => curV();
  switch (a) {
    case 'export': exportCsv(); break;
    case 'vessel': openVessel(+el.dataset.i); break;
    case 'sort': state.sortDesc = !state.sortDesc; show(cur, true); break;
    case 'draft': save(); toast('Rascunho salvo neste navegador', 1); break;
    case 'factor': openFactor(); break;
    case 'apply-factor': { const val = parseFloat(($('#fac').value || '').trim().replace(',', '.')); if (!(val > 0 && val <= 10)) { toast('Informe um fator entre 0 e 10', 1); break; } state.factor = val; closeModal(); show(cur, true); toast('Fator atualizado para ' + fmtFac(val) + ' kg CO₂/L', 1); break; }
    case 'reset-factor': state.factor = 2.68; closeModal(); show(cur, true); toast('Fator restaurado para 2,68 kg CO₂/L', 1); break;
    case 'review': if (isRev(v())) { toast('A revisão independente já foi solicitada', 1); break; } openModal(`<h2>Solicitar revisão independente</h2><p style="font-size:13px">O registro de <b>${v().n}</b> será marcado como "Em revisão" (demonstração: nenhuma solicitação real é enviada). Nenhum certificado ou crédito é emitido por este passo.</p><div class="modal-a">${btn('Cancelar', { do: 'close' })}${btn('Confirmar solicitação', { do: 'confirm-review', p: 1 })}</div>`); break;
    case 'confirm-review': state.reviewed[v().key] = 1; closeModal(); show(cur, true); toast('Revisão independente solicitada', 1); break;
    case 'upload': { const f = $('#fileinp'); if (f) f.click(); break; }
    case 'preview': openModal(`<h2>Pré-visualização</h2><p class="mut" style="font-size:13px">${esc(el.dataset.n)}</p>${D('Tamanho', esc(el.dataset.s))}<div style="border:1px dashed var(--line);border-radius:8px;padding:28px;text-align:center;color:var(--mut);font-size:13px">▤<br>Pré-visualização simulada. Este protótipo não armazena arquivos.</div><div class="modal-a">${btn('Fechar', { do: 'close', p: 1 })}</div>`); break;
    case 'submit': submitReq(); break;
    case 'reset': state.dirCo = ''; state.dirTopic = ''; show(cur, true); break;
    case 'close': closeModal(); break;
  }
}

/* ---------- Eventos ---------- */
document.addEventListener('click', e => {
  const t = e.target, inPop = t.closest('#pop');
  if (pop && !inPop && !t.closest('[data-calopen]')) closePop();
  if (inPop) {
    const d = t.closest('[data-d]'); if (d) { pickDay(d.dataset.d); return; }
    const c = t.closest('[data-cal]'); if (c) { calAct(c.dataset.cal, c.dataset.i); return; }
    return;
  }
  const co = t.closest('[data-calopen]'); if (co) { openCal(co.dataset.calopen, co); return; }
  const sh = t.closest('[data-shift]'); if (sh) { shift(+sh.dataset.shift); return; }
  const dd = t.closest('[data-do]'); if (dd) { doAct(dd.dataset.do, dd); return; }
  const g = t.closest('[data-go]');
  if (g) { if (g.dataset.v) state.vessel = g.dataset.v; if (g.dataset.co) state.company = g.dataset.co; closeModal(); show(g.dataset.go); return; }
  const c = t.closest('[data-act=chk]'); if (c) { const i = +c.dataset.i; state.topics[i] = !state.topics[i]; c.firstElementChild.classList.toggle('off', !state.topics[i]); c.setAttribute('aria-checked', state.topics[i]); save(); return; }
  if (t.classList.contains('mbg')) { closeModal(); return; }
  const ts = t.closest('[data-toast]'); if (ts) toast(ts.dataset.toast);
});
document.addEventListener('keydown', e => {
  if (e.key == 'Escape') { closePop(); closeModal(); }
  if ((e.key == 'Enter' || e.key == ' ') && e.target.matches && e.target.matches('[data-do][tabindex],[data-act=chk]')) { e.preventDefault(); e.target.click(); }
});
window.addEventListener('resize', () => { if (pop) placePop(); });
document.addEventListener('change', e => {
  const a = e.target.dataset.act, v = e.target.value; if (!a) return;
  if (a == 'port') { state.port = v; state.co = ''; state.vessel = null; state.dirCo = ''; show(cur, true); toast('Porto selecionado: ' + port().name, 1); }
  else if (a == 'cof') { state.co = v; show(cur, true); }
  else if (a == 'stf') { state.st = v; show(cur, true); }
  else if (a == 'dco') { state.dirCo = v; show(cur, true); }
  else if (a == 'dtp') { state.dirTopic = v; show(cur, true); }
  else if (a == 'req') { state.reqIdx = +v; show(cur, true); }
  else if (a == 'file') {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast('O arquivo excede 10 MB', 1); return; }
    const k = curV().key, size = f.size < 1048576 ? Math.max(1, Math.round(f.size / 1024)) + ' KB' : (f.size / 1048576).toFixed(1).replace('.', ',') + ' MB';
    (state.extra[k] = state.extra[k] || []).push({ name: f.name, size }); show(cur, true); toast('Arquivo anexado: ' + f.name, 1);
  }
});
document.addEventListener('input', e => {
  const a = e.target.dataset.act;
  if (a == 'lit') { const n = parseInt(e.target.value.replace(/\D/g, '')) || 0, c = calc(n), v = curV(); state.edits[v.ek] = n; $('#c1').textContent = c[0]; $('#c2').textContent = c[1]; $('#c3').textContent = c[2]; save(); }
  else if (a == 'credit') { state.credit = e.target.value; save(); }
  else if (a == 'recipient') { state.recipient = e.target.value; save(); }
});

show(V[cur] ? cur : 'ops', true);
