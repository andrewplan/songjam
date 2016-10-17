function mainViewCtrl ( $scope, userService ) {
    $scope.user = userService.getCurrentUser();
}

export default mainViewCtrl;
