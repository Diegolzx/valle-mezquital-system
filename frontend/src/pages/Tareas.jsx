import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import axios from 'axios';
import { Plus, Calendar, Clock, MapPin, CheckCircle, PlayCircle, XCircle } from 'lucide-react';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    manzanas: 'todas'
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadTareas();
  }, []);

  const loadTareas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tareas`);
      setTareas(response.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/tareas`, formData);
      setShowModal(false);
      loadTareas();
      setFormData({ titulo: '', descripcion: '', fecha: '', hora: '', manzanas: 'todas' });
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear tarea');
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`${API_URL}/api/tareas/${id}/estado`, { estado: nuevoEstado });
      loadTareas();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const generarMultas = async (tareaId) => {
    if (!confirm('¿Generar multas de $200 para los ausentes?')) return;
    
    try {
      await axios.post(`${API_URL}/api/tareas/${tareaId}/generar-multas`);
      alert('Multas generadas exitosamente');
      loadTareas();
    } catch (error) {
      console.error('Error al generar multas:', error);
      alert('Error al generar multas');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      programada: 'badge-info',
      en_curso: 'badge-warning',
      finalizada: 'badge-success'
    };
    return badges[estado] || 'badge-info';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      programada: 'Programada',
      en_curso: 'En Curso',
      finalizada: 'Finalizada'
    };
    return textos[estado] || estado;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Tareas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Total: {tareas.length} tareas
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Nueva Tarea
          </button>
        </div>

        {/* Grid de tareas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tareas.map((tarea) => (
            <div key={tarea.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tarea.titulo}
                </h3>
                <span className={`badge ${getEstadoBadge(tarea.estado)}`}>
                  {getEstadoTexto(tarea.estado)}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {tarea.descripcion}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(tarea.fecha).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {tarea.hora}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {tarea.manzanas === 'todas' ? 'Todas las manzanas' : `Manzanas ${tarea.manzanas}`}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tarea.estado === 'programada' && (
                  <button
                    onClick={() => cambiarEstado(tarea.id, 'en_curso')}
                    className="btn-secondary text-xs flex items-center"
                  >
                    <PlayCircle className="w-3 h-3 mr-1" />
                    Iniciar
                  </button>
                )}
                {tarea.estado === 'en_curso' && (
                  <>
                    <button
                      onClick={() => cambiarEstado(tarea.id, 'finalizada')}
                      className="btn-primary text-xs flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Finalizar
                    </button>
                    <button
                      onClick={() => generarMultas(tarea.id)}
                      className="btn-danger text-xs"
                    >
                      Generar Multas
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {tareas.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay tareas creadas
            </p>
          </div>
        )}
      </div>

      {/* Modal nueva tarea */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Tarea">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="input-field"
              rows="3"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Hora</label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Manzanas</label>
            <select
              value={formData.manzanas}
              onChange={(e) => setFormData({...formData, manzanas: e.target.value})}
              className="input-field"
            >
              <option value="todas">Todas las manzanas</option>
              <option value="1">Manzana 1</option>
              <option value="2">Manzana 2</option>
              <option value="3">Manzana 3</option>
              <option value="1,2">Manzanas 1 y 2</option>
              <option value="2,3">Manzanas 2 y 3</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Crear Tarea
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Tareas;
