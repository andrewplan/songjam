function landingPageCtrl( $scope, authService  ) {
      function init() {
          // Put the authService on $scope to access
          // the login method in the view
          $scope.authService = authService;

          $scope.mission = "The voice memo application designed for music creators.";
      }
      init();
}

export default landingPageCtrl;
