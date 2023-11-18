// Utilizamos el framework y la instancia de express 

const express = require("express");
const app = express();

// Lo relacionamos con la base de datos

const mariadb = require("mariadb");
const pool = mariadb.createPool({host:"localhost", user:"root", password:"1234", database:"planning", connectionLimit: 5});

// Traemos el framework para agregar la autenticación

const jwt = require("jsonwebtoken");
const SECRET_KEY = "CLAVE ULTRA SECRETA"; // Clave que utiliza el servidor para verificar que el token sea valido

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


// Función que muestra todos los elementos de la tabla al realizar GET

app.get("/data", async (req, res) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Mostramos todas las filas de la tabla

        const rows = await conn.query("SELECT * FROM todo");
        
        res.json(rows);
    
    } catch(error) {

        // Se muestra un posible error

        console.log (error);
        res.status(500).json({message:"Se produjo un fallo en el sistema"});

    } finally {
        if (conn) conn.release();

    }

});

// Función que muestra el elemento cuya id es igual a la especificada en la URL

app.get("/data/:id", async (req, res) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Mostramos una de las filas de la tabla (según su ID)

        const rows = await conn.query("SELECT * FROM todo WHERE id=?", [req.params.id]);
        
        res.json(rows[0]);
    
    } catch(error) {

        // Se muestra un posible error

        console.log (error);
        res.status(500).json({message:"Se produjo un fallo en el sistema"});

    } finally {
        if (conn) conn.release();

    }

});

// Función que agrega una fila al final de la tabla mediante POST

app.post("/data", async (req, res) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Agregamos un elemento a la tabla

        const element = await conn.query(`INSERT INTO todo (name, description, created_at, updated_at, status)
        VALUES (?, ?, ?, ?, ?)`, [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status]);
        
        // Mostramos el elemento agregado

        res.json({ id: element.insertID, ...req.body });
    
    } catch(error) {

        // Se muestra un posible error

        console.log (error);
        res.status(500).json({message:"Se produjo un fallo en el sistema"});

    } finally {
        if (conn) conn.release();

    }

});

// Función que actualiza los datos de una fila especificada mediante PUT

app.put("/data/:id", async (req, res) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Actualizamos un elemento de la tabla (según su ID)

        const element = await conn.query(`UPDATE todo SET name=?, description=?, created_at=?, updated_at=?, status=?
        WHERE id=?`, [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status, req.params.id]);
        
        // Mostramos el elemento actualizado

        res.json({ id: element.insertID, ...req.body });
    
    } catch(error) {

        // Se muestra un posible error

        console.log (error);
        res.status(500).json({message:"Se produjo un fallo en el sistema"});

    } finally {
        if (conn) conn.release();

    }

});

// Función para eliminar una fila especificada mediante DELETE

app.delete("/data/:id", async (req, res) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Mostramos el elemento a ser quitado

        const rows = await conn.query("SELECT * FROM todo WHERE id=?", [req.params.id]);
        
        res.json(rows[0]);

        // Quitamos el elemento de la tabla

        const element = await conn.query(`DELETE FROM todo WHERE id=?`, [req.params.id]);
    
    } catch(error) {

        // Se muestra un posible error

        console.log (error);
        res.status(500).json({message:"Se produjo un fallo en el sistema"});

    } finally {
        if (conn) conn.release();

    }

});