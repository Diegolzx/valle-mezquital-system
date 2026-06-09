import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AlertCircle, DollarSign, CheckCircle, Clock } from 'lucide-react';

const Multas = () => {
  const [multas, setMultas] = useState([]);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadMultas();
  }, [filterEstado]);

  const loadMultas = async () => {
    try {
      const params = filterEstado !== 'todos' ? { estado: filterEstado } : {};
      const response = await axios.get(`${API_URL}/api/multas`, { params });
      setMultas(response.data);
    } catch (error) {
      console.error('Error al cargar multas:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDeuda = multas
    .filter(m => m.estado === 'pendiente')
    .reduce((acc, m) => acc + m.monto, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Multas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total de multas: {multas.length}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Multas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {multas.filter(m => m.estado === 'pendiente').length}
                </p>
              </div>
              <div className="p-3 bg-red-600 rounded-full">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Deuda</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  ${totalDeuda.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-600 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Multas Pagadas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {multas.filter(m => m.estado === 'pagada').length}
                </p>
              </div>
              <div className="p-3 bg-green-600 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagada">Pagadas</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Habitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Tarea
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {multas.map((multa) => (
                  <tr key={multa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {multa.nombre_completo}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {multa.curp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {multa.tarea_titulo || 'Sin tarea asociada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${multa.monto.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        multa.estado === 'pagada' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {multa.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(multa.fecha_creacion).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {multas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No se encontraron multas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Multas;
