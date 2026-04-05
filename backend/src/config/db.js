import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const testDbConnection = async () => {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("BURAYA")) {
        console.log('⚠️ DATABASE_URL bulunamadı veya geçerli değil. PostgreSQL testi atlanıyor.');
        return;
    }
    const client = await pool.connect();
    console.log('✅ PostgreSQL Veritabanı bağlantısı BAŞARILI!');
    const res = await client.query('SELECT NOW() AS current_time');
    console.log('🕒 DB Saati:', res.rows[0].current_time);
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL Veritabanı bağlantı HATASI:', err.message);
  }
};

export default pool;
