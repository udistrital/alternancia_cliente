// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  entorno: 'test',
  autenticacion: true,
  notificaciones: false,
  menuApps: false,
  appname: 'alternancia',
  appMenu: 'alternancia',
  NUXEO: {
    PATH: 'https://documental.udistrital.edu.co/nuxeo/',
  },
  SINTOMAS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/sintomas_crud/v1/',
  TERCEROS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
  ACADEMICA_JBPM_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1/',
  OIKOS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v2/',
  PARAMETROS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/',
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  NOTIFICACION_SERVICE: 'wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws',
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email',
    REDIRECT_URL: 'http://localhost:4200/',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/',
    AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
  },
};
