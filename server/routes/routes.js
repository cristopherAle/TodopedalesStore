const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const pool = require('../db/conexion');

const {
  registrarUsuario,
  obtenerUsuarioPorId,
  ingresarProducto,
  obtenerProductos,
  obtenerProductoPorId,
  realizarCompra,
  obtenerComprasPorUsuario,
  verificarCredenciales,
} = require('../consultas/consultas');

const { checkCredentialsExists, tokenVerification } = require('../middlewares/middleware');

router.get('/', (req, res) => {
  res.send('Bienvenido a Todopedales Store');
});

router.post('/usuarios', async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.json({ message: 'Usuario registrado', username: usuario.username });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/productos', tokenVerification, async (req, res) => {
  try {
    const { name, description, price, inventory_quantity } = req.body;
    const newProducto = {
      name,
      description,
      price,
      inventory_quantity,
    };

    await ingresarProducto(newProducto);
    res.json({ message: 'Producto agregado' });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).json({ error: error.message || 'Error interno del servidor' });
  }
});

router.post('/compras', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const purchase_date = new Date().toISOString();

    const newPurchase = {
      user_id,
      product_id,
      purchase_date,
    };

    await realizarCompra(newPurchase);
    res.json({ message: 'Compra realizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la compra' });
  }
});

/* router.get('/productos', async (req, res) => {
  try {
    const productos = await obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
}); */

router.get('/productos', async (req, res) => {
  try {
    const consulta = 'SELECT * FROM products';
    const { rows } = await pool.query(consulta);
    console.log(rows)
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await obtenerProductoPorId(id);
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/compras/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const compras = await obtenerComprasPorUsuario(user_id);
    res.json(compras);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/perfil', tokenVerification, async (req, res) => {
  try {
    const { user_id } = req.user;
    const usuario = await obtenerUsuarioPorId(user_id);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/login', checkCredentialsExists, async (req, res) => {
  try {
    const { username, password } = req.body;
    await verificarCredenciales(username, password);
    const token = jwt.sign({ username }, process.env.SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Resto de las rutas y métodos

module.exports = router;
