import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={`${styles.header} glass-panel`}>
        <div className={styles.logoArea}>
          <h1>Finca San Angel</h1>
          <span className={styles.tagline}>Gestión Inteligente</span>
        </div>
        <nav className={styles.nav}>
          <button className={styles.navLink}>Dashboard</button>
          <button className={styles.navLink}>Ganado</button>
          <button className={styles.navLink}>Finanzas</button>
          <button className={styles.navLink}>Inventario</button>
          <button className="btn-primary">Nueva Tarea</button>
        </nav>
      </header>

      <section className={styles.dashboard}>
        <h2 className={styles.sectionTitle}>Resumen Semanal</h2>
        
        <div className={styles.metricsGrid}>
          <div className={`${styles.metricCard} glass-panel`}>
            <h3>Producción Leche</h3>
            <p className={styles.metricValue}>1,240 L</p>
            <span className={styles.metricSubtitle}>+4% respecto a la semana pasada</span>
          </div>
          
          <div className={`${styles.metricCard} glass-panel`}>
            <h3>Ganado Activo</h3>
            <p className={styles.metricValue}>45</p>
            <span className={styles.metricSubtitle}>2 Nacimientos recientes</span>
          </div>
          
          <div className={`${styles.metricCard} glass-panel`}>
            <h3>Ingresos Netos</h3>
            <p className={styles.metricValue}>$4,500</p>
            <span className={styles.metricSubtitle}>Venta de leche y derivados</span>
          </div>

          <div className={`${styles.metricCard} glass-panel warnings`}>
            <h3>Alertas</h3>
            <p className={styles.metricValue} style={{color: 'var(--warning)'}}>3</p>
            <span className={styles.metricSubtitle}>Vacunación pendiente esta semana</span>
          </div>
        </div>

        <div className={styles.panelsArea}>
          <div className={`${styles.panel} glass-panel`}>
             <h3>Próximos Eventos Médicos</h3>
             <ul className={styles.list}>
                <li><strong>Margarita (Chapeta 014):</strong> Chequeo Post-Parto - Mañana</li>
                <li><strong>Lolo (Chapeta 042):</strong> Vacunación - 15 Abr</li>
             </ul>
          </div>
          
          <div className={`${styles.panel} glass-panel`}>
             <h3>Inventario Crítico (< 20%)</h3>
             <ul className={styles.list}>
                <li><strong>Minerales (Sal):</strong> 2 Bultos restantes</li>
                <li><strong>Dosis Vacuna Aftosa:</strong> 5 Dosis restantes</li>
             </ul>
             <button className="btn-primary" style={{marginTop: '1rem'}}>Registrar Gasto de Insumo</button>
          </div>
        </div>
      </section>
    </div>
  )
}
