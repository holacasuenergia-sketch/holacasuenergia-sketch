const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import services
const ocrService = require('../services/ocr');
const Cliente = require('../models/Cliente');
const Factura = require('../models/Factura');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `factura-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes JPG, PNG o PDF'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/factura/upload
router.post('/upload', upload.single('factura'), async (req, res) => {
  try {
    const { nombre, email, telefono, cp, tipo = 'luz' } = req.body;
    const facturaFile = req.file;

    // Validate required fields
    if (!nombre || !email || !telefono || !cp || !facturaFile) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son obligatorios'
      });
    }

    // Extract data from factura using OCR
    const facturaData = await ocrService.extract(facturaFile.path);

    // Create or get cliente
    const cliente = await Cliente.findOrCreate({
      where: { email },
      defaults: {
        id: uuidv4(),
        nombre,
        email,
        telefono,
        cp
      }
    });

    // Create factura record
    const factura = await Factura.create({
      id: uuidv4(),
      cliente_id: cliente[0].id,
      url_factura: facturaFile.path,
      tipo,
      consumo_kwh: facturaData.consumo || 0,
      potencia: facturaData.potencia || 'N/A',
      periodo: facturaData.periodo || 'N/A',
      precio_actual: facturaData.precio || 0
    });

    res.json({
      success: true,
      cliente_id: cliente[0].id,
      factura_id: factura.id,
      factura_url: facturaFile.path,
      factura_data: facturaData
    });

  } catch (error) {
    console.error('Error subiendo factura:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la factura'
    });
  }
});

// GET /api/factura/:id
router.get('/:id', async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    
    if (!factura) {
      return res.status(404).json({
        success: false,
        error: 'Factura no encontrada'
      });
    }

    res.json({
      success: true,
      factura
    });

  } catch (error) {
    console.error('Error obteniendo factura:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la factura'
    });
  }
});

module.exports = router;