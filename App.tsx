
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, Restaurant, Category, Product } from './types';
import { INITIAL_DATA } from './constants';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import Dashboard from './views/Dashboard';
import PublicMenu from './views/PublicMenu';
import Home from './views/Home';
import Login from './views/Login';
import SuperAdmin from './views/SuperAdmin';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const savedUser = localStorage.getItem('menupe_userId');
      const savedSuper = localStorage.getItem('menupe_isSuper') === 'true';
      return {
        ...INITIAL_DATA,
        currentUserId: savedUser,
        isSuperAdmin: savedSuper
      };
    } catch (e) {
      console.warn("Error al recuperar estado de localStorage, usando datos iniciales.", e);
      return INITIAL_DATA;
    }
  });

  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Cargar datos desde Supabase
  const loadData = async () => {
    if (!isSupabaseConfigured || !supabase) {
      console.log("MenuPe: Usando modo demostración local");
      setLoading(false);
      return;
    }

    try {
      const { data: res } = await supabase.from('restaurants').select('*');
      const { data: cats } = await supabase.from('categories').select('*');
      const { data: prods } = await supabase.from('products').select('*');

      if (res && res.length > 0) {
        setState(prev => ({
          ...prev,
          restaurants: res.map(r => ({
            ...r,
            whatsappNumber: r.whatsapp_number,
            primaryColor: r.primary_color,
            logoUrl: r.logo_url,
            bannerUrl: r.banner_url,
            businessHours: r.business_hours,
            deliveryZones: r.delivery_zones,
            paymentMethods: r.payment_methods,
            orderTypes: r.order_types,
            promoBanners: r.promo_banners,
            plan: r.plan,
            isActive: r.is_active,
            createdAt: r.created_at,
            planExpiresAt: r.plan_expires_at,
            socialLinks: { instagram: r.instagram, facebook: r.facebook, tiktok: r.tiktok }
          })),
          categories: cats || [],
          products: (prods || []).map(p => ({
            ...p,
            categoryId: p.category_id,
            restaurantId: p.restaurant_id,
            imageUrl: p.image_url,
            isAvailable: p.is_available,
            optionGroups: p.option_groups
          }))
        }));
      }
    } catch (error) {
      console.error("Error cargando desde Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const login = (userId: string | null, isSuper: boolean = false) => {
    setState(prev => ({ ...prev, currentUserId: userId, isSuperAdmin: isSuper }));
    if (userId) localStorage.setItem('menupe_userId', userId);
    else localStorage.removeItem('menupe_userId');
    localStorage.setItem('menupe_isSuper', String(isSuper));
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setState(prev => ({ ...prev, currentUserId: null, isSuperAdmin: false }));
    localStorage.removeItem('menupe_userId');
    localStorage.removeItem('menupe_isSuper');
  };

  // ============ RESTAURANTES ============
  const addRestaurant = async (restaurant: Restaurant) => {
    console.log('🚀 addRestaurant llamado!', restaurant);
    console.log('🔌 Supabase:', !!supabase);

    if (!supabase) {
      alert('Error: Supabase no conectado');
      return;
    }

    if (!restaurant.email || !restaurant.password) {
      alert('Error: Email y contraseña son requeridos');
      return;
    }

    try {
      // Paso 1: Crear usuario en Supabase Auth
      console.log('📧 Paso 1: Creando usuario en Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: restaurant.email,
        password: restaurant.password,
        options: {
          emailRedirectTo: undefined, // No enviar email de confirmación
          data: {
            restaurant_name: restaurant.name,
          }
        }
      });

      if (authError) {
        console.error('❌ Error creando usuario:', authError);
        if (authError.message.includes('already registered')) {
          alert('Este email ya está registrado. Usa otro email.');
        } else {
          alert('Error al crear usuario: ' + authError.message);
        }
        return;
      }

      if (!authData.user) {
        alert('Error: No se pudo crear el usuario');
        return;
      }

      console.log('✅ Usuario creado:', authData.user.id);

      // Paso 2: Crear el restaurante en la BD asociado al usuario
      console.log('🏪 Paso 2: Creando restaurante...');
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([{
          user_id: authData.user.id,
          name: restaurant.name,
          email: restaurant.email, // Agregado email
          slug: restaurant.slug,
          description: restaurant.description,
          whatsapp_number: restaurant.whatsappNumber,
          primary_color: restaurant.primaryColor,
          logo_url: restaurant.logoUrl,
          banner_url: restaurant.bannerUrl,
          address: restaurant.address,
          instagram: restaurant.socialLinks?.instagram,
          facebook: restaurant.socialLinks?.facebook,
          tiktok: restaurant.socialLinks?.tiktok,
          plan: restaurant.plan || 'basic',
          plan_expires_at: restaurant.planExpiresAt,
          is_active: restaurant.isActive
        }])
        .select()
        .single();

      if (restaurantError) {
        console.error('❌ Error creando restaurante:', restaurantError);
        alert('Error al crear restaurante: ' + restaurantError.message);
        return;
      }

      console.log('✅ Restaurante creado:', restaurantData.id);

      // Paso 3: Asignar rol de restaurant_admin
      console.log('🔐 Paso 3: Asignando rol...');
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'restaurant_admin',
          restaurant_id: restaurantData.id
        }]);

      if (roleError) {
        console.error('❌ Error asignando rol:', roleError);
        // No mostramos alerta porque el restaurante ya se creó
        console.warn('El restaurante se creó pero hubo un problema asignando el rol');
      } else {
        console.log('✅ Rol asignado correctamente');
      }

      // Paso 4: Recargar datos y mostrar éxito
      await loadData();
      alert(`✅ Restaurante "${restaurant.name}" creado exitosamente!\n\nCredenciales de acceso:\n📧 Email: ${restaurant.email}\n🔒 Password: ${restaurant.password}\n\nEl administrador puede iniciar sesión en /#/login`);

    } catch (err) {
      console.error('❌ Error general:', err);
      alert('Error: ' + (err as Error).message);
    }
  };

  const updateRestaurant = async (restaurant: Restaurant) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: restaurant.name,
          description: restaurant.description,
          whatsapp_number: restaurant.whatsappNumber,
          primary_color: restaurant.primaryColor,
          logo_url: restaurant.logoUrl,
          banner_url: restaurant.bannerUrl,
          address: restaurant.address,
          business_hours: restaurant.businessHours,
          delivery_zones: restaurant.deliveryZones,
          payment_methods: restaurant.paymentMethods,
          order_types: restaurant.orderTypes,
          promo_banners: restaurant.promoBanners,
          instagram: restaurant.socialLinks?.instagram,
          facebook: restaurant.socialLinks?.facebook,
          tiktok: restaurant.socialLinks?.tiktok
        })
        .eq('id', restaurant.id);

      if (!error) {
        await loadData();
      } else {
        console.error('Error updating restaurant (DB):', error);
        alert('Error al actualizar datos: ' + error.message);
      }
    } catch (err) {
      console.error('Error updating restaurant:', err);
      alert('Error de conexión o inesperado al guardar.');
    }
  };
  const deleteRestaurant = async (id: string) => {
    if (!supabase) return;
    if (!confirm('¿Estás seguro de eliminar este restaurante? Esta acción no se puede deshacer.')) return;

    try {
      // Obtener el user_id antes de borrar
      const { data: res } = await supabase.from('restaurants').select('user_id').eq('id', id).single();

      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (!error) {
        console.log('✅ Restaurante eliminado de la BD');
        // Nota: No podemos eliminar el usuario de Auth desde el cliente por seguridad
        // pero al borrar el restaurante, las reglas RLS bloquerán el acceso.
        // Lo ideal sería tener una Edge Function para esto, pero por ahora esto es funcional.
        if (res?.user_id) {
          console.log('⚠️ Nota: El usuario de Auth sigue existiendo pero sin acceso a restaurante.');
        }
        await loadData();
      } else {
        alert('Error al eliminar: ' + error.message);
      }
    } catch (err) {
      console.error('Error deleting restaurant:', err);
    }
  };

  const toggleRestaurantStatus = async (id: string, isActive: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ is_active: isActive })
        .eq('id', id);

      if (!error) {
        await loadData();
      } else {
        console.error('Error toggling status:', error);
        alert('Error al actualizar estado');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // ============ CATEGORÍAS ============
  const addCategory = async (name: string, restaurantId: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name,
          restaurant_id: restaurantId,
          restaurantId: restaurantId
        }]);

      if (!error) {
        await loadData();
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (!error) {
        await loadData();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // ============ PRODUCTOS ============
  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          price: product.price,
          restaurant_id: product.restaurantId,
          restaurantId: product.restaurantId,
          category_id: product.categoryId,
          categoryId: product.categoryId,
          image_url: product.imageUrl,
          imageUrl: product.imageUrl,
          is_available: product.isAvailable,
          isAvailable: product.isAvailable,
          option_groups: product.optionGroups,
          optionGroups: product.optionGroups
        }]);

      if (!error) {
        await loadData();
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateProduct = async (product: Product) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          categoryId: product.categoryId,
          image_url: product.imageUrl,
          imageUrl: product.imageUrl,
          is_available: product.isAvailable,
          isAvailable: product.isAvailable,
          option_groups: product.optionGroups,
          optionGroups: product.optionGroups
        })
        .eq('id', product.id);

      if (!error) {
        await loadData();
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (!error) {
        await loadData();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-400 text-xs tracking-widest uppercase">Cargando...</p>
      </div>
    );
  }

  // Lógica de Subdominios
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  // Verifica si es un subdominio (ej: polleria.midominio.com)
  // Ignora localhost y www
  const isSubdomain = parts.length > 2 && parts[0] !== 'www' && !hostname.includes('localhost');

  if (isSubdomain && !loading) {
    const subdomain = parts[0];
    return (
      <HashRouter>
        <PublicMenu state={state} slug={subdomain} />
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/super-admin" element={state.isSuperAdmin ? <SuperAdmin state={state} addRestaurant={addRestaurant} deleteRestaurant={deleteRestaurant} toggleRestaurantStatus={toggleRestaurantStatus} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/dashboard/*" element={state.currentUserId ? <Dashboard state={state} logout={logout} updateRestaurant={updateRestaurant} addCategory={(name) => addCategory(name, state.currentUserId!)} deleteCategory={deleteCategory} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} /> : <Navigate to="/login" />} />
        <Route path="/menu/:slug" element={<PublicMenu state={state} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
