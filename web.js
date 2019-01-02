var express = require('express');
var app = express();
 app.use(express.logger());

var hbs = require('hbs');
 
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.static('public'));
  
app.get('/', function(req, res){
	res.render(
		'main_box',
		{
			title:"La Ruta del Vino Ensenada, Valle de Guadalupe.", 
		}
	);
});
 
app.get('/nosotros', function(req, res){
   res.render('about');
});
 
app.get('/article/:id', function(req, res) {
   var entry = blogEngine.getBlogEntry(req.params.id);
   res.render('article',{title:entry.title, blog:entry});
});

app.get('/sitemap', function(req, res) {
	res.sendfile('sitemap.xml');
});
 
var port = process.env.PORT || 5000; 
app.listen(port, function() {
  console.log("Listening on " + port);
 });