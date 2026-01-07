
import React, { useState } from 'react';
import { AppState, Restaurant, PLAN_DETAILS } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface SuperAdminProps {
  state: AppState;
  addRestaurant: (r: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  toggleRestaurantStatus: (id: string, isActive: boolean) => void;
  logout: () => void;
}

const SuperAdmin: React.FC<SuperAdminProps> = ({ state, addRestaurant, deleteRestaurant, toggleRestaurantStatus, logout }) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [newRes, setNewRes] = useState({
    name: '',
    email: '',
    password: '',
    slug: '',
    whatsapp: '',
    plan: 'basic' as 'basic' | 'standard' | 'premium'
  });
  const [planDuration, setPlanDuration] = useState<'monthly' | 'annual'>('monthly');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // Calcular fecha de expiración
    const now = new Date();
    const expiresAt = new Date(now);
    if (planDuration === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const res: Restaurant = {
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      name: newRes.name,
      email: newRes.email,
      password: newRes.password,
      slug: newRes.slug || newRes.name.toLowerCase().replace(/\s+/g, '-'),
      whatsappNumber: newRes.whatsapp,
      description: 'Restaurante registrado en la plataforma MenuPe',
      primaryColor: '#ef4444',
      address: 'Dirección a configurar por el dueño',
      plan: newRes.plan,
      isActive: true,
      planExpiresAt: expiresAt.toISOString()
    };
    addRestaurant(res);
    setIsAdding(false);
    setNewRes({ name: '', email: '', password: '', slug: '', whatsapp: '', plan: 'basic' });
    setPlanDuration('monthly');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="bg-red-600 px-3 py-1 rounded-xl shadow-lg">M</span>
              Plataforma Maestro
            </h1>
            <p className="text-slate-400 mt-1">Gestión centralizada de restaurantes</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-xl shadow-red-900/20"
            >
              + Nuevo Restaurante
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.restaurants.map(res => {
            const planName = PLAN_DETAILS[res.plan || 'basic'].name;
            const createdDate = res.createdAt ? new Date(res.createdAt).toLocaleDateString() : '—';

            // Calcular días restantes
            const expires = res.planExpiresAt ? new Date(res.planExpiresAt) : null;
            const now = new Date();
            const daysLeft = expires ? Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
            const isExpired = daysLeft <= 0;

            return (
              <div key={res.id} className={`bg-slate-800 rounded-2xl p-6 border shadow-2xl relative group transition-all duration-300 ${res.isActive !== false ? 'border-slate-700 hover:border-red-500/50' : 'border-slate-800 opacity-75 grayscale-[0.5]'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${res.isActive !== false ? 'bg-slate-700 text-red-500' : 'bg-slate-900 text-slate-600'}`}>
                    {res.name.charAt(0)}
                  </div>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar ${res.name}?`)) deleteRestaurant(res.id); }}
                    className="text-slate-500 hover:text-red-500 transition-colors p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-0.5">{res.name}</h3>
                <div className="flex justify-between items-end mb-4">
                  <p className="text-slate-500 text-xs font-mono">ID: {res.id.substr(0, 8)}...</p>
                </div>

                {/* Info Plan y Expiración */}
                <div className="bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Plan Actual</span>
                    <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-md">{planName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Vence en</span>
                    <span className={`text-xs font-bold ${isExpired ? 'text-red-500' : daysLeft < 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {expires ? (isExpired ? 'EXPIRADO' : `${daysLeft} días`) : '∞'}
                    </span>
                  </div>
                  {expires && !isExpired && (
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}></div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Email</span>
                    <span className="text-red-400 font-mono text-sm">{res.email || 'No configurado'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">WhatsApp</span>
                    <span className="text-slate-300 text-xs">{res.whatsappNumber}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/menu/${res.slug}`}
                    target="_blank"
                    className="flex-1 bg-slate-700 text-white text-center py-2.5 rounded-lg text-xs font-bold hover:bg-slate-600 transition"
                  >
                    Ver Carta
                  </Link>
                  <button
                    onClick={() => toggleRestaurantStatus(res.id, !(res.isActive !== false))}
                    className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold border transition ${res.isActive !== false
                        ? 'bg-green-600/10 text-green-500 border-green-500/20 hover:bg-green-600/20'
                        : 'bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600/20'
                      }`}
                  >
                    {res.isActive !== false ? 'Activo' : 'Desactivado'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {isAdding && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-8 border-b bg-slate-50">
                <h2 className="text-2xl font-black text-slate-900">Registrar Nuevo Local</h2>
                <p className="text-slate-500 text-sm mt-1">Define el acceso para el nuevo dueño del restaurante.</p>
              </div>
              <form onSubmit={handleCreate} className="p-8 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-1.5 ml-1">Nombre Comercial</label>
                    <input
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition"
                      placeholder="Ej: Pollería Don Lucho"
                      onChange={e => setNewRes({ ...newRes, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-1.5 ml-1">Email de Acceso</label>
                      <input
                        required
                        type="email"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition"
                        placeholder="admin@restaurant.com"
                        value={newRes.email}
                        onChange={e => setNewRes({ ...newRes, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-1.5 ml-1">Contraseña</label>
                      <input
                        required
                        type="text"
                        minLength={6}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition"
                        placeholder="mínimo 6 caracteres"
                        value={newRes.password}
                        onChange={e => setNewRes({ ...newRes, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-1.5 ml-1">Slug URL</label>
                      <input
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition"
                        placeholder="don-lucho"
                        onChange={e => setNewRes({ ...newRes, slug: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase mb-1.5 ml-1">WhatsApp</label>
                      <input
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition"
                        placeholder="51900000000"
                        onChange={e => setNewRes({ ...newRes, whatsapp: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-1.5 ml-1">Plan de Suscripción</label>

                    {/* Selector de periodo */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
                      <button
                        type="button"
                        onClick={() => setPlanDuration('monthly')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${planDuration === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Mensual
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlanDuration('annual')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${planDuration === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Anual (-20%)
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(PLAN_DETAILS).map(([key, detail]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNewRes({ ...newRes, plan: key as any })}
                          className={`p-3 rounded-xl border-2 text-left transition ${newRes.plan === key ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}
                        >
                          <div className={`text-xs font-black uppercase ${newRes.plan === key ? 'text-red-600' : 'text-slate-500'}`}>{detail.name}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{planDuration === 'monthly' ? detail.price : detail.annualPrice}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-4 font-bold rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 transition active:scale-[0.98]"
                  >
                    Crear Acceso
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;