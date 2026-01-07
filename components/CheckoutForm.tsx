import React, { useState } from 'react';
import { CartItem, Restaurant } from '../types';

interface CheckoutFormProps {
    restaurant: Restaurant;
    cart: CartItem[];
    total: number;
    onClose: () => void;
    onSubmit: (data: CheckoutData) => void;
}

export interface CheckoutData {
    orderType: 'delivery' | 'takeaway' | 'dine-in';
    customerName: string;
    phone?: string;
    address?: string;
    reference?: string;
    deliveryZone?: string;
    deliveryPrice?: number;
    tableNumber?: string;
    observations: string;
    paymentMethod: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ restaurant, cart, total, onClose, onSubmit }) => {
    // Determinar tipo de pedido inicial basado en configuración
    const initialOrderType = restaurant.orderTypes?.delivery ? 'delivery' :
        (restaurant.orderTypes?.takeaway ? 'takeaway' :
            (restaurant.orderTypes?.dineIn ? 'dine-in' : 'delivery'));

    const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dine-in'>(initialOrderType);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [reference, setReference] = useState('');
    const [deliveryZone, setDeliveryZone] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [observations, setObservations] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    // Zonas de delivery configurables
    const deliveryZones = restaurant.deliveryZones || [];

    // Métodos de pago configurables
    const paymentMethods = restaurant.paymentMethods || [
        { id: 'efectivo', name: 'Efectivo', enabled: true }
    ];

    // Seleccionar primer método de pago válido por defecto
    React.useEffect(() => {
        const firstEnabled = paymentMethods.find(p => p.enabled);
        if (firstEnabled) setPaymentMethod(firstEnabled.id);
    }, [restaurant.paymentMethods]);

    const selectedZone = deliveryZones.find(z => z.id === deliveryZone);
    const deliveryPrice = selectedZone?.price || 0;
    const finalTotal = total + deliveryPrice;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!customerName.trim()) {
            alert('Por favor ingresa tu nombre');
            return;
        }

        if (orderType === 'delivery') {
            if (!phone.trim() || !address.trim() || !deliveryZone) {
                alert('Por favor completa todos los campos de delivery');
                return;
            }
        }

        if (orderType === 'dine-in' && !tableNumber.trim()) {
            alert('Por favor ingresa el número de mesa');
            return;
        }

        if (!paymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        const data: CheckoutData = {
            orderType,
            customerName,
            phone: orderType === 'delivery' ? phone : undefined,
            address: orderType === 'delivery' ? address : undefined,
            reference: orderType === 'delivery' ? reference : undefined,
            deliveryZone: orderType === 'delivery' ? selectedZone?.name : undefined,
            deliveryPrice: orderType === 'delivery' ? deliveryPrice : 0,
            tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
            observations,
            paymentMethod: paymentMethods.find(p => p.id === paymentMethod)?.name || 'Efectivo',
        };

        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-xl flex items-end justify-center">
            <div className="bg-white w-full max-w-2xl rounded-t-[48px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
                <div className="px-8 py-6 border-b flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Finalizar Pedido</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Completa tus datos</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-light hover:bg-slate-200 transition">×</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Tipo de Pedido */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-3">TIPO DE PEDIDO</label>
                        <div className="grid grid-cols-3 gap-3">
                            {restaurant.orderTypes?.delivery !== false && (
                                <button
                                    type="button"
                                    onClick={() => setOrderType('delivery')}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition ${orderType === 'delivery' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600'}`}
                                >
                                    🛵 Delivery
                                </button>
                            )}
                            {restaurant.orderTypes?.takeaway !== false && (
                                <button
                                    type="button"
                                    onClick={() => setOrderType('takeaway')}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition ${orderType === 'takeaway' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600'}`}
                                >
                                    🥡 Para llevar
                                </button>
                            )}
                            {restaurant.orderTypes?.dineIn !== false && (
                                <button
                                    type="button"
                                    onClick={() => setOrderType('dine-in')}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition ${orderType === 'dine-in' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600'}`}
                                >
                                    🍽️ En mesa
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Nombre (siempre) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Tu Nombre *</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="Juan Pérez"
                            required
                            className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none"
                        />
                    </div>

                    {/* Campos específicos de Delivery */}
                    {orderType === 'delivery' && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">Teléfono *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="987654321"
                                    required
                                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">Dirección *</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Av. Principal 123"
                                    required
                                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">Referencia</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={e => setReference(e.target.value)}
                                    placeholder="Casa blanca con reja negra"
                                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-2">Zona de Delivery *</label>
                                <select
                                    value={deliveryZone}
                                    onChange={e => setDeliveryZone(e.target.value)}
                                    required
                                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none"
                                >
                                    <option value="">Selecciona tu zona</option>
                                    {deliveryZones.map(zone => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name} (+S/ {zone.price.toFixed(2)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Campo específico de Mesa */}
                    {orderType === 'dine-in' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Número de Mesa *</label>
                            <input
                                type="text"
                                value={tableNumber}
                                onChange={e => setTableNumber(e.target.value)}
                                placeholder="Mesa 5"
                                required
                                className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Observaciones</label>
                        <textarea
                            value={observations}
                            onChange={e => setObservations(e.target.value)}
                            placeholder="Ej: Sin cebolla, extra picante..."
                            rows={3}
                            className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-red-500 outline-none resize-none"
                        />
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-3">MÉTODO DE PAGO</label>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.filter(p => p.enabled).map(method => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition ${paymentMethod === method.id ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200 text-slate-600'}`}
                                >
                                    {method.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resumen del Total */}
                    <div className="bg-slate-100 p-6 rounded-2xl space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-bold">S/ {total.toFixed(2)}</span>
                        </div>
                        {orderType === 'delivery' && deliveryPrice > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Delivery ({selectedZone?.name})</span>
                                <span className="font-bold">S/ {deliveryPrice.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-slate-300 flex justify-between">
                            <span className="font-black">TOTAL</span>
                            <span className="font-black text-xl">S/ {finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </form>

                {/* Botón de Enviar */}
                <div className="p-8 bg-slate-50 border-t flex-shrink-0">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-[#25D366] text-white py-5 rounded-[28px] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.511-2.961-2.625-.087-.115-.712-.95-.712-1.81s.448-1.28.608-1.44c.159-.16.348-.2.463-.2h.33c.12 0 .282-.004.408.302.143.348.487 1.18.529 1.265.042.085.07 .184.015.294-.055.11-.081.18-.163.273-.082.092-.17.206-.243.277-.081.08-.166.166-.071.327.095.162.424.7.91 1.136.625.559 1.152.73 1.311.809.159.08.252.067.345-.039.093-.105.398-.462.505-.62.107-.158.214-.132.36-.079.147.053.93.439 1.089.518.16.079.266.118.305.184.04.066.04.382-.104.787z" />
                        </svg>
                        Enviar Pedido por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;
