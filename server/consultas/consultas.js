const pool = require('../db/conexion');

// Función para registrar un nuevo usuario
const registrarUsuario = async (username, password) => {
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
  const values = [username, password];
  const { rows } = await pool.query(query, values);
  return rows[0].id;
};

// Función para obtener un usuario por nombre de usuario
const obtenerUsuarioPorNombreUsuario = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Función para obtener un usuario por ID
const obtenerUsuarioPorId = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Función para obtener todos los productos
const obtenerProductos = async () => {
  const query = 'SELECT * FROM products';
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return []; // Devolver un arreglo vacío en caso de error
  }
};

// Función para obtener un producto por ID
const obtenerProductoPorId = async (id) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Función para realizar una compra
const realizarCompra = async (user_id, product_id) => {
  const query = 'INSERT INTO purchases (user_id, product_id, purchase_date) VALUES ($1, $2, NOW()) RETURNING id';
  const values = [user_id, product_id];
  const { rows } = await pool.query(query, values);
  return rows[0].id;
};

// Otras funciones de consultas...

module.exports = {
  registrarUsuario,
  obtenerUsuarioPorNombreUsuario,
  obtenerUsuarioPorId,
  obtenerProductos,
  obtenerProductoPorId,
  realizarCompra,
  // Exporta otras funciones aquí
};
