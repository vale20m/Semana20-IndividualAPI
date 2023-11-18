// Colocamos todas las rutas (o endpoints) que interactuan con el servidor

const express = require("express");
const dataController = require("../controllers/dataController");
const dataRouter = express.Router();

dataRouter.get("/", dataController.getData);

dataRouter.get("/:id", dataController.getDataById);

dataRouter.post("/", dataController.postData);

dataRouter.put("/:id", dataController.putData);

dataRouter.delete("/:id", dataController.deleteData);

module.exports = dataRouter;