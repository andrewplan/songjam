const express = require( 'express' );
const { json } = require( 'body-parser' );
const port = 4000;

const app = express();

app.use( json() );
app.use( express.static( `${ __dirname }/dist` ) );

app.listen( port, () => { console.log( `Listening on ${ port }` ) } );
