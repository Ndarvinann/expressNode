import express from 'express';
import {query, validationResult, body,matchedData, checkSchema } from 'express-validator';
import {UserValidationSchema} from './utils/validationSchemas.mjs'
import usersRouter from "./routes/users.mjs";


const app = express();

//middleware --bridge between incoming requests and responses
app.use(express.json());
//other middleswares, eg, url encoded, usually works when data from forms needs to be parsed.
app.use(usersRouter);

const loggingMiddleWare = (req, res,next)=>{ // for every request, log get/post /api/users.
    // request-->loggingMiddleware-->route Handler--> Response
console.log(`Incoming ${req.method} request to  ${req.url}`); // logs methods (Get/Post)+ URL
next(); // passes conrol to the next middleware route
};
//logging middleware globally to all routes
app.use(loggingMiddleWare);
//specific route wuth additional middleware (app.get runs ONLY get requests, app.use runs ALL requests)
// app.get("/", loggingMiddleWare, (req,res)=>{
//     res.status(201).send({msg : "Hey Darvin"});
// });

// middleWare to find user index by ID
const resolveIndexById = (req, res, next )=>{ //this is reusable across routes(get,put,delete) the delete route could become,
    // app.delete('/users/:id', resolveIndexById, (req, res) => {
    //       mockUsers.splice(req.findUserIndex, 1);
    //       res.sendStatus(204);
    //     }
    //   );
    const { params : {id}} = req;
    const parsedID = parseInt(id);
    if(isNaN(parsedID)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user)=> user.id === parsedID);
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;// this makes it available to all subsequnet route handlers in the chain.
    next(); 
    //this middleware 1. extracts Id from URL params. 2. validates the ID(check if its a number) 3. finds the user index in the provided array. 4. attaches the found index to the req.object.
};
// runs only for specific http methods. ie get, post, put, etc.. doesnt need a next as its only getting. 
 app.get( "/", (req , res, next)=> {
    console.log("base url 1");
    res.status(200).send({msg: "hello"}); 
 });
// midleware needs to be called at the end of every set up method, to use the 'next' function, otw it doesnt work. order matters.
//routing with validation
app.get("/",  usersRouter); //experimenting with routes.
//     query('filter')// validation syntax. this validates that
//     .isString()//its a string 
//     .notEmpty()// its not empty
//     .isLength({min:5, max:10})
//     .withMessage('must not be'), // has between 5-10 characters
//     (req, res) => { // this is a route(/), req is a request handler, and res is a response handler from the web.
//         const errors = validationResult(req);
//         if(!errors.isEmpty()){
//             return res.status(400).send({ errors: errors.array()});
//         }
//         console.log(errors); // extract and log errors, the query filter doesnt throw errors. they are handled by the console manually. 
//     res.status(201).send('validation passesd!'); //order matters as validations run before the route handler
// });
app.get("/api/users", (req, res) => {
    const { filter, value } = req.query
    if (!filter || !value) {
        return res.send(mockUsers);
    }
    const filteredUsers = mockUsers.filter(user =>
        String(user[filter]).toLowerCase().includes(String(value).toLowerCase())
    );
    res.send(filteredUsers);
});
//route parameters--used to get specific info, using a unique identifier--
app.get("/api/users/:id", (req, res) => { //i want the "id" field to return a number.
    //console.log(req.params);
    //parse id from url params
    const parsedId = parseInt(req.params.id)
    //console.log(parsedId);
    // check if ID is a valid number
    if (isNaN(parsedId)) {
        return res.status(400).send({ msg: "Bad request.Invalid Id." });
        // res.send(`id: ${req.params}`);
    }
    // find user in mock data
    const findUser = mockUsers.find((user) => user.id === parsedId);
    // handle user not found.
    if (!findUser) {
        return res.sendStatus(404);
    }
    // return the found user
    return res.send(findUser);
});

//Add new user 
// using post requests-- usually getting client side requests(submit) and sending them to the back end. 
app. post("/api" , usersRouter)
// app.post("/api/users", checkSchema(UserValidationSchema),
//      // validation
//         (req, res) => { // route definition
//         const errors= validationResult(req);
// console.log("validation Errors:", errors.array());
// // if(!errors.isEmpty())
// //     return res.status(400).send({errors: errors.array()});
//     const { body } = req;// extracts the body property from req. body is the data sent by the client.
//     // console.log(req.body)//logs the parsed incoming req body to the server
//     // }
//     //const data = matchedData(req)--> this is preferred to 'const body'
    
//     // auto-increment id
//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };// create a new user and auto increase the Id (...body copies all the properties from the req. body)
//     mockUsers.push(newUser); // add new users to mockDatabase
//     res.status(201).send(newUser)// send a sucess res. with the new user. exits the function.
// });

// more routing.
app.get("/api/products", (req, res) => {
    res.send([{ id: 123, name: "chickenBreast", Price: 15.99 }])
});

//querry strings(?) for obtaining already processed data from one page to another. e.g alphabetised 'usernames' from mockUsers. also for filtering through data( i want user names with the name "a").
app.get("/api/users", (req, res) => { //set up a get end point, req is data from the client. res sends data back to the client.
    const { filter, value } = req.query// extracts the filter and value from url query parameters. e.g(/api/users?filter=name&value=john)
    //re.query ={filter: name, value: John }
    //if filter and value are undefined
    if (!filter || !value) {// checks if both are falsy( undefined, empty, null )
        return res.send(mockUsers);// if true, return all mockUsers array as response.
    }
    //filter users(case-insensitive + error-safe)
    const filteredUsers = mockUsers.filter(user =>
        user[filter].includes(value) // filters the mockUsers Array to find the matching creteria. includes(value) checks if property contains value(case-sensitive)
    );

    res.send(mockUsers); // send the filtered list of users back as the http response.
});
//patch-- partially updates a user record. eg just the user name.
//put--updates the entire resource, every single field. 
//delete-- removes something from the database.

//put method, just the ID.
app.put("/api/users/:id", (req, res) => {// route definition. update an existing user by id.
    const { //destructuring req. extracts "body" and id from the existing array.
        body,
        params: { id },
    } = req;
    // make sure they are only intergers
    const parsedId = parseInt(id);// convert id from a string to an integer. 
    if (isNaN(parsedId))
        return res.sendStatus(400); // if the id isnt a number, return 400.
    const findUserIndex = mockUsers.findIndex( //find users index. search mockUsers for the matching id.
        (user) => user.id === parsedId);
    if (!findUserIndex === -1) // return -1 if the user doesnt exist.
        return res.sendStatus(404); // if no user is found, return 404.
    mockUsers[findUserIndex] = { id: parsedId, ...body };  // overwrite the user at findUserIndex with the original id, and the new input data frpm body.
    res.status(200).send(mockUsers[findUserIndex]); // send a success response to confirm update and the updated user. 
});

//patch Requests-- allows us to update things partially.
app.patch("/api/users/:id", (req, res) => {
    const {body, // destructure the body
    params: { id },
    } = req;
    // make sure they are only intergers
    const parsedId = parseInt(id);//make sure its a number 
    if (isNaN(parsedId)) // if its not a number 
        return res.sendStatus(400); //return this error
    const findUserIndex = mockUsers.findIndex( // fidn users by the id index
        (user) => user.id === parsedId); // find the user
    if (findUserIndex === -1) // return -1 if the user isnt available
        return res.sendStatus(404); // send a 404 error code.
    mockUsers[findUserIndex] = {
        ...mockUsers[findUserIndex],//use of the spread operators(...) keep existing properties by creating a copy of existing objects
        ...body
    }; // overrides with new properties from the request. by copying the properties from the request
    res.status(200).send(mockUsers[findUserIndex]); // return the updated new user + a success code.
});
//delete Request method
app.delete("/api/users/:id", (req, res) => {
    // dont usually have to parse things in the delete.
    const { id } = req.params; //destructre id directly, no need for body
    // convert string to ID number
    const parsedId = parseInt(id);
    if (isNaN(parsedId))// check if ID is valid
        return res.status(400).send({ error: "invalid ID" }); //status report and error message
    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);// find the user index
    if (findUserIndex === -1) // if user index doesnt exist
        return res.status(404).send({ error: "user not found" }); // user not found.
    mockUsers.splice(findUserIndex, 1);// remove user from array
    res.status(200).send({ sucess: true }); //confirm deletion 
});

const PORT = process.env.PORT || 3004; // setting this up to allow our work to upload with the easiest port of 3004.

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

