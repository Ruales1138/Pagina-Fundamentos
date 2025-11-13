const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiame_por_una_secreta';

async function register(req, res) {
  try {
    const { username, password, role, email, nombre, carrera, departamento } = req.body;
    if (!username || !password) return res.status(400).json({ ok: false, message: 'Usuario y contraseña requeridos' });

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ ok: false, message: 'Usuario ya existe' });

    // Verificar si el email ya existe (si se proporciona)
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) return res.status(409).json({ ok: false, message: 'Email ya registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      username, 
      passwordHash, 
      role: role || 'Estudiante',
      email: email || null,
      nombre: nombre || null,
      carrera: carrera || null,
      departamento: departamento || null
    });
    
    return res.status(201).json({ 
      ok: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        email: user.email,
        nombre: user.nombre,
        carrera: user.carrera,
        departamento: user.departamento
      } 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

async function login(req, res) {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ ok: false, message: 'Usuario y contraseña requeridos' });

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });

    if (role && role !== user.role) return res.status(403).json({ ok: false, message: 'Rol inválido para este usuario' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    return res.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        email: user.email,
        nombre: user.nombre,
        carrera: user.carrera,
        departamento: user.departamento
      }, 
      token 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

/**
 * 🔐 Solicitar código de reseteo de contraseña
 * Genera un código de 6 dígitos válido por 15 minutos
 */
async function forgotPassword(req, res) {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ ok: false, message: 'Email/usuario requerido' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      // Por seguridad, no revelar si el usuario existe o no
      return res.json({ 
        ok: true, 
        message: 'Si el usuario existe, recibirá un código de reseteo',
        code: null 
      });
    }

    // Generar código de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    console.log(`🔐 Código de reseteo generado para ${username}: ${resetCode}`);

    // En producción, aquí enviarías un email. Por ahora, devolvemos el código
    return res.json({ 
      ok: true, 
      message: 'Código de reseteo generado',
      code: resetCode, // En producción, NO devolver esto
      expiresIn: '15 minutos'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

/**
 * 🔓 Resetear contraseña con código
 */
async function resetPassword(req, res) {
  try {
    const { username, code, newPassword } = req.body;

    if (!username || !code || !newPassword) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Usuario, código y nueva contraseña requeridos' 
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    // Validar código
    if (user.resetCode !== code) {
      return res.status(401).json({ ok: false, message: 'Código inválido' });
    }

    // Validar expiración
    if (!user.resetCodeExpires || new Date() > user.resetCodeExpires) {
      return res.status(401).json({ ok: false, message: 'Código expirado' });
    }

    // Actualizar contraseña
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Limpiar código usado
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    console.log(`✅ Contraseña reseteada exitosamente para ${username}`);

    return res.json({ 
      ok: true, 
      message: 'Contraseña actualizada correctamente' 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error del servidor' });
  }
}

module.exports = { register, login, forgotPassword, resetPassword };