var protractorPerf = require('protractor-perf');

var statsList_ = [];
var scenarioName;

var ProtractorPerfRunner = function () {};

ProtractorPerfRunner.prototype.createRunner = function (protractor, browser, myScenarioName) {
	this.runner_ = new protractorPerf(protractor, browser);
	scenarioName = myScenarioName;
};

ProtractorPerfRunner.prototype.start = function () {
	return this.runner_.start();
};

ProtractorPerfRunner.prototype.stop = function () {
	this.runner_.stop().then(function () {
		this.runner_.getStats().then(function (stats) {
			stats.scenarioName = scenarioName;
			statsList_.push( stats );
		});
	}.bind(this));
};

ProtractorPerfRunner.prototype.isEnabled = function() {
	return this.runner_.isEnabled;
};

ProtractorPerfRunner.prototype.getStats = function (statName) {
	return this.runner_.getStats(statName);
};

ProtractorPerfRunner.prototype.destroyRunner = function() {
	this.runner_ = undefined;
};

module.exports = ProtractorPerfRunner;

module.exports.getStatsList = function () {
	return statsList_;
};
