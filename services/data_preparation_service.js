const { translateToEnglish } = require("../services/traslation_service.js");

class DataPreparationService {
  normalizeData(value, mapping) {
    return mapping.hasOwnProperty(value) ? mapping[value] : 0; // Si no existe, devuelve 0 por defecto
  }

  prepareDataForModel(userData) {
    // Convertir el objeto de usuario a un array para usar translateToEnglish
    const userDataArray = [userData];
    const translatedData = translateToEnglish(userDataArray)[0];

    // Mapas de normalización
    const genderMap = { Male: 1, Female: 0, Other: 2 };
    const regionMap = { Rural: 0, Urban: 2, Suburban: 1 };
    const exerciseMap = { Low: 1, Moderate: 2, High: 0 };
    const activityMap = { Low: 1, Moderate: 2, High: 0 };
    const alcoholMap = { None: 3, Low: 1, Moderate: 2, Heavy: 0 };
    const dietMap = { Healthy: 0, Unhealthy: 2, Mixed: 1 };
    const occupationMap = {
      Employed: 0,
      Unemployed: 3,
      Retired: 1,
      Student: 2,
    };
    const drinkMap = {
      "Sparkling wine": 3,
      Wine: 5,
      Vodka: 4,
      Brandy: 1,
      Beer: 0,
      Water: -1,
    };

    // Crear el objeto con los nombres exactos del dataset, asegurando que los valores sean numéricos
    const preparedData = {
      Age: Number(userData.edad) || 0,
      Gender: this.normalizeData(translatedData.genero, genderMap),
      Region: this.normalizeData(translatedData.localidad, regionMap),
      BMI: Number(userData.bmi) || 0,
      Heart_Rate: Number(userData.ratioCorazon) || 0,
      Exercise_Level: this.normalizeData(
        translatedData.nivelEjercicio,
        exerciseMap
      ),
      Smoking: translatedData.cigarrillo === "True" ? 1 : 0,
      Alcohol_Consumption: this.normalizeData(
        translatedData.consumoAlcohol,
        alcoholMap
      ),
      Diabetes: translatedData.diabetes === "True" ? 1 : 0,
      Family_History: translatedData.familiarEnfermo === "True" ? 1 : 0,
      Stress_Level: Number(userData.estres) || 0,
      Heart_Attack: translatedData.ataqueCardiaco === "True" ? 1 : 0,
      Heart_Disease_History:
        translatedData.enfermedadCardiaca === "True" ? 1 : 0,
      Diet: this.normalizeData(translatedData.nivelDieta, dietMap),
      Sleep_Hours: Number(userData.horasSuenio) || 0,
      Occupation: this.normalizeData(translatedData.ocupacion, occupationMap),
      Physical_Activity: this.normalizeData(
        translatedData.actividadFisica,
        activityMap
      ),
      Daily_Water_Intake: Number(userData.consumoAgua) || 0,
      Obesity: translatedData.obesidad === "True" ? 1 : 0,
      type_drink: this.normalizeData(translatedData.tipoBebida, drinkMap),
      Cause_name: translatedData.Causa,
    };

    console.log("Datos normalizados:", preparedData);

    return preparedData;
  }
}

module.exports = new DataPreparationService();