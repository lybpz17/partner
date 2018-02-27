const elasticsearch = require('elasticsearch');

let mongoose = require('mongoose');

var conn = mongoose.connect('mongodb://localhost/partner');
let Activity = require('./models/Activity')

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
  });

function createIndex(rs){
	for(item of rs){
		esClient.index({
		  index: 'activity',
		  type: 'post',
		  //id: id,
		  body: item,
		}, function (err, res) {
		  console.log('err:'+err);
		  console.log('res:'+res);
		});
	}
}
function search(){
	esClient.search({
	  index: 'activity',
	  size: 50,
	  body: {
	    query: {
	      match: {
	        atitle: '乒乓'
	      }
	    }
	  }
	}).then(function (res) {
		console.log(res);
		var hits = res.hits;
		console.log(res.hits.hits);
	});
}
//创建索引


Activity.find({},{"_id":0,"nicheng":1,"adate":1,"creditnum":1,"atitle":1,"address":1,"lat":1,"lng":1,"price":1},function(err, rs){
	Activity.find({},{"_id":1},function(err, idrs){
		let ii=0;
		for(item of idrs){
			rs[ii++]["id"] = item._id;
			console.log(rs[ii-1]);
		}
    	// createIndex(rs);
	});
    
});

//查询索引
// search();
