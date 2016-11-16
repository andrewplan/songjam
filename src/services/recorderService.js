import { BinaryClient } from 'binaryjs-client';

function recorderService ( $http ){
    const bookmarks = [];

    this.getBookmarks = () => {
        return bookmarks;
    };

    this.addBookmark = bookmark => {
        bookmarks.push( { position: bookmark } );
        this.getBookmarks();
    };

    this.addRecording = recording => {
        console.log( 'addRecording is working! recording is ', recording );
        return $http
                  .post( '/api/recordings', recording )
                  .then( response => { console.log( response.data ); } );
    };
    this.deleteRecording = recording => {
        console.log( 'deleteRecording is working! recording is ', recording );
        return $http
                  .delete( '/api/recordings/' + recording._id )
                  .then( response => { console.log( response.data ); } );
    };
    this.updateRecording = recording => {
        console.log( 'updateRecording is working! recording is ', recording );
        return $http
                  .put( '/api/recordings/' + recording._id, recording )
                  .then( response => { console.log( response.data ); } );
    };
}

export default recorderService;
