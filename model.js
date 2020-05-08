
const schema = require('./schemas')
const tokenController = require('./tokenJWT.js');

const User = schema.User;
const Device = schema.Device;
const Measure = schema.Measure;
const Recommendation = schema.Recommendation;

const contexts = ["http://schema.org/", {"oos": "http://our_own_schema.org"}];

const infoMeasure = {"@context": contexts , "@type": "Measure"};
const infoRecommendation = {"@context": contexts , "@type": "Recommendation"};

const addInfo = (data, info) => {
	data = JSON.parse(JSON.stringify(data))
	Object.assign(data, info);
	return data;
};

exports.login = data => {
	return new Promise((resolve) => {
		User.findOne({'email':data.email, 'accessCode':data.accessCode}).then(d => {
			if (d == null) {
				resolve('KO')
			} else {
				tokenController.createToken(d["@id"]).then(token => {
					var res = {identifier: d.identifier, "@id": d["@id"], name: d.name, token: token}
					resolve(res)
				})
			}
		});
	});
}

exports.getDevices = userId => {
	return new Promise((resolve) => {
		Device.find({'oos:owner':userId}).then(data => {
			var res = data.map(k => ({identifier: k.identifier, "@id": k["@id"], description: k.description}))
			resolve(res)
		});
	});
}

exports.addMeasure = (deviceId, data) => {
	return new Promise((resolve) => {
		var id = Date.now() + Math.floor(Math.random() * 10000000000000);

		if (!data.observationDate || !data.measuredValue)
			resolve('KO')

		var measure = new Measure({
			"@id": "http://our_own_schema.org/device/" + deviceId + "/measure/" + id,
			"oos:device" : "http://our_own_schema.org/device/" + deviceId,
			"identifier": id,
			"observationDate": new Date(data.observationDate),
			"measuredValue": data.measuredValue
		});

		measure.save()
			.then(() => {
				resolve('OK')
			}).catch((err) => {
				resolve('KO')
			})
	});
}

exports.addRecommendation= (deviceId, data, STREAM) => {
	return new Promise((resolve) => {
		var id = Date.now() + Math.floor(Math.random() * 10000000000000);

		if (!data.dateCreated || !data.description || !data.category)
			resolve('KO')

		var recommendation = new Recommendation({
			"@id": "http://54.174.138.71:8080/device/" + deviceId + "/recommendation/" + id, 
			"oos:device" : "http://our_own_schema.org/device/" + deviceId,
			"oos:owner" : data.userId,
			"identifier": id, 
			"dateCreated": new Date(data.dateCreated),
			"description": data.description,
			"category": data.category
		});

		recommendation.save()
			.then(() => {
				STREAM.send(JSON.stringify(data), 'newRecomendation')
				resolve('OK')
			}).catch(() => {
				resolve('KO')
			})
	});
}

exports.getRecommendation = (recommendationId) => {
	return new Promise((resolve) => {
		Recommendation.findOne({'identifier':recommendationId}).then(data => {
			resolve(addInfo(data, infoRecommendation))
		});
	});
}

exports.getMeasure = (measureId) => {
	return new Promise((resolve) => {
		Measure.findOne({'identifier':measureId}).then(data => {
			resolve(addInfo(data, infoMeasure))
		});
	});
}

exports.searchDevice = (itemCondition, location, category, userId) => {
	return new Promise((resolve) => {
		var filters = {"oos:owner": userId};

		if (itemCondition) {
			filters["itemCondition"] = itemCondition;
		}
		if (category) {
			filters["category"] = category;
		}
		if (location) {
			filters["location"] = location;
		}

		Device.find(filters).then(data => {
			var res = data.map(k => ({identifier: k.identifier, "@id": k["@id"], description: k.description}))
			resolve(res)
		});
	});
}

exports.getRecommendations = (deviceId, sDate, eDate, category, description, userId) => {
	return new Promise((resolve) => {
		var filters = {};
		if (deviceId == "all") {
			filters["oos:owner"] = userId;
		} else {
			filters["oos:device"] = "http://our_own_schema.org/device/" + deviceId;
		}

		if (category) {
			filters["category"] = category;
		}

		if (description) {
			filters["description"] = { $regex: '.*' + description + '.*', $options: 'i'}
		}

		if (sDate != undefined && eDate != undefined) {
			filters["dateCreated"] = { $gte: sDate, $lte: eDate}
		}
		Recommendation.find(filters).then(data => {
			var res = data.map(k => k["@id"])
			resolve(res)
		});
	});
}

exports.getMeasures = (deviceId, sValue, eValue, sDate, eDate) => {
	return new Promise((resolve) => {
		if ((sValue && eValue) || (sDate && eDate)) {
			var filters = {"oos:device" : "http://our_own_schema.org/device/" + deviceId}
			
			if (sDate != undefined && eDate != undefined) {
				var split = sDate.split("~");
				sDate = new Date(split[0]);
				var sHour = split[1].split(":");
				var sHora = parseInt(sHour[0]);
				sDate.setHours( sHora, sHour[1]);

				split = eDate.split("~");
				eDate = new Date(split[0]);
				var eHour = split[1].split(":");
				var eHora = parseInt(eHour[0]);
				eDate.setHours( eHora, eHour[1]);
				
				filters["observationDate"] = { $gte: sDate, $lte: eDate}
			}

			if (sValue && eValue) {
				filters["measuredValue"] = { $gte: sValue, $lte: eValue}
			}

			Measure.find(filters).then(data => {
				var res = data.map(k => ({"@id": k["@id"], observationDate: k.observationDate, measuredValue: k.measuredValue}))
				resolve(res)
			});
		} else {
			resolve("KO")
		}
	});
}


exports.deleteDevice = (deviceId) => {
	return new Promise((resolve) => {
		Device.deleteOne({'identifier':deviceId})
			.then(data => {
				if (data.deletedCount != 0) {
					var device = "http://our_own_schema.org/device/" + deviceId;
					Recommendation.deleteMany({'oos:device':device})
						.then(() => {
							Measure.deleteMany({'oos:device':device})
								.then(() => {
									resolve("OK");
								})
						})
				} else {
					resolve("KO")
				}
			})
	});
}

exports.deleteRecommendation = (recommendationId) => {
	return new Promise((resolve) => {
		Recommendation.deleteOne({'identifier':recommendationId})
			.then(data => {
				if (data.deletedCount == 0) {
					resolve("KO");
				} else {
					resolve("OK")
				}
			})
	});
}
