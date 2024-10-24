# EVC-105 Test DO NOT MERGE

Creating a branch env to test the reply-to feature.


# E-Visa Contact Us (EVC)

## Getting Started

- [Install & run with VSCode Dev Containers](#install--run-using-docker--vscode-dev-containers)
- [Install & run with locally installed Services](#install--run-using-locally-installed-services)

### Dependencies

This form is built using
- [HOF framework](https://github.com/UKHomeOfficeForms/hof)
   - hof v21.0.1
- [Gov.uk Notify](https://www.notifications.service.gov.uk) to send notification emails
- [File Vault](https://github.com/UKHomeOffice/file-vault) to store and retrieve uploaded files




## Install & Run using Docker & VSCode Dev Containers

Choose this option if you if you are using VSCode, have Docker installed and wish to run containerized Servers.

### Prerequisites
   - [Docker](https://www.docker.com)
   - [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 

### Setup

1. Copy `./.devcontainer/devcontainer.env.sample` to `./.devcontainer/devcontainer.env` and populate the values.

2. Open the project in a VSCode Dev Container with the command `Dev Containers: Reopen in Container`

3. Open a terminal on the application server container through VScode `View -> Terminal`

4. Install dependencies with `yarn`, then launch the application in dev mode with `yarn start:devcontainer`

### Additional Services

The [Redis Insight](https://redis.io/insight/) tool is available on [http://localhost:5540/](http://localhost:5540/)


## Install & Run using locally installed services

Choose this option if you want to use services installed directly on your development machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
   - Node v20.15.1 (LTS)
- [Redis server](http://redis.io/download) running on default port 6379
- [File Vault](https://github.com/UKHomeOffice/file-vault) Service - running port 3000

### Setup

1. Copy `.env.development` to `.env` and populate it with all the required environment variables for the project.
2. Install dependencies with `yarn install`.
3. Start the service in development mode using `yarn run start:dev`.
