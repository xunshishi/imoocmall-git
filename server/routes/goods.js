var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//链接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected', function () {
  console.log('mongoDB connected success');
});

mongoose.connection.on('error', function (err) {
  console.log('mongoDB connected error');
  console.log(err);
});

mongoose.connection.on('disconnected', function () {
  console.log('mongoDB connected disconnected');
});


router.get("/", function (req, res, next) {
  //分页
  //?page=1&pageSize=8&sort=1
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let priceLevel = req.param("priceLevel");
  let sort = req.param('sort');
  let skip = (page - 1) * pageSize;
  let priceGt = '';
  let priceLte = '';
  let params = {};
  if (priceLevel != 'all') {//点击了all,全条件
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }


  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log(doc);

      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })

  //无分页
  /*Goods.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log(doc);

      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  });*/

  //res.send('hello, goods list.哈哈哈哈');

  /*Goods.find({},function (err, doc) {
    if (!err) {
      res.send(doc);
    }
  })*/


});

module.exports = router;
