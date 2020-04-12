The internship-backend-service provides a backend server for maintaining information about internship opportunities, and information about internees looking for new opportunities. 

The server is developed in NodeJS; the database is MongoDB managed by the Mongoose ODM. 

# About The Server

The server provides encrypted data storage of all information. All communication with the server use SSL protocol with XSS protection.
Interactions with the server require authentication that's given based of the user's role (admin, internee, recruiter, HR etc.). 
The server also uses geocoding which allows the use of location based search.

I hope you'll enjoy using this app as much as I enjoyed maikng it (:

# Using The Server

## API Documentation

Documentation, created using Postman, can be found in the following link _[TBD]_

# Release Notes

## v 1.0.0

### New Features:

1. First Release.

### Known Issues:
1. None.
