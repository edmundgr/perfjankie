var Q = require('q');

var init = require('./init'),
	site = require('./couchSite'),
	views = require('./couchViews'),
	data = require('./couchData'),
	perf = require('./perfTests'),
	perfProtractor = require('./perfTestsProtractor');

function resultArrayToPromiseChainData(arr, promise) {
	return arr.reduce( function (accum, cur) {
		console.log('accum:', accum);
		console.log('cur:', cur);
		return accum.then(function () {
			return data(config, cur);
		}, promise);
	});
}

function runTests(config) {
	var dfd = Q.defer();

	(function next(i) {
		if (i < config.repeat) {
			var myPerf;
			if (config.protractor) {
				myPerf = perfProtractor;
			} else {
				myPerf = perf;
			}
			myPerf(config).then(function(results) {
				var myResults;
				if (config.protractor) {
					myResults = results[0];
					myResults = myResults.map(function (metrics) {
						metrics._browserName = config.browsers[0].browserName;
						metrics._url = config.url;
						return metrics;
					});
					myResults.length = 1;
					config.dfdProtractor = results[1];
					config.name += ' - ' + myResults[0].scenarioName;
					return data(config, myResults);
				} else {
					myResults = results;
					return data(config, myResults);
				}
			}).then(function() {
				next(i + 1);
			}, function(err) {
				dfd.reject(err);
			}).done();
		} else {
			dfd.resolve();
		}
	}(0));
	return dfd.promise;
}

module.exports = function(config) {
	var options = require('./options')(config),
		log = options.log,
		cb = options.callback;

	log.info('Starting PerfJankie');

	init(config).then(function() {
		return runTests(config);
	}).then(function() {
		return Q.allSettled([site(config), views(config)]);
	}).then(function(res) {
		log.debug('Successfully done all tasks');
		cb(null, res);
		if (config.protractor) {
			config.dfdProtractor.resolve();
		}
	}, function(err) {
		log.debug(err);
		cb(err, null);
	}).done();
};