const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt    = require('jsonwebtoken')
const config = require('./config.js')
const  apiRoutes = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//NOTE : Use the access-token key in the header e.g access-token : hdhjg.kgufv.4755.jfhj

apiRoutes.use((req, res, next) => {
    var token = req.headers['access-token'];
    if (token) {
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          res.json({ message: 'invalid token' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          message: 'No token provided.' 
      });
    }
});

app.use('/api', apiRoutes)
app.set('Secret', config.secret)

var countries = ['Nigeria','Ghana','Togo','Liberia','South Africa']
app.post('/login',(req,res)=>{
	if (req.body.user == 'admin' && req.body.password == 'admin') {
		const payload = {check:  true};
		var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440 // expires in 24 hours
		});

		res.status(200).json({
			'message':'Successfully logged In',
			'token':token
		})
	}

	res.status(404).json({
		'message':'Invalid credentials'
	})
})

apiRoutes.get('/countries',(req,res)=> {
	res.status(200).json(countries)
})

apiRoutes.delete('/countries/delete/',(req,res)=>{
	if (isNaN(req.body.del) || req.body.del == '') {
		res.status(404).json({
			'message':'Invalid Input'
		})
	}else{
		countries.splice(req.body.del,1);
    	res.status(200).json(countries)
	}
	
})

apiRoutes.post('/countries/add',(req,res)=>{
	if (!isNaN(req.body.add) || req.body.add == '') {
		res.status(404).json({
			'message':'Invalid Input'
		})
	}else{
		countries.push(req.body.add)
		res.status(200).json(countries)
	}
})


app.listen(8080,()=>{
	console.log('App started on port 8080')
})