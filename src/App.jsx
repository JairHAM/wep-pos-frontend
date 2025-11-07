import { useState, useEffect } from 'react';
import useAuthStore from './store/authStore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { isAuthenticated, verifyAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    const checkAuth = async () => {
      await verifyAuth();
      setIsLoading(false);
    };
    
    checkAuth();
  }, [verifyAuth]);

  const handleLoginSuccess = () => {
    // Cualquier lógica adicional después del login
    console.log('Login exitoso');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
