const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nexmo = require('nexmo-client');

require('dotenv').config();

app.set('view engine', 'pug');

app.use(express.static('public'))
app.use('/modules', express.static('node_modules/nexmo-client/dist/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/auth/:userid', (req, res) => {
  console.log(`Authenticating ${req.params.userid}`)
  return res.json(process.env.JWT);
})

app.get('/webhooks/answer', (req, res) => {
  console.log("Answer:")
  console.log(req.query)
  const ncco = [
    {
      "action": "talk",
      "text": "Thank you for calling Acme support. Transferring you now."
    },
    {
      "action": "connect",
      "from": process.env.NEXMO_NUMBER,
      "endpoint": [{
        "type": "phone",
        "number": process.env.DESTINATION_PHONE_NUMBER
      }]
    }]
  res.json(ncco);
});

app.post('/webhooks/event', (req, res) => {
  console.log("EVENT:")
  console.log(req.body)
  res.status(200).end()
});



