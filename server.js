var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var app = express();
var port = 3000;
var db = new sqlite3.Database('quotes.db');
app.use(bodyParser.urlencoded({extended:true}));

app.post('/quotes',function(req,res){
    console.log("insert a new quote:" + req.body.quote);
    db.run('INSERT INTO Quotes VALUES(?,?,?)',[req.body.quote,req.body.author,req.body.year],function(err){
        if(err){
            res.send(err.message);
        }
        else{
            res.json("Inserted quote with ID:"+ this.lastID);
        }
    });
});

app.get('/', function(req, res) {
    res.send("Get request received at '/' ");
});

app.get('/quotes', function(req, res){
    if(req.query.year){
        db.all('SELECT * FROM Quotes WHERE year = ?',[req.query.year], function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                console.log(rows);
                res.json(rows);
            }
        });
    }
    else{
        db.all('SELECT * FROM Quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id',function(req,res){
    /*console.log('Get list of all quotes as json');
    if(req.query.year){
        res.send("Return a list of quotes from the year: "+ req.query.year);
    }
    else{
        res.json(quotes);
    }*/
    console.log("return quote with ID:"+ req.params.id);
    db.get('SELECT * FROM Quotes WHERE rowid = ?',[req.params.id],function(err,row){
        if(err){
            res.send(err.message);
        }
        else{
            res.json(row);
        }

    });
});

app.get('/',function(request,response){
    response.send('get message received at /');
});

app.listen(port,function(){
    console.log('express app listening at port'+ port);
});