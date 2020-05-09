The internship-backend-service provides a backend server for maintaining information about internship opportunities, and information about internees looking for new opportunities.

The server is developed in NodeJS; the database is MongoDB managed by the Mongoose ODM.

# About the Server

The server provides encrypted data storage of all information. All communication with the server use SSL protocol with XSS protection.
Interactions with the server require authentication that's given based of the user's role (admin, internee, recruiter, HR etc.).
The server also uses geocoding which allows the use of location based search.

I hope you'll enjoy using this app as much as I enjoyed making it (:
##Databases
There are three main database collections:

- Users
- Companies
- Internships

####Users
The _Users_ database holds information on all the users. There are four types of users roles:

- Intern
- Recruiter
- Company Admin
- Admin

Each company has one _Company Admin_ and can have several _Recruiters_.
The _Admin_ role can only be created manually by the owner of the server.

####Companies
The _Companies_ database contains all information regarding the company, who is the admin and a list of the recruiters that work for the company.

####Internships
The _Internships_ database contains all information regarding the internships. Each internship is associated with a company.

##Roles & Permissions
The following tables describe the permissions of each role and what CRUD function he/she can invoke on each database:
###Internships Database CRUD Permissions
| Role | CREATE | READ | UPDATE | DELETE |
| :---:| :---: | :---: | :---: | :---: |
|Intern\*| |X|
|Recruiter\*|X|X|X|X|
|Company Admin\*|X|X|X|X|
|Admin\*\*| |X|
###Companies Database CRUD Permissions
| Role | CREATE | READ | UPDATE | DELETE |
| :---:| :---: | :---: | :---: | :---: |
|Intern\*| |X|
|Recruiter\*| |X|
|Company Admin\*|X|X|X|X|
|Admin\*\*| |X| | |
###Users Database CRUD Permissions
| Role | Intern | Recruiter | Company Admin | Admin |
| :---:| :---: | :---: | :---: | :---: |
|Intern\*|READ<br>CREATE<br>UPDATE<br>DELETE||
|Recruiter\*|READ|READ<br>CREATE<br>UPDATE<br>DELETE|READ
|Company Admin\*|READ|READ<br>CREATE<br>DELETE|READ<br>CREATE<br>UPDATE<br>DELETE||
|Admin\*\*|READ<br>CREATE<br>DELETE|READ<br>CREATE<br>DELETE|READ<br>CREATE<br>DELETE|READ<br>UPDATE|

\* Applies only to itself and data owned by the user; e.g. an _Intern_ can only create an account for himself and update the information of his own account.  
\*\* Applies to all the documents in database.

# Using The Server

## API Documentation

Documentation, created using Postman, can be found in the following link _[TBD]_

# Release Notes

## v 1.0.0

### New Features:

1. First Release.

### Known Issues:

1. None.
