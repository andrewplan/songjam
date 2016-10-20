function mainViewCtrl ( $scope, userService ) {
    $scope.user = userService.getCurrentUser();
    $scope.songjamSearchQuery;
}

export default mainViewCtrl;
