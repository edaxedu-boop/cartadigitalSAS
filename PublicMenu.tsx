
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppState, Product, CartItem, ProductOption } from '../types';

interface PublicMenuProps {
  state: AppState;
}

const PublicMenu: React.FC<PublicMenuProps> = ({ state }) => {
  const { slug } = useParams();
  const restaurant = state.restaurants.find(r => r.slug === slug);

  if (!restaurant) {
    return <div className="min-h-screen flex items-center justify-center font-bold">Restaurante no encontrado</div>;
  }

  const resCategories = state.categories.filter(c => c.restaurantId === restaurant.id);
  const resProducts = state.products.filter(p => p.restaurantId === restaurant.id);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(resCategories[0]?.id || '');
  const [showCart, setShowCart] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempOptions, setTempOptions] = useState<{[groupId: string]: ProductOption[]}>({});

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
      const existing = prev.find(item => item.id === product.id && !item.selectedOptions);
      if (existing) {
        return prev.map(item => item.id === product.id && !item.selectedOptions ? { ...item, quantity: item.quantity + 1 } : item);
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
    }).filter(g => (g.options as ProductOption[]).length > 0);

    const extraPrice = selectedOptionsList.reduce((acc, g) => 
      acc + (g.options as ProductOption[]).reduce((oAcc, o) => oAcc + o.price, 0), 0);
    
    const totalPricePerUnit = selectedProduct.price + extraPrice;

    setCart(prev => [...prev, { 
      ...selectedProduct, 
      quantity: 1, 
      selectedOptions: selectedOptionsList,
      totalPricePerUnit 
    }]);

    setSelectedProduct(null);
  };

  const updateQuantity = (cartItemId: string, delta: number, index: number) => {
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

  const total = cart.reduce((sum, item) => sum + item.totalPricePerUnit * item.quantity, 0);

  const sendWhatsApp = () => {
    const message = `*Pedido Nuevo - ${restaurant.name}*\n` +
      `--------------------------\n` +
      cart.map(item => {
        let itemTxt = `${item.quantity}x ${item.name}`;
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          item.selectedOptions.forEach(group => {
            itemTxt += `\n   _${group.groupName}: ${group.options.map(o => o.name).join(', ')}_`;
          });
        }
        itemTxt += `\n   *S/ ${(item.totalPricePerUnit * item.quantity).toFixed(2)}*`;
        return itemTxt;
      }).join('\n\n') +
      `\n--------------------------\n` +
      `*Total: S/ ${total.toFixed(2)}*\n\n` +
      `_Pedido vía MenuPe_`;

    const url = `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const currentModalPrice = selectedProduct 
    ? selectedProduct.price + (Object.values(tempOptions).flat() as ProductOption[]).reduce((acc, o) => acc + o.price, 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Link to="/login" className="fixed top-4 right-4 z-[60] bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20">
        Acceso Dueños
      </Link>

      <div className="h-48 md:h-64 bg-slate-200 relative">
        <img src={restaurant.bannerUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-2xl">
            <img src={restaurant.logoUrl || "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5"} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-14 text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">{restaurant.name}</h1>
        <p className="text-slate-500 mt-2 text-sm">{restaurant.description}</p>
        <div className="flex justify-center gap-4 mt-4">
          {restaurant.socialLinks?.instagram && <a href={restaurant.socialLinks.instagram} className="text-slate-400 hover:text-red-500">IG</a>}
          {restaurant.socialLinks?.facebook && <a href={restaurant.socialLinks.facebook} className="text-slate-400 hover:text-blue-500">FB</a>}
        </div>
        <div className="text-xs text-slate-400 mt-4 flex justify-center items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {restaurant.address}
        </div>
      </div>

      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b overflow-x-auto scrollbar-hide">
        <div className="flex px-4 py-3 gap-3 max-w-2xl mx-auto">
          {resCategories.map(cat => (
            <button
              key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition whitespace-nowrap ${activeCategory === cat.id ? 'text-white' : 'bg-slate-100 text-slate-600'}`}
              style={activeCategory === cat.id ? { backgroundColor: restaurant.primaryColor } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-8">
        {resCategories.filter(c => !activeCategory || c.id === activeCategory).map(cat => (
          <section key={cat.id}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: restaurant.primaryColor }}></span>
              {cat.name}
            </h2>
            <div className="space-y-4">
              {resProducts.filter(p => p.categoryId === cat.id).map(prod => (
                <div key={prod.id} onClick={() => handleProductClick(prod)} className="bg-white rounded-2xl shadow-sm border flex p-3 gap-4 cursor-pointer active:scale-[0.98] transition">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <img src={prod.imageUrl || `https://picsum.photos/seed/${prod.id}/200/200`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">{prod.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.description}</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-extrabold text-slate-900">S/ {prod.price.toFixed(2)}</span>
                      <button className="text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: restaurant.primaryColor }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[90vh]">
            <div className="relative h-48 flex-shrink-0">
              <img src={selectedProduct.imageUrl || `https://picsum.photos/seed/${selectedProduct.id}/600/400`} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-black/40 text-white w-10 h-10 rounded-full">×</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <h3 className="text-2xl font-extrabold">{selectedProduct.name}</h3>
              {selectedProduct.optionGroups?.map(group => (
                <div key={group.id} className="space-y-3">
                  <h4 className="font-bold">{group.name}</h4>
                  {group.options.map(opt => {
                    const isSelected = (tempOptions[group.id] || []).some(o => o.id === opt.id);
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => handleOptionToggle(group.id, opt, group.isMultiSelect)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition ${isSelected ? 'bg-red-50 border-red-500' : 'border-slate-100'}`}
                      >
                        <span>{opt.name}</span>
                        <span className="font-bold">S/ {opt.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="p-6 border-t">
              <button onClick={confirmAddToCart} className="w-full text-white py-4 rounded-xl font-bold flex justify-between px-6" style={{ backgroundColor: restaurant.primaryColor }}>
                <span>Añadir al pedido</span>
                <span>S/ {currentModalPrice.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-50">
          <button onClick={() => setShowCart(true)} className="w-full text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center" style={{ backgroundColor: restaurant.primaryColor }}>
            <span className="font-bold">Ver Pedido ({cart.length})</span>
            <span className="font-extrabold text-lg">S/ {total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-extrabold">Tu Pedido</h3>
              <button onClick={() => setShowCart(false)} className="text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b pb-4">
                  <div className="flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    {item.selectedOptions?.map((g, gi) => <p key={gi} className="text-xs text-slate-400 italic">{g.groupName}: {g.options.map(o => o.name).join(', ')}</p>)}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1, idx)} className="w-8 h-8 rounded-full border">-</button>
                    <span className="font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1, idx)} className="w-8 h-8 rounded-full border">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-100 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total</span>
                <span className="font-extrabold text-2xl">S/ {total.toFixed(2)}</span>
              </div>
              <button onClick={sendWhatsApp} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3">
                Enviar pedido a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenu;
