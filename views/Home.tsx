
import React from 'react';
import { Link } from 'react-router-dom';
import { PLAN_DETAILS } from '../types';

const Home: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">M</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">MenuPe</h1>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollTo('precios')} className="text-slate-600 font-medium hover:text-red-600 transition hidden md:block">Precios</button>
              <Link to="/login" className="text-slate-600 font-medium hover:text-red-600 transition">Entrar</Link>
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition shadow-lg shadow-red-100"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-red-600 uppercase bg-red-50 rounded-full">
            🔥 Digitaliza tu negocio hoy
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Tu Carta Digital en <span className="text-red-600">Minutos</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Crea el menú de tu restaurante, recibe pedidos directos a WhatsApp y aumenta tus ventas con MenuPe. Diseñado para el sabor peruano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-red-700 shadow-xl shadow-red-200 transition-all hover:-translate-y-1"
            >
              Crear mi Carta Gratis
            </Link>
            <Link
              to="/menu/el-sabor-peruano"
              className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all hover:-translate-y-1"
            >
              Ver Demo Real
            </Link>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&h=600&auto=format&fit=crop"
              className="rounded-3xl shadow-2xl border border-slate-100 mx-auto max-w-4xl w-full object-cover h-[300px] md:h-[400px]"
              alt="Preview"
            />
          </div>
        </div>

        <div id="features" className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">¿Por qué elegir MenuPe?</h2>
              <p className="text-slate-500 mt-2">Todo lo que necesitas para tu restaurante en la era digital.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">📱</div>
                <h3 className="text-xl font-bold mb-3">QR Personalizado</h3>
                <p className="text-slate-600 leading-relaxed">Generamos un código QR único para tu local. Tus clientes escanean, eligen y disfrutan sin contacto.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">🛒</div>
                <h3 className="text-xl font-bold mb-3">Pedidos a WhatsApp</h3>
                <p className="text-slate-600 leading-relaxed">Olvídate de comisiones altas. Recibe el pedido detallado con extras y totales directamente en tu chat.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">🎨</div>
                <h3 className="text-xl font-bold mb-3">Personalización Total</h3>
                <p className="text-slate-600 leading-relaxed">Adapta los colores y el diseño de tu carta para que combine perfectamente con la identidad de tu restaurante.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Precios NUEVA */}
        <div id="precios" className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Planes Simples y Transparentes</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">Elige el plan que mejor se adapte al tamaño de tu restaurante. Sin comisiones ocultas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(PLAN_DETAILS).map(([key, detail]) => (
                <div key={key} className={`relative p-8 rounded-[32px] border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${key === 'standard' ? 'border-red-500 bg-white ring-4 ring-red-50' : 'border-slate-100 bg-slate-50/50'}`}>
                  {key === 'standard' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Más Popular</div>
                  )}

                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight text-center mb-2">{detail.name}</h3>
                  <div className="text-center mb-8">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl font-black text-slate-900 tracking-tight">{detail.price.replace('/mes', '')}</span>
                      <span className="text-sm text-slate-400 font-bold uppercase mb-2">/mes</span>
                    </div>
                    {detail.annualPrice && (
                      <div className="mt-2 text-sm font-bold text-green-600 bg-green-100 inline-block px-3 py-1 rounded-full">{detail.annualPrice}</div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                      <span className="font-medium text-slate-700">{detail.limit === 'Ilimitado' ? <strong>Platos Ilimitados</strong> : <span>Hasta <strong>{detail.limit}</strong> platos</span>}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                      <span className="font-medium text-slate-700">Pedidos WhatsApp Ilimitados</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                      <span className="font-medium text-slate-700">Código QR Personalizado</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                      <span className="font-medium text-slate-700">{detail.limit === 'Ilimitado' || key === 'premium' ? <strong>Soporte Prioritario</strong> : 'Panel de Control'}</span>
                    </li>
                  </ul>

                  <a
                    href={`https://wa.me/51973282798?text=${encodeURIComponent(`Hola, deseo adquirir el Plan ${detail.name} de MenuPe`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 rounded-xl font-black text-center transition-all block ${key === 'standard' ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200' : 'bg-slate-900 text-white hover:bg-black'}`}
                  >
                    Elegir Plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">MenuPe</h1>
              </div>
              <p className="text-slate-400 max-w-sm">La plataforma líder en digitalización gastronómica en Perú. Ayudamos a emprendedores a profesionalizar su servicio.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/login" className="hover:text-white transition">Ingresar</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Panel de Control</Link></li>
                <li><Link to="/menu/el-sabor-peruano" className="hover:text-white transition">Demo en Vivo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Soporte</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Tutoriales</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
                <li><button onClick={() => scrollTo('precios')} className="hover:text-white transition">Precios</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2025 MenuPe. Todos los derechos reservados. Hecho en 🇵🇪 para el mundo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
