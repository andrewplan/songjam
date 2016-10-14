import { BinaryClient } from 'binaryjs-client';

function recorderService ( $window ){
    const bookmarks = [];

    this.getBookmarks = () => {
        return bookmarks;
    };

    this.addBookmark = bookmark => {
        bookmarks.push( bookmark );
        this.getBookmarks();
    };
}

export default recorderService;
