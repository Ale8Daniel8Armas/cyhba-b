const { translateToEnglish } = require("./traslation_service.js");

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
    const regionMap = { Rural: 0, Urban: 1, Suburban: 2 };
    const exerciseMap = { Low: 0, Moderate: 1, High: 2 };
    const activityMap = { Low: 0, Moderate: 1, High: 2 };
    const alcoholMap = { None: 0, Low: 1, Moderate: 2, Heavy: 3 };
    const dietMap = { Healthy: 1, Unhealthy: 0, Mixed: 2 };
    const occupationMap = {
      Employed: 2,
      Unemployed: 0,
      Retired: 1,
      Student: 3,
    };
    const drinkMap = {
      "Sparkling wine": 0,
      Wine: 1,
      Vodka: 2,
      Brandy: 3,
      Beer: 4,
      Water: 5,
    };

    // Crear el objeto con los nombres exactos del dataset, asegurando que los valores sean numéricos
    const preparedData = {
      Age: Number(userData.edad) || 0,
      Gender: this.normalizeData(translatedData.genero, genderMap),
      Region: this.normalizeData(translatedData.localidad, regionMap),
      Blood_Pressure: Number(userData.presion) || 0,
      Cholesterol: 200, // Valor por defecto
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
