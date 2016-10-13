const express = require( 'express' );
const { json } = require( 'body-parser' );
const googleSpeechConfig = require( './server/configs/googleSpeechConfig' );
// const googleSpeechCredentials = require( './server/configs/googleSpeechCredentials.json' );
const port = 4000;

const app = express();

app.use( json() );
app.use( express.static( `${ __dirname }/dist` ) );

// [START speech_quickstart]
// Imports the Google Cloud client library
const Speech = require('google-cloud/node_modules/@google-cloud/speech');

// Your Google Cloud Platform project ID
const projectId = googleSpeechConfig.project_id;

process.env.GOOGLE_APPLICATION_CREDENTIALS = './server/configs/googleSpeechCredentials.json';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = './server/resources/audio_recording_mainAudio_test_3.wav';

// The audio file's encoding and sample rate
const options = {
  encoding: 'LINEAR16',
  sampleRate: 44000
};

// Detects speech in the audio file
// speechClient.recognize(fileName, options, (err, result) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//
//   console.log(`Transcription: ${result}`);
// });
// [END speech_quickstart]
/******************* END Google Speech quickstart.js ********************/

app.listen( port, () => { console.log( `Listening on ${ port }` ) } );
