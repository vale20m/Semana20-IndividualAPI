// Aquí establecemos como se maneja la logica de las peticiones

// Importamos el archivo "dataModel"

const dataModel = require("../models/dataModel");

// Manejamos las peticiones del GET general

const getData = async (req, res) => {
    
    const data = await dataModel.getData();
    res.json(data);

}


// Manejamos las peticiones del GET por id

const getDataById = async (req, res) => {

    const data = await dataModel.getDataById(req.params.id);
    res.json(data[0]);

}


// Manejamos las peticiones del POST

const postData = async (req, res) => {

    const newData = await dataModel.postData(req.body);
    res.json(newData[0]);

}


// Manejamos las peticiones del PUT

const putData = async (req, res) => {

    const updatedData = await dataModel.putData(req.body, req.params.id);
    return res.json(updatedData[0]);

}


// Manejamos las peticiones del DELETE

const deleteData = async (req, res) => {

    const deletedData = await dataModel.deleteData(req.params.id);
    res.json(deletedData[0]);


}


module.exports = {
    getData,
    getDataById,
    postData,
    putData,
    deleteData
}