var passport = require('passport');
var Account = require('./models/account');



module.exports = function (app) {

  var Swolemate = require('./swolemate.js')(app);

  app.get('/', function (req, res) {
  	var display = '';
  	if (req['query']['error'] == 'nologin') {
  		display = "Error: please login before proceeding"; 
  	}
  	res.render('index', { user : req.user, display : display });
  });

//             ----                               ----
//                  REGISTRATION and LOGIN ROUTES
//             ----                               ----

  app.get('/register', function(req, res) {
  	res.render('register', { });
  }); 

  app.post('/register', function(req, res) {
  	Account.register(
  		new Account({ username : req.body.username }), 
  		req.body.password, 
  		function(err, account) {
  			if (err) {
  				console.log("Error in Register!");
  				console.log(err);
  				return res.render('register', { info : err });
  			}
  			console.log("Registered");
  			passport.authenticate('local', 
  							{ successRedirect: '/newuser',
  							failureRedirect: '/login' })(req,res);
  		}
  	);
  });

  app.get('/login', function(req, res) {
	 res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
	 res.redirect('/');
  });

  app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
  });


//             ----                               ----
//                          HTML ROUTES 
//             ----                               ----

  app.get('/getstarted', function(req, res) {
	  var user = req.user;
	  if (!user) {
		  res.redirect('/?error=nologin');
	  }

	  function returnJSON(err, jsonData) {
		  if (err) {throw err};
		  res.json(jsonData);
	  };
	  Swolemate.initMatchingParams(user, returnJSON);
  });

  //This is the HTML endpoint for Dashboard, which sends back the template,
  //rendered in jade, of the dashboard, to be populated by angular's call to
  //the dashboard API
  app.get('/dashboard', function(req, res) {
    var user = req.user;
    if (!user) {
      res.redirect('/?error=nologin');
    }

    function sendEmptyDashboard () {
      res.render('dashboard', {});
    }

    Swolemate.createDashboardForUser(user, sendEmptyDashboard);
  });

  app.get('/swolefinder', function(req, res) {
    var user = req.user;
    if (!user) {
      return res.redirect('/?error=nologin');
    }

    
  });

//             ----                               ----
//                API ROUTES - ALL SEND JSON BACK
//             ----                               ----

  app.get('/api/user', function(req, res) {
	  var user = req.user;
	  if (!user) {
		  res.redirect('/?error=nologin');
	  }
    else {
	    res.json(user);
    }
  });

  app.get('/api/user/matchingparams', function (req, res) {
	  var user = req.user;
	  if (!user) {
		  return res.redirect('/?error=nologin');
	  }
	  Account(user).populate('matching_params', function(err, mp) {
		  res.json(mp.matching_params);
	  });
  });

  app.post('/api/user/matchingparams', function (req, res) {
	  var user = req.user;
	  if (!user) { // if there's no user, gettouttahere!
		  return res.redirect('/?error=nologin');
	  }
    
    Swolemate.postMatchingParams(req, echoJSON);

	  function echoJSON (err, finalJSON) {
		  if (err) {
		    res.status(500);
		    return res.json(err);
		  }
      else {
        var shitThatAngularExpects = {success: true, message: "Success"};
		    res.json(shitThatAngularExpects);
      }
	  }

  });

  app.post('/api/echo', function (req, res) {

    console.log("Request: " + JSON.stringify(req['body']));

    var shitThatAngularExpects = {success: true, message: "Success"};
    res.json(shitThatAngularExpects);

  });

//This is the API endpoint for dashboard, which sends back the fully populated
//user account JSON. Not to be confused with the HTML endpoint for dashboard,
//which sends back the template for the dashboard page 
  app.get('/api/dashboard', function(req, res) {
    var user = req.user;
    if (!user) {
    res.redirect('/?error=nologin');
    }

    function returnJSON(err, jsonData) {
      if (err) {throw err};
      res.json(jsonData);
    };

   Swolemate.createDashboardForUser(user, returnJSON);
  });

  app.get('/api/swolationship/:id([0-9a-f]{24})', function(req, res){
	  var idRequested = req.params['id'];
  });



  app.get('/ping', function(req, res){
    console.log("pinging");
    res.status(200).send("pong!");
  });

};
