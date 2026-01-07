import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// console.log('⚡ USANDO VARIABLES DE ENTORNO');

console.group('🔧 Diagnóstico Supabase');
console.log('1. Verificando variables de entorno...');
console.log('- URL Value:', supabaseUrl ? supabaseUrl : '(vacío)');
console.log('- Key Length:', supabaseKey ? supabaseKey.length : 0);
console.log('- Key Prefix:', supabaseKey ? supabaseKey.substring(0, 3) : 'N/A');

let supabaseInstance = null;

if (supabaseUrl && supabaseKey) {
  try {
    console.log('2. Intentando crear cliente...');
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Cliente creado exitosamente');
  } catch (error) {
    console.error('❌ Error fatal al crear cliente:', error);
  }
} else {
  console.error('❌ Falta configuración. Revisa .env.local');
}
console.groupEnd();

export const supabase = supabaseInstance;
export const isSupabaseConfigured = !!supabaseInstance;