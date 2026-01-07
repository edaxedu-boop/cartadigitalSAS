import postgres from 'postgres';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const sql = postgres(process.env.NEON_DATABASE_URL, {
        ssl: 'require',
    });

    try {
        const restaurants = await sql`SELECT * FROM restaurants`;
        res.status(200).json(restaurants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        await sql.end();
    }
}
