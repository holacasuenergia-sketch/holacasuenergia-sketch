const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuración del transportador de email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'enerlux.soluciones@gmail.com',
      pass: process.env.EMAIL_PASS // App Password de Google
    }
  });
};

// Email de administrador
const ADMIN_EMAIL = 'admin@enerlux.com';

/**
 * Enviar email de nuevo lead
 */
router.post('/nuevo-lead', async (req, res) => {
  const { nombre, telefono, email, servicio, mensaje } = req.body;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Enerlux CRM" <${process.env.EMAIL_USER || 'enerlux.soluciones@gmail.com'}>`,
    to: ADMIN_EMAIL,
    subject: `📥 Nuevo Lead: ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #1E3A5F 0%, #0F2744 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">📥 Nuevo Lead Recibido</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 10px 0; color: #666; width: 120px;">Nombre:</td>
              <td style="padding: 10px 0; font-weight: bold;">${nombre || 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Teléfono:</td>
              <td style="padding: 10px 0; font-weight: bold;">${telefono || 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Email:</td>
              <td style="padding: 10px 0; font-weight: bold;">${email || 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Servicio:</td>
              <td style="padding: 10px 0; font-weight: bold;">${servicio || 'No especificado'}</td>
            </tr>
            ${mensaje ? `<tr><td style="padding: 10px 0; color: #666;">Mensaje:</td><td style="padding: 10px 0;">${mensaje}</td></tr>` : ''}
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://pagomenosluzygas.es/leads-dashboard.html" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver en Dashboard</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          Enerlux Soluciones - CRM
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Enviar email de nueva venta (asesor)
 */
router.post('/nueva-venta', async (req, res) => {
  const { asesorNombre, cliente, servicio, compania } = req.body;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Enerlux CRM" <${process.env.EMAIL_USER || 'enerlux.soluciones@gmail.com'}>`,
    to: ADMIN_EMAIL,
    subject: `💰 Nueva Venta de ${asesorNombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">💰 Nueva Venta Registrada</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 10px 0; color: #666; width: 120px;">Asesor:</td>
              <td style="padding: 10px 0; font-weight: bold;">${asesorNombre}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Cliente:</td>
              <td style="padding: 10px 0; font-weight: bold;">${cliente}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Servicio:</td>
              <td style="padding: 10px 0; font-weight: bold;">${servicio}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Compañía:</td>
              <td style="padding: 10px 0; font-weight: bold;">${compania || 'No especificada'}</td>
            </tr>
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://pagomenosluzygas.es/admin-dashboard.html" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver en Dashboard</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          Enerlux Soluciones - CRM
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Enviar email de cambio de estado
 */
router.post('/cambio-estado', async (req, res) => {
  const { asesorEmail, asesorNombre, cliente, estadoAnterior, estadoNuevo, operacionId } = req.body;
  
  const transporter = createTransporter();
  
  // Email al asesor (si hay email)
  if (asesorEmail) {
    const mailOptions = {
      from: `"Enerlux CRM" <${process.env.EMAIL_USER || 'enerlux.soluciones@gmail.com'}>`,
      to: asesorEmail,
      subject: `📋 Actualización: ${cliente}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">📋 Estado Actualizado</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hola <strong>${asesorNombre}</strong>,</p>
            <p>El estado de tu operación ha sido actualizado:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Cliente:</strong> ${cliente}</p>
              <p style="margin: 10px 0 0;">
                <span style="background: #FEF3C7; padding: 5px 10px; border-radius: 5px;">${estadoAnterior || 'Nuevo'}</span>
                →
                <span style="background: #D1FAE5; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${estadoNuevo}</span>
              </p>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://pagomenosluzygas.es/asesor-dashboard.html" style="background: #6366F1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver en Dashboard</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            Enerlux Soluciones - CRM
          </div>
        </div>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
      console.error('Error enviando email:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.json({ success: true, message: 'Sin email de asesor' });
  }
});

/**
 * Enviar email de liquidación lista
 */
router.post('/liquidacion', async (req, res) => {
  const { asesorEmail, asesorNombre, total, periodo } = req.body;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Enerlux CRM" <${process.env.EMAIL_USER || 'enerlux.soluciones@gmail.com'}>`,
    to: asesorEmail,
    subject: `💰 Tu Liquidación Está Lista - ${total}€`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">💰 Liquidación Lista</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hola <strong>${asesorNombre}</strong>,</p>
          <p>Tu liquidación ya está disponible:</p>
          <div style="background: #f0fdf4; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #666;">Total a cobrar</p>
            <p style="margin: 10px 0 0; font-size: 48px; font-weight: bold; color: #10B981;">${total}€</p>
            ${periodo ? `<p style="margin: 10px 0 0; color: #666;">${periodo}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 14px;">Revisa los detalles en tu dashboard para verificar las ventas incluidas.</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://pagomenosluzygas.es/asesor-dashboard.html" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver Liquidación</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          Enerlux Soluciones - CRM
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;