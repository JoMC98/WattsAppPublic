const M = require('./model')
const tokenController = require('./tokenJWT.js');

const SSE = require('express-sse')

exports.middleware = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers',
	           'Origin, Content-Type, Accept')
	res.header('Cache-Control', 'no-cache')

	if (req.url.startsWith("/login") || req.url.startsWith("/web") || req.url.startsWith("/favicon") || req.url.startsWith("/notification")) {
		next()
	} else {
		tokenController.checkToken(req, res).then(result => {
            req.body.userId = result.identifier;
            next();
        })
	}
}

const STREAM = new SSE()

exports.notificate = (req, res) => STREAM.init(req, res)

exports.login = async (req, res) => res.send({result: await M.login(req.body)})

exports.getDevices = async (req, res) => res.send({result: await M.getDevices(req.body.userId)})

exports.getMeasure = async (req, res) => res.send({result: await M.getMeasure(req.params.measureID)})

exports.addMeasure = async (req, res) => res.send({result: await M.addMeasure(req.params.id, req.body)})

exports.getMeasures = async (req, res) => res.send({result: await M.getMeasures(req.params.id, req.query.sValue, req.query.eValue, req.query.sDate, req.query.eDate)})

exports.getRecommendation = async (req, res) => res.send({result: await M.getRecommendation(req.params.recommendationID)})

exports.addRecommendation = async (req, res) => res.send({result: await M.addRecommendation(req.params.id, req.body, STREAM)})

exports.getRecommendations = async (req, res) => res.send({result: await M.getRecommendations(req.params.id, req.query.sDate, req.query.eDate, req.query.category, req.query.description, req.body.userId)})

exports.searchDevice = async (req, res) => res.send({result: await M.searchDevice(req.query.itemCondition, req.query.location, req.query.category, req.body.userId)})

exports.deleteDevice = async (req, res) => res.send({result: await M.deleteDevice(req.params.id)})

exports.deleteRecommendation = async (req, res) => res.send({result: await M.deleteRecommendation(req.params.recommendationID)})