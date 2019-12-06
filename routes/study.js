var express = require('express');
var querystring = require('querystring');
var router = express.Router();
var mysql_dbc = require('./db_conf')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


/* GET home page. */
router.get('/', function (req, res) {
  console.log('study main get');
  var stmt = 'select * from study';
  connection.query(stmt, function (err, results) {
	var sess = req.session.loginInfo;
	if(sess == undefined) {
		res.redirect('/');
	} else {
		res.render('study', { title: 'studies', studyList : results });
	}
  });
});

router.get('/search', function(req, res){
  console.log('study search');
  var query = req.query.search_text;
  try{
    connection.query("SELECT * FROM study WHERE SUBJECT LIKE '%" + query + "%' OR CONTENT LIKE '%" + query + "%'", function(err, result){
        if(err){
          console.log(err);
        }else{
          res.send({result : 'Success', studyList : result});
        }
    });
  }catch(err){
    console.log('catch : '+ err);
  }
});
//
// router.get('/hashtag', async(req, res, next) => {
//     const query = req.query.hashtag;
//     if(!query) {
//         return res.redirect('/');
//     }
//     try {
//         const hashtag = await Hashtag.find({ where: { title: query } });
//         let posts = [];
//         if(hashtag) {
//             posts = await hashtag.getPosts({ include: [{ model: User }] });
//         }
//         return res.render('main', {
//             title: `${query} | NodeBird`,
//             user: req.user,
//             twits: posts,
//         });
//     }
//     catch (error) {
//         console.error(error);
//         return next(error);
//     }
// });
//
//
// 출처: https://niddo-present.tistory.com/23 [Niddo's B.L.O.G]


//내가 짠 검색 post
// router.post('/', function(req, res){
//   var search_text = '';
//
//   req.on('data', function(data){
//     var data = querystring.parse(data.toString());
//     search_text = data.search_text;
//
//     // var stmt ='SELECT * FROM STUDY WHERE subject like ? or content like ?';
//     // var param = [search_text+"%"];
//
//     connection.query('SELECT * FROM STUDY WHERE SUBJECT LIKE ?', [search_text+"%"], function(err, result){
//       if(err){
//         console.log(err);
//         console.log('search Fail');
//         res.send({result : 'Fail'});
//       }else {
//         console.log('search Success');
//         res.send({result : 'Success'});
//       }
//     });
//   });


// });

router.get('/detail/:idx',function (req,res) {
	var idx = req.params.idx;
  	connection.query(`SELECT *, date_format(start_date, '%Y-%m-%d') as startDate, date_format(end_date, '%Y-%m-%d') as endDate FROM study where study_id=?`, [idx], function(error, study){
	var sess = req.session.loginInfo;
	if(sess == undefined) {
		res.redirect('/');
	} else {
		res.render('detail', {title : 'study', study:study, user_id:sess.user_id, name: sess.name});
	}
  });
});

router.post('/partiStudy', function(req, res){
  var study_id = '';
  var user_id = '';

  req.on('data', function(data){
    var data = querystring.parse(data.toString());

    study_id = data.study_id;
    user_id = data.user_id;

    var stmt = 'INSERT INTO parti_study VALUES(?, ?)';
    var params = [study_id, user_id];

    connection.query(stmt, params, function(err, result, fields){
      if(err){
        console.log(err);
        res.send({result : 'Fail'});
      }
      else{
        console.log("parti success");
        res.send({result : 'Success'});
      }
    });
  });
});

module.exports = router;
