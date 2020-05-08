const schema = require('./schemas')

const Rate = schema.Rate;
const User = schema.User;
const Device = schema.Device;
const Measure = schema.Measure;
const Recommendation = schema.Recommendation;

// var rate = new Rate({
//     "@id": "http://our_own_schema.org/rate/1",
//     "identifier": 1,
//     "name": "Basica",
//     "price" : 50, 
//     "description" : "BASICA"   
// });

// var rate2 = new Rate({
//     "@id": "http://our_own_schema.org/rate/2",
//     "identifier": 2,
//     "name": "Avanzada",
//     "price" : 30, 
//     "description" : "YE"   
// });

// rate.save().then(() => rate2.save())
//  	.catch(err => console.log('Error!', err))


// var user = new User({
// 	"@id":"http://our_own_schema.org/user/1", 
//     "identifier": 1, 
//     "name":"Carlos", 
//     "address":"Castellon", 
//     "email":"carlos@gmail.com", 
//     "accessCode":"patata", 
//     "oos:rate":"http://our_own_schema.org/rate/2"
// });

// var user2 = new User({
// 	"@id":"http://our_own_schema.org/user/2", 
//     "identifier": 2, 
//     "name":"Juan", 
//     "address":"Morella", 
//     "email":"juan@gmail.com", 
//     "accessCode":"patata", 
//     "oos:rate":"http://our_own_schema.org/rate/1"
// });user2.save()

// user.save().then(() => user2.save())
//  	.catch(err => console.log('Error!', err))


// states: ["Activo", "Pausado", "Desconectado"],
// locations: ["Cocina", "Comedor", "Baño", "Dormitorio"],
// deviceTypes: ["Electrodomestico", "Dispositivo electrónico", "Calefacción", "Refrigeración", "Iluminación"],

// var device = new Device({
// 	"@id": "http://our_own_schema.org/device/tv", 
//     "oos:owner" : "http://our_own_schema.org/user/1",
//     "identifier": "tv",
//     "itemCondition": "Activo", 
//     "location": "Comedor", 
//     "category": "Dispositivo electrónico", 
//     "description":"Televisión"
// });

// var device2 = new Device({
// 	"@id": "http://our_own_schema.org/device/nev", 
//     "oos:owner" : "http://our_own_schema.org/user/1",
//     "identifier": "nev",
//     "itemCondition": "Pausado", 
//     "location": "Comedor", 
//     "category": "Refrigeración", 
//     "description":"Nevera"
// });

var device3 = new Device({
	"@id": "http://our_own_schema.org/device/tv_coc", 
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": "tv_coc",
    "itemCondition": "Desconectado", 
    "location": "Cocina", 
    "category": "Dispositivo electrónico", 
    "description":"Televisión"
});

device3.save()

// device.save().then(() => device2.save().then(() => device3.save()))
// .catch(err => console.log('Error!', err))


// var measure = new Measure({
//     "@id": "http://our_own_schema.org/device/lav/measure/1",
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "identifier": 1,
//     "observationDate": "2020-04-07:17:00",
//     "measuredValue": 200
// });

// var measure2 = new Measure({
//     "@id": "http://our_own_schema.org/device/lav/measure/2",
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "identifier": 2,
//     "observationDate": "2020-04-07:18:00",
//     "measuredValue": 900
// });

// var measure3 = new Measure({
//     "@id": "http://our_own_schema.org/device/lav/measure/3",
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "identifier": 3,
//     "observationDate": "2020-04-07:19:00",
//     "measuredValue": 400
// });

// var measure4 = new Measure({
//     "@id": "http://our_own_schema.org/device/lav/measure/4",
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "identifier": 4,
//     "observationDate": "2020-04-07:20:00",
//     "measuredValue": 500
// });

// var measure5 = new Measure({
//     "@id": "http://our_own_schema.org/device/lav/measure/5",
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "identifier": 5,
//     "observationDate": "2020-04-07:21:00",
//     "measuredValue": 800
// });
    
// measure.save().catch(err => console.log('Error!', err))
// measure2.save().catch(err => console.log('Error!', err))
// measure3.save().catch(err => console.log('Error!', err))
// measure4.save().catch(err => console.log('Error!', err))
// measure5.save().catch(err => console.log('Error!', err))


// var recommendation = new Recommendation({
//     "@id": "http://our_own_schema.org/device/lav/recommendation/1", 
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "oos:owner" : "http://our_own_schema.org/user/1",
//     "identifier": 1, 
//     "dateCreated":"2020-03-31", 
//     "description":"Apaga la luz", 
//     "category": "Uso"
// });

// var recommendation2 = new Recommendation({
//     "@id": "http://our_own_schema.org/device/lav/recommendation/2", 
//     "oos:device" : "http://our_own_schema.org/device/lav",
//     "oos:owner" : "http://our_own_schema.org/user/1",
//     "identifier": 2, 
//     "dateCreated":"2020-04-05", 
//     "description":"Pon la lavadora por la noche", 
//     "category": "Consumo"
// });

// recommendation.save().catch(err => console.log('Error!', err))
// recommendation2.save().catch(err => console.log('Error!', err))