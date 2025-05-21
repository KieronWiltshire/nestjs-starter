## Description

This is an Enterprise grade starter template for building robust, scalable, and maintainable NestJS applications. It provides a solid foundation with best practices, security features, and production-ready configurations out of the box. The authentication system implements a secure JWT-based approach using JWKS (JSON Web Key Set) from your identity provider, while also supporting API key management for service-to-service communication.

### Features

- 🔐 **Authentication & Authorization**
  - JWT authentication with JWKS support
  - API key management for service-to-service communication

- 🏗️ **Architecture & Structure**
  - Modular architecture following NestJS best practices
  - Clear separation of concerns (Controllers, Services, DAOs)
  - TypeScript-first approach with strict type checking

- 🛠️ **Development Tools**
  - Docker development environment
  - Database migrations with Knex.js
  - Redis integration for caching and pub/sub
  - Swagger/OpenAPI documentation
  - Comprehensive logging system

- 🚀 **Production Ready**
  - Environment-based configuration
  - Health check endpoints
  - Rate limiting
  - CORS configuration via `helmet`
  - Error handling and validation
  - Request/Response serialization

- 📊 **Database & Caching**
  - PostgreSQL integration
  - Redis caching layer
  - Database migrations
  - Connection pooling

- 🧪 **Testing**
  - Unit testing setup
  - E2E testing configuration
  - Test coverage reporting
  - Mocking utilities

### ⚠️ User Provisioning
> 
> This template does not include user provisioning functionality. Developers are responsible for implementing their own user provisioning system. The recommended approach is to implement a webhook endpoint that handles user creation events from your identity provider. This allows for seamless integration with your existing identity management system while maintaining proper separation of concerns. By listening to user-created events from your identity management system, you can ensure a flexible and maintainable integration with any identity infrastructure.

### ⚠️ Authorization
> 
> This template does not include a comprehensive authorization system. While some applications may prefer a simple role-based access control (RBAC) approach, others may require more sophisticated authorization patterns. For complex authorization requirements, we recommend implementing an open-source solution inspired by Google's Zanzibar paper, which provides a flexible and scalable approach to relationship-based access control. Popular implementations include:
> 
> - [OpenFGA](https://openfga.dev/) - Open source, self-hostable authorization service
> - [SpiceDB](https://authzed.com/spicedb) - Open source, self-hostable authorization database
> 
> Developers should conduct their own research to evaluate similar options and choose the solution that best aligns with their specific requirements, considering factors such as deployment model, performance characteristics, and integration complexity.

## Table of Contents
- [Installation](#installation)
  - [Dependencies](#dependencies)
  - [Docker (Development)](#docker-development)
  - [Manual (Development/Production)](#manual-developmentproduction)
- [Deployment](#deployment)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Contributing](#contributing)
  - [Project Structure](#project-structure)
  - [Development Guidelines](#development-guidelines)
    - [Database Migrations](#database-migrations)
    - [Adding New Features](#adding-new-features)
    - [Code Style](#code-style)
- [Stay in touch](#stay-in-touch)
- [License](#license)

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
You can also access **pgAdmin 4** in the browser on port `8082` and **Redis Commander** on port `8083`. You will need to make sure
that you create any necessary databases for local development.

### Manual (Development/Production)
If you are setting up the application for a production environment, then change the variables within the `.env` file
for connecting to your production **postgres** and **Redis**. In order for the application to run correctly, you will
need to install the dependencies by running the following command:

```bash 
$ npm ci
$ npx knex migrate:up
```

You can then run the app with any of the following commands:

```bash 
# development 
$ npm run start 
 
# watch mode 
$ npm run start:dev 
```

You should now be able to access the application via localhost on the designated port.

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

## Testing
If you wish to run through the application's test suite with the following commands:

```bash 
# unit tests 
$ npm run test 
 
# e2e tests 
$ npm run test:e2e 
 
# test coverage 
$ npm run test:cov 
```

## API Reference

The API documentation can be accessed at `/api/reference` when running the application. Here you will find every API documented endpoint.

## Contributing

### Project Structure
```
src/
├── app.module.ts    # Main application module
├── main.ts         # Application entry point
├── config/         # Configuration files
├── database/       # Database related files
│   └── knex/      # Knex.js configuration and migrations
├── filters/        # Exception filters
├── modules/        # Feature modules
│   ├── auth/      # Authentication module
│   ├── api-key/   # API key management
│   ├── socket/    # WebSocket functionality
│   └── user/      # User management
└── redis/         # Redis configuration and utilities
```

### Development Guidelines

#### Database Migrations
This project uses Knex.js for database migrations. Here's how to work with migrations:

1. Create a new migration:
```bash
$ npx knex migrate:make migration_name
```

2. Run migrations:
```bash
$ npx knex migrate:latest
```
3. Rollback migrations:
```bash
$ npx knex migrate:rollback
```

4. View migration status:
```bash
$ npx knex migrate:status
```

#### Adding New Features
Each feature module (e.g., auth, user) follows this structure:
```
modules/
└── [feature]/
    ├── controllers/    # HTTP request handlers
    ├── services/       # Business logic
    ├── daos/          # Data access objects
    ├── dtos/          # Data transfer objects
    ├── events/        # Event type definitions
    └── [feature].module.ts  # Module definition
```

When adding a new feature, follow these steps:
1. Create necessary database migrations
2. Create DTOs (Data Transfer Objects) in the module's `dtos` directory
3. Implement database queries using Knex in the module's `daos` directory
4. Implement business logic in the module's `services` directory
5. Define event types in the `events` directory
6. Create controllers in the module's `controllers` directory
7. Add testing where appropriate
8. Update documentation

#### Code Style
- Follow TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Comment complex functions and classes
- Error handling responsibilities:
  - DAOs only return data or null, it should not throw errors
  - Services are responsible for business logic and are allowed to throw errors
  - Controllers are responsible for handling or escalating service related errors
- Separation of concerns:
  - Controllers should only handle HTTP requests/responses and delegate to services
  - Services contain all business logic and orchestrate data operations
  - DAOs are purely responsible for data retrieval and persistence
- Event handling:
  - Events should be treated as immutable objects
  - Event types should be defined as readonly interfaces
- Documentation:
  - Controllers and IO-related classes must be documented using @nestjs/swagger decorators
  - DTOs must include OpenAPI property decorators for proper API documentation
  - All API endpoints should be properly documented with `@ApiOperation`, `@ApiResponse`, etc. [See more](https://docs.nestjs.com/openapi/introduction).
  - All controller methods must use `@SerializeOptions()` decorator to explicitly handle properties should be exposed in responses

## Stay in touch

- Authors
    - [Kieron Wiltshire](mailto:kieron.wiltshire@outlook.com)

## License

MIT License

Copyright (c) 2024 Kieron Wiltshire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
