const app = require("./app.js");
const db = require("./config/db.js");
const userModel = require("./user_model.js");

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hola Mundo !!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
