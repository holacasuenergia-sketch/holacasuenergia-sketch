const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter
const createTransporter = () => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const ADMIN_EMAIL = 'admin@enerlux.com';

// Email de nuevo lead
app.post('/nuevo-lead', async (req, res) => {
  const { nombre, telefono, email, servicio, mensaje } = req.body;
  
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Enerlux CRM" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `📥 Nuevo Lead: ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E3A5F 0%, #0F2744 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">📥 Nuevo Lead Recibido</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <p><strong>Nombre:</strong> ${nombre || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> ${telefono || 'No especificado'}</p>
            <p><strong>Email:</strong> ${email || 'No especificado'}</p>
            <p><strong>Servicio:</strong> ${servicio || 'No especificado'}</p>
            ${mensaje ? `<p><strong>Mensaje:</strong> ${mensaje}</p>` : ''}
          </div>
        </div>
      `
    });
    
    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email de nueva venta
app.post('/nueva-venta', async (req, res) => {
  const { asesorNombre, cliente, servicio, compania } = req.body;
  
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Enerlux CRM" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `💰 Nueva Venta: ${cliente}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>💰 Nueva Venta Registrada</h2>
          <p><strong>Asesor:</strong> ${asesorNombre}</p>
          <p><strong>Cliente:</strong> ${cliente}</p>
          <p><strong>Servicio:</strong> ${servicio}</p>
          <p><strong>Compañía:</strong> ${compania}</p>
        </div>
      `
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email de cambio de estado
app.post('/cambio-estado', async (req, res) => {
  const { asesorEmail, operacionId, cliente,.estadoAnterior, estadoNuevo } = req.body;
  
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Enerlux CRM" <${process.env.EMAIL_USER}>`,
      to: asesorEmail,
      subject: `📋 Actualización: ${cliente}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>📋 Cambio de Estado</h2>
          <p><strong>Operación:</strong> ${operacionId}</p>
          <p><strong>Cliente:</strong> ${cliente}</p>
          <p><strong>Estado anterior:</strong> ${estadoAnterior}</p>
          <p><strong>Estado nuevo:</strong> ${estadoNuevo}</p>
        </div>
      `
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email de liquidación
app.post('/liquidacion', async (req, res) => {
  const { asesorEmail, asesorNombre, periodo, monto, operaciones } = req.body;
  
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Enerlux CRM" <${process.env.EMAIL_USER}>`,
      to: asesorEmail,
      subject: `💶 Liquidación Lista: ${periodo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>💶 Liquidación Preparada</h2>
          <p>Hola ${asesorNombre},</p>
          <p>Tu liquidación para <strong>${periodo}</strong> está lista.</p>
          <p><strong>Monto total:</strong> €${monto}</p>
          <p><strong>Operaciones:</strong> ${operaciones}</p>
        </div>
      `
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    email_user: process.env.EMAIL_USER ? 'configured' : 'missing',
    email_pass: process.env.EMAIL_PASS ? 'configured' : 'missing'
  });
});

module.exports = app;
