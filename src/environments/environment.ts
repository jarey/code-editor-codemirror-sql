// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const REST_BASE_URL = 'https://igvpir.dev.xunta.local/rest';

export const environment = {
  production: false,
  authorization: {
    oauth: {
      interceptor: {
        resourceServer: {
          sendAccessToken: true,
          allowedUrls: [REST_BASE_URL + '/private']
        }
      },
      config: {
        storagePrefix: 'plavis_private_'
      },
      proactive: true,
      baseHref: '/',
    }
  },
  xdomain: {
    basicURL: 'https://plavis-igvaut.dev.xunta.local/rest/',
    url: 'https://plavis-igvaut.dev.xunta.local/rest/iframe/xdomain.html#',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
