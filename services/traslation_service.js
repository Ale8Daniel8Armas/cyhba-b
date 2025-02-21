const translations = {
  genero: { Masculino: "Male", Femenino: "Female", Otro: "Other" },
  localidad: { Rural: "Rural", Urbano: "Urban", SubUrbano: "Suburban" },
  nivelEjercicio: { Bajo: "Low", Moderado: "Moderate", Alto: "High" },
  actividadFisica: { Bajo: "Low", Moderado: "Moderate", Alto: "High" },
  cigarrillo: { Si: "True", No: "False" },
  consumoAlcohol: {
    Nada: "None",
    Bajo: "Low",
    Moderado: "Moderate",
    Alto: "Heavy",
  },
  nivelDieta: {
    Saludable: "Healthy",
    "No saludable": "Unhealthy",
    Regular: "Mixed",
  },
  ocupacion: {
    Empleado: "Employed",
    Desempleado: "Unemployed",
    Jubilado: "Retired",
    Estudiante: "Student",
  },
  obesidad: { Si: "True", No: "False" },
  diabetes: { Si: "True", No: "False" },
  familiarEnfermo: { Si: "True", No: "False" },
  enfermedadCardiaca: { Si: "True", No: "False" },
  ataqueCardiaco: { Si: "True", No: "False" },
  tipoBebida: {
    "Vino espumoso": "Sparkling wine",
    Vino: "Wine",
    Vodka: "Vodka",
    Aguardiente: "Brandy",
    Cerveza: "Beer",
    "Agua (no tomo)": "Water", //falta agregar el ñider
  },
  Causa: {
    "Enfermedad arterial periférica en extremidades inferiores":
      "Lower extremity peripheral arterial disease",
    "Aneurisma aórtico": "Aortic aneurysm",
    Endocarditis: "Endocarditis",
    "Enfermedad cardíaca isquémica": "Ischemic heart disease",
    "Derrame cerebral": "Stroke",
    "Hipertensión arterial pulmonar": "Pulmonary Arterial Hypertension",
    Miocarditis: "Myocarditis",
  },
};

const translateToEnglish = (data) => {
  return data.map((entry) => {
    let translatedEntry = { ...entry };

    Object.keys(translations).forEach((field) => {
      if (
        translatedEntry[field] &&
        translations[field][translatedEntry[field]]
      ) {
        translatedEntry[field] = translations[field][translatedEntry[field]];
      }
    });

    return translatedEntry;
  });
};

module.exports = { translateToEnglish };
