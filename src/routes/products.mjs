import { Router } from "express";
import {query, validationResult, checkSchema} from "express-validator";
import {UserValidationSchema} from "../utils/validationSchemas.mjs"
import { mockProducts, mockUsers } from "../utils/mock.mjs";
const router = Router();


router.get("/api/products", (req, res) => {
    res.status(200).send([mockProducts])
});
