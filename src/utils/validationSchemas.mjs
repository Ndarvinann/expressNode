// for validation of all routes to get cleaner code.
// just like css, validation only code can be deleted from our index file, and the new file with just the validation of feilds can be linked via the schema files. go to import.
export const UserValidationSchema = {
    username:{
       isLength: {
        options: {
            min:5,
            max:32,
        },
        errorMessage: 'user must be at least 5 characters long',
       },
       notEmpty:{
        errorMessage : "username cannot be empty"
       },
       isString :{
        errorMessage : 'username cannot be like that!'
       },
    },
    displayName:{
      notEmpty: true
    }
    
};