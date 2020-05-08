const bodyparser = require('body-parser')
const express    = require('express')
const app        = express()

const control = require('./controllers')

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.use(control.middleware)

app.use('/web', express.static('public'))

app.post('/login', control.login)

app.get('/notification', control.notificate)

app.get('/devices', control.getDevices )

app.get('/device/:id/measure/:measureID', control.getMeasure )

app.post('/device/:id/measure', control.addMeasure )

app.get('/device/:id/measures', control.getMeasures )

app.get('/device/:id/recommendation/:recommendationID', control.getRecommendation )

app.post('/device/:id/recommendation', control.addRecommendation )

app.get('/device/:id/recommendations', control.getRecommendations )

app.get('/device/search', control.searchDevice )

app.delete('/device/:id', control.deleteDevice)

app.delete('/device/:id/recommendation/:recommendationID', control.deleteRecommendation )

const PORT = 8080
app.listen(PORT, _ => console.log(`Servidor web escuchando en puerto ${PORT}`))
