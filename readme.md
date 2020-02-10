# Openlms.io

#### Getting started

This project contains many APIs and UIs. You need to first configure all of your .env files. Below are all the directorys you need an .env file.

```.
├── root
│   ├── api-account-manager
│   │   └── .env
│   ├── api-lms
│   |    └── .env
│   ├── api-crm
│   |    └── .env
│   ├── api-cms
│   |    └── .env
│   └── .env
```

All of these directories have an .env.example file to copy over. Below is a helpful command.

```bash
cp .env.example .env
```

After setup of the .env files, run the following

```bash
docker-compose up --build
```

In the future, remove the "--build" if you haven't "git pull"

```bash
docker-compose up
```

#### Documentation

After the docker is up, the following endpoints have your documentation
* Development Docs: localhost:8100
* User Docs: localhost: 8101

#### Database

The project is built with mysql. We are using PhpMyAdmin as an UI for the database.
* PhpMyAdmin: localhost:8000

#### APIs

The project uses multiply APIs
* API-Account-Manager: localhost:8001
* API-lms: localhost:8002
* API-crm: localhost:8003
* API-cms: localhost:8004

#### UIs

The project has two UIs
* User: localhost:8050
* Organizational: localhost:8051