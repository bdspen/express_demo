var mongoose = require('mongoose');
var Bear = require('./app/models/bear');
mongoose.connect('mongodb://bdspen:root@ds041924.mlab.com:41924/connect'); //mlab address

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); //returns middleware that only parses json

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

//MIDDLEWARE, we can instantiate here.
router.use(function(req, res, next) {
    console.log('something is happening');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

router.route('/bears')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var bear = new Bear(); //create new instance of bear model
        bear.name = req.body.name; //set the bears name

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Bear Created'
            });
        });
    })
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });
//get bear by id
router.route('/bears/:bear_id')
    .get(function(req, res) {
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);

            res.json(bear);
        });
    })
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);

            bear.name = req.body.name;

            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Bear Updated'
                })
            });

        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted'
            });
        });
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
