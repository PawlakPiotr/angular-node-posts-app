# Posts Service Application

Web application for creating/reading/updating/deleting posts. App implements creating users with roles.   

## Tech stack:
* Node.js using Express.js
* MongoDB 
* Angular

## Instaling dependecies
**Note: you need to have `Angular CLI` and `node.js` installed**

```
cd angular-node-posts-app/mean-app/
npm install
```
## Running aplication

Open two terminals and run:

* 1 terminal:
```
cd angular-node-posts-app/mean-app/
ng serve
```
* 2 terminal:
```
cd angular-node-posts-app/mean-app/
node server.js
```
**Go to browser**
`http://localhost:4200/`

**Note:** Application uses MongoDB to store data. You need to install it and run it on `localhost:27017`
