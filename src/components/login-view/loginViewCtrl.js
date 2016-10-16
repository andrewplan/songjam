// import Auth0Lock from 'auth0-lock';
import authService from '../../services/authService';

function loginViewCtrl ( $scope, authService ) {
    $scope.authService = authService;
}

export default loginViewCtrl;
