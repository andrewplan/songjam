import Auth0Lock from 'auth0-lock';
import authService from '../../services/authService';

function loginViewCtrl ( $scope, authService ) {
    // Put the authService on $scope to access
    // the login method in the view
    $scope.authService = authService;

    // var config = {
    //     auth0Domain: 'songjam.auth0.com'
    //     , clientID: 'QWzoH8reUjNZRsM9pGqlZFEyUjnSoKuX'
    //     , callbackURL: 'http://localhost:4000/auth/callback'
    // };
    //
    // var connection = config.connection;
    // var prompt = config.prompt;
    // var languageDictionary;
    // var language;
    // if (config.dict && config.dict.signin && config.dict.signin.title) {
    //   languageDictionary = { title: config.dict.signin.title };
    // } else if (typeof config.dict === 'string') {
    //   language = config.dict;
    // }
    //
    // var lock = new Auth0Lock(config.clientID, config.auth0Domain, {
    //   auth: {
    //     redirectUrl: config.callbackURL,
    //     responseType: config.callbackOnLocationHash ? 'token' : 'code',
    //     params: config.internalOptions
    //   },
    //   assetsUrl:  config.assetsUrl,
    //   allowedConnections: connection ? [connection] : null,
    //   rememberLastLogin: !prompt,
    //   language: language,
    //   languageDictionary: languageDictionary,
    //   theme: {
    //     //logo:            'YOUR LOGO HERE',
    //     //primaryColor:    'green'
    //   },
    //   closable: false,
    //   // uncomment if you want small buttons for social providers
    //   // socialButtonStyle: 'small'
    // });
    //
    // lock.show();
}

export default loginViewCtrl;
