import mp3PlayerDir from './../mp3-player-directive/mp3PlayerDirective';

function markersContainerDir() {
    return {
        restrict: 'EA'
        // , require: mp3PlayerDir
        , scope: {
            bookmarks: '='
            , duration: '='
            , waveformWidth: '='
        }
        , controller: ( $scope ) => {
            console.log( 'In markersContainer.  bookmarks: ', $scope.bookmarks, 'duration: ', $scope.duration, 'waveformWidth: ', $scope.waveformWidth );
        }
        , link: ( scope, elem, attrs ) => {
            angular.element( elem[ 0 ] ).querySelector( 'markers-container-dir' ).css( { 'width': scope.waveformWidth } );
        }
    }
}

export default markersContainerDir;
