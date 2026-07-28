import { useMemo, useState } from 'react'
import {
  ACCESO_COMPLETO,
  CLINICAS,
  PISO_MENSUAL,
  PISO_SETUP,
  TOPE_MENSUAL,
  TOPE_SETUP,
  type Clinica,
  type PlanId,
} from './data/clinicas'
import {
  actualizarCamas,
  cotizarTodas,
  formatARS,
  LABEL_COMPLEJIDAD,
  LABEL_PLAN,
  PESOS_CAMAS,
  PLANES_SAAS,
  bandaDePlan,
  type CampoCama,
  type DetalleCotizacion,
} from './lib/cotizacion'
import './App.css'

type Filtro = 'todas' | PlanId

const CAMPOS_CAMA: { key: CampoCama; label: string }[] = [
  { key: 'camasGenerales', label: 'Generales' },
  { key: 'camasUtiUco', label: 'UTI/UCO' },
  { key: 'camasUtiNeoPed', label: 'Neo/Ped' },
  { key: 'camasUci', label: 'UCI' },
]

export default function App() {
  const [clinicas, setClinicas] = useState<Clinica[]>(() =>
    CLINICAS.map((c) => ({ ...c })),
  )
  const [piso, setPiso] = useState(PISO_MENSUAL)
  const [tope, setTope] = useState(TOPE_MENSUAL)
  const [pisoSetup, setPisoSetup] = useState(PISO_SETUP)
  const [topeSetup, setTopeSetup] = useState(TOPE_SETUP)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [seleccionada, setSeleccionada] = useState<string | null>('sarmiento')
  const [busqueda, setBusqueda] = useState('')

  const params = useMemo(
    () => ({
      mensual: { piso, tope },
      setup: { piso: pisoSetup, tope: topeSetup },
    }),
    [piso, tope, pisoSetup, topeSetup],
  )
  const cotizaciones = useMemo(
    () => cotizarTodas(params, clinicas),
    [params, clinicas],
  )
  const cotizacionPorId = useMemo(() => {
    const map = new Map<string, DetalleCotizacion>()
    for (const d of cotizaciones) map.set(d.clinica.id, d)
    return map
  }, [cotizaciones])

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return cotizaciones.filter((d) => {
      const okFiltro = filtro === 'todas' || d.plan.id === filtro
      const okBusqueda =
        !q ||
        d.clinica.nombre.toLowerCase().includes(q) ||
        d.clinica.localidad.toLowerCase().includes(q)
      return okFiltro && okBusqueda
    })
  }, [cotizaciones, filtro, busqueda])

  const detalle: DetalleCotizacion | undefined =
    cotizaciones.find((d) => d.clinica.id === seleccionada) ?? filtradas[0]

  const resumen = useMemo(() => {
    const counts: Record<PlanId, number> = {
      starter: 0,
      professional: 0,
      business: 0,
      enterprise: 0,
    }
    let totalMensual = 0
    let totalSetup = 0
    for (const d of cotizaciones) {
      counts[d.plan.id]++
      totalMensual += d.cotizacionMensual
      totalSetup += d.setupInicial
    }
    return { counts, totalMensual, totalSetup }
  }, [cotizaciones])

  function onChangeCama(id: string, campo: CampoCama, raw: string) {
    const valor = raw === '' ? 0 : Number(raw)
    setClinicas((prev) =>
      prev.map((c) => (c.id === id ? actualizarCamas(c, campo, valor) : c)),
    )
  }

  function resetCatalogo() {
    setClinicas(CLINICAS.map((c) => ({ ...c })))
  }

  return (
    <div className="app">
      <div className="bg-grid" aria-hidden />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <p className="brand-kicker">SaaS · cobro por tamaño · producto completo</p>
            <h1>Cotizador de suscripción</h1>
          </div>
        </div>
        <div className="params params-wide">
          <label>
            Piso mensual
            <span className="hint">Suscripción mínima</span>
            <div className="input-money">
              <span>$</span>
              <input
                type="number"
                min={0}
                step={10000}
                value={piso}
                onChange={(e) => setPiso(Number(e.target.value) || 0)}
              />
            </div>
          </label>
          <label>
            Tope mensual
            <span className="hint">Ancla Sanatorio Chaco</span>
            <div className="input-money">
              <span>$</span>
              <input
                type="number"
                min={0}
                step={10000}
                value={tope}
                onChange={(e) => setTope(Number(e.target.value) || 0)}
              />
            </div>
          </label>
          <label>
            Piso setup
            <span className="hint">Setup inicial mínimo</span>
            <div className="input-money">
              <span>$</span>
              <input
                type="number"
                min={0}
                step={100000}
                value={pisoSetup}
                onChange={(e) => setPisoSetup(Number(e.target.value) || 0)}
              />
            </div>
          </label>
          <label>
            Tope setup
            <span className="hint">Setup inicial máximo</span>
            <div className="input-money">
              <span>$</span>
              <input
                type="number"
                min={0}
                step={100000}
                value={topeSetup}
                onChange={(e) => setTopeSetup(Number(e.target.value) || 0)}
              />
            </div>
          </label>
        </div>
      </header>

      <p className="product-note">
        Misma plataforma para todos. Mensual y setup inicial escalan por tamaño (camas).
        Editá camas o parámetros y todo se recalcula al instante.
      </p>

      <section className="plans" aria-label="Bandas de tamaño">
        {PLANES_SAAS.map((plan) => {
          const banda = bandaDePlan(plan.id, params.mensual)
          const count = resumen.counts[plan.id]
          const active = filtro === plan.id
          return (
            <button
              key={plan.id}
              type="button"
              className={`plan-card plan-${plan.id} ${active ? 'active' : ''}`}
              onClick={() => setFiltro(active ? 'todas' : plan.id)}
            >
              <div className="plan-card-top">
                <span className="plan-name">{plan.nombre}</span>
                <span className="plan-count">{count}</span>
              </div>
              <p className="plan-tagline">{plan.tagline}</p>
              <p className="plan-price">
                {formatARS(banda.min)}
                <span> — {formatARS(banda.max)} / mes</span>
              </p>
              <p className="plan-same">Producto completo</p>
            </button>
          )
        })}
      </section>

      <section className="stats stats-4" aria-label="Resumen">
        <article className="stat">
          <span className="stat-label">Prestadores</span>
          <strong>{cotizaciones.length}</strong>
        </article>
        <article className="stat">
          <span className="stat-label">Ticket mensual avg</span>
          <strong>
            {formatARS(
              Math.round(resumen.totalMensual / Math.max(1, cotizaciones.length)),
            )}
          </strong>
        </article>
        <article className="stat">
          <span className="stat-label">Setup cartera</span>
          <strong>{formatARS(resumen.totalSetup)}</strong>
        </article>
        <article className="stat stat-total">
          <span className="stat-label">MRR estimado</span>
          <strong>{formatARS(resumen.totalMensual)}</strong>
        </article>
      </section>

      <div className="workspace">
        <aside className="panel list-panel">
          <div className="panel-toolbar">
            <input
              className="search"
              type="search"
              placeholder="Buscar establecimiento o localidad…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar establecimiento"
            />
            <div className="chips" role="tablist" aria-label="Filtrar por banda">
              <button
                type="button"
                role="tab"
                aria-selected={filtro === 'todas'}
                className={`chip ${filtro === 'todas' ? 'active' : ''}`}
                onClick={() => setFiltro('todas')}
              >
                Todos
              </button>
              {PLANES_SAAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={filtro === p.id}
                  className={`chip chip-${p.id} ${filtro === p.id ? 'active' : ''}`}
                  onClick={() => setFiltro(p.id)}
                >
                  {p.nombre}
                </button>
              ))}
            </div>
          </div>

          <ul className="clinica-list">
            {filtradas.map((d) => (
              <li key={d.clinica.id}>
                <button
                  type="button"
                  className={`clinica-row ${detalle?.clinica.id === d.clinica.id ? 'selected' : ''} ${d.clinica.esTope || d.clinica.esReferenciaMedia ? 'is-base' : ''}`}
                  onClick={() => setSeleccionada(d.clinica.id)}
                >
                  <div className="clinica-row-main">
                    <span className={`badge badge-plan badge-${d.plan.id}`}>
                      {LABEL_PLAN[d.plan.id]}
                    </span>
                    <span className="clinica-name">
                      {d.clinica.nombre}
                      {d.clinica.esReferenciaMedia ? <em>Ancla</em> : null}
                      {d.clinica.esTope ? <em>Tope</em> : null}
                    </span>
                    <span className="clinica-localidad">{d.clinica.localidad}</span>
                  </div>
                  <div className="clinica-row-meta">
                    <span>
                      {d.clinica.totalCamas} camas · {LABEL_COMPLEJIDAD[d.complejidad]}
                    </span>
                    <div className="clinica-amounts">
                      <strong>{formatARS(d.cotizacionMensual)}/mes</strong>
                      <span>Setup {formatARS(d.setupInicial)}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
            {filtradas.length === 0 && (
              <li className="empty">No hay prestadores en esta banda.</li>
            )}
          </ul>
        </aside>

        {detalle && (
          <main className="panel detail-panel">
            <header className="detail-head">
              <div>
                <div className="detail-badges">
                  <span className={`badge badge-plan badge-${detalle.plan.id}`}>
                    {detalle.plan.nombre}
                  </span>
                  <span className={`badge badge-${detalle.complejidad}`}>
                    Complejidad {LABEL_COMPLEJIDAD[detalle.complejidad]}
                  </span>
                </div>
                <h2>{detalle.clinica.nombre}</h2>
                <p className="localidad-line">{detalle.clinica.localidad}</p>
                <p className="motivo">{detalle.motivoComplejidad}</p>
              </div>
              <div className="quote-pair">
                <div className="quote-hero">
                  <span>Suscripción mensual</span>
                  <strong>{formatARS(detalle.cotizacionMensual)}</strong>
                  <small>
                    {detalle.clinica.totalCamas} camas · índice{' '}
                    {detalle.indiceTamano.toFixed(1)}
                  </small>
                </div>
                <div className="quote-hero quote-setup">
                  <span>Setup inicial</span>
                  <strong>{formatARS(detalle.setupInicial)}</strong>
                  <small>
                    Rango {formatARS(detalle.bandaSetup.min)} –{' '}
                    {formatARS(detalle.bandaSetup.max)}
                  </small>
                </div>
              </div>
            </header>

            <section className="beds-grid" aria-label="Camas por tipo">
              <BedCard label="Generales / piso" value={detalle.clinica.camasGenerales} peso={PESOS_CAMAS.generales} />
              <BedCard label="UTI / UCO" value={detalle.clinica.camasUtiUco} peso={PESOS_CAMAS.utiUco} accent="critical" />
              <BedCard label="UTI Neo / Ped" value={detalle.clinica.camasUtiNeoPed} peso={PESOS_CAMAS.utiNeoPed} accent="critical" />
              <BedCard label="UCI intermedia" value={detalle.clinica.camasUci} peso={PESOS_CAMAS.uci} accent="mid" />
              <BedCard label="Total camas" value={detalle.clinica.totalCamas} highlight />
            </section>

            <section className="split">
              <div>
                <h3>Incluye (igual para todos)</h3>
                <ul className="servicios">
                  {ACCESO_COMPLETO.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Cómo se calculó</h3>
                <p className="calc-line">
                  Índice de tamaño: <strong>{detalle.indiceTamano.toFixed(1)}</strong>
                </p>
                <p className="calc-note">
                  Mensual y setup usan la misma curva por tamaño: piso → ancla Sarmiento →
                  tope Chaco. Mensual {formatARS(piso)}–{formatARS(tope)}. Setup{' '}
                  {formatARS(pisoSetup)}–{formatARS(topeSetup)}.
                </p>
                <h3 className="subhead">Servicios clínicos</h3>
                <ul className="servicios dense">
                  {detalle.servicios.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </section>
          </main>
        )}
      </div>

      <section className="panel editor-panel" aria-label="Editor de camas">
        <div className="editor-head">
          <div>
            <h2>Prestadores · camas editables</h2>
            <p>
              Cambiá cualquier valor: mensual, setup, banda, complejidad y totales se
              actualizan en vivo.
            </p>
          </div>
          <button type="button" className="btn-reset" onClick={resetCatalogo}>
            Restaurar datos originales
          </button>
        </div>

        <div className="editor-scroll">
          <table className="editor-table">
            <thead>
              <tr>
                <th>Prestador</th>
                <th>Localidad</th>
                {CAMPOS_CAMA.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>Total</th>
                <th>Banda</th>
                <th>Complejidad</th>
                <th>Mensual</th>
                <th>Setup</th>
              </tr>
            </thead>
            <tbody>
              {clinicas.map((c) => {
                const d = cotizacionPorId.get(c.id)
                return (
                  <tr
                    key={c.id}
                    className={seleccionada === c.id ? 'row-selected' : undefined}
                    onClick={() => setSeleccionada(c.id)}
                  >
                    <td className="col-nombre">
                      <strong>{c.nombre}</strong>
                      {c.esReferenciaMedia ? <em>Ancla</em> : null}
                      {c.esTope ? <em>Tope</em> : null}
                    </td>
                    <td>{c.localidad}</td>
                    {CAMPOS_CAMA.map((campo) => (
                      <td key={campo.key} className="col-input">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={c[campo.key]}
                          aria-label={`${c.nombre} ${campo.label}`}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onChangeCama(c.id, campo.key, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="col-total">{c.totalCamas}</td>
                    <td>
                      {d ? (
                        <span className={`badge badge-plan badge-${d.plan.id}`}>
                          {LABEL_PLAN[d.plan.id]}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {d ? (
                        <span className={`badge badge-${d.complejidad}`}>
                          {LABEL_COMPLEJIDAD[d.complejidad]}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="col-precio">
                      {d ? formatARS(d.cotizacionMensual) : '—'}
                    </td>
                    <td className="col-precio col-setup">
                      {d ? formatARS(d.setupInicial) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function BedCard({
  label,
  value,
  peso,
  accent,
  highlight,
}: {
  label: string
  value: number
  peso?: number
  accent?: 'critical' | 'mid'
  highlight?: boolean
}) {
  return (
    <div
      className={`bed-card ${accent ?? ''} ${highlight ? 'highlight' : ''} ${value === 0 ? 'zero' : ''}`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      {peso != null && <small>peso ×{peso}</small>}
    </div>
  )
}
