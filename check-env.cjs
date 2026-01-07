import fs from 'fs';
import path from 'path';

// Ruta al archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');

console.log('🔍 Analizando .env.local...');

try {
    if (!fs.existsSync(envPath)) {
        console.error('❌ EROR FATAL: No existe el archivo .env.local');
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf-8');
    console.log('✅ Archivo encontrado.');

    const lines = content.split('\n');
    let url = '';
    let key = '';

    lines.forEach(line => {
        if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
        if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
    });

    console.log('\n----------------------------------------');

    // Validar URL
    if (!url) {
        console.error('❌ URL no encontrada.');
    } else {
        console.log(`✅ URL detectada: ${url}`);
    }

    // Validar KEY
    if (!key) {
        console.error('❌ KEY no encontrada.');
    } else {
        console.log(`ℹ️  Key detectada (longitud ${key.length}): ${key.substring(0, 15)}...`);

        // CHEQUEO DE TYPO
        if (key.includes('publisnable')) {
            console.log('\n🚨🚨🚨 ¡ERROR ENCONTRADO! 🚨🚨🚨');
            console.log('Tu clave dice "publisnable" (con N).');
            console.log('Debería decir "publishable" (con H).');
            console.log('❌ Incorrecto: sb_publisnable_...');
            console.log('✅ Correcto:   sb_publishable_...');
            console.log('----------------------------------------');
            console.log('👉 POR FAVOR CORRIGE LA "n" por una "h" EN TU ARCHIVO .env.local');
        } else if (key.includes('publishable')) {
            console.log('✅ La palabra "publishable" está bien escrita.');
        } else {
            console.log('⚠️ La key no tiene el formato estándar esperado (no contiene "publishable").');
        }
    }
    console.log('----------------------------------------\n');

} catch (err) {
    console.error('Error leyendo archivo:', err);
}
