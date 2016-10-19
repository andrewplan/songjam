function markersContainerDir() {
    return {
        restrict: 'EA'
        , scope: {
            bookmarks: '='
            , duration: '='
            , recording: '='
            , waveformWidth: '='
        }
        , controller: ( $scope ) => {
            console.log( 'In markersContainer.  bookmarks: ', $scope.bookmarks, 'duration: ', $scope.duration, 'waveformWidth: ', $scope.waveformWidth );
        }
    }
}

export default markersContainerDir;
