//Estructura JSON
//User {id:String, name:String, address:String, email:String, passwd:String, rateId:String, token:String}
//Device {id: String, state: String, location: String, type: String, description: String}
//Measure {date: Timestamp, value: Number}
//Recommendation {id: String, date: Timestamp, description: String, type: String}

//Estructura Listas
//Users {idUser : {User}}
//Devices {idUser : {idDevice: {Device}, idDevice: {Device}}, ...}
//measures {idUser : {idDevice: [{Measure}, {Measure}], idDevice : ...}, ...}
//Recommendations {idUser : {idDevice: {idRecommendation : {Recommendation}, idRecommendation : {Recommendation}}, idDevice : ...}, ...}

//Listado de usuarios
let Users = [
    {
    "@id":"http://our_own_schema.org/user/1", 
    "identifier": 1, 
    "name":"Carlos", 
    "address":"Castellon", 
    "email":"carlos@gmail.com", 
    "accessCode":"patata", 
    "oos:rate":"http://our_own_schema.org/rate/1"
    },

    {
    "@id":"http://our_own_schema.org/user/2", 
    "identifier": 2, 
    "name":"Juan", 
    "address":"Morella", 
    "email":"juan@gmail.com", 
    "accessCode":"patata", 
    "oos:rate":"http://our_own_schema.org/rate/1"}
]

//Listado de dispositivos
let Devices =  [
    {
    "@id": "http://our_own_schema.org/device/lav", 
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": "lav",
    "itemCondition": "Activo", 
    "location": "Cocina", 
    "category": "Electrodomestico", 
    "description":"Lavadora"},

    { 
    "@id": "http://our_own_schema.org/device/sec", 
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": "sec",
    "itemCondition": "Activo", 
    "location": "Comedor", 
    "category": "Refrigeracion", 
    "description":"Secadora"},

    {
    "@id": "http://our_own_schema.org/device/lav2", 
    "oos:owner" : "http://our_own_schema.org/user/2",
    "identifier": "lav2",
    "itemCondition": "Activo", 
    "location": "Cocina", 
    "category": "Electrodomestico", 
    "description":"Lavadora"}
]

//Listado de medidas
let Measures = [
    {
    "@id": "http://our_own_schema.org/device/lav/measure/1",
    "oos:device" : "http://our_own_schema.org/device/lav",
    "identifier": 1,
    "observationDate": "2020-03-19:00:30",
    "measuredValue": 200},

    {
    "@id": "http://our_own_schema.org/device/lav/measure/2",
    "oos:device" : "http://our_own_schema.org/device/lav",
    "identifier": 2,
    "observationDate": "2020-03-19:01:30",
    "measuredValue": 800}
]

//Listado de recomendaciones
let Recommendations = [
    {
    "@id": "http://our_own_schema.org/device/lav/recommendation/1", 
    "oos:device" : "http://our_own_schema.org/device/lav",
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": 1, 
    "dateCreated":"2020-03-31", 
    "description":"Apaga la luz", 
    "category": "Uso"},

    {
    "@id": "http://our_own_schema.org/device/lav/recommendation/2", 
    "oos:device" : "http://our_own_schema.org/device/lav",
    "oos:owner" : "http://our_own_schema.org/user/1",
    "identifier": 2, 
    "dateCreated":"2020-04-05", 
    "description":"Pon la lavadora por la noche", 
    "category": "Consumo"}
]
