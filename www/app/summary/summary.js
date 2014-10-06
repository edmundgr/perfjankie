angular
	.module('summary', ['ngRoute', 'Backend'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/summary', {
				templateUrl: 'app/summary/summary.html',
				controller: 'SummaryCtrl',
				controllerAs: 'summary',
				resolve: {
					// TODO - get actual summary data					
					Summary: ['Data',
						function(Data) {
							return Data.summary();
						}
					]
				}
			});
		}
	])
	.controller('SummaryCtrl', ['Summary',
		function(Summary) {
			this.data = Summary;
		}
	]);