var express = require('express');
var router = express.Router();
var mysql_dbc = require('./db_conf')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
	var sess = req.session.loginInfo;
	console.log(sess);
	console.log('indexPage');
	if(sess == undefined) {
		res.render('index', {
			name: ''
		});
	} else {
		res.render('index', {
			name: sess.name
		});
	}
});

router.get('/test', function (req, res) {
  var stmt = 'select * from test1';
  connection.query(stmt, function (err, result) {
      console.log(result);
	  console.log(result[0][1]);
  });
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  console.log('loginPage');
  res.render('login');
});

router.get('/mypage', function(req, res, next) {
  console.log('mypage');
  res.render('mypage');
});

module.exports = router;
