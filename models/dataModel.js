// Aqui va el codigo relacionado con el manejo de la base de datos

const mariadb = require("mariadb");
const pool = 
mariadb.createPool({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"planning",
    connectionLimit: 5
});


// Tomamos las funciones anteriormente de app.js y las guardamos en variables para organizarlas

// Funcion que retorna todos los elementos de la database

const getData = async () => {

    let conn;
    try {

        conn = await pool.getConnection();

        // Mostramos todas las filas de la tabla

        const rows = await conn.query("SELECT * FROM todo");
        return rows;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return false;

}

// Función que retorna el elemento con la id especificada de la database

const getDataById = async (id) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Mostramos una de las filas de la tabla (según su ID)

        const row = await conn.query("SELECT * FROM todo WHERE id=?", [id]);
        
        return row;
    
    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return false;

}

// Función que retorna el elemento agregado a la base de datos

const postData = async (body) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Agregamos un elemento a la tabla

        const addElement = await conn.query(`INSERT INTO todo (name, description, created_at, updated_at, status)
        VALUES (?, ?, ?, ?, ?)`, [body.name, body.description, body.created_at, body.updated_at, body.status]);

        // Retornamos el nuevo elemento

        return { id: parseInt(addElement.insertID), ...body };
    
    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return false;

}

// Función que actualiza la informacion del elemento especificado por su id

const putData = async (body, id) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Actualizamos un elemento de la tabla (según su ID)

        const updateData = await conn.query(`UPDATE todo SET name=?, description=?, created_at=?, updated_at=?, status=?
        WHERE id=?`, [body.name, body.description, body.created_at, body.updated_at, body.status, id]);
        
        // Guardamos el elemento actualizado en una variable

        const updatedElement = await conn.query(`SELECT * FROM todo WHERE id=?`, [id]);

        // Mostramos el elemento actualizado

        return updatedElement;
    
    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return false;

}

// Funcion que elimina el elemento especificado por su id

const deleteData = async (id) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Mostramos el elemento a ser quitado

        const element = await conn.query("SELECT * FROM todo WHERE id=?", [id]);

        // Quitamos el elemento de la tabla

        const deleteElement = await conn.query(`DELETE FROM todo WHERE id=?`, [id]);
    
        return element;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return false;

}


module.exports = {
    getData,
    getDataById,
    postData,
    putData,
    deleteData
}