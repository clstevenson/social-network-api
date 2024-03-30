# Social network APIs using MongoDB

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description
API Routes are written for a social network with the following features:
- Users can post their thoughts and can react to other's posts
- Users can friend other users

## Table of Contents
- [Installation](#installation)
- [Use](#use)
- [Questions](#questions)
- [License](#license)

## Installation
This is a Node.js application that uses Express and MongoDB (through a Mongoose ODM). If you wish to run it from your own machine, download or clone the GitHub repo. You will need to adjust the connection to point to a MongoDB that you administer. Run `npm install` in the application's directory, and then `npm start` to start the server.

If you wish to test the API with fake data, run `npm run seed`.

## Use
The following APIs are provided. The link below is to [a video that demonstrates the routes](https://youtu.be/Ky3bald6OmE) in Insomnia.

https://youtu.be/Ky3bald6OmE

### /api/users
- GET route to return all users
- POST route to create a user (input data: username and email, both of which must be unique. The email is validated to be an authentic email address.)

### /api/users/:userid
- GET route to return a single user with information on posted thoughts and friends
- PUT route to update user (changing username and/or email)
- DELETE to remove the user from the database; all thoughts the user posted are also removed

### /api/users/:userid/friends/:friendid
- POST route to add a new friend
- DELETE route to remove a friend from a user

### /api/thoughts
- GET route to return all thoughts and their reactions
- POST route to add a new thought/post (input data: thoughtText, username, userID)

### /api/thoughts/:thoughtid
- GET route to return one posted thought and associated reactions
- PUT route to update a thought (input data: thoughtText)
- DELETE route to remove a thought

### /api/thoughts/:thoughtid/reactions
- POST route to create a new reaction to a specific thought (input data: reactionBody and username)
- DELETE route to remove a reaction (input data: reactionId)

## Questions
Reach out if you have questions that are not covered here!

- GitHub username: clstevenson
- email: chrislstevenson@gmail.com

## License
This project is licensed under the terms of the [MIT license](https://opensource.org/licenses/MIT).
