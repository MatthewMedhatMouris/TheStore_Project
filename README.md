# Storefront backend API
Store App 

## Storefront backend API project built using:
- Node.js and Express to build a server
- TypeScript 
- PostgreSQL
- Unit Testing with Jasmine

## Project Scripts:
- Install Dependencies
```
npm install
```
- Run prettier
```
npm run prettier
```
 - Run Eslint
```
npm run lint
```
 - Run Eslint Fix
```
npm run lint:f
```
- Run build app
```
npm run build
```
- Run test
```
npm run test
```
- Run app during development (nodemon)
```
npm run dev
```
- Run app
```
npm run start
```

## DataBase
- Create database (the_store) for storefrond backed API project using postgres then create require tables using (db-migrate up).
- Run data-migrations file using (psql -U admin -d the_store -a -f initialization.sql) to create admin user to authenticate (Like Login), also some of data which maybe need. 
- Create database (the_store_test) for test using postgres.
  
## Endpoints:
All endpoints and schema described in (REQUIREMENTS.md) file, 
 
## Environment Variables:
- POSTGRES_HOST = 127.0.0.1
- POSTGRES_DB = the_store
- POSTGRES_TEST_DB = the_store_test
- POSTGRES_USER = admin
- POSTGRES_PASSWORD = 000
- ENV = dev
- PEPPER = speak_friend_and_enter
- SALT_ROUNDS = 10
- TOKEN_SECRET = admin123!
 
 
 
 