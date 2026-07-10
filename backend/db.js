import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let pool = null;
let isMySQL = false;

// Initialize Database (either MySQL or local JSON files)
export const initDb = async () => {
  // Check if DB_HOST is provided
  if (process.env.DB_HOST) {
    console.log('Database Configuration: MySQL connection details detected. Connecting to MySQL...');
    try {
      const mysql = await import('mysql2/promise');
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false } // default is to enable SSL with rejection disabled, standard for Render/Aiven/Railway
      });

      // Test connection
      const connection = await pool.getConnection();
      console.log('Database Status: Successfully connected to MySQL!');
      connection.release();

      isMySQL = true;

      // Initialize tables
      await createTables();
      // Seed tables from JSON if they are empty
      await seedFromJSON();

    } catch (error) {
      console.error('Database Status: MySQL connection failed. Error details:', error.message);
      console.log('Database Status: Falling back to local JSON file storage.');
      isMySQL = false;
    }
  } else {
    console.log('Database Configuration: No DB_HOST env variable found. Using local JSON files.');
    isMySQL = false;
  }
};

// Create tables in MySQL if they do not exist
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        image VARCHAR(1000) NOT NULL,
        description TEXT,
        features JSON,
        materials JSON
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        date VARCHAR(20) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        cart JSON NOT NULL,
        total INT NOT NULL,
        date VARCHAR(50) NOT NULL
      )
    `);

    console.log('Database Schema: Checked/created tables successfully.');
  } catch (err) {
    console.error('Database Schema Error: Failed to check/create tables:', err.message);
    throw err;
  }
};

// Seed MySQL database with data from existing local JSON files if MySQL tables are empty
const seedFromJSON = async () => {
  try {
    // 1. Seed Products
    const [prodRows] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (prodRows[0].count === 0) {
      console.log('Database Seeding: Products table is empty. Seeding from local products.json...');
      if (fs.existsSync(PRODUCTS_FILE)) {
        const productsData = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8') || '[]');
        for (const p of productsData) {
          await pool.query(
            `INSERT INTO products (id, name, category, price, image, description, features, materials) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id,
              p.name,
              p.category,
              parseInt(p.price, 10),
              p.image,
              p.description || '',
              JSON.stringify(p.features || []),
              JSON.stringify(p.materials || [])
            ]
          );
        }
        console.log(`Database Seeding: Successfully seeded ${productsData.length} products.`);
      }
    }

    // 2. Seed Reviews
    const [revRows] = await pool.query('SELECT COUNT(*) as count FROM reviews');
    if (revRows[0].count === 0) {
      console.log('Database Seeding: Reviews table is empty. Seeding from local reviews.json...');
      if (fs.existsSync(REVIEWS_FILE)) {
        const reviewsData = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8') || '[]');
        for (const r of reviewsData) {
          await pool.query(
            `INSERT INTO reviews (id, name, rating, comment, date) VALUES (?, ?, ?, ?, ?)`,
            [r.id, r.name, parseInt(r.rating, 10), r.comment, r.date]
          );
        }
        console.log(`Database Seeding: Successfully seeded ${reviewsData.length} reviews.`);
      }
    }
  } catch (err) {
    console.error('Database Seeding Error: Failed to seed tables from JSON files:', err.message);
  }
};

// --- DATA READ/WRITE INTERFACES ---

// Products Data operations
export const getProducts = async () => {
  if (isMySQL) {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows.map((row) => ({
      ...row,
      features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
      materials: typeof row.materials === 'string' ? JSON.parse(row.materials) : (row.materials || [])
    }));
  } else {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8') || '[]');
  }
};

export const addProduct = async (product) => {
  if (isMySQL) {
    await pool.query(
      `INSERT INTO products (id, name, category, price, image, description, features, materials) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.name,
        product.category,
        product.price,
        product.image,
        product.description,
        JSON.stringify(product.features || []),
        JSON.stringify(product.materials || [])
      ]
    );
    return product;
  } else {
    const products = await getProducts();
    products.unshift(product);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return product;
  }
};

export const deleteProduct = async (id) => {
  if (isMySQL) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } else {
    const products = await getProducts();
    const exists = products.some((p) => p.id === id);
    if (!exists) return false;
    const filtered = products.filter((p) => p.id !== id);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};

// Reviews operations
export const getReviews = async () => {
  if (isMySQL) {
    const [rows] = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
    return rows;
  } else {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8') || '[]');
  }
};

export const addReview = async (review) => {
  if (isMySQL) {
    await pool.query(
      `INSERT INTO reviews (id, name, rating, comment, date) VALUES (?, ?, ?, ?, ?)`,
      [review.id, review.name, review.rating, review.comment, review.date]
    );
    return review;
  } else {
    const reviews = await getReviews();
    reviews.unshift(review);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
    return review;
  }
};

// Users operations
export const getUsers = async () => {
  if (isMySQL) {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  } else {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');
  }
};

export const addUser = async (user) => {
  if (isMySQL) {
    await pool.query(
      `INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)`,
      [user.id, user.username, user.password, user.email]
    );
    return user;
  } else {
    const users = await getUsers();
    users.push(user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return user;
  }
};

// Consultations operations
export const getConsultations = async () => {
  if (isMySQL) {
    const [rows] = await pool.query('SELECT * FROM consultations ORDER BY date DESC');
    return rows.map((row) => ({
      ...row,
      cart: typeof row.cart === 'string' ? JSON.parse(row.cart) : (row.cart || [])
    }));
  } else {
    if (!fs.existsSync(CONSULTATIONS_FILE)) return [];
    return JSON.parse(fs.readFileSync(CONSULTATIONS_FILE, 'utf-8') || '[]');
  }
};

export const addConsultation = async (booking) => {
  if (isMySQL) {
    await pool.query(
      `INSERT INTO consultations (id, username, phone, address, cart, total, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.id,
        booking.username,
        booking.phone,
        booking.address,
        JSON.stringify(booking.cart || []),
        booking.total,
        booking.date
      ]
    );
    return booking;
  } else {
    const bookings = await getConsultations();
    bookings.unshift(booking);
    fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
    return booking;
  }
};
