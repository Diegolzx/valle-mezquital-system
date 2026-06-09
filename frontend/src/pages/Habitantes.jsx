import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Search, UserCheck, UserX, Edit, Trash2, Eye, FileText } from 'lucide-react';

const Habitantes = () => {
  const [habitantes, setHabitantes] = useState([]);
  const [filteredHabitantes, setFilteredHabitantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [selectedHabitante, setSelectedHabitante] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { on, off } = useSocket();

  useEffect(() => {
    loadHabitantes();

    on('actualizar-habitantes', () => {
      loadHabitantes();
    });

    return () => {
      off('actualizar-habitantes');
    };
  }, []);

  useEffect(() => {
    filterHabitantes();
  }, [habitantes, searchTerm, filterEstado]);

  const loadHabitantes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/habitantes`);
      setHabitantes(response.data);
    } catch (error) {
      console.error('Error al cargar habitantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHabitantes = () => {
    let filtered = habitantes;

    if (filterEstado !== 'todos') {
      filtered = filtered.filter(h => h.estado === filterEstado);
    }

    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.curp.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHabitantes(filtered);
  };

  const handleAprobar = async (id) => {
    try {
      await axios.put(`${API_URL}/api/habitantes/${id}/estado`, { estado: 'activo' });
      loadHabitantes();
    } catch (error) {
      console.error('Error al aprobar habitante:', error);
      alert('Error al aprobar habitante');
    }
  };

  const handleRechazar = async (id) => {
    if (!confirm('¿Estás seguro de rechazar este habitante?')) return;
    
    try {
      await axios.put(`${API_URL}/api/habitantes/${id}/estado`, { estado: 'rechazado' });
      loadHabitantes();
    } catch (error) {
      console.error('Error al rechazar habitante:', error);
      alert('Error al rechazar habitante');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este habitante?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/habitantes/${id}`);
      loadHabitantes();
    } catch (error) {
      console.error('Error al eliminar habitante:', error);
      alert('Error al eliminar habitante');
    }
  };

  const verDetalles = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/habitantes/${id}`);
      setSelectedHabitante(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Habitantes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Total: {filteredHabitantes.length} habitantes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o CURP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="pendiente">Pendientes</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CURP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Manzana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHabitantes.map((habitante) => (
                  <tr key={habitante.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {habitante.nombre_completo}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {habitante.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {habitante.correo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {habitante.curp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Manzana {habitante.manzana}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        habitante.estado === 'activo' ? 'badge-success' :
                        habitante.estado === 'pendiente' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {habitante.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => verDetalles(habitante.id)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {habitante.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => handleAprobar(habitante.id)}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg text-green-600 transition-colors"
                              title="Aprobar"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRechazar(habitante.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600 transition-colors"
                              title="Rechazar"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleEliminar(habitante.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredHabitantes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No se encontraron habitantes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles del Habitante"
      >
        {selectedHabitante && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Completo</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedHabitante.nombre_completo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedHabitante.telefono}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Correo</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedHabitante.correo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CURP</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedHabitante.curp}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manzana</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  Manzana {selectedHabitante.manzana}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                <span className={`badge ${
                  selectedHabitante.estado === 'activo' ? 'badge-success' :
                  selectedHabitante.estado === 'pendiente' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {selectedHabitante.estado}
                </span>
              </div>
            </div>

            {selectedHabitante.ine_pdf && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">INE (PDF)</p>
                <a
                  href={selectedHabitante.ine_pdf}
                  download="INE.pdf"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Descargar INE</span>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Habitantes;
