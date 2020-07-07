The project provides an API for maintaining information about internship opportunities, and information about internees looking for new opportunities.

The server is developed in NodeJS; the database is MongoDB managed by the Mongoose ODM.

# About the API

The API provides encrypted data storage of all information. All communication with the API use SSL protocol with XSS protection.
Interactions with the API require authentication that's given based of the user's role (admin, internee, recruiter, HR etc.).
The API also uses geocoding which allows the use of location based search.

I hope you'll enjoy using this app as much as I enjoyed making it (:

# Using The API

## Usage

Rename the file `config/config.to_update.env` to `config/config.env` and update the values and settings in the file.

### Run the App

Install the dependencies

```
npm install
```

#### Run in Development Mode

```
npm run dev
```

#### Run in Production Mode

```
npm start
```

## API Documentation

Documentation for the API, created using Postman, can be found [here](https://documenter.getpostman.com/view/11046904/Szmk1FUm?version=latest).

## Databases

There are three main database collections:

- Users
- Companies
- Internships

#### Users

The _Users_ database holds information on all the users. There are four types of users roles:

- Intern
- Recruiter
- Company Admin
- Admin

Each company has one _Company Admin_ and can have several _Recruiters_.
The _Admin_ role can only be created manually by the owner of the service.

#### Companies

The _Companies_ database contains all information regarding the company, who is the admin and a list of the recruiters that work for the company.

#### Internships

The _Internships_ database contains all information regarding the internships. Each internship is associated with a company.

## Roles & Permissions

The following tables describe the permissions of each role and what CRUD function he/she can invoke on each database:

### Internships Database CRUD Permissions

|       Role        | CREATE | READ | UPDATE | DELETE |
| :---------------: | :----: | :--: | :----: | :----: |
|     Intern\*      |        |  X   |        |        |
|   Recruiter\*\*   |   X    |  X   |   X    |   X    |
| Company Admin\*\* |   X    |  X   |   X    |   X    |
|    Admin\*\*\*    |   X    |  X   |   X    |   X    |

### Companies Database CRUD Permissions

|       Role        | CREATE | READ | UPDATE | DELETE |
| :---------------: | :----: | :--: | :----: | :----: |
|     Intern\*      |        |  X   |
|   Recruiter\*\*   |        |  X   |
| Company Admin\*\* |   X    |  X   |   X    |   X    |
|    Admin\*\*\*    |   X    |  X   |   X    |   X    |

### Users Database CRUD Permissions

|       Role        |               Intern               |             Recruiter              |           Company Admin            |     Admin      |
| :---------------: | :--------------------------------: | :--------------------------------: | :--------------------------------: | :------------: |
|     Intern\*      | READ<br>CREATE<br>UPDATE<br>DELETE |                                    |
|    Recruiter\*    |                READ                | READ<br>CREATE<br>UPDATE<br>DELETE |                READ                |
| Company Admin\*\* |                READ                |      READ<br>CREATE<br>DELETE      | READ<br>CREATE<br>UPDATE<br>DELETE |                |
|    Admin\*\*\*    |      READ<br>CREATE<br>DELETE      |      READ<br>CREATE<br>DELETE      |      READ<br>CREATE<br>DELETE      | READ<br>UPDATE |

\* Applies only to itself and data owned by the user; e.g. an _Intern_ can only create an account for himself and update the information of his own account.  
\*\* Applies to all documents within a company  
\*\*\* Applies to all the documents in the database.

## Security

### XSS Security

The API uses two modules to protect against XSS attacks:

1. [Helmet](https://www.npmjs.com/package/helmet) - sets HTTP Headers that help protect against reflected XSS payload (non-persistent attacks).
2. [XSS Clean](https://www.npmjs.com/package/xss-clean) - protect against persistent attacks, e.g. injection of script into the database.

### NoSQL Injection Attacks Security

Protection against MongoDB operator injection is done using the [Express Mongoose Sanitize](https://www.npmjs.com/package/express-mongo-sanitize) module.

### Request Limit Security

The API is set by default to allow 100 requests in a time period of 10 minutes using the [Rate Limit Mongo](https://www.npmjs.com/package/rate-limit-mongo) module.

### HTTP Request Parameters Pollution Security

This is a minor but necessary addition to prevent an attacker from polluting the HTTP request parameters using [Hpp](https://www.npmjs.com/package/hpp) module.

# Release Notes

## v 1.0.0

### New Features:

1. First Release.

### Known Issues:

1. None.

# License

Copyright &copy; 2020 Michael Pesin

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
