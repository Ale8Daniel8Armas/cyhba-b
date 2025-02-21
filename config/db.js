const mongoose = require("mongoose");
const password = encodeURIComponent("#Barcelona2002");
const database = encodeURIComponent("users");

// Cadena de conexión a MongoDB Atlas
const uri = `mongodb+srv://alejodany02:${password}@cyhbacluster.ngjmz.mongodb.net/${database}?retryWrites=true&w=majority&appName=CyhbaCluster`;

// Conexión a MongoDB Atlas
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Exportar la conexión de mongoose
module.exports = mongoose;
