define({ "api": [
  {
    "type": "POST",
    "url": "/api/file/upload",
    "title": "Authenticate User",
    "name": "UploadFile",
    "group": "File",
    "parameter": {
      "fields": {
        "Request Body": [
          {
            "group": "Request Body",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>File that user wishes to upload</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "owner",
            "description": "<p>User email - owner of the uploaded file</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "passcode",
            "description": "<p>User inputted password to be used in encryption/decryption of file</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 Response": [
          {
            "group": "201 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "201 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ],
        "400 Response": [
          {
            "group": "400 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "400 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/main/routes/api/file/upload.js",
    "groupTitle": "File"
  },
  {
    "type": "POST",
    "url": "/api/user/authenticate",
    "title": "Authenticate User",
    "name": "AuthenticateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Request Body": [
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Mandatory email associated with account</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mandatory password associated with account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 Response": [
          {
            "group": "200 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "200 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          },
          {
            "group": "200 Response",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization token associated with User</p>"
          },
          {
            "group": "200 Response",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID associated with User</p>"
          },
          {
            "group": "200 Response",
            "type": "JSON",
            "optional": false,
            "field": "user",
            "description": "<p>User object containing firstname, surname, and email</p>"
          }
        ],
        "400 Response": [
          {
            "group": "400 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "400 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ],
        "404 Response": [
          {
            "group": "404 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "404 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/main/routes/api/user/authenticate.js",
    "groupTitle": "User"
  },
  {
    "type": "DELETE",
    "url": "/api/user/{id}",
    "title": "Delete User",
    "name": "DeleteUser",
    "group": "User",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>User's unique bearer token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Query Param": [
          {
            "group": "Query Param",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mandatory ID assocaited with User account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/main/routes/api/user/account.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "/api/user/{id}",
    "title": "Get User",
    "name": "GetUser",
    "group": "User",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>User's unique bearer token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Query Param": [
          {
            "group": "Query Param",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mandatory ID assocaited with User account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 Response": [
          {
            "group": "200 Response",
            "type": "JSON",
            "optional": false,
            "field": "user",
            "description": "<p>User object</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/main/routes/api/user/account.js",
    "groupTitle": "User"
  },
  {
    "type": "POST",
    "url": "/api/user/register",
    "title": "Register new user",
    "name": "RegisterUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Request Body": [
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Mandatory Firstname of User</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>Mandatory Surname of User</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Mandatory email associated with account</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mandatory password associated with account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 Response": [
          {
            "group": "201 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "201 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ],
        "400 Response": [
          {
            "group": "400 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "400 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ],
        "409 Response": [
          {
            "group": "409 Response",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success state of operation</p>"
          },
          {
            "group": "409 Response",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Description of response</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/main/routes/api/user/register.js",
    "groupTitle": "User"
  }
] });
