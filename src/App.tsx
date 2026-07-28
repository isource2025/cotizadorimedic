import { useMemo, useState } from 'react'
import { ACCESO_COMPLETO, PISO_MENSUAL, TOPE_MENSUAL, type PlanId } from './data/clinicas'
import {
  cotizarTodas,
  formatARS,
  LABEL_COMPLEJIDAD,
  LABEL_PLAN,
  PESOS_CAMAS,
  PLANES_SAAS,
  bandaDePlan,
  type DetalleCotizacion,
} from './lib/cotizacion'
import './App.css'

type Filtro = 'todas' | PlanId

export default function App() {
  const [piso, setPiso] = useState(PISO_MENSUAL)
  const [tope, setTope] = useState(TOPE_MENSUAL)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [seleccionada, setSeleccionada] = useState<string | null>('sarmiento')
  const [busqueda, setBusqueda] = useState('')

  const params = useMemo(() => ({ piso, tope }), [piso, tope])
  const cotizaciones = useMemo(() => cotizarTodas(params), [params])

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return cotizaciones.filter((d) => {
      const okFiltro = filtro === 'todas' || d.plan.id === filtro
      const okBusqueda = !q || d.clinica.nombre.toLowerCase().includes(q)
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
    let total = 0
    for (const d of cotizaciones) {
      counts[d.plan.id]++
      total += d.cotizacionMensual
    }
    return { counts, total }
  }, [cotizaciones])

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
        <div className="params">
          <label>
            Piso mensual
            <span className="hint">Mínimo por prestador</span>
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
            Tope Escala
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
        </div>
      </header>

      <p className="product-note">
        Misma plataforma para todos: sin límites de usuarios ni sedes. Las bandas solo
        empaquetan el precio según tamaño (camas).
      </p>

      <section className="plans" aria-label="Bandas de tamaño">
        {PLANES_SAAS.map((plan) => {
          const banda = bandaDePlan(plan.id, params)
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
                <span> — {formatARS(banda.max)}</span>
              </p>
              <p className="plan-same">Producto completo</p>
            </button>
          )
        })}
      </section>

      <section className="stats" aria-label="Resumen">
        <article className="stat">
          <span className="stat-label">Prestadores</span>
          <strong>{cotizaciones.length}</strong>
        </article>
        <article className="stat">
          <span className="stat-label">Ticket promedio</span>
          <strong>
            {formatARS(Math.round(resumen.total / Math.max(1, cotizaciones.length)))}
          </strong>
        </article>
        <article className="stat stat-total">
          <span className="stat-label">MRR estimado cartera</span>
          <strong>{formatARS(resumen.total)}</strong>
        </article>
      </section>

      <div className="workspace">
        <aside className="panel list-panel">
          <div className="panel-toolbar">
            <input
              className="search"
              type="search"
              placeholder="Buscar establecimiento…"
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
                  </div>
                  <div className="clinica-row-meta">
                    <span>
                      {d.clinica.totalCamas} camas · {LABEL_COMPLEJIDAD[d.complejidad]}
                    </span>
                    <strong>{formatARS(d.cotizacionMensual)}</strong>
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
                <p className="motivo">{detalle.motivoComplejidad}</p>
              </div>
              <div className="quote-hero">
                <span>Suscripción mensual</span>
                <strong>{formatARS(detalle.cotizacionMensual)}</strong>
                <small>
                  {detalle.clinica.totalCamas} camas · índice tamaño{' '}
                  {detalle.indiceTamano.toFixed(1)}
                </small>
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
                  El precio sigue el tamaño del prestador (camas), con un plus suave por
                  UTI/UCO/Neo/UCI. Escala continua: piso {formatARS(piso)} → ancla Sarmiento →
                  tope {formatARS(tope)} (Chaco). La complejidad es informativa; no limita
                  módulos ni uso.
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
