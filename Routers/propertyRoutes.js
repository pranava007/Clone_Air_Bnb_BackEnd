import express from "express";
import { createProperty, getProperty } from "../Controllers/propertyController.js";

const propertrouter = express.Router()

propertrouter.post('/createProperty',createProperty)
propertrouter.get('/getproperty',getProperty)

export default propertrouter