const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  nombreCompleto: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario', 'contador'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ CORRECCIÓN 1: Usar async/await SIN parámetro next
usuarioSchema.pre('save', async function() {
  try {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// ✅ CORRECCIÓN 2: Método para comparar passwords
usuarioSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);