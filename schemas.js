const mng = require('mongoose')
const my_conn_data = "mongodb+srv://usuario:practicas@wattsapp-m9bdm.mongodb.net/test?retryWrites=true&w=majority"

mng.connect(my_conn_data);

var userSchema = new mng.Schema({
	"@id": String, 
	"identifier": Number, 
	"name": String, 
	"address": String, 
	"email": String, 
	"accessCode": String, 
	"oos:rate": String
});

var deviceSchema = new mng.Schema({
	"@id": String, 
	"identifier": Number, 
	"oos:owner": String,
	"itemCondition": String, 
	"location": String,  
	"category": String, 
	"description": String
});

var measureSchema = new mng.Schema({
	"@id": String,
	"identifier": Number,
	"oos:device": String,
	"observationDate": Date,
	"measuredValue": Number
});

var recommendationSchema = new mng.Schema({
	"@id": String,
	"identifier": Number, 
	"oos:owner": String,
	"oos:device": String,
	"dateCreated": Date,
	"description": String,
	"category": String,
});

var User = mng.model('User', userSchema);
var Device = mng.model('Device', deviceSchema);
var Measure = mng.model('Measure', measureSchema);
var Recommendation = mng.model('Recommendation', recommendationSchema);

exports = module.exports = {User, Device, Measure, Recommendation}