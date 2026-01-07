import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface LoginProps {
  login: (id: string | null, isSuper?: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Redirigir según el rol del usuario
        await redirectBasedOnRole(session.user.id);
      }
    };

    checkSession();
  }, []);

  const redirectBasedOnRole = async (userId: string) => {
    if (!supabase) return;

    try {
      // Obtener el rol del usuario
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, restaurant_id')
        .eq('user_id', userId)
        .single();

      if (roleError || !roleData) {
        console.error('Error obteniendo rol:', roleError);
        setError('No se pudo determinar tu rol de usuario');
        return;
      }

      if (roleData.role === 'super_admin') {
        login(null, true);
        navigate('/super-admin');
      } else if (roleData.role === 'restaurant_admin' && roleData.restaurant_id) {
        login(roleData.restaurant_id, false);
        navigate('/dashboard');
      } else {
        setError('Usuario sin permisos asignados');
      }
    } catch (err) {
      console.error('Error en redirectBasedOnRole:', err);
      setError('Error al verificar permisos');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado');
      }

      // Intentar login con Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Error de autenticación:', authError);
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos');
        } else {
          setError('Error al iniciar sesión: ' + authError.message);
        }
        return;
      }

      if (!data.user) {
        setError('No se pudo obtener información del usuario');
        return;
      }

      console.log('✅ Login exitoso:', data.user.email);

      // Redirigir según el rol
      await redirectBasedOnRole(data.user.id);

    } catch (err) {
      console.error('Error en handleLogin:', err);
      setError('Error técnico: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🍽️</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">MenuPe</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Panel de Control</p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-sm font-medium flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Campos de Formulario */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        {/* Botón de Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 hover:shadow-2xl hover:from-red-700 hover:to-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>



        {/* Link para regresar */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-slate-500 font-bold uppercase hover:text-red-500 transition inline-flex items-center gap-2"
          >
            ← Regresar al inicio
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;