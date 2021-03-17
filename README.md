# alternancia_cliente

Cliente del Sistema de XX

## Especificaciones Técnicas

### Tecnologías Implementadas y Versiones
* [Angular 11.2.1](https://angular.io/)

### Variables de Entorno
```shell
# En Pipeline
SLACK_AND_WEBHOOK: WEBHOOK ..
AWS_ACCESS_KEY_ID: llave de acceso ID Usuario AWS
AWS_SECRET_ACCESS_KEY: Secreto de Usuario AWS
```

### Ejecución del Proyecto

Clonar el proyecto del repositorio de git
```bash
# clone the project
git clone https://github.com/udistrital/alternancia_cliente.git
# enter the project directory
cd alternancia_cliente
```
Iniciar el servidor en local
```bash
# install dependency
npx npm install
or
npm install
# start server
npx ng serve
# Whenever you want to change the port just run
npx ng dev --port = 9528
```
Linter
```bash
# Angular linter
npm run lint
# run linter and auto fix
npm run lint:fix
# run linter on styles
npm run lint:styles
# run lint UI
npm run lint:ci
```

### Ejecución Dockerfile
```bash
# Does not apply
```
### Ejecución docker-compose
```bash
# Does not apply
```
### Ejecución Pruebas

Pruebas unitarias powered by Jest
```bash
# run unit test
npm run test
# Runt linter + unit test
npm run test:ui
```

## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/alternancia_cliente/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/alternancia_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/alternancia_cliente/status.svg?ref=refs/heads/master)](https://hubci.portaloas.udistrital.edu.co/udistrital/alternancia_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/alternancia_cliente/status.svg?ref=refs/heads/master)](https://hubci.portaloas.udistrital.edu.co/udistrital/alternancia_cliente) |

## Licencia

[This file is part of sga_cliente.](LICENSE)

alternancia_cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (atSara Sampaio your option) any later version.

alternancia_cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with alternancia_cliente. If not, see https://www.gnu.org/licenses/.






























# AlternanciaCliente
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
