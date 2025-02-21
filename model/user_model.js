const mongoose = require("mongoose");
const db = require("../config/db.js");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: false,
    min: 18,
    max: 80,
  },
  genero: {
    type: String,
    required: false,
    enum: ["Masculino", "Femenino", "Otro"],
  },
  localidad: {
    type: String,
    required: false,
    enum: ["Rural", "Urbano", "SubUrbano"],
  },
  ocupacion: {
    type: String,
    required: false,
    enum: ["Empleado", "Desempleado", "Estudiante", "Jubilado"],
  },
  familiarEnfermo: {
    type: String,
    required: false,
    enum: ["Si", "No"],
  },
  enfermedadCardiaca: {
    type: String,
    required: false,
    enum: ["Si", "No"],
  },
  diabetes: {
    type: String,
    required: false,
    enum: ["Si", "No"],
  },
  obesidad: {
    type: String,
    required: false,
    enum: ["Si", "No"],
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  peso: {
    type: Number,
    required: false,
  },
  altura: {
    type: Number,
    required: false,
  },
  bmi: {
    type: Number,
    required: false,
  },
  presion: {
    type: Number,
    required: false,
  },
  nivelEjercicio: {
    type: String,
    required: false,
    enum: ["Moderado", "Alto", "Bajo"],
  },
  actividadFisica: {
    type: String,
    required: false,
    enum: ["Moderado", "Alto", "Bajo"],
  },
  nivelDieta: {
    type: String,
    required: false,
    enum: ["Saludable", "Regular", "No Saludable"],
  },
  consumoAgua: {
    type: Number,
    required: false,
  },
  estres: {
    type: Number,
    required: false,
  },
  horasSuenio: {
    type: Number,
    required: false,
  },
  ataqueCardiaco: {
    type: String,
    required: false,
    enum: ["Si", "No"],
  },
  ratioCorazon: {
    type: Number,
    required: false,
  },
  tipoBebida: {
    type: String,
    required: false,
    enum: [
      "Vino",
      "Cerveza",
      "Vodka",
      "Vino espumoso",
      "Aguardiente",
      "Agua (no tomo)",
    ],
  },
  unidadesAlcohol: {
    type: Number,
    required: false,
  },
  consumoPorDias: {
    type: Number,
    required: false,
  },
  frecuenciaSemanal: {
    type: Number,
    required: false,
  },
  cigarrillo: {
    type: String,
    required: false,
    enum: ["Si", "No"],
  },
  consumoAlcohol: {
    type: String,
    required: false,
  },
});

// Método para encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  try {
    var user = this;
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(user.password, salt);
    user.password = hashpass;
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar la contraseña
userSchema.methods.comparePassword = async function (userPassword) {
  try {
    console.log("Comparing passwords:");
    console.log("Input password:", userPassword);
    console.log("Stored hash:", this.password);
    const isMatch = await bcrypt.compare(userPassword, this.password);
    console.log("Password match:", isMatch);
    return isMatch;
  } catch (err) {
    console.error("Error comparing passwords:", err);
    throw err;
  }
};

const UserModel = db.model("user", userSchema);

module.exports = UserModel;
