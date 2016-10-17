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
                  .post( 'http://localhost:4000/api/recordings', recording )
                  .then( data => { console.log( data ); } );
    };
}

export default recorderService;
