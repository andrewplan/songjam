function libraryViewCtrl( $scope ) {
        $scope.audioUrls = [
          'https://s3-us-west-2.amazonaws.com/songjam-recordings/demo.mp3'
          , 'https://s3-us-west-2.amazonaws.com/songjam-recordings/mySongJam.mp3'
          , 'https://songjam-recordings.s3-us-west-2.amazonaws.com/mySongJam2.mp3' ];
        $scope.bookmarks = [ 2, 3, 5 ];

        // console.log( 'user is ', user );
        // $scope.user = user.data;
}

export default libraryViewCtrl;

//https://songjam-recordings.s3-us-west-2.amazonaws.com/mySongJam.mp3
