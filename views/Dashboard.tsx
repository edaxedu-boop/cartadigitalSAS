
import React, { useState, useEffect } from 'react';
import { AppState, Restaurant, Product, Category, ProductOptionGroup, ProductOption, DeliveryZone, PLAN_LIMITS, PLAN_DETAILS } from '../types';
import { THEME_COLORS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardProps {
  state: AppState;
  logout: () => void;
  updateRestaurant: (r: Restaurant) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  state, logout, updateRestaurant, addCategory, deleteCategory, addProduct, updateProduct, deleteProduct,
}) => {
  const navigate = useNavigate();
  const currentRestaurant = state.restaurants.find(r => r.id === state.currentUserId);

  useEffect(() => {
    if (!currentRestaurant && !state.isSuperAdmin) {
      navigate('/login');
    }
  }, [currentRestaurant, state.isSuperAdmin, navigate]);

  const [activeTab, setActiveTab] = useState<'perfil' | 'categorias' | 'platos' | 'configuracion' | 'compartir'>('perfil');
  const [newCatName, setNewCatName] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Omit<Product, 'id'> & { id?: string }>({
    name: '', description: '', price: 0, categoryId: '', restaurantId: currentRestaurant?.id || '', isAvailable: true, optionGroups: [],
  });

  // Estado local para zonas de delivery y banners
  const [tempZones, setTempZones] = useState<DeliveryZone[]>([]);
  const [tempBanners, setTempBanners] = useState<string[]>([]);

  useEffect(() => {
    if (currentRestaurant) {
      setTempZones(currentRestaurant.deliveryZones || []);
      setTempBanners(currentRestaurant.promoBanners || []);
    }
  }, [currentRestaurant]);

  if (!currentRestaurant) return null;

  // Bloqueo por cuenta inactiva
  if (currentRestaurant.isActive === false) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
            🚫
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Cuenta Suspendida</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Hola <strong>{currentRestaurant.name}</strong>, tu cuenta ha sido desactivada. Para reactivar el servicio y recuperar el acceso a tu menú, por favor realiza el pago correspondiente.
          </p>

          <a
            href={`https://wa.me/51973282798?text=${encodeURIComponent(`Hola, deseo activar mi cuenta para el restaurante: ${currentRestaurant.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition transform hover:-translate-y-1"
          >
            👉 Pagar y Activar Ahora
          </a>
          <button onClick={() => { logout(); navigate('/login'); }} className="mt-6 text-slate-400 text-sm font-bold hover:text-slate-600 underline">
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  const restaurantCategories = state.categories.filter(c => c.restaurantId === currentRestaurant.id);
  const restaurantProducts = state.products.filter(p => p.restaurantId === currentRestaurant.id);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleSaveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    updateRestaurant({
      ...currentRestaurant,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      whatsappNumber: formData.get('whatsapp') as string,
      address: formData.get('address') as string,
      primaryColor: formData.get('primaryColor') as string,
      logoUrl: formData.get('logoUrl') as string,
      bannerUrl: formData.get('bannerUrl') as string,
      businessHours: formData.get('businessHours') as string,
      socialLinks: {
        instagram: formData.get('instagram') as string,
        facebook: formData.get('facebook') as string,
        tiktok: formData.get('tiktok') as string,
      },
      promoBanners: tempBanners
    });
    alert('✅ Cambios guardados correctamente');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que tenga categoría seleccionada
    if (!editingProduct.categoryId) {
      alert('Por favor selecciona una categoría');
      return;
    }

    if (editingProduct.id) updateProduct(editingProduct as Product);
    else addProduct({ ...editingProduct, restaurantId: currentRestaurant.id });

    // Limpiar formulario
    setEditingProduct({ name: '', description: '', price: 0, categoryId: '', restaurantId: currentRestaurant?.id || '', isAvailable: true, optionGroups: [] });
    setIsAddingProduct(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">M</div>
          <span className="font-bold text-lg">MenuPe</span>
        </div>
        <nav className="space-y-1">
          {['perfil', 'categorias', 'platos', 'configuracion', 'compartir'].map(id => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`w-full text-left px-4 py-3 rounded-xl font-bold capitalize transition ${activeTab === id ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              {id === 'configuracion' ? 'Configuración' : id}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-10 px-4 text-slate-400 font-bold text-sm">Cerrar Sesión</button>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <h2 className="text-3xl font-black mb-8 capitalize">{activeTab}</h2>
        {activeTab === 'perfil' && (
          <div className="max-w-4xl">
            <form onSubmit={handleSaveRestaurant} className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">

              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-700">Información Básica</h3>
                <input
                  name="name"
                  defaultValue={currentRestaurant.name}
                  placeholder="Nombre del Restaurante"
                  required
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition font-semibold"
                />
                <textarea
                  name="description"
                  defaultValue={currentRestaurant.description}
                  placeholder="Descripción de tu negocio..."
                  rows={3}
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition resize-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="whatsapp"
                    defaultValue={currentRestaurant.whatsappNumber}
                    placeholder="WhatsApp (51987654321)"
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                  />
                  <input
                    name="address"
                    defaultValue={currentRestaurant.address}
                    placeholder="Dirección completa"
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Color Primario */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-700">Color de Marca</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    name="primaryColor"
                    defaultValue={currentRestaurant.primaryColor || '#ef4444'}
                    className="w-20 h-20 rounded-2xl border-4 border-slate-200 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-sm">Selecciona tu color principal</p>
                    <p className="text-xs text-slate-500">Se usará en tu menú público</p>
                  </div>
                </div>
              </div>

              {/* Imágenes */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-700">Imágenes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Logo (URL)</label>
                    <input
                      name="logoUrl"
                      defaultValue={currentRestaurant.logoUrl}
                      placeholder="https://ejemplo.com/logo.png"
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                    />
                    {currentRestaurant.logoUrl && (
                      <img src={currentRestaurant.logoUrl} alt="Vista previa logo" className="mt-2 w-24 h-24 object-cover rounded-xl border-2" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Banner/Portada (URL)</label>
                    <input
                      name="bannerUrl"
                      defaultValue={currentRestaurant.bannerUrl}
                      placeholder="https://ejemplo.com/banner.jpg"
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                    />
                    {currentRestaurant.bannerUrl && (
                      <img src={currentRestaurant.bannerUrl} alt="Vista previa banner" className="mt-2 w-full h-24 object-cover rounded-xl border-2" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">💡 Tip: Usa servicios como Imgur, PostImages o Cloudinary</p>
              </div>

              {/* Banners Promocionales (Carrusel) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-slate-700">Imágenes del Carrusel (Promociones)</h3>
                    <p className="text-xs text-slate-500">Agrega múltiples imágenes para que roten en la cabecera.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTempBanners([...tempBanners, ''])}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-xl font-bold hover:bg-blue-100 transition"
                  >
                    + Agregar Imagen
                  </button>
                </div>

                <div className="space-y-3">
                  {tempBanners.map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <input
                          value={url}
                          onChange={(e) => {
                            const newBanners = [...tempBanners];
                            newBanners[idx] = e.target.value;
                            setTempBanners(newBanners);
                          }}
                          placeholder="https://ejemplo.com/promo1.jpg"
                          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                        />
                        {url && (
                          <img src={url} alt={`Banner ${idx}`} className="mt-2 h-20 w-auto object-cover rounded-lg border shadow-sm" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setTempBanners(tempBanners.filter((_, i) => i !== idx))}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Eliminar imagen"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {tempBanners.length === 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-sm italic border-2 border-dashed border-slate-200">
                      No hay banners adicionales. Se mostrará solo la imagen de portada principal.
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">💡 Tip: Usa imágenes anchas de buena calidad (recomendado 1200x400px o similar).</p>
              </div>

              {/* Redes Sociales */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-700">Redes Sociales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">📷 Instagram</label>
                    <input
                      name="instagram"
                      defaultValue={currentRestaurant.socialLinks?.instagram}
                      placeholder="@turestaurante"
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">📘 Facebook</label>
                    <input
                      name="facebook"
                      defaultValue={currentRestaurant.socialLinks?.facebook}
                      placeholder="Tu Restaurante"
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">🎵 TikTok</label>
                    <input
                      name="tiktok"
                      defaultValue={currentRestaurant.socialLinks?.tiktok}
                      placeholder="@turestaurante"
                      className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-700">Horario de Atención</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">📅 Horarios</label>
                  <textarea
                    name="businessHours"
                    defaultValue={currentRestaurant.businessHours || ''}
                    placeholder="Ejemplo: Lun-Vie: 9am-10pm, Sáb-Dom: 10am-8pm"
                    rows={3}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none transition resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">💡 Escribe tus horarios en formato libre</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 hover:shadow-2xl transition-all">
                💾 Guardar Cambios
              </button>
            </form>
          </div>
        )}
        {activeTab === 'categorias' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nueva categoría..." className="flex-1 p-3 border rounded-xl" />
              <button onClick={() => { addCategory(newCatName); setNewCatName(''); }} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">Añadir</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {restaurantCategories.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-xl border flex justify-between">
                  <span>{c.name}</span>
                  <button onClick={() => deleteCategory(c.id)} className="text-red-500">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'platos' && (() => {
          const productCount = restaurantProducts.length;
          const plan = currentRestaurant.plan || 'basic';
          // Asegurar que el plan existe en las constantes, fallback a basic
          const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.basic;
          const planInfo = PLAN_DETAILS[plan] || PLAN_DETAILS.basic;
          const isLimitReached = productCount >= limit;

          return (
            <div className="space-y-6">
              {/* Banner de Estado del Plan */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Plan Actual: <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{planInfo.name}</span></p>
                    <p className="text-xs font-bold text-slate-500">{productCount} / {limit === Infinity ? '∞' : limit} Platos</p>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: limit === Infinity ? '5%' : `${Math.min(100, (productCount / limit) * 100)}%` }}
                    ></div>
                  </div>

                  {currentRestaurant.planExpiresAt && (() => {
                    const expires = new Date(currentRestaurant.planExpiresAt);
                    const now = new Date();
                    const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpired = daysLeft <= 0;

                    return (
                      <div className="mt-3 pt-2 border-t border-slate-100/50">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {isExpired ? 'Plan Expirado' : `Vence en ${daysLeft} días`}
                          </p>
                          {daysLeft < 7 && !isExpired && (
                            <span className="text-[10px] font-bold text-red-500 animate-pulse">Renovar pronto</span>
                          )}
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${isExpired ? 'bg-slate-300' : daysLeft < 7 ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: isExpired ? '100%' : `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="text-center md:text-right flex flex-col items-end gap-1">
                  {isLimitReached && (
                    <span className="inline-block text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full mb-1">⚠️ Límite Alcanzado</span>
                  )}
                  <button
                    onClick={() => setShowPlansModal(true)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                  >
                    {isLimitReached ? 'Mejorar Plan ahora' : 'Ver Planes y Precios'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">Tus Platos</h3>
                <button
                  onClick={() => {
                    if (isLimitReached) {
                      alert(`Has alcanzado el límite de ${limit} platos de tu plan ${planInfo.name}. Contacta a soporte para mejorar tu plan.`);
                      return;
                    }
                    setIsAddingProduct(true);
                    setEditingProduct({ name: '', description: '', price: 0, categoryId: '', restaurantId: currentRestaurant?.id || '', isAvailable: true, optionGroups: [] });
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${isLimitReached ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'}`}
                >
                  <span>+</span> Nuevo Plato
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {restaurantProducts.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={p.imageUrl || 'https://picsum.photos/200'} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">S/ {p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">{p.description}</p>
                      <div className="flex gap-3 mt-3 border-t pt-2">
                        <button onClick={() => { setEditingProduct(p); setIsAddingProduct(true); }} className="text-xs font-bold text-blue-600 hover:underline">Editar</button>
                        <button onClick={() => deleteProduct(p.id)} className="text-xs font-bold text-red-500 hover:underline">Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
                {restaurantProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="text-4xl mb-2">🥗</div>
                    <p>Aún no tienes platos.</p>
                    <p className="text-sm">¡Agrega el primero arriba!</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6">{editingProduct.id ? 'Editar Plato' : 'Nuevo Plato'}</h3>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nombre del Plato</label>
                  <input
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ej: Pollo a la brasa"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Categoría</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none"
                  >
                    <option value="">Selecciona una categoría</option>
                    {restaurantCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Descripción</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Describe tu plato..."
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none h-24 resize-none"
                  />
                </div>

                {/* URL de Imagen */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Imagen (URL)</label>
                  <input
                    value={editingProduct.imageUrl || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none"
                  />
                  {editingProduct.imageUrl && (
                    <img src={editingProduct.imageUrl} alt="Vista previa" className="mt-2 w-full h-32 object-cover rounded-xl" />
                  )}
                </div>

                {/* Opciones/Extras */}
                <div className="border-t-2 border-slate-100 pt-4 mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-700">Opciones/Extras</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newGroup: ProductOptionGroup = {
                          id: Date.now().toString(),
                          name: '',
                          isMultiSelect: false,
                          options: []
                        };
                        setEditingProduct({
                          ...editingProduct,
                          optionGroups: [...(editingProduct.optionGroups || []), newGroup]
                        });
                      }}
                      className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200"
                    >
                      + Agregar Grupo
                    </button>
                  </div>

                  {(editingProduct.optionGroups || []).map((group, groupIdx) => (
                    <div key={group.id} className="bg-slate-50 p-4 rounded-xl mb-3">
                      {/* Nombre del grupo */}
                      <div className="flex gap-2 mb-3">
                        <input
                          value={group.name}
                          onChange={e => {
                            const updated = [...(editingProduct.optionGroups || [])];
                            updated[groupIdx] = { ...updated[groupIdx], name: e.target.value };
                            setEditingProduct({ ...editingProduct, optionGroups: updated });
                          }}
                          placeholder="Nombre del grupo (ej: Tamaño, Extras)"
                          className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingProduct.optionGroups?.filter((_, i) => i !== groupIdx);
                            setEditingProduct({ ...editingProduct, optionGroups: updated });
                          }}
                          className="text-red-500 px-3 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Tipo de selección */}
                      <div className="flex gap-2 mb-3">
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={group.isMultiSelect}
                            onChange={e => {
                              const updated = [...(editingProduct.optionGroups || [])];
                              updated[groupIdx] = { ...updated[groupIdx], isMultiSelect: e.target.checked };
                              setEditingProduct({ ...editingProduct, optionGroups: updated });
                            }}
                            className="w-4 h-4"
                          />
                          <span className="font-semibold">Permitir selección múltiple</span>
                        </label>
                      </div>

                      {/* Opciones */}
                      <div className="space-y-2">
                        {group.options.map((option, optIdx) => (
                          <div key={option.id} className="flex gap-2">
                            <input
                              value={option.name}
                              onChange={e => {
                                const updated = [...(editingProduct.optionGroups || [])];
                                updated[groupIdx].options[optIdx] = { ...option, name: e.target.value };
                                setEditingProduct({ ...editingProduct, optionGroups: updated });
                              }}
                              placeholder="Nombre"
                              className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={option.price}
                              onChange={e => {
                                const updated = [...(editingProduct.optionGroups || [])];
                                updated[groupIdx].options[optIdx] = { ...option, price: parseFloat(e.target.value) || 0 };
                                setEditingProduct({ ...editingProduct, optionGroups: updated });
                              }}
                              placeholder="Precio"
                              className="w-20 p-2 border border-slate-200 rounded-lg text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(editingProduct.optionGroups || [])];
                                updated[groupIdx].options = updated[groupIdx].options.filter((_, i) => i !== optIdx);
                                setEditingProduct({ ...editingProduct, optionGroups: updated });
                              }}
                              className="text-red-500 px-2 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(editingProduct.optionGroups || [])];
                            updated[groupIdx].options.push({
                              id: Date.now().toString(),
                              name: '',
                              price: 0
                            });
                            setEditingProduct({ ...editingProduct, optionGroups: updated });
                          }}
                          className="text-xs text-blue-600 font-semibold hover:underline"
                        >
                          + Agregar opción
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!editingProduct.optionGroups || editingProduct.optionGroups.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No hay opciones. Haz clic en "+ Agregar Grupo" para comenzar.
                    </p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct({ name: '', description: '', price: 0, categoryId: '', restaurantId: currentRestaurant?.id || '', isAvailable: true, optionGroups: [] });
                  }}
                  className="flex-1 p-3 font-bold text-slate-400 border-2 border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleAddProductSubmit}
                  className="flex-1 bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'configuracion' && (
          <div className="max-w-4xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);

              const orderTypes = {
                delivery: !!formData.get('type_delivery'),
                takeaway: !!formData.get('type_takeaway'),
                dineIn: !!formData.get('type_dineIn')
              };

              const paymentMethods = [
                { id: 'yape', name: 'Yape', enabled: !!formData.get('payment_yape') },
                { id: 'plin', name: 'Plin', enabled: !!formData.get('payment_plin') },
                { id: 'efectivo', name: 'Efectivo', enabled: !!formData.get('payment_efectivo') },
                { id: 'tarjeta', name: 'Tarjeta', enabled: !!formData.get('payment_tarjeta') }
              ];

              updateRestaurant({
                ...currentRestaurant,
                orderTypes,
                paymentMethods,
                deliveryZones: tempZones
              });
              alert('✅ Configuración guardada correctamente');
            }} className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">

              {/* 1. Tipos de Pedido */}
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                  <span>🛎️</span> Tipos de Pedido
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      name="type_delivery"
                      defaultChecked={currentRestaurant.orderTypes?.delivery ?? true}
                      className="w-6 h-6 text-red-600 rounded-lg"
                    />
                    <div>
                      <div className="font-bold text-slate-700">🛵 Delivery</div>
                      <div className="text-xs text-slate-500">Envíos a domicilio</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      name="type_takeaway"
                      defaultChecked={currentRestaurant.orderTypes?.takeaway ?? true}
                      className="w-6 h-6 text-red-600 rounded-lg"
                    />
                    <div>
                      <div className="font-bold text-slate-700">🥡 Para Llevar</div>
                      <div className="text-xs text-slate-500">Recojo en local</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      name="type_dineIn"
                      defaultChecked={currentRestaurant.orderTypes?.dineIn ?? true}
                      className="w-6 h-6 text-red-600 rounded-lg"
                    />
                    <div>
                      <div className="font-bold text-slate-700">🍽️ En Mesa</div>
                      <div className="text-xs text-slate-500">Consumo en local</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* 2. Métodos de Pago */}
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                  <span>💳</span> Métodos de Pago
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Yape', 'Plin', 'Efectivo', 'Tarjeta'].map(method => {
                    const id = method.toLowerCase();
                    const isEnabled = currentRestaurant.paymentMethods?.find(p => p.id === id)?.enabled ?? (id !== 'tarjeta');
                    return (
                      <label key={id} className={`flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition text-center ${isEnabled ? 'border-red-500 bg-red-50' : 'hover:bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          name={`payment_${id}`}
                          defaultChecked={isEnabled}
                          className="w-6 h-6 mb-2"
                        />
                        <span className="font-bold text-slate-700">{method}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* 3. Zonas de Delivery */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <span>🌍</span> Zonas de Delivery
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newZone = { id: Date.now().toString(), name: '', price: 0 };
                      setTempZones([...tempZones, newZone]);
                    }}
                    className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold hover:bg-blue-200"
                  >
                    + Agregar Zona
                  </button>
                </div>

                <div className="space-y-3">
                  {tempZones.map((zone, idx) => (
                    <div key={zone.id} className="flex gap-3 bg-slate-50 p-4 rounded-xl items-center animate-in fade-in slide-in-from-top-5">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Nombre de la Zona</label>
                        <input
                          value={zone.name}
                          onChange={(e) => {
                            const updated = [...tempZones];
                            updated[idx].name = e.target.value;
                            setTempZones(updated);
                          }}
                          placeholder="Ej: Centro, Norte, Miraflores..."
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                        />
                      </div>
                      <div className="w-32">
                        <label className="text-xs font-bold text-slate-500 ml-1">Precio (S/)</label>
                        <input
                          type="number"
                          value={zone.price}
                          onChange={(e) => {
                            const updated = [...tempZones];
                            updated[idx].price = parseFloat(e.target.value) || 0;
                            setTempZones(updated);
                          }}
                          placeholder="0.00"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTempZones(tempZones.filter((_, i) => i !== idx));
                        }}
                        className="mt-4 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50"
                        title="Eliminar zona"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {tempZones.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      No hay zonas configuradas. Agrega una para habilitar el delivery.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">
                  💾 Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        )}
        {activeTab === 'compartir' && (
          <div className="bg-white p-10 rounded-3xl border text-center max-w-md mx-auto">
            <h3 className="text-xl font-black text-slate-800 mb-6">Comparte tu Menú</h3>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/#/menu/' + currentRestaurant.slug)}`}
              className="mx-auto mb-6 rounded-xl border-2 border-slate-100 p-2 w-48 h-48"
              alt="Código QR"
            />

            <div className="bg-slate-50 p-4 rounded-2xl mb-6 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Enlace directo</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/#/menu/${currentRestaurant.slug}`}
                  className="flex-1 bg-white border border-slate-200 p-3 rounded-xl text-sm font-semibold text-slate-600 outline-none select-all"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/#/menu/${currentRestaurant.slug}`);
                    alert('✅ ¡Enlace copiado!');
                  }}
                  className="bg-slate-900 text-white px-4 rounded-xl font-bold text-sm hover:bg-black transition"
                  title="Copiar enlace"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`/#/menu/${currentRestaurant.slug}`}
                target="_blank"
                className="flex items-center justify-center gap-2 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                <span>🔗</span> Ver Menú
              </a>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                <span>🖨️</span> Imprimir
              </button>
            </div>
          </div>
        )}

        {showPlansModal && (
          <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-slate-900">Planes y Precios</h2>
                  <p className="text-slate-500 mt-2">Mejora tu plan para desbloquear más platos y beneficios.</p>
                </div>
                <button onClick={() => setShowPlansModal(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm z-10">✕</button>

                {/* Decoración */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              </div>

              <div className="p-8 overflow-y-auto bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(PLAN_DETAILS).map(([key, detail]) => {
                    const isCurrent = (currentRestaurant.plan || 'basic') === key;
                    return (
                      <div key={key} className={`relative bg-white rounded-[32px] p-6 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${isCurrent ? 'border-red-500 ring-4 ring-red-50 z-10 scale-[1.02]' : 'border-slate-100'}`}>
                        {isCurrent && (
                          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg">Plan Actual</span>
                        )}

                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center mt-4">{detail.name}</h3>
                        <div className="text-center mt-2 mb-6">
                          <div className="flex items-end justify-center gap-1">
                            <span className="text-4xl font-black text-slate-900">{detail.price.replace('/mes', '')}</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1.5">/mes</span>
                          </div>
                          {detail.annualPrice && (
                            <div className="text-xs text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-md">
                              o {detail.annualPrice}
                            </div>
                          )}
                        </div>

                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${detail.limit === 'Ilimitado' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-400'}`}>
                              {detail.limit === 'Ilimitado' ? '★' : '✓'}
                            </div>
                            <span>{detail.limit === 'Ilimitado' ? 'Platos Ilimitados' : `Hasta ${detail.limit} platos`}</span>
                          </li>
                          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Pedidos Ilimitados por WhatsApp</span>
                          </li>
                          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>QR Personalizado</span>
                          </li>
                          {key === 'premium' && (
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-800">
                              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">✓</div>
                              <span>Soporte Prioritario</span>
                            </li>
                          )}
                        </ul>

                        <a
                          href={`https://wa.me/51973282798?text=${encodeURIComponent(`Hola, deseo el Plan ${detail.name} para mi restaurante ${currentRestaurant.name}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isCurrent ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 text-white hover:bg-black shadow-lg hover:shadow-xl'}`}
                          onClick={(e) => isCurrent && e.preventDefault()}
                        >
                          <span>{isCurrent ? '✓ Activado' : '👉 Solicitar'}</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;