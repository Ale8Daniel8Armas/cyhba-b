// ml_service.js
const express = require("express");
const router = express.Router();
const User = require("./model/user_model");
const axios = require("axios");
const dataPreparationService = require("./services/data_preparation_service.js");

const ML_SERVICE_URL = "http://192.168.1.5:5000/predict";

router.post("/predict", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email es requerido" });
    }

    // Obtener datos del usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Preparar los datos usando el servicio de preparación
    const preparedData = dataPreparationService.prepareDataForModel(
      user.toObject()
    );

    console.log(preparedData);

    // Hacer la predicción
    const prediction = await axios.post(ML_SERVICE_URL, preparedData);

    return res.json({
      email: user.email,
      preparedData,
      prediction: prediction.data.prediction,
    });
  } catch (error) {
    console.error("Error en la predicción:", error);
    return res.status(500).json({
      message: "Error al realizar la predicción",
      error: error.message,
    });
  }
});

module.exports = router;
