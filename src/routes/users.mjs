// just like we separated our validation logic with schema, this one is for the routes. they all cant go to the index page. go to your index page and get everything that has app.(get, post,put.patch)


import { Router } from "express";
import {query, validationResult, checkSchema} from "express-validator";
import {UserValidationSchema} from "../utils/validationSchemas.mjs"
import { mockUsers } from "../utils/mock.mjs";
const router = Router();


//this helps keep the code in the index file clean, in places where we have these things in detail, a small app.use("/api", router) if well exported to the index file, could keep the code cleaner. also, ifwhat you are building has users, products, admins, but all the bulk of the work here, and just referencing the file keeps it organised. the app.get is a strict specific route. route.get/post/delete can be done for 1.users, then again for products, and then referenced as middleware in the indexfile. this file contains all routes pertaining to the "user page"
router.get("/api/users",
    query('filter') //could be solved by validationschemas.
        .isString()
        .notEmpty()
        .isLength({ min: 5, max: 10 })
        .withMessage('must not be'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }
        console.log(errors);
        res.status(201).send('validation passed!'); 
    });

    router.post("/api/users", checkSchema(UserValidationSchema), //could be made shorter by a "mockuser" import
         // validation
            (req, res) => { // route definition
            const errors= validationResult(req);
    console.log("validation Errors:", errors.array());
        const { body } = req;
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
        mockUsers.push(newUser);
        res.status(201).send(newUser)
    });

    router.put("/api/users/:id", (req, res) => {
        const { //checkSchema , resolveIndexById.
            body,
            params: { id },
        } = req;
        const parsedId = parseInt(id);
        if (isNaN(parsedId))
            return res.sendStatus(400); 
        const findUserIndex = mockUsers.findIndex(
            (user) => user.id === parsedId);
        if (!findUserIndex === -1)
            return res.sendStatus(404); 
        mockUsers[findUserIndex] = { id: parsedId, ...body };
        res.status(200).send(mockUsers[findUserIndex]); 
    });
    router.patch("/api/users/:id", (req, res) => {
        const {body, 
        params: { id },
        } = req;
        const parsedId = parseInt(id);
        if (isNaN(parsedId))
            return res.sendStatus(400); 
        const findUserIndex = mockUsers.findIndex( 
            (user) => user.id === parsedId);
        if (findUserIndex === -1) 
            return res.sendStatus(404);
        mockUsers[findUserIndex] = {
            ...mockUsers[findUserIndex],
            ...body
        };
        res.status(200).send(mockUsers[findUserIndex]); 
        // //router.patch("/api/users/:id", resolveIndexByUserId, (req,res)=>{
        //     const {body , findUserIndex} = req;
        //     mockUsers[findUserIndex]={...mockusers[finsUserIndex], ...body};
        //     return res.sendStatus(200);
        // });
    });


    router.delete("/api/users/:id", (req, res) => {
        const { id } = req.params; 
        const parsedId = parseInt(id);
        if (isNaN(parsedId))
            return res.status(400).send({ error: "invalid ID" }); 
        const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
        if (findUserIndex === -1)
            return res.status(404).send({ error: "user not found" });
        mockUsers.splice(findUserIndex, 1);
        res.status(200).send({ sucess: true });
    });
//     //router.delete("/api/users/:id", resolveIndexByUserId, (req,res)=>{
//         const{ findUserIndex}=req;
//     mockUsers.splice(findUserIndex, 1);
// return res.sendStatus(200);
// });
   export default router;// expose this to other files to use these routes. 
     