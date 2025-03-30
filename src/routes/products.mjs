import { response, Router } from "express";
import {query, validationResult, checkSchema} from "express-validator";
import {UserValidationSchema} from "../utils/validationSchemas.mjs"
import { mockProducts, mockUsers } from "../utils/mock.mjs";
const router = Router();

router.get("/set-test-cookie", (req,res)=> {
    res.cookie("test_cookie" , "wasap",{
        maxAge :90000,
        signed : true // this is a signed cookie that was given "angela" reference. not all the cookies in yur project should be signed, but thats how to do it. from the app.cookieuse.
    });
    res.send("Cookie set!")
});

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies.hello);
    if (req.signedCookies.hello && req.signedCookies.hello === "world")
    res.send([mockProducts])
return res
.status(403)
.send({msg : "sorry. you need the correct cookie"});
});
 export default router;