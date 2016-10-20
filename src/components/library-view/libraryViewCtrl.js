function libraryViewCtrl( $scope, $state, $stateParams, $timeout, user ) {
    $scope.user = user;
    $scope.songjamCount = $scope.user.recordings.length
    $scope.songjamSearchQuery;
    // $timeout( () => { console.log($state.current.name, 'this is working fine'); }, 100);
}

export default libraryViewCtrl;
