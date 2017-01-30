var app = angular.module('stocktool', ['nvd3', 'gridster', 'stocktool.services', 'ui.bootstrap']);

app.controller('dashboardCtrl', ['$scope', '$timeout', '$uibModal', 'DataService', function ($scope, $timeout, $modal, DataService) {
			var ctrl = this;

			$scope.gridsterOptions = {
				margins : [10, 10],
				columns : 6,
				minColumns : 1,
				minRows : 2,
				maxRows : 100,
				mobileModeEnabled : false,
				draggable : {
					handle : 'h3'
				},
				pushing : true,
				swapping : false,
				width : 'auto',
				colWidth : 'auto',
				outerMargin : true,
				minColumns : 1,
				resizable : {
					enabled : true,
					handles : ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

					// optional callback fired when resize is started
					start : function (event, $element, widget) {},

					// optional callback fired when item is resized,
					resize : function (event, $element, widget) {
						if (widget.chart.api)
							widget.chart.api.update();
					},

					// optional callback fired when item is finished resizing
					stop : function (event, $element, widget) {
						$timeout(function () {
							if (widget.chart.api)
								widget.chart.api.update();
						}, 400)
					}
				}
			};

			$scope.dashboards = [{
					name : "Default Dashboard",
					dashboardConfig : {
						widgets : [{
								col : 0,
								row : 0,
								sizeY : 2,
								sizeX : 2,
								name : "Discrete Bar Chart",
								chart : {
									options : DataService.discreteBarChart.options(),
									data : DataService.discreteBarChart.data(),
									api : {}
								}
							}, {
								col : 2,
								row : 0,
								sizeY : 2,
								sizeX : 2,
								name : "Candlestick Bar Chart",
								chart : {
									options : DataService.candlestickBarChart.options(),
									data : DataService.candlestickBarChart.data(),
									api : {}
								}
							}, {
								col : 0,
								row : 2,
								sizeY : 2,
								sizeX : 3,
								name : "Line Chart",
								chart : {
									options : DataService.lineChart.options(),
									data : DataService.lineChart.data(),
									api : {}
								}
							}, {
								col : 4,
								row : 2,
								sizeY : 1,
								sizeX : 1,
								name : "Pie Chart",
								chart : {
									options : DataService.pieChart.options(),
									data : DataService.pieChart.data(),
									api : {}
								}
							}
						]
					}
				}
			];

			$scope.addDashboard = function (name) {
				$scope.dashboards.push({
					name : name,
					dashboardConfig : {
						widgets : []
					}
				});
			};

			$scope.openSettings = function (widget) {
				$modal.open({
					scope : $scope,
					templateUrl : 'widget_settings.html',
					controller : 'dashboardCtrl',
					resolve : {
						widget : function () {
							return widget;
						}
					}
				});
			};

			$scope.dashboard = {
				widgets : [{
						col : 0,
						row : 0,
						sizeY : 2,
						sizeX : 2,
						name : "Discrete Bar Chart",
						chart : {
							options : DataService.discreteBarChart.options(),
							data : DataService.discreteBarChart.data(),
							api : {}
						}
					}, {
						col : 2,
						row : 0,
						sizeY : 2,
						sizeX : 2,
						name : "Candlestick Bar Chart",
						chart : {
							options : DataService.candlestickBarChart.options(),
							data : DataService.candlestickBarChart.data(),
							api : {}
						}
					}, {
						col : 0,
						row : 2,
						sizeY : 2,
						sizeX : 3,
						name : "Line Chart",
						chart : {
							options : DataService.lineChart.options(),
							data : DataService.lineChart.data(),
							api : {}
						}
					}, {
						col : 4,
						row : 2,
						sizeY : 1,
						sizeX : 1,
						name : "Pie Chart",
						chart : {
							options : DataService.pieChart.options(),
							data : DataService.pieChart.data(),
							api : {}
						}
					}
				]
			};

			// We want to manually handle `window.resize` event in each directive.
			// So that we emulate `resize` event using $broadcast method and internally subscribe to this event in each directive
			// Define event handler
			$scope.events = {
				resize : function (e, scope) {
					$timeout(function () {
						scope.api.update()
					}, 200)
				}
			};
			angular.element(window).on('resize', function (e) {
				$scope.$broadcast('resize');
			});

			// We want to hide the charts until the grid will be created and all widths and heights will be defined.
			// So that use `visible` property in config attribute
			$scope.config = {
				visible : false
			};
			$timeout(function () {
				$scope.config.visible = true;
			}, 200);

			// grid manipulation
			$scope.clear = function () {
				$scope.dashboard.widgets = [];
			};

			$scope.addWidget = function () {
				$scope.dashboard.widgets.push({
					name : "New Widget",
					sizeX : 1,
					sizeY : 1
				});
			};

			$scope.addWidgetDashboard = function () {	
				$modal.open({
					scope : $scope,
					templateUrl : 'widget_settings_new.html',
					controller : 'NewWidgetSettingsCtrl'					
				});
			};

			$scope.saveDashboard = function (dashboard) {}

			// Widget ctrl
			$scope.remove = function (widget) {
				$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
			};

			$scope.openSettings = function (widget) {
				$modal.open({
					scope : $scope,
					templateUrl : 'widget_settings.html',
					controller : 'WidgetSettingsCtrl',
					resolve : {
						widget : function () {
							return widget;
						}
					}
				});
			};

		}
	]);

app.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$uibModalInstance', 'widget',
		function ($scope, $timeout, $rootScope, $uibModalInstance, widget) {
			$scope.widget = widget;
			
			$scope.form = {
				name : widget.name,
				type: widget.type,
				sizeX : widget.sizeX,
				sizeY : widget.sizeY,
				col : widget.col,
				row : widget.row
			};

			$scope.sizeOptions = [{
					id : '1',
					name : '1'
				}, {
					id : '2',
					name : '2'
				}, {
					id : '3',
					name : '3'
				}, {
					id : '4',
					name : '4'
				}
			];

			$scope.dismiss = function () {
				$uibModalInstance.dismiss();
			};

			$scope.remove = function () {
				$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
				$uibModalInstance.close();
			};

			$scope.submit = function () {
				angular.extend(widget, $scope.form);

				$uibModalInstance.close(widget);
			};
		}
	]);
	
app.controller('NewWidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$uibModalInstance', 'DataService',
		function ($scope, $timeout, $rootScope, $uibModalInstance, DataService) {
			$scope.newWidget = {
				name: "",
				type:"",
				sizeX: "",
				sizeY: "",
				col: "",
				row: "",
				chart: {}
			};

			$scope.form = {
				name : $scope.newWidget.name,
				type: $scope.newWidget.type,
				sizeX : $scope.newWidget.sizeX,
				sizeY : $scope.newWidget.sizeY,
				col : $scope.newWidget.col,
				row : $scope.newWidget.row
			};

			$scope.sizeOptions = [{
					id : '1',
					name : '1'
				}, {
					id : '2',
					name : '2'
				}, {
					id : '3',
					name : '3'
				}, {
					id : '4',
					name : '4'
				}
			];

			$scope.dismiss = function () {
				$uibModalInstance.dismiss();
			};

			$scope.remove = function () {				
				$uibModalInstance.close();
			};

			$scope.submit = function () {
				angular.extend($scope.newWidget, $scope.form);
				
				switch($scope.form.type){			
				case 'lineChart':
					$scope.newWidget.chart = {
						options: DataService.lineChart.options(),
						data: DataService.lineChart.data(),
						api: {}
					}
					break;
				case 'discreteBarChart':
					$scope.newWidget.chart = {
						options: DataService.discreteBarChart.options(),
						data: DataService.discreteBarChart.data(),
						api: {}
					}
					break;
				case 'candlestickBarChart': 
					$scope.newWidget.chart = {
							options: DataService.candlestickBarChart.options(),
							data: DataService.candlestickBarChart.data(),
							api: {}
						}
					break;	
				case 'pieChart': 
					$scope.newWidget.chart = {
							options: DataService.pieChart.options(),
							data: DataService.pieChart.data(),
							api: {}
						}
					break;	
				}
				
				$scope.dashboard.widgets.push($scope.newWidget);

				$uibModalInstance.close();
			};
		}
	]);

// helper code
app.filter('object2Array', function () {
	return function (input) {
		var out = [];
		for (i in input) {
			out.push(input[i]);
		}
		return out;
	}
});
