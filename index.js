async function lerImagem (req, res, file) {
  // Imports the Google Cloud client libraries
  const vision = require('@google-cloud/vision')
  const fs = require('fs')

// Creates a client
  const client = new vision.ImageAnnotatorClient()


  // const image = {};
  // image.id = req.file.filename;
  // image.url = `/uploads/${image.id}`;


  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const fileName = `teste.jpg`
  const fileName = file.path
  const request = {
    image: { content: fs.readFileSync(fileName) }
  }

  const [result] = await client.objectLocalization(request)
  const objects = result.localizedObjectAnnotations

  let response = []
  objects.forEach(object => {

    let item = {};
    item.name = object.name;
    item.score = object.score;

    // console.log(`Name: ${ object.name }`)
    // console.log(`Confidence: ${ object.score }`)
    const vertices = object.boundingPoly.normalizedVertices
    // vertices.forEach(v => console.log(`x: ${ v.x }, y:${ v.y }`))
    item.vertices = vertices;
    // vertices.forEach(v => {
    //   // item.x = v.x;
    //   // item.x = v.x;
    //   // item.y = v.y;
    // })
    response.push( item )
  })

  res.json({ response })
  // console.log({ response })
  // JSON.stringify( response )
}

// Montar um servidor
const express = require('express')
const app = express()
const port = 3000

const cors = require('cors');
app.use(cors())


var formidable = require('formidable');
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.post('/', cors(), function(req, res) {

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if( files.hasOwnProperty('avatar') )
    {
      const file = files.avatar;
      lerImagem(req, res, file);
    }
    // var oldpath = files.filetoupload.path;
    // var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
    // fs.rename(oldpath, newpath, function (err) {
    //   if (err) throw err;
    //   res.write('File uploaded and moved!');
    //   res.end();
    // });
  });


  // console.log( req.file )
  // console.log( req.files )
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${ port }`)
})
