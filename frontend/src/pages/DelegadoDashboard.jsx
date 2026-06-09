import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import axios from 'axios';
import { Users, ClipboardList, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DelegadoDashboard = () => {
  const [stats, setStats] = useState({
    totalHabitantes: 0,
    tareasActivas: 0,
    recaudacionMes: 0,
    habitantesPendientes: 0,
    multasPendientes: 0,
    totalDeudores: 0
  });
  
  const [recaudacionData, setRecaudacionData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [dashboardRes, recaudacionRes] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard/delegado`),
        axios.get(`${API_URL}/api/multas/pagos/recaudacion-mensual`)
      ]);

      setStats(dashboardRes.data);
      setRecaudacionData(recaudacionRes.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <div 
      className={`card cursor-pointer transform hover:scale-105 transition-transform ${onClick ? 'hover:shadow-xl' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`p-4 ${color} rounded-full`}>
          <Icon className="w-8 h-8 text-white" />
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
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard del Delegado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Resumen general del sistema
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Users}
            title="Total de Habitantes"
            value={stats.totalHabitantes}
            color="bg-blue-600"
          />
          
          <StatCard
            icon={ClipboardList}
            title="Tareas Activas"
            value={stats.tareasActivas}
            color="bg-green-600"
          />
          
          <StatCard
            icon={DollarSign}
            title="Recaudación del Mes"
            value={`$${stats.recaudacionMes.toLocaleString()}`}
            color="bg-purple-600"
            onClick={() => setShowChart(true)}
          />
          
          <StatCard
            icon={AlertCircle}
            title="Habitantes Pendientes"
            value={stats.habitantesPendientes}
            color="bg-yellow-600"
          />
          
          <StatCard
            icon={AlertCircle}
            title="Multas Pendientes"
            value={stats.multasPendientes}
            color="bg-red-600"
          />
          
          <StatCard
            icon={TrendingUp}
            title="Total Deudores"
            value={stats.totalDeudores}
            color="bg-orange-600"
          />
        </div>

        {/* Alerts */}
        {stats.habitantesPendientes > 0 && (
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                  Tienes {stats.habitantesPendientes} {stats.habitantesPendientes === 1 ? 'habitante pendiente' : 'habitantes pendientes'} de aprobación
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  Revisa la sección de habitantes para aprobar o rechazar solicitudes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal con gráfica */}
      <Modal
        isOpen={showChart}
        onClose={() => setShowChart(false)}
        title="Recaudación Mensual (Julio - Presente)"
        size="lg"
      >
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recaudacionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                name="Recaudación"
                dot={{ fill: '#0ea5e9', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Total recaudado:</strong> ${recaudacionData.reduce((acc, item) => acc + item.total, 0).toLocaleString()}
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default DelegadoDashboard;
