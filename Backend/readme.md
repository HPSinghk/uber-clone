# User Registration API

## Endpoint
`POST /users/register`

## Description
This endpoint allows a new user to register by providing their details. Upon successful registration, a JSON Web Token (JWT) is generated and returned along with the user information.

## Request Body
The request body must be in JSON format and should include the following fields:

```json
{
    "fullName": {
        "firstName": "string (min: 5 characters)",
        "lastName": "string (optional)"
    },
    "email": "string (must be a valid email address)",
    "password": "string (min: 6 characters)"
}