Install requirements:
 - docker (https://docs.docker.com/get-docker/)

To initialize this project, run `docker compose up` from the root of this project. This will build and seed the database. By default the database runs on port `5432` and is also exposed on `5432`, if you want to change this you can update `docker-compose.yml`.

## Exercise Notes

Very enjoyable brief! Below is additions I've made to the approach, how to run the app, the approach I took, and file descriptions.

### Closing thoughts
- I Added in a dockerised server app and redis to the docker-compose setup. The aim of the Redis cache is to only hit the DB if necessary, and return a cached response otherwise.
- Used a pool of db connections with the `pg` package to enable multiple requests.
- Separated route controller and business logic for clarity.
- At the moment, treating the stateLogs and vehicles as separate services, although could be combined in the future, depending on use case.
- With a bit more time I would sort out the environment variables further, by adding a config directory and importing from .env or docker-compose, validating existence of values or not.

### To Run
1. `docker-compose build && docker-compose up`
2. Send a request GET to the following URL `http://localhost:3000/vehicles/1?timestamp=2022-09-10%2010:23:54+00`
example: `curl --location --request GET 'http://localhost:3000/vehicles/1?timestamp=2022-09-10%2010:23:54+00'`

3. response should be the following;
```json
   {
   "id": "1",
   "make": "BMW",
   "model": "X1",
   "state": "quoted"
   }
```
### Folder Structure
`src/`: This folder contains the source code of the application.

`controllers/`: This folder contains the controllers that handle incoming requests and responses.

`middleware/`: error handling and param validation files.

`interfaces/`: Type interfaces used across the app.

`routes/`: This folder contains the express Route object that can be built out with further functionality.

`services/`: This folder contains the business logic services.

`app.ts`: This file contains the main application initialization and configuration logic.

`db.ts`: This file contains the database configuration and connection logic.


### Tests
`npm test`
