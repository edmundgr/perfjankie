window.ENDPOINTS = {
	metricNames: {
		url: '../metadata/_view/metricNames'
	},
	pagelist: {
		url: '../metadata/_view/pagelist?group=true',
		transformResponse: function(data, headersGetter) {
			var result = {};

			angular.forEach(JSON.parse(data).rows, function(row) {
				var suite = row.key[0],
					pagename = row.key[1],
					browser = row.key[2] || 'unknown',
					runCount = row.value;

				if (typeof result[suite] === 'undefined') {
					result[suite] = {};
				}
				if (typeof result[suite][pagename] === 'undefined') {
					result[suite][pagename] = [];
				}
				result[suite][pagename].push({
					browser: browser,
					runCount: runCount
				});
			});
			return result;
		}
	}
};