import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, CheckCircle, XCircle, User, FileText } from 'lucide-react';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [selectedTarea, setSelectedTarea] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [scanner, setScanner] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadTareas();
  }, []);

  useEffect(() => {
    if (scanning) {
      initScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scanning]);

  const loadTareas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tareas`, {
        params: { estado: 'en_curso' }
      });
      setTareas(response.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const initScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear().catch(err => console.error('Error clearing scanner:', err));
      setScanner(null);
    }
  };

  const onScanSuccess = async (decodedText) => {
    setScannedData(decodedText);
    setScanning(false);
    
    // Buscar usuario por CURP
    try {
      const response = await axios.get(`${API_URL}/api/habitantes`);
      const habitante = response.data.find(h => h.curp === decodedText);
      
      if (habitante) {
        setUsuario(habitante);
        setShowModal(true);
      } else {
        alert('Usuario no encontrado');
        setScannedData(null);
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      alert('Error al buscar usuario');
    }
  };

  const onScanError = (error) => {
    // Silenciar errores de escaneo continuo
  };

  const registrarAsistencia = async () => {
    if (!selectedTarea) {
      alert('Selecciona una tarea');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/tareas/asistencia`, {
        tareaId: selectedTarea,
        usuarioId: usuario.id
      });
      
      alert('Asistencia registrada exitosamente');
      setShowModal(false);
      setUsuario(null);
      setSelectedTarea('');
      setScannedData(null);
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      alert(error.response?.data?.message || 'Error al registrar asistencia');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Escáner de Código QR
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Escanea el código QR de los habitantes para registrar asistencia
          </p>
        </div>

        {/* Scanner Card */}
        <div className="card">
          <div className="text-center">
            {!scanning ? (
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                  <QrCode className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Escanear Código QR
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Haz clic en el botón para activar la cámara y escanear
                  </p>
                  
                  <button
                    onClick={() => setScanning(true)}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    <QrCode className="w-5 h-5 inline mr-2" />
                    Activar Cámara
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div id="qr-reader" className="max-w-md mx-auto"></div>
                
                <button
                  onClick={() => setScanning(false)}
                  className="btn-danger px-6 py-2"
                >
                  <XCircle className="w-5 h-5 inline mr-2" />
                  Detener Escaneo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info sobre tareas activas */}
        {tareas.length > 0 && (
          <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Tareas activas: {tareas.length}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              {tareas.map(tarea => (
                <li key={tarea.id}>• {tarea.titulo}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setUsuario(null);
          setSelectedTarea('');
        }}
        title="Registrar Asistencia"
      >
        {usuario && (
          <div className="space-y-6">
            {/* Datos del usuario */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-200">
                    Usuario Identificado
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                    El código QR se escaneó correctamente
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {usuario.nombre_completo}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CURP</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {usuario.curp}
                  </p>
                </div>
              </div>
            </div>

            {/* Selección de tarea */}
            <div>
              <label className="label">Seleccionar Tarea</label>
              <select
                value={selectedTarea}
                onChange={(e) => setSelectedTarea(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Selecciona una tarea...</option>
                {tareas.map(tarea => (
                  <option key={tarea.id} value={tarea.id}>
                    {tarea.titulo} - {new Date(tarea.fecha).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setUsuario(null);
                  setSelectedTarea('');
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={registrarAsistencia}
                className="btn-primary"
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Registrar Asistencia
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default QRScanner;
