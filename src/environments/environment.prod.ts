export const environment = {
  production: true,
  entorno: 'prod',
  autenticacion: true,
  notificaciones: false,
  menuApps: true,
  appname: 'core',
  appMenu: 'CONFIGURACION',
  NUXEO: {
    PATH: 'https://documental.udistrital.edu.co/nuxeo/',
  },
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  NOTIFICACION_SERVICE: 'wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws',
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: '1RQxbw6ReM_D3j1nZu8DOkYI1T4a', // RgZGDAPQLhEm1UFwyltcMfaAe74a - google
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email',
    REDIRECT_URL: 'https://configuracion.portaloas.udistrital.edu.co',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'https://configuracion.portaloas.udistrital.edu.co',
    AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
  },
};
