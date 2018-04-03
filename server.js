var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var app = express();


const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use(favicon(path.join(__dirname + '/favicon.ico')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(process.env.PORT, function(){
  console.log(`Listening on port ${PORT}`);
});