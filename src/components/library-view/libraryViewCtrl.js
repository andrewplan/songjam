function libraryViewCtrl( $scope ) {
    // function init() {
        $scope.audioUrls = [
          'https://s3-us-west-2.amazonaws.com/songjam-recordings/demo.mp3', 
        'https://s3-us-west-2.amazonaws.com/songjam-recordings/mySongJam.mp3' ];
        $scope.bookmarks = [ 2, 3, 5 ];
    // }
}

export default libraryViewCtrl;

//https://songjam-recordings.s3-us-west-2.amazonaws.com/mySongJam.mp3
