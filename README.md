## Description

NestJS Starter

## Installation
Begin by copying the `.env.example` file to a `.env` file.

### Dependencies

### Docker (Development)
If you are going to use docker, then setup all the necessary software dependencies with the following command:
```bash
$ docker-compose up -d -V --build
```
You can then shutdown the application with the following command:
```bash
$ docker-compose down
```

If you're using docker to spin up the local environment, you can access the **Postgres** on port `5432` and **Redis** on `6379`.
You can also access **pgAdmin 4** in the browser on port `8082` and **Redis Commander** on port `8081`. You will need to make sure
that you create any necessary databases for local development.

### Manual (Development/Production)
If you are setting up the application for a production environment, then change the variables within the `.env` file
for connecting to your production database and redis services. In order for the application to run correctly, you will
need to install the dependencies by running the following command:

```bash 
$ npm ci
```

You can then run the app with any of the following commands:

```bash 
# development 
$ npm run start 
 
# watch mode 
$ npm run start:dev 
```

You should now be able to access the application behind the envoy proxy on port `8080` using a URL like `http://localhost:8080/`.

## Deployment
Ideally, you'll want to deploy this application using container orchestration infrastructure and then connecting to
the relevant services. You'll want to first build the application for production which will get rid of the development
dependencies and unused code keeping the overall bundle light. You can do that by running the following command:
```bash
$ npm run build
```
The command will result in a newly generated `dist` directory. You can then use the following command to start the application:
```bash
# production mode 
$ npm run start:prod 
```
It is recommended you use a process manager like [pm2](https://pm2.keymetrics.io/) for running applications in a production
environment. You should also consider only deploying the production required dependencies, this can only be done after the
application build has been created, so if you have any development dependencies, you'll want to delete the `node_modules` directory
before proceeding. You can install the production only dependencies with the following command:
```bash 
$ npm ci --only=production
```

## Test
If you wish to run through the application's test suite with the following commands:

```bash 
# unit tests 
$ npm run test 
 
# e2e tests 
$ npm run test:e2e 
 
# test coverage 
$ npm run test:cov 
``` 

## Stay in touch

- Authors
    - [Kieron Wiltshire](mailto:kieron.wiltshire@outlook.com)

## License

No License 
