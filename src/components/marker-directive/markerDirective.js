import mp3PlayerDir from './../mp3-player-directive/mp3PlayerDirective';

function markerDir() {
    return {
        restrict: 'EA'
        // , require: mp3PlayerDir
        , scope: {
            bookmark: '='
            , duration: '='
            , waveformWidth: '='
        }
        , controller: ( $scope ) => {
            console.log( 'In marker.  bookmark: ', $scope.bookmark, 'duration: ', $scope.duration, 'waveformWidth: ', $scope.waveformWidth );
        }
        , link: ( scope, elem, attrs ) => {
          // - Set position to absolute
          // - For left:
          //
          // - Get duration of audio
          // - Divide by time position of marker
          // - Take the result and multiply it by the .waveform width to get the value for left
              let position = ( scope.bookmark.position / scope.duration ) * scope.waveformWidth;
              console.log( position );
              angular.element( elem[ 0 ] ).css( { 'position': 'absolute', 'left': position + 'em' } );
        }
    }
}

export default markerDir;
