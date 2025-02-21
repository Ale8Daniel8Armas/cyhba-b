const UserModel = require("../model/user_model.js");
const jwt = require("jsonwebtoken");

class UserService {
  static async registerUser(email, password) {
    try {
      const user = new UserModel({
        email: email.toLowerCase(),
        password: password,
      });

      const savedUser = await user.save();

      const { password: _, ...userWithoutPassword } = savedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async checkuser(email) {
    try {
      return await UserModel.findOne({ email: email.toLowerCase() });
    } catch (err) {
      throw err;
    }
  }

  static async generateToken(tokenData, secretkey, jwt_expire) {
    return jwt.sign(tokenData, secretkey, { expiresIn: jwt_expire });
  }

  static async verifyPassword(user, password) {
    try {
      console.log("Verifying password for user:", user.email);
      const isMatch = await user.comparePassword(password);
      console.log("Password verification result:", isMatch);
      return isMatch;
    } catch (error) {
      throw error;
    }
  }

  // Función para actualizar nombre, edad y género
  static async updateUserDataByAgeNameGender(
    email,
    nombre,
    edad,
    genero,
    isProfileComplete
  ) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar solo los valores proporcionados
      if (nombre) user.nombre = nombre;
      if (edad) user.edad = edad;
      if (genero) user.genero = genero;
      if (isProfileComplete) user.isProfileComplete = isProfileComplete;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar localidad y ocupacion
  static async updateUserDataByLocalOcupation(email, localidad, ocupacion) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar solo los valores proporcionados
      if (localidad) user.localidad = localidad;
      if (ocupacion) user.ocupacion = ocupacion;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  static async updateUserDataByAgeNameGender(
    email,
    nombre,
    edad,
    genero,
    isProfileComplete
  ) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Validar isProfileComplete para asegurarnos que sea un valor booleano
      if (isProfileComplete !== undefined && isProfileComplete !== null) {
        user.isProfileComplete = Boolean(isProfileComplete); // Convertir a booleano
      } else {
        user.isProfileComplete = false; // Si no se pasa, se pone en false
      }

      // Actualizar solo los valores proporcionados
      if (nombre) user.nombre = nombre;
      if (edad) user.edad = edad;
      if (genero) user.genero = genero;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar los datos de la salud historica
  static async updateUserDataBySaludHistorico(
    email,
    familiarEnfermo,
    enfermedadCardiaca,
    diabetes,
    obesidad
  ) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(
          "Usuario no encontrado en los datos de salud historico"
        );
      }

      // Actualizar solo los valores proporcionados
      if (familiarEnfermo) user.familiarEnfermo = familiarEnfermo;
      if (enfermedadCardiaca) user.enfermedadCardiaca = enfermedadCardiaca;
      if (diabetes) user.diabetes = diabetes;
      if (obesidad) user.obesidad = obesidad;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar presion y colesterol
  static async updateUserDataByPressureColesterol(email, presion) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado para la presion y colesterol");
      }

      // Actualizar solo los valores proporcionados
      if (presion) user.presion = presion;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar niveles de ejercicio
  static async updateUserDataByExerciseHabits(
    email,
    nivelEjercicio,
    actividadFisica
  ) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(
          "Usuario no encontrado para el nivel de ejercicio y actividad"
        );
      }

      // Actualizar solo los valores proporcionados
      if (nivelEjercicio) user.nivelEjercicio = nivelEjercicio;
      if (actividadFisica) user.actividadFisica = actividadFisica;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar dieta y consumo de agua
  static async updateUserDataByDietWater(email, nivelDieta, consumoAgua) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(
          "Usuario no encontrado para el nivel de dieta y consumo de agua"
        );
      }

      // Actualizar solo los valores proporcionados
      if (nivelDieta) user.nivelDieta = nivelDieta;
      if (consumoAgua) user.consumoAgua = consumoAgua;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar el nivel de estres y las horas de sueño
  static async updateUserDataByStressDream(email, estres, horasSuenio) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(
          "Usuario no encontrado para el nivel de estres y horas de sueño"
        );
      }

      // Actualizar solo los valores proporcionados
      if (estres) user.estres = estres;
      if (horasSuenio) user.horasSuenio = horasSuenio;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar el estado del corazon
  static async updateUserDataByHeartState(email, ataqueCardiaco, ratioCorazon) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado para el estado del corazon");
      }

      // Actualizar solo los valores proporcionados
      if (ataqueCardiaco) user.ataqueCardiaco = ataqueCardiaco;
      if (ratioCorazon) user.ratioCorazon = ratioCorazon;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar el tipo de bebida
  static async updateUserDataByBeverage(email, tipoBebida) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado para el tipo de bebida");
      }

      // Actualizar solo los valores proporcionados
      if (tipoBebida) user.tipoBebida = tipoBebida;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar el unidades alcohol y consumo x dias
  static async updateUserDataUnitsAlcohol(
    email,
    unidadesAlcohol,
    consumoPorDias
  ) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado para el ST");
      }

      // Actualizar solo los valores proporcionados
      if (unidadesAlcohol) user.unidadesAlcohol = unidadesAlcohol;
      if (consumoPorDias) user.consumoPorDias = consumoPorDias;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar la frecuenca de alcohol
  static async updateUserDataBySemanalFrecuency(email, frecuenciaSemanal) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado para la frecuencia");
      }

      // Actualizar solo los valores proporcionados
      if (frecuenciaSemanal) user.frecuenciaSemanal = frecuenciaSemanal;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Función para actualizar el consumo de cigarrillo o tabaco
  static async updateUserDataBySmoking(email, cigarrillo) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado para la tasa de smoke");
      }

      // Actualizar solo los valores proporcionados
      if (cigarrillo) user.cigarrillo = cigarrillo;

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
