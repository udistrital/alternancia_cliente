export const environment = {
    production: true,
    entorno: 'test',
    autenticacion: true,
    notificaciones: false,
    menuApps: true,
    appname: 'alternancia',
    appMenu: 'alternancia',
    NUXEO: {
        PATH: 'https://documental.udistrital.edu.co/nuxeo/',
    },
    TERCEROS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
    CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
    CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
    NOTIFICACION_SERVICE: 'wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws',
    TOKEN: {
        AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
        CLIENTE_ID: 'h2mfKBjx_8o51lpjgftKh2_0czQa',
        RESPONSE_TYPE: 'id_token token',
        SCOPE: 'openid email',
        REDIRECT_URL: 'https://pruebasalternancia.portaloas.udistrital.edu.co',
        SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
        SIGN_OUT_REDIRECT_URL: 'https://pruebasalternancia.portaloas.udistrital.edu.co',
        AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
    },
};

