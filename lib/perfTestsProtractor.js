module.exports = function(config) {
	var Q = require('q'),
		dfd = Q.defer(),
		dfdProtractor = Q.defer();

	if (config.couch.onlyUpdateSite) {
		dfd.resolve();
	} else {
		var protractorPerf = config.browserPerf || require('protractor-perf'),
		    protractorPerfRunner = require('./protractorPerfRunner'),
			log = config.log,
			reqConfigParser = require('protractor/built/configParser'),
			ConfigParser = reqConfigParser.default || reqConfigParser.ConfigParser,
			configParser = new ConfigParser(),
			protractorResults;
		config.protractorConfig.perf = {
			browsers: config.browsers,
			selenium: config.selenium,
			debugBrowser: config.debug,
			preScript: config.preScript,
			preScriptFile: config.preScriptFile,
			actions: config.actions,
			metrics: config.metrics,
			SAUCE_ACCESSKEY: config.SAUCE_ACCESSKEY || undefined,
			SAUCE_USERNAME: config.SAUCE_USERNAME || undefined,
			BROWSERSTACK_USERNAME: config.BROWSERSTACK_USERNAME || undefined,
			BROWSERSTACK_KEY: config.BROWSERSTACK_KEY || undefined
		};
		log.debug('Adding protractor config file ' + config.protractorConfig.file);
		configParser.addFileConfig(config.protractorConfig.file);
		log.debug('Adding additional config ');
		config.protractorConfig.afterLaunch = function (exitCode) {
			if (exitCode && exitCode != 0) {
				log.error('Protractor exit code: ' + exitCode);
			}
			log.debug('Got Browser Perf results back, now saving the results');
			protractorResults = protractorPerfRunner.getStatsList();
			dfd.resolve([protractorResults, dfdProtractor]);
			return dfdProtractor.promise;
		};
		configParser.addConfig(config.protractorConfig);
		log.debug('Starting Protractor Perf');
		protractorPerf.getConfig(configParser.getConfig(), function(data) {
			log.debug('Running the protractor launcher');
			require('protractor/built/launcher').init(undefined, data);
		});
	}
	return dfd.promise;
};
