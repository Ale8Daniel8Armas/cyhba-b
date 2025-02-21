function calculateBMI(peso, altura) {
  if (peso <= 0 || altura <= 0) {
    throw new Error("El peso y la altura deben ser valores positivos");
  }
  return peso / (altura * altura); // Fórmula BMI
}

module.exports = calculateBMI;
