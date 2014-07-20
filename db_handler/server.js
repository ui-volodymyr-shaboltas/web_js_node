var http = require('http');
var mysql = require('mysql');
var path = require('path');
//var favicon = require('static-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , json = require('json')
  , server = require('http').createServer(app)
;

var router = express.Router()


var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  database: 'my_db',
  user : 'test',
  password : 'test111'
});

app.use(express.static(__dirname));
// Config
//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/myjson', function(req, res){
	
	var json = {};
	/*присвой в переменную json твой вывод из базы данных*/
	connection.query('SELECT * FROM regulatory', function(err, rows) {
	if (err) { 
		connection.rollback(function() {
		  throw err;
		});
	} else {
		//json=JSON.stringify({ a: 1 });\
		console.log('\nJSON DB sent!');
		res.send(JSON.stringify(rows));
		
	}
	});
    
  
  //res.send('hello world');
});

app.post('/get', function(req, res) {
//render post

console.log('req.body.id', req.body['id']);
var json = {};
	/*присвой в переменную json твой вывод из базы данных*/
	connection.query('SELECT * FROM regulatory WHERE ID=?', req.body['id'], function(err, rows) {
	if (err) { 
		connection.rollback(function() {
		  throw err;
		});
	} else {
		json=JSON.stringify(rows);
		console.log('ROWS:\n'+json);
		res.send(JSON.stringify(rows));
	}
	});
});

app.post('/update', function(req, res) {
//create new comment 
var jsonArray = JSON.stringify(req.body);
//var jsonArray = req.body;
console.log('objArray '+jsonArray);
var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
//console.log('array '+array);

var recID=array['ID'];

console.log('jsonArray.ID '+ recID);

var q = "UPDATE regulatory" + " SET ";
for (var index in array) {
	//console.log('index '+index);
	if ( index != 'ID' ) {
		if (index != 'CC')
			q += ","
		q += " `"+index+"`=\""+array[index]+"\"";
		
	}
}
q += " WHERE `ID`="+recID;
console.log('query: '+q);
	connection.query(q, function (err, results, fields) {
		if(err) { throw err; }
		var json = JSON.stringify(results);
		console.log(json);
	  }
	);
	//if (jsonArray != null) { 
	   //for (var i=1;i<;i++)
	   //{ 
		   ////Excluding the item at position
			//if (i != position) 
			//{
				//list.put(jsonArray.get(i));
			//}
	   //} 
  // }
//console.log(list);

//console.log('req.param', req.param[0]);
console.log('req.body.id (update)', recID);

////return to ROOT URL
res.writeHead(302, {
  'Location': '/'
  //add other headers here...
});
res.end();


});


server.listen(8080);
