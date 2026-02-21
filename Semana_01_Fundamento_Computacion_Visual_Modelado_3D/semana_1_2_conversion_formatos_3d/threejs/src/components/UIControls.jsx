import { FORMAT_OPTIONS } from '../utils/modelUtils'

const FORMAT_META = {
  OBJ:  { desc: 'Wavefront', color: '#f0c34e' },
  STL:  { desc: 'Stereolithography', color: '#e06c75' },
  GLTF: { desc: 'GL Transmission', color: '#61afef' },
}

export default function UIControls({ activeFormat, onFormatChange, modelInfo }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        Formatos 3D
      </div>

      <div>
        <p className="format-label">Formato activo</p>
        <div className="tab-group">
          {FORMAT_OPTIONS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              className={`tab-btn ${activeFormat === fmt ? 'active' : ''}`}
              onClick={() => onFormatChange(fmt)}
            >
              <span
                className="tab-dot"
                style={{ background: FORMAT_META[fmt].color }}
              />
              <span className="tab-ext">.{fmt}</span>
              <span className="tab-tag">{FORMAT_META[fmt].desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <p className="stats-title">Geometría</p>

        <div className="stat-card">
          <span className="stat-value">{modelInfo.vertices.toLocaleString()}</span>
          <span className="stat-label">Vértices</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{modelInfo.faces.toLocaleString()}</span>
          <span className="stat-label">Caras</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{modelInfo.format}</span>
          <span className="stat-label">Formato activo</span>
        </div>
      </div>

      <p className="nav-hint">
        <strong>Controles de cámara</strong>
        Clic + arrastrar — rotar<br />
        Rueda — zoom<br />
        Clic derecho + arrastrar — desplazar
      </p>
    </aside>
  )
}
