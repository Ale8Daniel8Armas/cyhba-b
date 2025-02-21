const calculateBMI = require("../utils/CalculateBMI.js");
const calculateSTU = require("../utils/CalculateAlcoholComsumption.js");
const userService = require("../services/user_service.js");
const UserModel = require("../model/user_model.js");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email y contraseña son requeridos",
      });
    }

    // Check if user exists
    const existingUser = await userService.checkuser(email);
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "El usuario ya existe",
      });
    }

    // Register new user
    const user = await userService.registerUser(email, password);

    // Generate initial token
    const token = await userService.generateToken(
      { _id: user._id, email: user.email },
      "secretkey",
      "1h"
    );

    res.status(200).json({
      status: true,
      message: "Usuario registrado satisfactoriamente",
      token,
      user,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Intento de login - Datos recibidos:", {
      email: req.body.email,
      passwordLength: req.body.password?.length,
    });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email y contraseña son requeridos",
      });
    }

    // Find user
    const user = await userService.checkuser(email);
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Usuario no encontrado",
      });
    }

    // Verify password
    const isMatch = await userService.verifyPassword(user, password);
    if (!isMatch) {
      console.log("Contraseña incorrecta para usuario:", email);
      return res.status(401).json({
        status: false,
        message: "Contraseña inválida",
      });
    }

    // Generate token
    const token = await userService.generateToken(
      { _id: user._id, email: user.email },
      "secretkey",
      "1h"
    );

    res.status(200).json({
      status: true,
      token,
      user: {
        email: user.email,
        // Add other non-sensitive user data as needed
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
    });
  }
};

exports.updateUserDataByAgeNameGender = async (req, res) => {
  try {
    const { email, nombre, edad, genero, isProfileComplete } = req.body;

    // Validamos que isProfileComplete sea un valor booleano
    const perfilCompleto =
      typeof isProfileComplete === "boolean" ? isProfileComplete : false;

    const updatedUser = await userService.updateUserDataByAgeNameGender(
      email,
      nombre,
      edad,
      genero,
      perfilCompleto // Aseguramos que sea un valor booleano
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente",
      user: {
        email: updatedUser.email,
        nombre: updatedUser.nombre,
        edad: updatedUser.edad,
        genero: updatedUser.genero,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByLocalOcupation = async (req, res) => {
  try {
    const { email, localidad, ocupacion } = req.body;
    const updatedUser = await userService.updateUserDataByLocalOcupation(
      email,
      localidad,
      ocupacion
    );

    res.status(200).json({
      status: true,
      message: "Datos ocupacion y localidad actualizados",
      user: {
        email: updatedUser.email,
        localidad: updatedUser.localidad,
        ocupacion: updatedUser.ocupacion,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataBySaludHistorico = async (req, res) => {
  try {
    const { email, familiarEnfermo, enfermedadCardiaca, diabetes, obesidad } =
      req.body;
    const updatedUser = await userService.updateUserDataBySaludHistorico(
      email,
      familiarEnfermo,
      enfermedadCardiaca,
      diabetes,
      obesidad
    );

    res.status(200).json({
      status: true,
      message: "Datos de salud historico actualizados",
      user: {
        email: updatedUser.email,
        familiarEnfermo: updatedUser.familiarEnfermo,
        enfermedadCardiaca: updatedUser.enfermedadCardiaca,
        diabetes: updatedUser.diabetes,
        obesidad: updatedUser.obesidad,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.getUserNameByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ nombre: user.nombre });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

exports.getProfileComplete = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ isProfileComplete: user.isProfileComplete });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Función para actualizar BMI
exports.updateBMI = async (req, res) => {
  try {
    const { email, peso, altura } = req.body;

    // Validación de datos
    if (!email || !peso || !altura) {
      return res
        .status(400)
        .json({ status: false, message: "Faltan datos (email, peso, altura)" });
    }

    // Buscar el usuario en la base de datos
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    // Calcular el BMI
    const bmi = calculateBMI(peso, altura);

    // Actualizar los valores del usuario en la base de datos
    user.peso = peso;
    user.altura = altura;
    user.bmi = bmi;

    await user.save(); // Guardamos los cambios

    // Responder con éxito
    return res.status(200).json({
      status: true,
      message: "Datos de usuario actualizados correctamente",
      user: {
        email: user.email,
        peso: user.peso,
        altura: user.altura,
        bmi: user.bmi,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error en el servidor" });
  }
};

exports.updateUserDataByPressureColesterol = async (req, res) => {
  try {
    const { email, presion } = req.body;
    const updatedUser = await userService.updateUserDataByPressureColesterol(
      email,
      presion
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente en la presion y colesterol",
      user: {
        email: updatedUser.email,
        presion: updatedUser.presion,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByExcerciseLevel = async (req, res) => {
  try {
    const { email, nivelEjercicio, actividadFisica } = req.body;
    const updatedUser = await userService.updateUserDataByExerciseHabits(
      email,
      nivelEjercicio,
      actividadFisica
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente el nivel de actividad fisica",
      user: {
        email: updatedUser.email,
        nivelEjercicio: updatedUser.nivelEjercicio,
        actividadFisica: updatedUser.actividadFisica,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByDietAndWater = async (req, res) => {
  try {
    const { email, nivelDieta, consumoAgua } = req.body;
    const updatedUser = await userService.updateUserDataByDietWater(
      email,
      nivelDieta,
      consumoAgua
    );

    res.status(200).json({
      status: true,
      message:
        "Datos actualizados correctamente el nivel de dieta y consumo de agua",
      user: {
        email: updatedUser.email,
        nivelDieta: updatedUser.nivelDieta,
        consumoAgua: updatedUser.consumoAgua,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByEstresLevel = async (req, res) => {
  try {
    const { email, estres, horasSuenio } = req.body;
    const updatedUser = await userService.updateUserDataByStressDream(
      email,
      estres,
      horasSuenio
    );

    res.status(200).json({
      status: true,
      message:
        "Datos actualizados correctamente el nivel de estres y horas de suenio",
      user: {
        email: updatedUser.email,
        estres: updatedUser.estres,
        horasSuenio: updatedUser.horasSuenio,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByHeart = async (req, res) => {
  try {
    const { email, ataqueCardiaco, ratioCorazon } = req.body;
    const updatedUser = await userService.updateUserDataByHeartState(
      email,
      ataqueCardiaco,
      ratioCorazon
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente el estado del corazon",
      user: {
        email: updatedUser.email,
        ataqueCardiaco: updatedUser.ataqueCardiaco,
        ratioCorazon: updatedUser.ratioCorazon,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataST = async (req, res) => {
  try {
    const { email, unidadesAlcohol, consumoPorDias } = req.body;
    const updatedUser = await userService.updateUserDataUnitsAlcohol(
      email,
      unidadesAlcohol,
      consumoPorDias
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente en el ST",
      user: {
        email: updatedUser.email,
        unidadesAlcohol: updatedUser.unidadesAlcohol,
        consumoPorDias: updatedUser.consumoPorDias,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByBeer = async (req, res) => {
  try {
    const { email, tipoBebida } = req.body;
    const updatedUser = await userService.updateUserDataByBeverage(
      email,
      tipoBebida
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente en el tipo de bebida",
      user: {
        email: updatedUser.email,
        tipoBebida: updatedUser.tipoBebida,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserDataByFrecuencia = async (req, res) => {
  try {
    const { email, frecuenciaSemanal } = req.body;
    const updatedUser = await userService.updateUserDataBySemanalFrecuency(
      email,
      frecuenciaSemanal
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente en la frecuencia semanal",
      user: {
        email: updatedUser.email,
        frecuenciaSemanal: updatedUser.frecuenciaSemanal,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

exports.updateUserSmoke = async (req, res) => {
  try {
    const { email, cigarrillo } = req.body;
    const updatedUser = await userService.updateUserDataBySmoking(
      email,
      cigarrillo
    );

    res.status(200).json({
      status: true,
      message: "Datos actualizados correctamente la tasa de cigarrillo",
      user: {
        email: updatedUser.email,
        cigarrillo: updatedUser.cigarrillo,
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// Función para actualizar consumoAlcohol
exports.updateSTU = async (req, res) => {
  try {
    const { email, unidadesAlcohol, consumoPorDias, frecuenciaSemanal } =
      req.body;

    // Validación de datos
    if (
      !email ||
      unidadesAlcohol == null ||
      consumoPorDias == null ||
      frecuenciaSemanal == null
    ) {
      return res.status(400).json({
        status: false,
        message: "Faltan datos para el calculo del STU",
      });
    }

    // Buscar el usuario en la base de datos
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    // Calcular el STU
    const consumoInicial = calculateSTU(
      unidadesAlcohol,
      consumoPorDias,
      frecuenciaSemanal
    );

    let consumoAlcohol = "";

    //consumo para hombres
    if (user.genero == "Masculino") {
      if (consumoInicial <= 7) {
        consumoAlcohol = "Nada";
      } else if (consumoInicial <= 14) {
        consumoAlcohol = "Bajo";
      } else if (consumoInicial <= 21 && consumoInicial >= 15) {
        consumoAlcohol = "Moderado";
      } else if (consumoInicial >= 22) {
        consumoAlcohol = "Alto";
      }
    }

    if (user.genero == "Femenino") {
      if (consumoInicial <= 4) {
        consumoAlcohol = "Nada";
      } else if (consumoInicial <= 7) {
        consumoAlcohol = "Bajo";
      } else if (consumoInicial <= 14 && consumoInicial >= 8) {
        consumoAlcohol = "Moderado";
      } else if (consumoInicial >= 15) {
        consumoAlcohol = "Alto";
      }
    }

    if (user.genero == "Otro") {
      if (consumoInicial <= 6) {
        consumoAlcohol = "Nada";
      } else if (consumoInicial <= 11) {
        consumoAlcohol = "Bajo";
      } else if (consumoInicial <= 20 && consumoInicial >= 12) {
        consumoAlcohol = "Moderado";
      } else if (consumoInicial >= 21) {
        consumoAlcohol = "Alto";
      }
    }

    // Actualizar los valores del usuario en la base de datos
    user.consumoAlcohol = consumoAlcohol;

    await user.save(); // Guardamos los cambios

    // Responder con éxito
    return res.status(200).json({
      status: true,
      message: "Datos de usuario actualizados STU correctamente",
      user: {
        email: user.email,
        consumoAlcohol: user.consumoAlcohol,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error en el servidor" });
  }
};

//getters para hacer el calculo del STU invocado
exports.getUnidadesAlcoholByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ unidadesAlcohol: user.unidadesAlcohol });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

exports.getConsumoPorDiasByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ consumoPorDias: user.consumoPorDias });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

exports.getFrecuenciaSemanalByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ frecuenciaSemanal: user.frecuenciaSemanal });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

exports.getConsumoAlcoholByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ consumoAlcohol: user.consumoAlcohol });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};
