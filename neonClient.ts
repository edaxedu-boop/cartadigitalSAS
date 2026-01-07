import postgres from 'postgres';

const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL || '';

console.log('🔍 Neon PostgreSQL:');
console.log('URL configurada:', neonUrl ? '✅' : '❌');

let sql: any = null;

if (neonUrl) {
    try {
        sql = postgres(neonUrl, {
            ssl: 'require',
            max: 10,
        });
        console.log('✅ Cliente PostgreSQL inicializado');
    } catch (err) {
        console.error('❌ Error inicializando PostgreSQL:', err);
    }
} else {
    console.warn('⚠️ VITE_NEON_DATABASE_URL no configurada');
}

// Funciones helper para usar en la app
export const db = {
    async query(text: string, params?: any[]) {
        if (!sql) {
            console.error('❌ Base de datos no conectada');
            return { rows: [], error: 'Database not connected' };
        }

        try {
            const result = await sql.unsafe(text, params);
            return { rows: result, error: null };
        } catch (error) {
            console.error('❌ Query error:', error);
            return { rows: [], error };
        }
    },

    // Get all restaurants
    async getRestaurants() {
        return this.query('SELECT * FROM restaurants');
    },

    // Get restaurant by slug
    async getRestaurantBySlug(slug: string) {
        const result = await this.query('SELECT * FROM restaurants WHERE slug = $1', [slug]);
        return result.rows[0] || null;
    },

    // Get categories by restaurant
    async getCategoriesByRestaurant(restaurantId: string) {
        return this.query('SELECT * FROM categories WHERE restaurant_id = $1', [restaurantId]);
    },

    // Get products by restaurant
    async getProductsByRestaurant(restaurantId: string) {
        return this.query('SELECT * FROM products WHERE restaurant_id = $1', [restaurantId]);
    },

    // Create restaurant
    async createRestaurant(data: any) {
        const { name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, username, password, instagram, facebook, tiktok } = data;
        return this.query(`
      INSERT INTO restaurants (name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, username, password, instagram, facebook, tiktok)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, username, password, instagram, facebook, tiktok]);
    },

    // Create category
    async createCategory(restaurantId: string, name: string) {
        return this.query(`
      INSERT INTO categories (restaurant_id, name)
      VALUES ($1, $2)
      RETURNING *
    `, [restaurantId, name]);
    },

    // Create product
    async createProduct(data: any) {
        const { restaurant_id, category_id, name, description, price, image_url, is_available, option_groups } = data;
        return this.query(`
      INSERT INTO products (restaurant_id, category_id, name, description, price, image_url, is_available, option_groups)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [restaurant_id, category_id, name, description, price, image_url, is_available, JSON.stringify(option_groups)]);
    }
};

export const isConfigured = !!sql;
