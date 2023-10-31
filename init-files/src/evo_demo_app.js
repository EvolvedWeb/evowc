const PORT = 12345;
const path = require('path');
const express = require('express');

const app = express();
app.use(express.static('src/public'));
app.get('/*', renderIndex)
console.log(`Demo server listening on port ${ PORT }`);
app.listen(PORT, '0.0.0.0');

function renderIndex(req, res, next) {
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile('index.html', options, err => {
    if (err) {
      next(err)
    }
  })
}