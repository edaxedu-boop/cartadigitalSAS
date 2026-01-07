import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppState, Product, CartItem, ProductOption } from '../types';
import CheckoutForm, { CheckoutData } from '../components/CheckoutForm';

interface PublicMenuProps {
  state: AppState;
  slug?: string; // Prop opcional para subdominios
}

const PublicMenu: React.FC<PublicMenuProps> = ({ state, slug: propSlug }) => {
  const params = useParams();
  // Usar el slug prop si existe (subdominio), sino el de la URL
  const slug = propSlug || params.slug;

  const restaurant = state.restaurants.find(r => r.slug === slug);

  // Estados del carrito y UI
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempOptions, setTempOptions] = useState<{ [groupId: string]: ProductOption[] }>({});

  // Estado para el carrusel de banners
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Estado para la categoría activa ('all' para mostrar todas)
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Efecto para la rotación del carrusel
  useEffect(() => {
    const rawBanners = restaurant?.promoBanners || [];
    const validBanners = rawBanners.filter(url => url && url.trim() !== '');

    if (validBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % validBanners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [restaurant]);


  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-2xl font-bold text-slate-900">Restaurante no encontrado</h1>
        <p className="text-slate-500 mt-2">La carta que buscas no existe o el enlace es incorrecto.</p>
        <Link to="/" className="mt-6 text-red-600 font-bold">Volver al inicio</Link>
      </div>
    );
  }

  if (restaurant.isActive === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
          <span className="text-4xl">😴</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">{restaurant.name}</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          Este servicio se encuentra temporalmente inactivo. Estamos trabajando para volver pronto mejores que nunca.
        </p>
        <div className="h-px w-24 bg-slate-200 mx-auto my-6"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Powered by MenuPe</p>
      </div>
    );
  }

  const resCategories = state.categories.filter(c => c.restaurantId === restaurant.id);
  const resProducts = state.products.filter(p => p.restaurantId === restaurant.id);

  // Filtrar categorías que SI tienen productos disponibles
  const visibleCategories = resCategories.filter(cat =>
    resProducts.some(p => p.categoryId === cat.id && p.isAvailable !== false)
  );

  const handleProductClick = (product: Product) => {
    if (product.optionGroups && product.optionGroups.length > 0) {
      setSelectedProduct(product);
      setTempOptions({});
    } else {
      addToCartDirectly(product);
    }
  };

  const addToCartDirectly = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && (!item.selectedOptions || item.selectedOptions.length === 0));
      if (existing) {
        return prev.map(item => (item.id === product.id && (!item.selectedOptions || item.selectedOptions.length === 0)) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, totalPricePerUnit: product.price }];
    });
  };

  const handleOptionToggle = (groupId: string, option: ProductOption, isMulti: boolean) => {
    setTempOptions(prev => {
      const current = prev[groupId] || [];
      if (isMulti) {
        const exists = current.find(o => o.id === option.id);
        if (exists) {
          return { ...prev, [groupId]: current.filter(o => o.id !== option.id) };
        } else {
          return { ...prev, [groupId]: [...current, option] };
        }
      } else {
        return { ...prev, [groupId]: [option] };
      }
    });
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;

    const selectedOptionsList = Object.entries(tempOptions).map(([groupId, options]) => {
      const group = selectedProduct.optionGroups?.find(g => g.id === groupId);
      return {
        groupName: group?.name || 'Opciones',
        options: options as ProductOption[]
      };
    }).filter(g => g.options.length > 0);

    const extraPrice = selectedOptionsList.reduce((acc, g) =>
      acc + g.options.reduce((oAcc, o) => oAcc + o.price, 0), 0);

    const totalPricePerUnit = selectedProduct.price + extraPrice;

    setCart(prev => [...prev, {
      ...selectedProduct,
      quantity: 1,
      selectedOptions: selectedOptionsList,
      totalPricePerUnit
    }]);

    setSelectedProduct(null);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQty = Math.max(0, item.quantity + delta);
      if (newQty === 0) {
        return prev.filter((_, i) => i !== index);
      }
      newCart[index] = { ...item, quantity: newQty };
      return newCart;
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.totalPricePerUnit * item.quantity), 0);
  const currentModalPrice = selectedProduct
    ? selectedProduct.price + (Object.values(tempOptions).flat() as ProductOption[]).reduce((acc, o) => acc + o.price, 0)
    : 0;


  const handleCheckoutSubmit = (checkoutData: CheckoutData) => {
    const finalTotal = total + (checkoutData.deliveryPrice || 0);

    let message = `*Pedido Nuevo - ${restaurant.name}*\n`;
    message += `--------------------------\n`;

    const typeLabels = {
      'delivery': '🛵 DELIVERY',
      'takeaway': '🥡 PARA LLEVAR',
      'dine-in': '🍽️ EN MESA'
    };
    message += `*Tipo:* ${typeLabels[checkoutData.orderType]}\n\n`;
    message += `*Cliente:* ${checkoutData.customerName}\n`;

    if (checkoutData.orderType === 'delivery') {
      message += `*Teléfono:* ${checkoutData.phone}\n`;
      message += `*Dirección:* ${checkoutData.address}\n`;
      if (checkoutData.reference) message += `*Referencia:* ${checkoutData.reference}\n`;
      message += `*Zona:* ${checkoutData.deliveryZone} (+S/ ${checkoutData.deliveryPrice?.toFixed(2)})\n`;
    }

    if (checkoutData.orderType === 'dine-in') {
      message += `*Mesa:* ${checkoutData.tableNumber}\n`;
    }

    message += `--------------------------\n\n`;

    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        item.selectedOptions.forEach(group => {
          message += `   _${group.groupName}: ${group.options.map(o => o.name).join(', ')}_\n`;
        });
      }
      message += `   *S/ ${(item.totalPricePerUnit * item.quantity).toFixed(2)}*\n\n`;
    });

    message += `--------------------------\n`;
    message += `*Subtotal:* S/ ${total.toFixed(2)}\n`;

    if (checkoutData.deliveryPrice && checkoutData.deliveryPrice > 0) {
      message += `*Delivery:* S/ ${checkoutData.deliveryPrice.toFixed(2)}\n`;
    }

    message += `*Total: S/ ${finalTotal.toFixed(2)}*\n`;
    message += `--------------------------\n\n`;
    message += `*Pago:* ${checkoutData.paymentMethod}\n`;

    if (checkoutData.observations.trim()) {
      message += `*Observaciones:* ${checkoutData.observations}\n`;
    }

    message += `\n_Pedido enviado desde MenuPe_`;

    const url = `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setShowCheckout(false);
    setShowCart(false);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Botón de acceso para dueños discreto */}
      <Link to="/login" className="fixed top-4 right-4 z-[60] bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold border border-white/20 uppercase tracking-widest">
        Acceder
      </Link>

      {/* Hero Section (Estático) */}
      <div className="h-56 md:h-72 bg-slate-200 relative">
        <img src={restaurant.bannerUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000"} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-28 h-28 bg-white rounded-full p-1.5 shadow-2xl">
            <img src={restaurant.logoUrl || "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200"} className="w-full h-full rounded-full object-cover border border-slate-100" />
          </div>
        </div>
      </div>

      {/* Info del Restaurante */}
      <div className="max-w-2xl mx-auto px-6 pt-16 text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{restaurant.name}</h1>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">{restaurant.description}</p>
        <div className="text-[11px] text-slate-400 mt-4 flex justify-center items-center gap-1 uppercase font-bold tracking-widest">
          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {restaurant.address}
        </div>

        {/* Carrusel Publicitario (Debajo de la dirección) */}
        {(() => {
          const validBanners = (restaurant.promoBanners || []).filter(url => url && url.trim() !== '');
          if (validBanners.length === 0) return null;

          return (
            <div className="mt-8 relative overflow-hidden rounded-2xl h-48 md:h-64 shadow-lg group">
              {validBanners.map((url, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === (currentBannerIndex % validBanners.length) ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img src={url} alt={`Promo ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                </div>
              ))}

              {validBanners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {validBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === (currentBannerIndex % validBanners.length) ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Horarios y Redes Sociales */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {restaurant.businessHours && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" /></svg>
                Horario de Atención
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{restaurant.businessHours}</p>
            </div>
          )}
          {(restaurant.socialLinks?.instagram || restaurant.socialLinks?.facebook || restaurant.socialLinks?.tiktok) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3c-1.1 0-2 .9-2 2v3H9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-3h3c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 15H9V9h4v8zm5-5h-3V9c0-1.1-.9-2-2-2h-3V4h8v8z" /></svg>
                Síguenos
              </h3>
              <div className="flex gap-3">
                {restaurant.socialLinks?.instagram && (
                  <a href={`https://instagram.com/${restaurant.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                )}
                {restaurant.socialLinks?.facebook && (
                  <a href={`https://facebook.com/${restaurant.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                )}
                {restaurant.socialLinks?.tiktok && (
                  <a href={`https://tiktok.com/@${restaurant.socialLinks.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categorías Sticky (Filtros Reales) */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-slate-100 overflow-x-auto scrollbar-hide shadow-sm transition-all">
        <div className="flex px-4 py-4 gap-2 max-w-2xl mx-auto items-center">
          {/* Botón "Todos" */}
          <button
            onClick={() => {
              setActiveCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-full font-bold text-xs transition border whitespace-nowrap uppercase tracking-wider flex items-center gap-2 ${activeCategory === 'all' ? 'text-white border-transparent shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
            style={activeCategory === 'all' ? { backgroundColor: restaurant.primaryColor } : {}}
          >
            <span>🍽️</span>
            Todos
          </button>

          <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>

          {visibleCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-full font-bold text-xs transition border whitespace-nowrap uppercase tracking-wider ${activeCategory === cat.id ? 'text-white border-transparent shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
              style={activeCategory === cat.id ? { backgroundColor: restaurant.primaryColor } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Productos Filtrada */}
      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-12 min-h-[50vh]">
        {visibleCategories
          .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
          .map(cat => (
            <section key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {cat.name}
                </h2>
                <div className="h-[1px] flex-1 bg-slate-200/50"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {resProducts
                  .filter(p => p.categoryId === cat.id && p.isAvailable !== false)
                  .map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => handleProductClick(prod)}
                      className="bg-white rounded-[20px] p-3 flex gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 group border border-transparent hover:border-slate-100"
                    >
                      <div className="w-28 h-28 aspect-square rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative shadow-inner">
                        <img loading="lazy" src={prod.imageUrl || `https://picsum.photos/seed/${prod.id}/300/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={prod.name} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-red-600 transition-colors">{prod.name}</h3>
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{prod.description}</p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <span className="font-black text-slate-900 text-lg bg-slate-50 px-2 py-1 rounded-lg">S/ {prod.price.toFixed(2)}</span>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                            style={{ backgroundColor: restaurant.primaryColor }}
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}

        {visibleCategories.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <div className="text-4xl mb-2">🍃</div>
            <p>No hay platos disponibles por ahora.</p>
          </div>
        )}
      </div>

      {/* Modal de Personalización de Producto */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[40px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[92vh] shadow-2xl">
            <div className="relative h-64 flex-shrink-0">
              <img src={selectedProduct.imageUrl || `https://picsum.photos/seed/${selectedProduct.id}/600/400`} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl font-light hover:bg-white/40 transition"
              >
                ×
              </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
              <div>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>

              {selectedProduct.optionGroups?.map(group => (
                <div key={group.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">{group.name}</h4>
                    {group.isMultiSelect ? (
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-bold">Múltiple</span>
                    ) : (
                      <span className="text-[10px] bg-red-50 px-2 py-1 rounded-md text-red-500 font-bold">Obligatorio</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {group.options.map(opt => {
                      const isSelected = (tempOptions[group.id] || []).some(o => o.id === opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionToggle(group.id, opt, group.isMultiSelect)}
                          className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'bg-red-50/50 border-red-500 ring-4 ring-red-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-500 bg-red-500' : 'border-slate-300'}`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className={`font-bold ${isSelected ? 'text-red-900' : 'text-slate-700'}`}>{opt.name}</span>
                          </div>
                          <span className={`font-black ${isSelected ? 'text-red-600' : 'text-slate-400'}`}>+ S/ {opt.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t bg-slate-50/50">
              <button
                onClick={confirmAddToCart}
                className="w-full text-white py-5 rounded-3xl font-black text-lg flex justify-between px-8 shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                <span>Añadir al pedido</span>
                <span>S/ {currentModalPrice.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra Inferior del Carrito */}
      {cart.length > 0 && !showCart && (
        <div className="fixed bottom-8 left-0 right-0 px-6 z-50 flex justify-center animate-in fade-in slide-in-from-bottom duration-500">
          <button
            onClick={() => setShowCart(true)}
            className="w-full max-w-md text-white p-5 rounded-[28px] shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex justify-between items-center group transition-transform hover:scale-105"
            style={{ backgroundColor: restaurant.primaryColor }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center font-black">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </div>
              <span className="font-black text-lg">Ver mi pedido</span>
            </div>
            <span className="font-black text-xl bg-black/10 px-4 py-1 rounded-xl">S/ {total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Modal del Carrito Completo */}
      {showCart && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl rounded-t-[48px] max-h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="px-8 py-8 border-b flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900">Tu Pedido</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Revisa antes de enviar</p>
              </div>
              <button onClick={() => setShowCart(false)} className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-light hover:bg-slate-200 transition">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                    {item.selectedOptions?.map((g, gi) => (
                      <p key={gi} className="text-[11px] text-slate-400 font-medium italic mt-1">
                        {g.groupName}: <span className="text-slate-600">{g.options.map(o => o.name).join(', ')}</span>
                      </p>
                    ))}
                    <p className="text-red-500 font-black text-sm mt-2">S/ {(item.totalPricePerUnit * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                    <button onClick={() => updateQuantity(idx, -1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold text-slate-400 hover:text-red-500 transition">-</button>
                    <span className="font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(idx, 1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold text-slate-400 hover:text-red-500 transition">+</button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-slate-400 font-bold">Tu carrito está vacío</p>
                  <button onClick={() => setShowCart(false)} className="mt-4 text-red-500 font-black uppercase text-xs tracking-widest">Explorar el menú</button>
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-50 space-y-6 rounded-t-[40px] border-t border-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Total a pagar</span>
                <span className="font-black text-4xl text-slate-900">S/ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                disabled={cart.length === 0}
                className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {showCheckout && (
        <CheckoutForm
          restaurant={restaurant}
          cart={cart}
          total={total}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckoutSubmit}
        />
      )}
    </div>
  );
};

export default PublicMenu;