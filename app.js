// Utilizamos el framework y la instancia de express 

const express = require("express");
const app = express();

// Lo relacionamos con la base de datos

const mariadb = require("mariadb");
const pool = mariadb.createPool({host:"localhost", user:"root", password:"1234", database:"planning", connectionLimit: 5});

// Traemos el framework para agregar la autenticación

const jwt = require("jsonwebtoken");
const SECRET_KEY = "CLAVE ULTRA SECRETA"; // Clave que utiliza el servidor para verificar que el token sea valido


// Importamos los archivos mediante require

const dataController = require("./controllers/dataController");
const dataRouter = require("./routes/dataRoute");


// Especificamos el puerto

const port = 3000;

app.use(express.json());

// Funciones para el funcionamiento de los métodos HTTP

// Sin esta función, el servidor no puede recibir peticiones

app.listen(port, () => {

    console.log(`Servidor ejecutándose en http://localhost:${port}`);

});

// Función que muestra el mensaje inicial del servidor

app.get("/", (req, res) => {

    res.send("<h1>Bienvenid@ al sistema!</h1>");

});


// Agregamos el codigo relacionado al login

// app.use("/login", )


// Agregamos un metodo POST para mayor seguridad

app.post("/login", (req, res) => {

    // Recibimos el usuario y la contraseña del body

    const {username, password} = req.body;

    if (username == "admin" && password == "admin"){
        const token = jwt.sign({username}, SECRET_KEY);
        res.status(200).json({token});
    } else {
        res.status(401).json({message: "Usuario y/o contraseña incorrecto"});
    }

});

// Analiza la peticion antes de ejecutarla, verificando si la peticion es valida o invalida

app.use("/data", (req, res, next) => {

    try {
    
        const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
        console.log(decoded);
        next();

    } catch (error) {
    
        res.status(401).json({message: "Usuario no autorizado"});
    
    }

});

// Hace que segun el metodo HTTP elegido, realiza una de las funciones del archivo dataRoute.js

app.use("/data", dataRouter);




// Este codigo ya no es necesario

// // Función que muestra todos los elementos de la tabla al realizar GET

// app.get("/data", dataController.getData);

// // Función que muestra el elemento cuya id es igual a la especificada en la URL

// app.get("/data/:id", dataController.getDataById);

// // Función que agrega una fila al final de la tabla mediante POST

// app.post("/data", dataController.postData);

// // Función que actualiza los datos de una fila especificada mediante PUT

// app.put("/data/:id", dataController.putData);

// // Función para eliminar una fila especificada mediante DELETE

// app.delete("/data/:id", dataController.deleteData);