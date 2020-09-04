import { HttpErrorHandlerConfig } from '@amtega/igvcomp-common-lib';

export const errorHandlerConfig: HttpErrorHandlerConfig = [
    /*{
        urlPattern: '/exception/(\\w*)/([\\w_]*)',
        code: {
            general: {
                objectCode: 'http.error.handler.object.excepcion'
            }
        },
        params : ['uno', 'dos']
    }, */
    {
        urlPattern: '/oauth/token',
        code: {
            method: {
                POST : {
                    methodCode : 'http.error.handler.auth.method',
                    msgCode : 'http.error.handler.auth.msg',
                    objectCode : 'http.error.handler.auth.object'
                }
            }
        }
    },
    {
        /* Patron de fichero se ignora */
        urlPattern: '/private/file',
        code: {},
        ignore: true
    },
    {
        /* Patron general - utiliza valores por defecto */
        urlPattern: '/',
        code: {}
    }
];
