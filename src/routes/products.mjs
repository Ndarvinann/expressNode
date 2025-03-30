import { Router } from "express";
import {query, validationResult, checkSchema} from "express-validator";
import {UserValidationSchema} from "../utils/validationSchemas.mjs"
import { mockProducts, mockUsers } from "../utils/mock.mjs";
import session from "express-session";
const router = Router();


//cookie tester for postman
router.get("/set-test-cookie", (req,res)=> {
    // console.log(res.session);
    // console.log(req.session.id)set a signed copy
    req.session.visited = true; //sets a visited flag in the session store and persists across requests
    req.sessionStore.get(req.session.id, (err , sessionData)=>{ //session storage look up. sessionStore is the storage and get()retrives session data by ID.
        if(err){// error handling. logs the storage errors
            console.log(err);
            throw err;// stops execution.
        }
    });
    // cookie setting + parameters
    res.cookie("test_cookie", "cookie_Value" ,{maxAge:90000*60, signed : true // this is a signed cookie that was given "angela" reference. not all the cookies in yur project should be signed, but thats how to do it. from the app.cookieuse.
    });
    // the response.
    res.send("Cookie set!")
});//1.hit set-test-cookie 2. server: updates session data,verifies session storage, sets a signed cookie, sends confirmation. 3. client: res-body('cookie set'), two set-cookie headers. rememberto encrypt your cookie.

router.get("/api/products", (req, res) =>{
    if (req.signedCookies.test_cookie ==="cookie_value"){
        return res.send([{id: 123, name: "product"}]);
}
    // console.log(req.headers.cookie);
    // console.log(req.cookies);
    // console.log(req.signedCookies.hello);

// && req.signedCookies.hello === "world")
    //res.status(200).send([mockProducts])
res.status(403).send({msg : "Need a validation cookie"});
//.status(403)
//.send({msg : "sorry. you need the correct cookie"});
});

 export default router;