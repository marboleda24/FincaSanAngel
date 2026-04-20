import { getBovinos } from '@/app/actions/bovinos'
import Link from 'next/link'

export default async function GanadoListView() {
  const { data: bovinos, success } = await getBovinos()

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Gestión de Ganado</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Inventario general de reses activas de la finca.</p>
        </div>
        <Link href="/ganado/nuevo" className="btn-primary" style={{ display: 'inline-block' }}>
          + Registrar Res
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Identificador</th>
              <th>Raza</th>
              <th>Género</th>
              <th>Edad Aprox.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!success || bovinos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No hay reses registradas actualmente en la finca.
                </td>
              </tr>
            ) : (
              bovinos.map((bovino) => {
                // Cálculo simple de edad en años
                const edad = new Date().getFullYear() - new Date(bovino.fechaNacimiento).getFullYear()
                return (
                  <tr key={bovino.id}>
                    <td><strong>{bovino.identificador}</strong></td>
                    <td>{bovino.raza}</td>
                    <td>{bovino.genero}</td>
                    <td>{edad === 0 ? 'Menos de 1 año' : `${edad} años`}</td>
                    <td>
                      <span className={`badge ${bovino.estado === 'Activo' ? 'active' : ''}`}>
                        {bovino.estado}
                      </span>
                    </td>
                    <td>
                      <Link href={`/ganado/${bovino.id}`} style={{ color: 'var(--info)', fontWeight: 500 }}>
                        Ver Hoja de Vida
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
