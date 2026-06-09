import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { User, Phone, Mail, CreditCard, Home, ClipboardList, AlertCircle, DollarSign, Calendar } from 'lucide-react';

const HabitanteDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/habitante/${user.id}`);
      setDashboard(response.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`p-3 ${color} rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mi Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bienvenido, {dashboard?.habitante.nombre_completo}
          </p>
        </div>

        {/* Grid con datos y QR */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Datos del habitante */}
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Mis Datos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {dashboard?.habitante.nombre_completo}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {dashboard?.habitante.telefono}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Correo</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CURP</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {dashboard?.habitante.curp}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manzana</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Manzana {dashboard?.habitante.manzana}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Código QR */}
          <div className="card text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Mi Código QR
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Presenta este código en las tareas comunitarias
            </p>
            <div className="bg-white p-6 rounded-lg inline-block">
              <QRCodeSVG 
                value={dashboard?.habitante.curp || ''} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              ID: {dashboard?.habitante.curp}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            icon={ClipboardList}
            title="Tareas Programadas"
            value={dashboard?.tareasProgramadas || 0}
            color="bg-blue-600"
          />
          
          <StatCard
            icon={Calendar}
            title="Tareas en Curso"
            value={dashboard?.tareasEnCurso || 0}
            color="bg-green-600"
          />
          
          <StatCard
            icon={AlertCircle}
            title="Multas Pendientes"
            value={dashboard?.multasPendientes || 0}
            color="bg-red-600"
          />
          
          <StatCard
            icon={DollarSign}
            title="Deuda Total"
            value={`$${dashboard?.totalDeuda || 0}`}
            color="bg-orange-600"
          />
        </div>

        {/* Últimas tareas */}
        {dashboard?.ultimasTareas && dashboard.ultimasTareas.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Últimas Tareas
            </h2>
            
            <div className="space-y-3">
              {dashboard.ultimasTareas.map((tarea) => (
                <div 
                  key={tarea.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {tarea.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {tarea.descripcion}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      📅 {new Date(tarea.fecha).toLocaleDateString()} - {tarea.hora}
                    </p>
                  </div>
                  <span className={`badge ${
                    tarea.estado === 'programada' ? 'badge-info' :
                    tarea.estado === 'en_curso' ? 'badge-warning' :
                    'badge-success'
                  }`}>
                    {tarea.estado === 'programada' ? 'Programada' :
                     tarea.estado === 'en_curso' ? 'En Curso' :
                     'Finalizada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HabitanteDashboard;
