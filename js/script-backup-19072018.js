// Apps
var app = angular.module('app', ['xeditable','ngRoute', 'angularRangeSlider', 'chart.js']);

app.config(function($routeProvider, $locationProvider, $httpProvider){

	//initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // Cache False
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	$httpProvider.defaults.withCredentials = false;
	
	
	//Chart.defaults.global.defaultFontColor = '#464646';
	Chart.defaults.global.defaultFontColor = '#d2d2d2';
	Chart.defaults.global.defaultFontSize = 8;
	Chart.defaults.global.defaultFontFamily = "HelveticaNeueETPro-Medium"
	Chart.defaults.global.defaultFontStyle = 'normal';
	
	$routeProvider.
		when('/login',{templateUrl: 'partials/login.html',controller: 'LoginController'}).
		when('/home',{templateUrl: 'partials/home.html',controller: 'HomeController'}).
		when('/event',{templateUrl: 'partials/event.html',controller: 'EventController'}).
		when('/service', {templateUrl: 'partials/service.html', controller: 'ServiceController'}).
		when('/pdumeteringsettings', {templateUrl: 'partials/PduMeteringSettings.html', controller: 'PduMeteringSettingsController'}).
		when('/about', {templateUrl: 'partials/about.html', controller: 'AboutController'}).
		when('/help', {templateUrl: 'partials/help.html', controller: 'HelpController'}).
		when('/pdumeteringhome', {templateUrl: 'partials/PduMeteringHome.html', controller: 'PduMeteringHomeController'}).
		when('/pdumeteringmeters', {templateUrl: 'partials/PduMeteringMeters.html', controller: 'PduMeteringMetersController'}).
		when('/bcmhome', {templateUrl: 'partials/BcmHome.html', controller: 'BcmHomeController'}).
		when('/bcmmeters', {templateUrl: 'partials/BcmMeters.html', controller: 'BcmMetersController'}).
		when('/bcmmetersbranchview', {templateUrl: 'partials/BcmMetersBranchView.html', controller: 'BcmMetersBranchViewController'}).
		when('/sfcmhome', {templateUrl: 'partials/SfcmHome.html', controller: 'SfcmHomeController'}).
		when('/sfcmmeters', {templateUrl: 'partials/SfcmMeters.html', controller: 'SfcmMetersController'}).
		otherwise({ redirectTo: '/index' });
	//$locationProvider.html5Mode(true);
});

app.run(function (editableOptions) {
	// For Editing the data
    editableOptions.theme = 'bs3';
});

// Directive

app.directive('popOverDirective', function($compile) {
    return {
        restrict: 'EAC',
        template: '<a href="#/event" data-toggle="popover" data-placement="right" data-popover-content="#popOverContentId" data-popover-is-open="isOpen">'+
					'<i class="fa fa-filter fa-lg" style="font-size: 20px;" aria-hidden="true"></i>'+
				  '</a>',
        link: function(scope, elements, attrs) {
			
			$("[data-toggle=popover]").popover({
				'trigger': 'click',
                'html': true,
                'container': 'body',
				content: function() {
				  var content = $(this).attr("data-popover-content");
				  return $compile($(content).children(".popover-body").html())(scope);
				},
				title: function() {
				  var title = $(this).attr("data-popover-content");
				  return $(title).children(".popover-heading").html();
				}
			});	
			
			

        }
    }
});

app.directive('activeLink', ['$timeout', '$location', '$interval', '$rootScope',
  function($timeout, $location, $interval, $rootScope) {
    return {
      restrict: 'A',
      priority: -1,
      link: function(scope, iElem) {
		//after the route has changed
		scope.$on("$routeChangeSuccess", function () {
			var hrefs = ['/#' + $location.path(),
						 '#' + $location.path(), //html5: false
						 $location.path()]; //html5: true
			var hrefContext = 
			angular.forEach(iElem.find('a'), function (a) {
				a = angular.element(a);
				if (-1 !== hrefs.indexOf(a.attr('href'))) {
					a.parent().removeClass('inactive-link');
					a.parent().addClass('active-link');
				} else if(hrefs[2] != '/pdumeteringthermal' && hrefs[2] != '/bcmmetersbranchview' && hrefs[2] != '/pdumeteringhomecb'){
					a.parent().removeClass('active-link');
					a.parent().addClass('inactive-link');
				}

			});

		});
      }
    };
  }
]);

app.directive('bootstrapSwitch', [
	function() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {

				element.bootstrapSwitch();

				element.on('switchChange.bootstrapSwitch', function(event, state) {
					// To get name of current target of bootstrapSwitch
					if (ngModel) {
						scope.$apply(function() {
							ngModel.$setViewValue(state);
						});
					}
				});

				scope.$watch(attrs.ngModel, function(newValue, oldValue) {
					if (newValue) {
						element.bootstrapSwitch('state', true, true);
					} else {
						element.bootstrapSwitch('state', false, true);
					}
				});
			}
		};
	}
]);


// Login Controller
app.controller('LoginController', function($scope, $http, $timeout, $location, $rootScope, $interval) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	document.getElementById('inputUserId').text = '';
	$rootScope.titleHeader = '';
	$rootScope.titleSubHeader = '';
	$rootScope.titleSubHeaderIcon = '';
	$scope.isChangePassword = false;
	$rootScope.activeEventsDisplay = false;

	$scope.AuthCategory = function(){
			alert('auth');
	}

	$scope.changePasswordScreenOpen = function() {
		$scope.isChangePassword = true;
	}

	$scope.changePasswordScreenClose = function() {
		$scope.isChangePassword = false;
	}
});

// Main Controller
app.controller('MainController', function($scope, $http, $timeout, $location, $rootScope, $interval) {		
	$rootScope.titleHeader = '';
	$rootScope.Day = '';
	$rootScope.Meridiem = '';
	$rootScope.titleSubHeaderIcon = './images/icons/icon-16/UI_Home_16.png';	
	$rootScope.activeEventsDisplay = false;		
	$scope.logo = ABB_LOGO_TYPE;
	$scope.versionNumber = VERSION;
	$scope.buildNumber = BUILDNUMBER;	
	$rootScope.routeFlow = {'home': 'home' , 'meters': '', 'settings': ''};	
	$location.url('/home');
	
	$scope.invokeTimeService = function() {
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		
		if(h<10)
		  h="0"+h;
		if(m<10)
		  m="0"+m;
	    if(s<10)
		  s="0"+s;
		if(h>12){
			h=h-12;
			$rootScope.Meridiem = 'PM';
		}else{
			$rootScope.Meridiem = 'AM';
		}
		$rootScope.time = h+ ":" + m;		
		var year = d.getFullYear();
		
		var day = d.getDay();
		
		switch(day){			
			case 0:
				$rootScope.Day = 'Sunday';
				break;
			case 1:
				$rootScope.Day = 'Monday';
				break;
			case 2:
				$rootScope.Day = 'Tuesday';
				break;
			case 3:
				$rootScope.Day = 'Wednesday';
				break;
			case 4:
				$rootScope.Day = 'Thursday';
				break;
			case 5:
				$rootScope.Day = 'Friday';
				break;
			case 6:
				$rootScope.Day = 'Saturday';
				break;
				
		}
		
		var d = d.toString();
		$rootScope.customDate=d.slice(0,3)+", "+d.slice(4,7)+" "+d.slice(8,10)+" "+year;
		$rootScope.customDateShort = d.slice(8,10)+" "+d.slice(4,7)+" "+year;
	}
	$scope.invokeTimeService();
	$interval(function () {
		$scope.invokeTimeService();
	}, TIMEDELAY);

   // Route to Avtive Events Page from Dashboard
   $scope.routeActiveEvents = function(){
	   $rootScope.activeEventsDisplay = true;
   }
   
   // Route to Home Page when the back button is clicked
   $scope.routeHomePage = function(){
	   $rootScope.routeFlow = {'home': 'home' , 'meters': '', 'settings': ''};
	   $location.url('/home');
   }
   
   // API call to show number of Active Events
   $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size)
		 .success(function(response) {
			$rootScope.eventCounter = response.event[1].Activecnt;
			if($rootScope.eventCounter>0){
				$("#active-event-counter-id").removeClass("event-notify-hide");
			}else{
				$("#active-event-counter-id").addClass("event-notify-hide");
			}			
		}).catch(function (response){
			$scope.networkFailure=true;
		});
   
   $scope.invokeStatusService = function() {
	   $http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?status')
		.success(function(response) {
			$scope.systemState = response.status[0].status;
			switch($scope.systemState)
			{
				case 'UNKNOWN':
					$scope.systemStateSource = 'UnknownIcon';
					break;

				case 'ALARM':
					$scope.systemStateSource = 'AlarmIcon';
					break;

				case 'WARNING':
					$scope.systemStateSource = 'WarningIcon';
					break;

				case 'NORMAL':
					$scope.systemStateSource = 'UI_Normal';
					break;
			}

			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?sysInfo')
			.success(function(response) {
				$scope.aboutInfo = response.info;
			}).catch(function (response){
				$scope.networkFailure=true;
			});
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?ethernet')
			.success(function(response) {
				$scope.networkDetails = response.Ethernet;
			}).catch(function (response){
				$scope.networkFailure=true;
			});	
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
			.success(function(response) {
				$scope.rating = response.Rating;
			}).catch(function (response){
				$scope.networkFailure=true;
			});
    }
	
	$scope.invokeStatusService();
	$interval(function () {
		$scope.invokeStatusService();
	}, DATADELAY);
	
});

// Home Controller
app.controller('HomeController', function($scope, $http, $timeout, $location, $interval, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'Home';
	$rootScope.activeEventsDisplay = false;
	$scope.deviceAvailable = false;
	
	$scope.singleDeviceSelect = function($event, i) {
		var element = $event;
		var deviceSelected = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText;
		$rootScope.selectedDeviceId = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.innerText.trim();

		switch(deviceSelected)
		{
			case 'PDU':
				$rootScope.routeFlow = {'home': 'pdumeteringhome' , 'meters': 'pdumeteringmeters', 'settings': 'pdumeteringsettings'};
				$location.url('/pdumeteringhome');
				break;
			case 'RPP':
			case 'BCM':
				$rootScope.routeFlow = {'home': 'bcmhome' , 'meters': 'bcmmeters', 'settings': 'pdumeteringsettings'};
				$location.url('/bcmhome');
				break;
			case 'SFCM':
				$rootScope.routeFlow = {'home': 'sfcmhome' , 'meters': 'sfcmmeters', 'settings': 'pdumeteringsettings'};
				$location.url('/sfcmhome');
				break;
		}
	};
		
	$scope.invokeDeviceStatusService = function(){
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?devicestatus')
			.success(function(response) {
				$scope.networkFailure=false;
				$scope.deviceAvailable=true;
				$scope.totalDevices = response.devicestatus;
				$scope.deviceStatusAll = [];				

				for(i=0; i<$scope.totalDevices.length; i++){

					if($scope.totalDevices[i].Active=='OK')
						$scope.totalDevices[i].Active='UI_Communication_24';
					else
						$scope.totalDevices[i].Active='UI_Lost_24';

					switch($scope.totalDevices[i].devciestatus)
					{
						case 'UNKNOWN':
							$scope.totalDevices[i].devciestatus = 'UnknownIcon';
							break;

						case 'ALARM':
							$scope.totalDevices[i].devciestatus = 'AlarmIcon';
							break;

						case 'WARNING':
							$scope.totalDevices[i].devciestatus = 'WarningIcon';
							break;

						case 'NORMAL':
							$scope.totalDevices[i].devciestatus = 'UI_Normal';
							break;
					}
					
					$scope.deviceStatusAll.push($scope.totalDevices[i]);
				}		
				
				// Initial Route Flow Settings based on the first device if PDU, BCM or SFCM
				$rootScope.selectedDeviceId = $scope.deviceStatusAll[0].Id;
				switch($scope.deviceStatusAll[0].Type){
					case 'PDU':
						$rootScope.routeFlow = {'home': 'home' , 'meters': 'pdumeteringmeters', 'settings': 'pdumeteringsettings'};
						break;
					case 'BCM':
					case 'RPP':
						$rootScope.routeFlow = {'home': 'home' , 'meters': 'bcmmeters', 'settings': 'pdumeteringsettings'};
						break;
					case 'SFCM':							
						$rootScope.routeFlow = {'home': 'sfcmhome' , 'meters': 'sfcmmeters', 'settings': 'pdumeteringsettings'};
						break;						
				}
				
				// If only one device is connected the page is routed to the dashboard page of that device
				if($scope.deviceStatusAll.length == 1){
					switch($scope.deviceStatusAll[0].Type)
					{
						case 'PDU':
							$rootScope.routeFlow = {'home': 'pdumeteringhome' , 'meters': 'pdumeteringmeters', 'settings': 'pdumeteringsettings'};
							$location.url('/pdumeteringhome');
							break;
						case 'RPP':
						case 'BCM':
							$rootScope.routeFlow = {'home': 'bcmhome' , 'meters': 'bcmmeters', 'settings': 'pdumeteringsettings'};
							$location.url('/bcmhome');
							break;
						case 'SFCM':
							$rootScope.routeFlow = {'home': 'sfcmhome' , 'meters': 'sfcmmeters', 'settings': 'pdumeteringsettings'};
							$location.url('/sfcmhome');
							break;
					}
				}

		}).catch(function (response){
			$scope.networkFailure=true;
		});
	}

	$scope.invokeDeviceStatusService();	
	
	$scope.deviceStausPromise = $interval(function () {
		$scope.invokeDeviceStatusService();
	}, DATADELAY);
	
	$scope.$on('$destroy', function () {
        $interval.cancel($scope.deviceStausPromise);
    });
	
	
});


//SFCM Controllers
app.controller('SfcmHomeController', function($scope, $http, $timeout, $interval, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'SFCM' + ' - '+$rootScope.selectedDeviceId;
	$rootScope.activeEventsDisplay = false;
	$scope.showCanvas = true;
	$scope.toggleViewTableMode = false;

	// To toggle between Graph & Table View
	$scope.toggleViewTableGraph = function($event, i) {
		var element = $event;
		var filterItem = element.currentTarget.id.trim();
		$scope.toggleViewTableMode = (filterItem=='tableModeId' ? true : false)

		// Setting the style for Graph/Table Link
		var currentItem = element.currentTarget.parentElement.firstElementChild;
		for(var i=0;i<element.currentTarget.parentElement.childElementCount;i++)
		{
			// Reset the class name of each element
			currentItem.className = '';			
			if(currentItem.id.trim() == filterItem){
				currentItem.className = 'active-text-link';
			}
			currentItem = currentItem.nextElementSibling
		}
		
	}

	$scope.options = {
						//responsive: false,
						legend: {
							display: true,
							position: 'bottom',
							labels: {								
								boxWidth: 20
							}
						},
						scales: {
							xAxes: [{
								categoryPercentage: 0.25,
							}],
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						},
					   showAllTooltips: true,
					   tooltipEvents: [],	
					   onAnimationComplete: function() {
							this.showTooltip(this.segments, true);
						}
					};

	$scope.colorsVoltageHarmonics =	[
					  {
						backgroundColor: '#2E92FA'
					  },
					  {
						backgroundColor: 'orange'
					  }
					 ];
	$scope.labelsVoltageHarmonics = ['A', 'B', 'C'];
	$scope.seriesVoltageHarmonics = ['Voltage', 'Load'];

	$scope.invokeServices = function(){
	
		// API call for Panel 1			
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1').
			success(function(response) {
			$scope.panelConfig1 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/1').
				success(function(response) {
					$scope.currentResponse1 = response;
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/1').
						success(function(response) {
							$scope.voltageResponse1 = response;
							$scope.voltageResponseValue1 =JSON.parse(JSON.stringify($scope.voltageResponse1));
							switch($scope.voltageResponse1.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse1.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse1.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageResponse1.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse1.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse1.Voltage.L1 = $scope.voltageResponse1.Voltage.L1/$scope.panelConfig1.VoltRating * 100;
							$scope.voltageResponse1.Voltage.L2 = $scope.voltageResponse1.Voltage.L2/$scope.panelConfig1.VoltRating * 100;		
							$scope.voltageResponse1.Voltage.L3= $scope.voltageResponse1.Voltage.L3/$scope.panelConfig1.VoltRating * 100;
							
							$scope.panelData1 = 	[
														[$scope.voltageResponse1.Voltage.L1,
														$scope.voltageResponse1.Voltage.L2, 
														$scope.voltageResponse1.Voltage.L3],
														[$scope.currentResponse1.Load.L1,
														$scope.currentResponse1.Load.L2,
														$scope.currentResponse1.Load.L3,
														]
												];
												
												
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});

		// API call for Panel 2	
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2').
			success(function(response) {
			$scope.panelConfig2 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/2').
				success(function(response) {
					$scope.currentResponse2 = response;
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/2').
						success(function(response) {
							$scope.voltageResponse2 = response;
							$scope.voltageResponseValue2 =JSON.parse(JSON.stringify($scope.voltageResponse2));
							switch($scope.voltageResponse2.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse2.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse2.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageRespons2.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse2.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse2.Voltage.L1 = $scope.voltageResponse2.Voltage.L1/$scope.panelConfig2.VoltRating * 100;
							$scope.voltageResponse2.Voltage.L2 = $scope.voltageResponse2.Voltage.L2/$scope.panelConfig2.VoltRating * 100;		
							$scope.voltageResponse2.Voltage.L3= $scope.voltageResponse2.Voltage.L3/$scope.panelConfig2.VoltRating * 100;
						
							$scope.panelData2 = [	[$scope.voltageResponse2.Voltage.L1,
											$scope.voltageResponse2.Voltage.L2, 
											$scope.voltageResponse2.Voltage.L3],
											[$scope.currentResponse2.Load.L1,
											$scope.currentResponse2.Load.L2,
											$scope.currentResponse2.Load.L3,
											]
										     ];
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});

		// API call for Panel 3

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3').
			success(function(response) {
			$scope.panelConfig3 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/3').
				success(function(response) {
					$scope.currentResponse3 = response;					
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/3').
						success(function(response) {
							$scope.voltageResponse3 = response;
							$scope.voltageResponseValue3 =JSON.parse(JSON.stringify($scope.voltageResponse3));
							switch($scope.voltageResponse3.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse3.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse3.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageResponse3.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse3.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse3.Voltage.L1 = $scope.voltageResponse3.Voltage.L1/$scope.panelConfig3.VoltRating * 100;
							$scope.voltageResponse3.Voltage.L2 = $scope.voltageResponse3.Voltage.L2/$scope.panelConfig3.VoltRating * 100;		
							$scope.voltageResponse3.Voltage.L3= $scope.voltageResponse3.Voltage.L3/$scope.panelConfig3.VoltRating * 100;
						
							$scope.panelData3 = [	[$scope.voltageResponse3.Voltage.L1,
											$scope.voltageResponse3.Voltage.L2, 
											$scope.voltageResponse3.Voltage.L3],
											[$scope.currentResponse3.Load.L1,
											$scope.currentResponse3.Load.L2,
											$scope.currentResponse3.Load.L3,
											]
										     ];
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});

		// API call for Panel 4

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4').
			success(function(response) {
			$scope.panelConfig4 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/4').
				success(function(response) {
					$scope.currentResponse4 = response;
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/4').
						success(function(response) {
							$scope.voltageResponse4 = response;							
							$scope.voltageResponseValue4 =JSON.parse(JSON.stringify($scope.voltageResponse4));
							
							switch($scope.voltageResponse4.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse4.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse4.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageResponse4.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse4.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse4.Voltage.L1 = $scope.voltageResponse4.Voltage.L1/$scope.panelConfig4.VoltRating * 100;
							$scope.voltageResponse4.Voltage.L2 = $scope.voltageResponse4.Voltage.L2/$scope.panelConfig4.VoltRating * 100;		
							$scope.voltageResponse4.Voltage.L3= $scope.voltageResponse4.Voltage.L3/$scope.panelConfig4.VoltRating * 100;
						
							$scope.panelData4 = [	[$scope.voltageResponse4.Voltage.L1,
											$scope.voltageResponse4.Voltage.L2, 
											$scope.voltageResponse4.Voltage.L3],
											[$scope.currentResponse4.Load.L1,
											$scope.currentResponse4.Load.L2,
											$scope.currentResponse4.Load.L3,
											]
										     ];
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});
			
		
				
						
	}

	$scope.invokeServices(); // Initial Call
	$scope.sfcmHomePromise = $interval(function(){$scope.invokeServices()}, DATADELAY);

	$scope.$on('$destroy', function () {
        $interval.cancel($scope.sfcmHomePromise);
    });
});

app.controller('SfcmMetersController', function($scope, $http, $timeout, $interval, $rootScope, $location, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'SFCM'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.activeEventsDisplay = false;	
	$rootScope.paginationNumbersBcmMeters = [];
	$scope.subFeeds = [];
	$scope.powerLoad = [];
	$scope.subFeedIndicator = 'active-link';
	$scope.subfeedNumber = "Subfeed 1";
	
	// Remove the below hard coded value after testing
	$rootScope.selectedDeviceId = 8;
	
	$scope.panelStatuses = [1, 2, 3, 4]
	$scope.selectedPanel = $scope.panelStatuses[0];
	
	
	// Subfeed when clicked from main view
	$scope.subfeedDetails = function($event, i) {
		$scope.meterView = true;
		$scope.settingsView = false;
		var element = $event;
		element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';		
		$(".bcm-meters-table-outer-content").css("width","300px");
		element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.style.display = 'block';
		element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.style.display = 'block';
		$scope.subfeedNumber = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText.trim();
		$scope.styleIndicator = ['border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0','border-left: 0'];
		
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/attributes/'+$rootScope.selectedDeviceId)
			.success(function(response) {
					$scope.settingsAttributes = response;
				
			}).catch(function (response){
					$scope.networkFailure=true;
			});
		
		switch($scope.subfeedNumber){
				case "Subfeed 1":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
						.success(function(response) {
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==0){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 2":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==1){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 3":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==2){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 4":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==3){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 5":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==4){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 6":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==5){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 7":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==6){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 8":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==7){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 9":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==8){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 10":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==9){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 11":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==10){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 12":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==11){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 13":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==12){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 14":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==13){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
		}
	}
	
	// Subfeed when clicked from side/minimized view
	$scope.subfeedDetailsMinView = function($event, i) {
		
		var element = $event;
		$scope.subfeedNumber = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText.trim();
		
		// Deselect all indicators previously selected
		element.currentTarget.parentElement.firstElementChild.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		element.currentTarget.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.style.borderLeft = "0";
		
		element.currentTarget.firstElementChild.style.borderLeft = "3px solid #2f96ea";
		
		switch($scope.subfeedNumber){
				case "Subfeed 1":
					// Subfeed 1	
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
						.success(function(response) {	
								$scope.subFeedDetails = response;
																
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 2":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 3":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 4":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 5":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 6":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 7":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 8":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 9":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 10":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 11":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 12":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 13":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 14":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
		}
	}
	
	// When the Settings and Meters icon is clicked in the Right Split View
	$scope.invokeSubfeedUserConfigDetails = function(){
		
		// To show the Settings Table
		if($scope.meterView == true){
			$scope.meterView = false;
			$scope.settingsView = true;
		}else{
			$scope.meterView = true;
			$scope.settingsView = false;
		}		
				
		// Display and Bind Settings View
		if($scope.settingsView){
			
			$scope.editMode = false;
			$scope.subfeedUserConfigDetails = null;
			
			switch($scope.subfeedNumber){
				case "Subfeed 1":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 2":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 3":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 4":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 5":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 6":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 7":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 8":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 9":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 10":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 11":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 12":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 13":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 14":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				
			}
		}
		//Display and Bind Meters View
		else{
			switch($scope.subfeedNumber){
				case "Subfeed 1":
					// Subfeed 1	
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
						.success(function(response) {
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==0){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 2":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==1){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 3":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==2){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 4":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==3){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 5":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==4){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}

				break;
				case "Subfeed 6":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==5){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 7":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==6){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 8":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==7){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 9":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==8){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 10":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==9){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 11":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==10){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 12":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==11){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 13":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==12){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
				case "Subfeed 14":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
						.success(function(response) {	
								$scope.subFeedDetails = response;
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
					for(var i=0; i<$scope.styleIndicator.length; i++){
						if(i==13){
							$scope.styleIndicator[i] = 'border-left: 3px solid #2f96ea';
						}else{
							$scope.styleIndicator[i] = 'border-left: 0';
						}
					}
				break;
			}
		}
	}
	
	// When the close button from the Right Split View is clicked
	$scope.subfeedList = function($event, i) {
		var element = $event;				
		var subfeeds = element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.firstElementChild;
		for(var i=0; i<14; i++){
			subfeeds.firstElementChild.style.borderLeft = "0";
			subfeeds = subfeeds.nextElementSibling;
		}
		
		element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.style.display = 'none';
		element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.style.display = 'none';
		$(".bcm-meters-table-outer-content").css("width","350px");		
		element.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.style.display = 'block';				
	}
	
	// Edit and Bind the required value
	$scope.editModeFeatureValue = function(data,requiredParameter, requiredParameter2){
		if($scope.editMode == false){
			$scope.editMode = true;
		}
		
		$scope.subfeedUserConfigDetails.requiredParameter2 = data;
	}
			
	$scope.saveChanges = function(){
		var postBody = $scope.subfeedUserConfigDetails;
		
		switch($scope.subfeedNumber){
				case "Subfeed 1":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 2":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 3":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 4":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 5":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 6":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 7":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 8":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 9":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 10":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10, postBody, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 11":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 12":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 13":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 14":
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14, postBody)
						.success(function(response) {	
								console.log(response);
							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				
			}
			
			$scope.editMode = false;
			
	}

	$scope.discardChanges = function(){		
		$scope.editMode = false;
	}
	
	$scope.invokeServices = function(){	
	
		// To have the Subfeed Detail View panel with the selected Subfeed details
		switch($scope.subfeedNumber){
				case "Subfeed 1":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 2":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 3":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 4":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 5":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 6":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 7":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 8":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 9":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 10":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 11":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 12":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 13":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
				case "Subfeed 14":
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedUserConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
						.success(function(response) {	
								$scope.subfeedUserConfigDetails = response;							
						}).catch(function (response){
								$scope.networkFailure=true;
						});
				break;
		}
	
		// Subfeed 1	
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+1)
			.success(function(response) {
				
				$scope.subFeeds = [];
				$scope.powerLoad = [];
				
				$scope.subFeeds.push(response);
				var feed=0;
				$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[feed]);
				for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
					if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
						$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
					}
				}
				if($scope.powerLoad[feed]>100){
					$scope.datapie1 = [100, 0];
					$scope.colorspie1 = ["#ff0000", "#272727"];
				}else{
					$scope.colorspie1 = ["#0b74da", "#272727"];
					$scope.datapie1 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
				}
				
				$scope.labelspie1 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
				$scope.optionspie1 = {
									      responsive: false,
										  rotation: 1 * (3/4*Math.PI),
										  circumference: 1 * (3/2*Math.PI),
										  cutoutPercentage: 86,
										  elements: { arc: { 
																borderWidth: 0,
																borderColor: '#0b74da'
															} 
													},
										   animation: false
									};
									
				// Subfeed 2
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+2)
					.success(function(response) {	
						$scope.subFeeds.push(response);
						var feed=1;
						$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
						for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
							if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
								$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
							}
						}
						if($scope.powerLoad[feed]>100){
							$scope.datapie2 = [100, 0];
							$scope.colorspie2 = ["#ff0000", "#272727"];
						}else{
							$scope.colorspie2 = ["#0b74da", "#272727"];
							$scope.datapie2 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
						}
						
						$scope.labelspie2 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];						
						$scope.optionspie2 = {
												  responsive: false,
												  rotation: 1 * (3/4*Math.PI),
												  circumference: 1 * (3/2*Math.PI),
												  cutoutPercentage: 86,
												  elements: { arc: { 
																		borderWidth: 0,
																		borderColor: '#0b74da'
																	} 
															},
												   animation: false
											};
											
						// Subfeed 3
						$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+3)
						.success(function(response) {						
							$scope.subFeeds.push(response);
							var feed=2;
							$scope.powerLoad.push($scope.subFeeds[2].Power.Load[0]);
							for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
								if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
									$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
								}
							}
							if($scope.powerLoad[feed]>100){
								$scope.datapie3 = [100, 0];
								$scope.colorspie3 = ["#ff0000", "#272727"];
							}else{
								$scope.colorspie3 = ["#0b74da", "#272727"];
								$scope.datapie3 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
							}
							
							$scope.labelspie3 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
							$scope.optionspie3 = {
													   responsive: false,
													  rotation: 1 * (3/4*Math.PI),
													  circumference: 1 * (3/2*Math.PI),
													  cutoutPercentage: 86,
													  elements: { arc: { 
																			borderWidth: 0,
																			borderColor: '#0b74da'
																		} 
																},
													   animation: false
												};
												
							// Subfeed 4
							$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+4)
							.success(function(response) {						
								$scope.subFeeds.push(response);
								var feed=3;
								$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
								for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
									if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
										$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
									}
								}
								if($scope.powerLoad[feed]>100){
									$scope.datapie4 = [100, 0];
									$scope.colorspie4 = ["#ff0000", "#272727"];
								}else{
									$scope.colorspie4 = ["#0b74da", "#272727"];
									$scope.datapie4 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
								}
								
								$scope.labelspie4 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
								$scope.optionspie4 = {
														   responsive: false,
														  rotation: 1 * (3/4*Math.PI),
														  circumference: 1 * (3/2*Math.PI),
														  cutoutPercentage: 86,
														  elements: { arc: { 
																				borderWidth: 0,
																				borderColor: '#0b74da'
																			} 
																	},
														   animation: false
													};
													
								// Subfeed 5
								$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+5)
								.success(function(response) {						
									$scope.subFeeds.push(response);
									var feed=4;
									$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
									for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
										if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
											$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
										}
									}
									if($scope.powerLoad[feed]>100){
										$scope.datapie5 = [100, 0];
										$scope.colorspie5 = ["#ff0000", "#272727"];
									}else{
										$scope.colorspie5 = ["#0b74da", "#272727"];
										$scope.datapie5 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
									}
									
									$scope.labelspie5 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
									$scope.optionspie5 = {
															   responsive: false,
															  rotation: 1 * (3/4*Math.PI),
															  circumference: 1 * (3/2*Math.PI),
															  cutoutPercentage: 86,
															  elements: { arc: { 
																					borderWidth: 0,
																					borderColor: '#0b74da'
																				} 
																		},
															   animation: false
														};
														
									// Subfeed 6
									$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+6)
									.success(function(response) {						
										$scope.subFeeds.push(response);
										var feed=5;
										$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
										for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
											if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
												$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
											}
										}
										if($scope.powerLoad[feed]>100){
											$scope.datapie6 = [100, 0];
											$scope.colorspie6 = ["#ff0000", "#272727"];
										}else{
											$scope.colorspie6 = ["#0b74da", "#272727"];
											$scope.datapie6 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
										}
										
										$scope.labelspie6 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
										$scope.optionspie6 = {
																   responsive: false,
																  rotation: 1 * (3/4*Math.PI),
																  circumference: 1 * (3/2*Math.PI),
																  cutoutPercentage: 86,
																  elements: { arc: { 
																						borderWidth: 0,
																						borderColor: '#0b74da'
																					} 
																			},
																   animation: false
															};
															
										// Subfeed 7
										$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+7)
										.success(function(response) {						
											$scope.subFeeds.push(response);
											var feed=6;
											$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
											for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
												if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
													$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
												}
											}
											if($scope.powerLoad[feed]>100){
												$scope.datapie7 = [100, 0];
												$scope.colorspie7 = ["#ff0000", "#272727"];
											}else{
												$scope.colorspie7 = ["#0b74da", "#272727"];
												$scope.datapie7 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
											}
											
											$scope.labelspie7 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
											$scope.optionspie7 = {
																	   responsive: false,
																	  rotation: 1 * (3/4*Math.PI),
																	  circumference: 1 * (3/2*Math.PI),
																	  cutoutPercentage: 86,
																	  elements: { arc: { 
																							borderWidth: 0,
																							borderColor: '#0b74da'
																						} 
																				},
																	   animation: false
																};
																
											// Subfeed 8
											$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+8)
											.success(function(response) {						
												$scope.subFeeds.push(response);
												var feed=7;
												$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
												for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
													if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
														$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
													}
												}
												if($scope.powerLoad[feed]>100){
													$scope.datapie8 = [100, 0];
													$scope.colorspie8 = ["#ff0000", "#272727"];
												}else{
													$scope.colorspie8 = ["#0b74da", "#272727"];
													$scope.datapie8 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
												}
												
												$scope.labelspie8 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
												$scope.optionspie8 = {
																		   responsive: false,
																		  rotation: 1 * (3/4*Math.PI),
																		  circumference: 1 * (3/2*Math.PI),
																		  cutoutPercentage: 86,
																		  elements: { arc: { 
																								borderWidth: 0,
																								borderColor: '#0b74da'
																							} 
																					},
																		   animation: false
																	};
											// Subfeed 9
											$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+9)
											.success(function(response) {						
												$scope.subFeeds.push(response);
												var feed=8;
												$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
												for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
													if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
														$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
													}
												}
												if($scope.powerLoad[feed]>100){
													$scope.datapie9 = [100, 0];
													$scope.colorspie9 = ["#ff0000", "#272727"];
												}else{
													$scope.colorspie9 = ["#0b74da", "#272727"];
													$scope.datapie9 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
												}
												
												$scope.labelspie9 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
												$scope.optionspie9 = {
																		   responsive: false,
																		  rotation: 1 * (3/4*Math.PI),
																		  circumference: 1 * (3/2*Math.PI),
																		  cutoutPercentage: 86,
																		  elements: { arc: { 
																								borderWidth: 0,
																								borderColor: '#0b74da'
																							} 
																					},
																		   animation: false
																	};
																	
												// Subfeed 10
												$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+10)
												.success(function(response) {						
													$scope.subFeeds.push(response);
													var feed=9;
													$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
													for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
														if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
															$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
														}
													}
													if($scope.powerLoad[feed]>100){
														$scope.datapie10 = [100, 0];
														$scope.colorspie10 = ["#ff0000", "#272727"];
													}else{
														$scope.colorspie10 = ["#0b74da", "#272727"];
														$scope.datapie10 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
													}
													
													$scope.labelspie10 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
													$scope.optionspie10 = {
																			   responsive: false,
																			  rotation: 1 * (3/4*Math.PI),
																			  circumference: 1 * (3/2*Math.PI),
																			  cutoutPercentage: 86,
																			  elements: { arc: { 
																									borderWidth: 0,
																									borderColor: '#0b74da'
																								} 
																						},
																			   animation: false
																		};
																		
													// Subfeed 11
													$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+11)
													.success(function(response) {						
														$scope.subFeeds.push(response);
														var feed=10;
														$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
														for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
															if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
																$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
															}
														}
														if($scope.powerLoad[feed]>100){
															$scope.datapie11 = [100, 0];
															$scope.colorspie11 = ["#ff0000", "#272727"];
														}else{
															$scope.colorspie11 = ["#0b74da", "#272727"];
															$scope.datapie11 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
														}
														
														$scope.labelspie11 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
														$scope.optionspie11 = {
																				   responsive: false,
																				  rotation: 1 * (3/4*Math.PI),
																				  circumference: 1 * (3/2*Math.PI),
																				  cutoutPercentage: 86,
																				  elements: { arc: { 
																										borderWidth: 0,
																										borderColor: '#0b74da'
																									} 
																							},
																				   animation: false
																			};
																			
														// Subfeed 12
														$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+12)
														.success(function(response) {						
															$scope.subFeeds.push(response);
															var feed=11;
															$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
															for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
																if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
																	$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
																}
															}
															if($scope.powerLoad[feed]>100){
																$scope.datapie12 = [100, 0];
																$scope.colorspie12 = ["#ff0000", "#272727"];
															}else{
																$scope.colorspie12 = ["#0b74da", "#272727"];
																$scope.datapie12 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
															}
															
															$scope.labelspie12 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
															$scope.optionspie12 = {
																					   responsive: false,
																					  rotation: 1 * (3/4*Math.PI),
																					  circumference: 1 * (3/2*Math.PI),
																					  cutoutPercentage: 86,
																					  elements: { arc: { 
																											borderWidth: 0,
																											borderColor: '#0b74da'
																										} 
																								},
																					   animation: false
																				};
																				
													// Subfeed 13
													$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+13)
													.success(function(response) {						
														$scope.subFeeds.push(response);
														var feed=12;
														$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
														for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
															if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
																$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
															}
														}
														if($scope.powerLoad[feed]>100){
															$scope.datapie13 = [100, 0];
															$scope.colorspie13 = ["#ff0000", "#272727"];
														}else{
															$scope.colorspie13 = ["#0b74da", "#272727"];
															$scope.datapie13 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
														}
														
														$scope.labelspie13 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
														$scope.optionspie13 = {
																				   responsive: false,
																				  rotation: 1 * (3/4*Math.PI),
																				  circumference: 1 * (3/2*Math.PI),
																				  cutoutPercentage: 86,
																				  elements: { arc: { 
																										borderWidth: 0,
																										borderColor: '#0b74da'
																									} 
																							},
																				   animation: false
																			};
																			
														// Subfeed 14
														$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SubfeedMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+14)
														.success(function(response) {						
															$scope.subFeeds.push(response);
															var feed=13;
															$scope.powerLoad.push($scope.subFeeds[feed].Power.Load[0]);
															for(var i=1; i<$scope.subFeeds[feed].Power.Load.length; i++){
																if($scope.subFeeds[feed].Power.Load[i] > $scope.powerLoad[feed]){
																	$scope.powerLoad[feed] = $scope.subFeeds[feed].Power.Load[i];
																}
															}
															if($scope.powerLoad[feed]>100){
																$scope.datapie14 = [100, 0];
																$scope.colorspie14 = ["#ff0000", "#272727"];
															}else{
																$scope.colorspie4 = ["#0b74da", "#272727"];
																$scope.datapie14 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];
															}
															
															$scope.labelspie14 = [$scope.powerLoad[feed], 100-$scope.powerLoad[feed]];															
															$scope.optionspie14 = {
																					   responsive: false,
																					  rotation: 1 * (3/4*Math.PI),
																					  circumference: 1 * (3/2*Math.PI),
																					  cutoutPercentage: 86,
																					  elements: { arc: { 
																											borderWidth: 0,
																											borderColor: '#0b74da'
																										} 
																								},
																					   animation: false
																				};
															
														}).catch(function (response){
															$scope.networkFailure=true;
														});
														
													}).catch(function (response){
														$scope.networkFailure=true;
													});
															
														}).catch(function (response){
															$scope.networkFailure=true;
														});
														
													}).catch(function (response){
														$scope.networkFailure=true;
													});
													
												}).catch(function (response){
													$scope.networkFailure=true;
												});
												
											}).catch(function (response){
												$scope.networkFailure=true;
											});
												
											}).catch(function (response){
												$scope.networkFailure=true;
											});
											
										}).catch(function (response){
											$scope.networkFailure=true;
										});
										
									}).catch(function (response){
										$scope.networkFailure=true;
									});
									
								}).catch(function (response){
									$scope.networkFailure=true;
								});
								
							}).catch(function (response){
								$scope.networkFailure=true;
							});
							
						}).catch(function (response){
							$scope.networkFailure=true;
						});
						
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				
				
				
			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
			$scope.subFeeds.splice(1, 1);
				
	}
	
	$scope.fixPieText = false;
	$scope.invokeServices();
	
	$scope.panelStatusChanged = function($event, i){
		var element = $event;	
		$scope.fixPieText = true;		
		$scope.invokeServices();
	}
	
	// Setting the text
	Chart.pluginService.register({
	  beforeDraw: function(chart) {
		  
			// For Pie Chart
			if(chart.config.type == "doughnut"){
								
				var width = chart.chart.width,
					height = chart.chart.height/1.25,
					ctx = chart.chart.ctx;
				if($scope.fixPieText){
					ctx.clearRect(0, 0, width, height);
				}
				ctx.restore();
				var fontSize = (height / 114).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Light";
				ctx.textBaseline = "middle";
				ctx.fillStyle = '#d2d2d2';
					
				var fontSize = (height / 57).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Medium";
				
				switch(ctx.canvas.id){
					case 'pieChart1':	
						if($scope.subFeeds.length>=1){
							var text = $scope.subFeeds[0].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;							
							ctx.fillText(text, textX, textY);
						}						
						break;
					case 'pieChart2':					
						if($scope.subFeeds.length>=2){
							var text = $scope.subFeeds[1].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}	
						break;
					case 'pieChart3':					
						if($scope.subFeeds.length>=3){
							var text = $scope.subFeeds[2].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}							
						break;
					case 'pieChart4':
						if($scope.subFeeds.length>=4){
							var text = $scope.subFeeds[3].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}	
						break;
					case 'pieChart5':
						if($scope.subFeeds.length>=5){
							var text = $scope.subFeeds[4].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}	
						break;
					case 'pieChart6':
						if($scope.subFeeds.length>=6){
							var text = $scope.subFeeds[5].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}	
						break;
					case 'pieChart7':	
						if($scope.subFeeds.length>=7){
							var text = $scope.subFeeds[6].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart8':
						if($scope.subFeeds.length>=8){
							var text = $scope.subFeeds[7].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart9':
						if($scope.subFeeds.length>=9){
							var text = $scope.subFeeds[8].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart10':	
						if($scope.subFeeds.length>=10){
							var text = $scope.subFeeds[9].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart11':	
						if($scope.subFeeds.length>=11){
							var text = $scope.subFeeds[10].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart12':
						if($scope.subFeeds.length>=12){
							var text = $scope.subFeeds[11].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart13':	
						if($scope.subFeeds.length>=13){
							var text = $scope.subFeeds[12].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
					case 'pieChart14':
						if($scope.subFeeds.length>=14){
							var text = $scope.subFeeds[13].Power.TotalkW,
							textX = Math.round((width - ctx.measureText(text).width)/2),
							textY = height/2*1.5;
							ctx.fillText(text, textX, textY);
						}
						break;
				}
				
				
				var fontSize = (height / 114).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Light";
				var text = "kW",
						textX = Math.round((width - ctx.measureText(text).width)/2),
						textY = height/2*2;
				ctx.fillText(text, textX, textY)
				
				ctx.save();
				
			}
			
	  }
	});
	

});


//BCM Controllers
app.controller('BcmHomeController', function($scope, $http, $timeout, $interval, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'Remote Power Panel' + ' - '+$rootScope.selectedDeviceId;
	$rootScope.activeEventsDisplay = false;
	$scope.showCanvas = true;
	$scope.editMode = false;
	//$scope.panelConfigEditMode = false;
	$scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
	
	$scope.panelNumbers = [];
	for(var i=1; i<=4; i++){
		$scope.panelNumbers.push(i);
	}
	$scope.selectedPanelNumber = $scope.panelNumbers[0];
	
	$scope.panelChanged = function(item){
		$scope.selectedPanelNumber = item;
		
		// API call for Panel Limits View
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelNumber)
			.success(function(response) {
				$scope.panelConfigLimitsAlarm = response.Alarm;
				$scope.panelConfigLimitsWarning = response.Warning;
				$scope.panelLimits = response;
			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
		// Panel Config API
		$scope.panelConfigs = [];				
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1')
			.success(function(response) {
				
				if(response.PanelConfig.OnOff == 'On'){
					response.PanelConfig.OnOff = true;
				}
				else{
					response.PanelConfig.OnOff = false;
				}
				
				$scope.panelConfigs.push(response.PanelConfig);						
				$scope.panelConfigs[0].panelNumber = '1';
				
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2')
				.success(function(response) {
					
					if(response.PanelConfig.OnOff == 'On'){
						response.PanelConfig.OnOff = true;
					}
					else{
						response.PanelConfig.OnOff = false;
					}
					
					$scope.panelConfigs.push(response.PanelConfig);
					$scope.panelConfigs[1].panelNumber = '2';
					
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3')
					.success(function(response) {
						
						if(response.PanelConfig.OnOff == 'On'){
							response.PanelConfig.OnOff = true;
						}
						else{
							response.PanelConfig.OnOff = false;
						}
						
						$scope.panelConfigs.push(response.PanelConfig);
						$scope.panelConfigs[2].panelNumber = '3';
						
						$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4')
						.success(function(response) {
							
							if(response.PanelConfig.OnOff == 'On'){
								response.PanelConfig.OnOff = true;
							}
							else{
								response.PanelConfig.OnOff = false;
							}
							
							$scope.panelConfigs.push(response.PanelConfig);	
							$scope.panelConfigs[3].panelNumber = '4';
						}).catch(function (response){
							$scope.networkFailure=true;
						});
					}).catch(function (response){
						$scope.networkFailure=true;
					});
					
				}).catch(function (response){
					$scope.networkFailure=true;
				});
			}).catch(function (response){
				$scope.networkFailure=true;
			});
	}
	

	// To toggle between Graph & Table View
	$scope.toggleViewTableGraph = function($event, i) {
		var element = $event;
		var filterItem = element.currentTarget.id.trim();
		
		switch(filterItem){
			case "graphModeId":
				$scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
				break;
			case "tableModeId":
				$scope.toggleViewMode = {"graph": false, "table": true, "settings": false};
			break;
			case "settingsModeId":
			{
				$scope.toggleViewMode = {"graph": false, "table": false, "settings": true};
				
				
				// Settings related Code
				
				// Global Attributes
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchGlobalConfig/attributes/'+$rootScope.selectedDeviceId)
					.success(function(response) {
						$scope.gloablConfigAttributes = response;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				
				// Panel Limits Attributes
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/attributes/'+$rootScope.selectedDeviceId)
					.success(function(response) {
						$scope.panelLimitsAttributes = response;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				
				// Panel Config Attributes
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/attributes/'+$rootScope.selectedDeviceId)
					.success(function(response) {
						$scope.panelConfigAttributes = response.PanelConfig;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				
				
				
				// API call for Panel Limits View
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/submeters/'+$rootScope.selectedDeviceId)
					.success(function(response) {
						$scope.panelConfigLimitsAlarm = response.Alarm;
						$scope.panelConfigLimitsWarning = response.Warning;
						$scope.panelLimits = response;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				
				// Panel Config API
				$scope.panelConfigs = [];				
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1')
					.success(function(response) {
						
						if(response.PanelConfig.OnOff == 'On'){
							response.PanelConfig.OnOff = true;
						}
						else{
							response.PanelConfig.OnOff = false;
						}
						
						$scope.panelConfigs.push(response.PanelConfig);						
						$scope.panelConfigs[0].panelNumber = '1';
						
						$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2')
						.success(function(response) {
							
							if(response.PanelConfig.OnOff == 'On'){
								response.PanelConfig.OnOff = true;
							}
							else{
								response.PanelConfig.OnOff = false;
							}
							
							$scope.panelConfigs.push(response.PanelConfig);
							$scope.panelConfigs[1].panelNumber = '2';
							
							$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3')
							.success(function(response) {
								
								if(response.PanelConfig.OnOff == 'On'){
									response.PanelConfig.OnOff = true;
								}
								else{
									response.PanelConfig.OnOff = false;
								}
								
								$scope.panelConfigs.push(response.PanelConfig);
								$scope.panelConfigs[2].panelNumber = '3';
								
								$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4')
								.success(function(response) {
									
									if(response.PanelConfig.OnOff == 'On'){
										response.PanelConfig.OnOff = true;
									}
									else{
										response.PanelConfig.OnOff = false;
									}
									
									$scope.panelConfigs.push(response.PanelConfig);	
									$scope.panelConfigs[3].panelNumber = '4';
								}).catch(function (response){
									$scope.networkFailure=true;
								});
							}).catch(function (response){
								$scope.networkFailure=true;
							});
							
						}).catch(function (response){
							$scope.networkFailure=true;
						});
					}).catch(function (response){
						$scope.networkFailure=true;
					});
			
			}
			break;
		}

		// Setting the style for Graph/Table/Settings Link
		var currentItem = element.currentTarget.parentElement.firstElementChild;
		for(var i=0;i<element.currentTarget.parentElement.childElementCount;i++)
		{
			// Reset the class name of each element
			currentItem.className = '';			
			if(currentItem.id.trim() == filterItem){
				currentItem.className = 'active-text-link';
			}
			currentItem = currentItem.nextElementSibling
		}
		
	}
	
	// For Editing Global view	
	$scope.postData = {
								'Alarm':	{
									'OverCurrent':	'',
									'UnderCurrent':	'',
									'Delay':	''
								},
								'Warning':	{
									'OverCurrent':	'',
									'Delay':	''
								}
							}
	
	$scope.updateData = function(data, requiredParameter){	
		
		switch(requiredParameter){
			case 'warningOverCurrent':
				$scope.postData.Warning.OverCurrent = data;
				break;
			case 'alarmOverCurrent':
				$scope.postData.Alarm.OverCurrent = data;
				break;
			case 'alarmUnderCurrent':
				$scope.postData.Alarm.UnderCurrent = data;
				break;
			case 'warningDelay':
				$scope.postData.Warning.Delay = data;
				break;
			case 'alarmDelay':
				$scope.postData.Alarm.Delay = data;
				break;
			
		}
	}
	
	// Functionality for editing the checkbox parameters in Settings
	$scope.editModeFeatureState = function(parameter, panelConfig){
		$scope.filterItemSubmenu = panelConfig;
		if($scope.filterItemSubmenu == 'Panel Configuration'){
			$scope.editMode = true;
			//$scope.panelConfigEditMode = true;
			$scope.requiredParameter2 = parameter;			
		}else if($scope.editMode == false){
			$scope.editMode = true;
		}			
	}

	// Edit and Bind the required value
	$scope.editModeFeatureValue = function(data,requiredParameter, requiredParameter2, requiredParameter3){
		$scope.filterItemSubmenu = requiredParameter3;
		if($scope.editMode == false){
			$scope.editMode = true;
		}
		switch($scope.filterItemSubmenu){
				case 'Panel Limits':
					$scope.panelLimits[requiredParameter][requiredParameter2] = data;					
					break;
				case 'Branch':
					$scope.branchInfo[requiredParameter][requiredParameter2] = data;
					break;
				case 'Panel Configuration':
					$scope.editMode = true;
					//$scope.panelConfigEditMode = true;
					$scope.panelConfigs[requiredParameter2-1][requiredParameter] = data;
					$scope.requiredParameter2 = requiredParameter2;
					break;
		}
	}
	
	// Global Screen functionality
	$scope.submitData = function($event){	
		
		$scope.panelNumber = document.getElementById("panelNumber").value;
	
		$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchGlobalConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.panelNumber, $scope.postData)
			.success(function(response) {
				var test = response;
				$scope.resetGlobalFields();
			}).catch(function (response){
				$scope.networkFailure=true;
			});
		
	}
	
	$scope.resetGlobalFields = function(){
		document.getElementById("panelNumber").value = '';
		document.getElementById("ocwLimit").value = '';
		document.getElementById("ocaLimit").value = '';
		document.getElementById("ucaLimit").value = '';
		document.getElementById("cwDelay").value = '';
		document.getElementById("caDelay").value = '';	
	}
	
	$scope.saveChanges = function(){
		var postBody = null;
		$scope.editMode = false;
		//$scope.panelConfigEditMode = false;
		switch($scope.filterItemSubmenu){				
				case 'Panel Limits':
					postBody = JSON.parse(JSON.stringify($scope.panelLimits));					
					// POST API call
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfigLimits/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelNumber, postBody)						
						.success(function(response) {
							var test = response;
						}).catch(function (response){
							$scope.networkFailure=true;
						});	
					break;
				case 'Panel Configuration':		
					for(var i=0; i<$scope.panelConfigs.length; i++){
						delete $scope.panelConfigs[i]['$$hashKey'];				
					}
					postBody = JSON.parse(JSON.stringify($scope.panelConfigs[$scope.requiredParameter2-1]));
					delete postBody['panelNumber'];
					postBody = { "PanelConfig":  postBody};
					
					if(postBody.PanelConfig.OnOff == true){
						postBody.PanelConfig.OnOff = 'On';
					}else{
						postBody.PanelConfig.OnOff = 'Off';	
					}

					// POST API call
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.requiredParameter2, postBody)						
						.success(function(response) {
							var test = response;
						}).catch(function (response){
							$scope.networkFailure=true;
						});
					break;
				case 'Branch':
					postBody = JSON.parse(JSON.stringify($scope.branchInfo));
					if(postBody.State.OnOff == true){
						postBody.State.OnOff = 'On';
					}else{
						postBody.State.OnOff = 'Off';	
					}
					// POST API call
					$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$scope.selectedMeterNumber, postBody)						
						.success(function(response) {
							var test = response;
						}).catch(function (response){
							$scope.networkFailure=true;
						});
					break;
		}
	}
	
	$scope.discardChanges = function(){
		$scope.editMode = false;
	}
	
	$scope.options = {
						responsive: true,
						legend: {
							display: true,
							position: 'bottom',
							labels: {								
								boxWidth: 20
							}
						},
						scales: {
							xAxes: [{
								categoryPercentage: 0.25,
							}],
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						},
					   showAllTooltips: true,
					   tooltipEvents: [],	
					   onAnimationComplete: function() {
							this.showTooltip(this.segments, true);
						}
					};

	$scope.colorsVoltageHarmonics =	[
					  {
						backgroundColor: '#2E92FA'
					  },
					  {
						backgroundColor: 'orange'
					  }
					 ];
	$scope.labelsVoltageHarmonics = ['A', 'B', 'C'];
	$scope.seriesVoltageHarmonics = ['Voltage', 'Load'];

	$scope.invokeServices = function(){
	
		// API call for Panel 1			
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/1').
			success(function(response) {
			$scope.panelConfig1 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/1').
				success(function(response) {
					$scope.currentResponse1 = response;
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/1').
						success(function(response) {
							$scope.voltageResponse1 = response;
							$scope.voltageResponseValue1 =JSON.parse(JSON.stringify($scope.voltageResponse1));
							switch($scope.voltageResponse1.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse1.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse1.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageResponse1.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse1.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse1.Voltage.L1 = $scope.voltageResponse1.Voltage.L1/$scope.panelConfig1.VoltRating * 100;
							$scope.voltageResponse1.Voltage.L2 = $scope.voltageResponse1.Voltage.L2/$scope.panelConfig1.VoltRating * 100;		
							$scope.voltageResponse1.Voltage.L3= $scope.voltageResponse1.Voltage.L3/$scope.panelConfig1.VoltRating * 100;
							
							$scope.height_chart = $(".card-layout-bcm-home").height() * 0.9;
							$scope.width_chart = $(".card-layout-bcm-home").width() * 0.75;
							$scope.panelData1 = 	[
														[$scope.voltageResponse1.Voltage.L1,
														$scope.voltageResponse1.Voltage.L2, 
														$scope.voltageResponse1.Voltage.L3],
														[$scope.currentResponse1.Load.L1,
														$scope.currentResponse1.Load.L2,
														$scope.currentResponse1.Load.L3,
														]
												];
												
												
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});

		// API call for Panel 2	
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/2').
			success(function(response) {
			$scope.panelConfig2 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/2').
				success(function(response) {
					$scope.currentResponse2 = response;
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/2').
						success(function(response) {
							$scope.voltageResponse2 = response;
							$scope.voltageResponseValue2 =JSON.parse(JSON.stringify($scope.voltageResponse2));
							switch($scope.voltageResponse2.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse2.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse2.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageRespons2.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse2.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse2.Voltage.L1 = $scope.voltageResponse2.Voltage.L1/$scope.panelConfig2.VoltRating * 100;
							$scope.voltageResponse2.Voltage.L2 = $scope.voltageResponse2.Voltage.L2/$scope.panelConfig2.VoltRating * 100;		
							$scope.voltageResponse2.Voltage.L3= $scope.voltageResponse2.Voltage.L3/$scope.panelConfig2.VoltRating * 100;
						
							$scope.panelData2 = [	[$scope.voltageResponse2.Voltage.L1,
											$scope.voltageResponse2.Voltage.L2, 
											$scope.voltageResponse2.Voltage.L3],
											[$scope.currentResponse2.Load.L1,
											$scope.currentResponse2.Load.L2,
											$scope.currentResponse2.Load.L3,
											]
										     ];
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});

		// API call for Panel 3

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/3').
			success(function(response) {
			$scope.panelConfig3 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/3').
				success(function(response) {
					$scope.currentResponse3 = response;					
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/3').
						success(function(response) {
							$scope.voltageResponse3 = response;
							$scope.voltageResponseValue3 =JSON.parse(JSON.stringify($scope.voltageResponse3));
							switch($scope.voltageResponse3.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse3.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse3.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageResponse3.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse3.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse3.Voltage.L1 = $scope.voltageResponse3.Voltage.L1/$scope.panelConfig3.VoltRating * 100;
							$scope.voltageResponse3.Voltage.L2 = $scope.voltageResponse3.Voltage.L2/$scope.panelConfig3.VoltRating * 100;		
							$scope.voltageResponse3.Voltage.L3= $scope.voltageResponse3.Voltage.L3/$scope.panelConfig3.VoltRating * 100;
						
							$scope.panelData3 = [	[$scope.voltageResponse3.Voltage.L1,
											$scope.voltageResponse3.Voltage.L2, 
											$scope.voltageResponse3.Voltage.L3],
											[$scope.currentResponse3.Load.L1,
											$scope.currentResponse3.Load.L2,
											$scope.currentResponse3.Load.L3,
											]
										     ];
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});

		// API call for Panel 4

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelConfig/submeters/'+$rootScope.selectedDeviceId+'/4').
			success(function(response) {
			$scope.panelConfig4 = response.PanelConfig;
	
			// API call for Current
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeterLoad/submeters/'+$rootScope.selectedDeviceId+'/4').
				success(function(response) {
					$scope.currentResponse4 = response;
					// API call for Voltage
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?PanelMeter/submeters/'+$rootScope.selectedDeviceId+'/4').
						success(function(response) {
							$scope.voltageResponse4 = response;							
							$scope.voltageResponseValue4 =JSON.parse(JSON.stringify($scope.voltageResponse4));
							
							switch($scope.voltageResponse4.Status.Status)
							{
								case 'Unknown':
									$scope.voltageResponse4.Status.Status = 'UnknownIcon';
									break;

								case 'Alarm':
									$scope.voltageResponse4.Status.Status = 'AlarmIcon';
									break;

								case 'Warning':
									$scope.voltageResponse4.Status.Status = 'WarningIcon';
									break;

								case 'Normal':
									$scope.voltageResponse4.Status.Status = 'UI_Normal';
									break;
							}
							$scope.voltageResponse4.Voltage.L1 = $scope.voltageResponse4.Voltage.L1/$scope.panelConfig4.VoltRating * 100;
							$scope.voltageResponse4.Voltage.L2 = $scope.voltageResponse4.Voltage.L2/$scope.panelConfig4.VoltRating * 100;		
							$scope.voltageResponse4.Voltage.L3= $scope.voltageResponse4.Voltage.L3/$scope.panelConfig4.VoltRating * 100;
						
							$scope.panelData4 = [	[$scope.voltageResponse4.Voltage.L1,
											$scope.voltageResponse4.Voltage.L2, 
											$scope.voltageResponse4.Voltage.L3],
											[$scope.currentResponse4.Load.L1,
											$scope.currentResponse4.Load.L2,
											$scope.currentResponse4.Load.L3,
											]
										     ];
						}).catch(function (response){
							$scope.networkFailure=true;
						});
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			
		}).catch(function (response){
			$scope.networkFailure=true;
		});
		
		
				
						
	}

	$scope.invokeServices(); // Initial Call
	$scope.bcmHomePromise = $interval(function(){$scope.invokeServices()}, DATADELAY);

	$scope.$on('$destroy', function () {
        $interval.cancel($scope.bcmHomePromise);
    });
});

app.controller('BcmMetersController', function($scope, $http, $timeout, $interval, $rootScope, $location) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'Remote Power Panel'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.activeEventsDisplay = false;
	$scope.meterNumbers = [];
	$rootScope.paginationNumbersBcmMeters = [];
	
	$scope.panelNumbers = [];
	for(var i=1; i<=4; i++){
		$scope.panelNumbers.push(i);
	}
	$scope.selectedPanel = $scope.panelNumbers[0];
	
	for(var i=1; i<=42; i=i+3){
		$scope.meterNumbers.push(i);
	}
	$rootScope.selectedPanelBcmMeters = '1';
	
	$scope.invokeServices = function(){			
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeterGrouped/submeters/'+$rootScope.selectedDeviceId+'/'+ $scope.selectedPanel + '/' +$rootScope.selectedPanelBcmMeters)
			.success(function(response) {	
				
					$scope.panelStates = response.Config.State;
					$scope.panelStatuses = response.Meter.Status;
					for(var i=0; i<$scope.panelStates.length; i++){
						if($scope.panelStates[i] == "On")
							 $scope.panelStates[i] = true;
						else
							$scope.panelStates[i] = false;
					}
					for(i=0; i<$scope.panelStatuses.length; i++){

						switch($scope.panelStatuses[i])
						{
							case 'Unknown':
								$scope.panelStatuses[i] = 'UnknownIcon';
								break;

							case 'Alarm':
								$scope.panelStatuses[i] = 'AlarmIcon';
								break;

							case 'Warning':
								$scope.panelStatuses[i] = 'WarningIcon';
								break;

							case 'Normal':
								$scope.panelStatuses[i] = 'UI_Normal';
								break;
						}

					}
				}).catch(function (response){
					$scope.networkFailure=true;
				});
				
	}
	

	$scope.invokeServices(); // Initial Call
	$scope.bcmMetersPanelPromise = $interval(function(){$scope.invokeServices()}, DATADELAY);
	
	$scope.branchInfo = function($event) {
		var element = $event;
		$rootScope.selectedMeterNumberBcmMeters = element.currentTarget.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText;
		
		$rootScope.paginationNumbersBcmMeters = [];
		for(var i=$rootScope.selectedMeterNumberBcmMeters; (i<Number($rootScope.selectedMeterNumberBcmMeters)+21 && i<=42); i++){
			if(i==$rootScope.selectedMeterNumberBcmMeters){
				$rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
			}
			else{
				$rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
			}
		}
		
       /// route to bcm meters branch view
	   $location.url('/bcmmetersbranchview');
	}
	
	$scope.$on('$destroy', function () {
        $interval.cancel($scope.bcmMetersPanelPromise);
    });
	

});


app.controller('BcmMetersBranchViewController', function($scope, $http, $timeout, $interval, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'Remote Power Panel'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.activeEventsDisplay = false;
	$scope.branchDetailsView = false;
	$scope.branchMeterDetailsView = true;
	$scope.editMode = false;
	
	$scope.panelNumbers = [];
	for(var i=1; i<=4; i++){
		$scope.panelNumbers.push(i);
	}
	$scope.selectedPanel = $scope.panelNumbers[0];
	
	$scope.toggleMeterSettingsView = function(){
		$scope.branchMeterDetailsView = !$scope.branchMeterDetailsView;
	}
	
	$scope.saveChanges = function(){
		var postBody = null;
		$scope.editMode = false;
		
		postBody = JSON.parse(JSON.stringify($scope.branchInfo));
		if(postBody.State.OnOff == true){
			postBody.State.OnOff = 'On';
		}else{
			postBody.State.OnOff = 'Off';	
		}
		// POST API call
		$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId + '/' + $scope.selectedPanel +'/'+$rootScope.selectedMeterNumberBcmMeters, postBody)						
			.success(function(response) {
				var test = response;
			}).catch(function (response){
				$scope.networkFailure=true;
			});					
	}
	
	$scope.discardChanges = function(){
		$scope.editMode = false;
	}
	
	// Functionality for editing the checkbox parameters in Settings
	$scope.editModeFeatureState = function(){
		$scope.editMode = true;						
	}

	// Edit and Bind the required value
	$scope.editModeFeatureValue = function(data,requiredParameter, requiredParameter2){
		if($scope.editMode == false){
			$scope.editMode = true;
		}
		$scope.branchInfo[requiredParameter][requiredParameter2] = data;
	}
	
	$scope.panelChanged = function(item){
		$scope.selectedPanel = item;
		
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+ $rootScope.selectedDeviceId + '/' + $scope.selectedPanel + '/' +$rootScope.selectedMeterNumberBcmMeters)
					.success(function(response) {
						$scope.branchInfo = response;
						if($scope.branchInfo.State.OnOff == 'On'){
							$scope.branchInfo.State.OnOff = true;
						}
						else{
							$scope.branchInfo.State.OnOff = false;
						}
					}).catch(function (response){
						$scope.networkFailure=true;
					});
					
		// API call for BCM Meters Details
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
		.success(function(response) {						
			$scope.branchDetailsCurrent = response.Current;
			$scope.branchDetailsPower = response.Power;

			switch($scope.branchDetailsCurrent.Status)
			{
				case 'Unknown':
					$scope.branchDetailsCurrent.Status = 'UnknownIcon';
					break;

				case 'Alarm':
					$scope.branchDetailsCurrent.Status = 'AlarmIcon';
					break;

				case 'Warning':
					$scope.branchDetailsCurrent.Status = 'WarningIcon';
					break;

				case 'Normal':
					$scope.branchDetailsCurrent.Status = 'UI_Normal';
					break;
			}

		}).catch(function (response){
			$scope.networkFailure=true;
		});
		
		// API call for BCM Settings Details
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
			.success(function(response) {
				$scope.branchInfo = response;
				if($scope.branchInfo.State.OnOff == 'On'){
					$scope.branchInfo.State.OnOff = true;
				}
				else{
					$scope.branchInfo.State.OnOff = false;
				}
			}).catch(function (response){
				$scope.networkFailure=true;
			});
	}
	
	$scope.invokeServices = function(){
		// API call for BCM Meters Details
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
		.success(function(response) {						
			$scope.branchDetailsCurrent = response.Current;
			$scope.branchDetailsPower = response.Power;

			switch($scope.branchDetailsCurrent.Status)
			{
				case 'Unknown':
					$scope.branchDetailsCurrent.Status = 'UnknownIcon';
					break;

				case 'Alarm':
					$scope.branchDetailsCurrent.Status = 'AlarmIcon';
					break;

				case 'Warning':
					$scope.branchDetailsCurrent.Status = 'WarningIcon';
					break;

				case 'Normal':
					$scope.branchDetailsCurrent.Status = 'UI_Normal';
					break;
			}

		}).catch(function (response){
			$scope.networkFailure=true;
		});
		
		// API call for BCM Settings Details
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
			.success(function(response) {
				$scope.branchInfo = response;
				if($scope.branchInfo.State.OnOff == 'On'){
					$scope.branchInfo.State.OnOff = true;
				}
				else{
					$scope.branchInfo.State.OnOff = false;
				}
			}).catch(function (response){
				$scope.networkFailure=true;
			});				
			
	}
	
	$scope.invokeServices(); // Initial Call
	
	//$scope.bcmMetersPanelPromise = $interval(function(){$scope.invokeServices()}, DATADELAY);	
	$scope.$on('$destroy', function () {
        $interval.cancel($scope.bcmMetersPanelPromise);
    });
	
					
	$scope.firstNavigationList = function($event){
		var element = $event;
		$rootScope.selectedMeterNumberBcmMeters=1;
		$rootScope.paginationNumbersBcmMeters = [];
		for(var i=1; i<22; i++){
			if(i==$rootScope.selectedMeterNumberBcmMeters){
				$rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
			}
			else{
				$rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
			}
		}
		
		$interval.cancel($scope.bcmMetersPanelPromise);
		
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
			.success(function(response) {						
				$scope.branchDetailsCurrent = response.Current;
				$scope.branchDetailsPower = response.Power;

				switch($scope.branchDetailsCurrent.Status)
				{
					case 'Unknown':
						$scope.branchDetailsCurrent.Status = 'UnknownIcon';
						break;

					case 'Alarm':
						$scope.branchDetailsCurrent.Status = 'AlarmIcon';
						break;

					case 'Warning':
						$scope.branchDetailsCurrent.Status = 'WarningIcon';
						break;

					case 'Normal':
						$scope.branchDetailsCurrent.Status = 'UI_Normal';
						break;
				}

			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
					.success(function(response) {
						$scope.branchInfo = response;
						if($scope.branchInfo.State.OnOff == 'On'){
							$scope.branchInfo.State.OnOff = true;
						}
						else{
							$scope.branchInfo.State.OnOff = false;
						}
					}).catch(function (response){
						$scope.networkFailure=true;
					});
	}
	
	$scope.lastNavigationList = function($event){
		var element = $event;
		$rootScope.selectedMeterNumberBcmMeters=22;
		$rootScope.paginationNumbersBcmMeters = [];
		for(var i=22; i<43; i++){
			if(i==$rootScope.selectedMeterNumberBcmMeters){
				$rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
			}
			else{
				$rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
			}
		}
		 $interval.cancel($scope.bcmMetersPanelPromise);
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
			.success(function(response) {						
				$scope.branchDetailsCurrent = response.Current;
				$scope.branchDetailsPower = response.Power;

				switch($scope.branchDetailsCurrent.Status)
				{
					case 'Unknown':
						$scope.branchDetailsCurrent.Status = 'UnknownIcon';
						break;

					case 'Alarm':
						$scope.branchDetailsCurrent.Status = 'AlarmIcon';
						break;

					case 'Warning':
						$scope.branchDetailsCurrent.Status = 'WarningIcon';
						break;

					case 'Normal':
						$scope.branchDetailsCurrent.Status = 'UI_Normal';
						break;
				}

			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
					.success(function(response) {
						$scope.branchInfo = response;
						if($scope.branchInfo.State.OnOff == 'On'){
							$scope.branchInfo.State.OnOff = true;
						}
						else{
							$scope.branchInfo.State.OnOff = false;
						}
					}).catch(function (response){
						$scope.networkFailure=true;
					});
	}

	$scope.prevNavigationList = function($event){
		var element = $event;
		if($rootScope.selectedMeterNumberBcmMeters>1){
			$rootScope.selectedMeterNumberBcmMeters--;

			$rootScope.paginationNumbersBcmMeters = [];
			for(var i=$rootScope.selectedMeterNumberBcmMeters; (i<Number($rootScope.selectedMeterNumberBcmMeters)+21 && i<=42); i++){
				if(i==$rootScope.selectedMeterNumberBcmMeters){
					$rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
				}
				else{
					$rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
				}
			}
			 $interval.cancel($scope.bcmMetersPanelPromise);
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
			.success(function(response) {						
				$scope.branchDetailsCurrent = response.Current;
				$scope.branchDetailsPower = response.Power;

				switch($scope.branchDetailsCurrent.Status)
				{
					case 'Unknown':
						$scope.branchDetailsCurrent.Status = 'UnknownIcon';
						break;

					case 'Alarm':
						$scope.branchDetailsCurrent.Status = 'AlarmIcon';
						break;

					case 'Warning':
						$scope.branchDetailsCurrent.Status = 'WarningIcon';
						break;

					case 'Normal':
						$scope.branchDetailsCurrent.Status = 'UI_Normal';
						break;
				}

			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
					.success(function(response) {
						$scope.branchInfo = response;
						if($scope.branchInfo.State.OnOff == 'On'){
							$scope.branchInfo.State.OnOff = true;
						}
						else{
							$scope.branchInfo.State.OnOff = false;
						}
					}).catch(function (response){
						$scope.networkFailure=true;
					});
		}
	}
	
	$scope.nextNavigationList = function($event){
		if($rootScope.selectedMeterNumberBcmMeters<22){
			var element = $event;
			$rootScope.selectedMeterNumberBcmMeters++;

			$rootScope.paginationNumbersBcmMeters = [];
			for(var i=$rootScope.selectedMeterNumberBcmMeters; (i<Number($rootScope.selectedMeterNumberBcmMeters)+21 && i<=42); i++){
				if(i==$rootScope.selectedMeterNumberBcmMeters){
					$rootScope.paginationNumbersBcmMeters.push({'className':'active', 'number': String(i)});
				}
				else{
					$rootScope.paginationNumbersBcmMeters.push({'className':'', 'number': String(i)});
				}
			}
			$interval.cancel($scope.bcmMetersPanelPromise);
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
			.success(function(response) {						
				$scope.branchDetailsCurrent = response.Current;
				$scope.branchDetailsPower = response.Power;

				switch($scope.branchDetailsCurrent.Status)
				{
					case 'Unknown':
						$scope.branchDetailsCurrent.Status = 'UnknownIcon';
						break;

					case 'Alarm':
						$scope.branchDetailsCurrent.Status = 'AlarmIcon';
						break;

					case 'Warning':
						$scope.branchDetailsCurrent.Status = 'WarningIcon';
						break;

					case 'Normal':
						$scope.branchDetailsCurrent.Status = 'UI_Normal';
						break;
				}

			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
					.success(function(response) {
						$scope.branchInfo = response;
						if($scope.branchInfo.State.OnOff == 'On'){
							$scope.branchInfo.State.OnOff = true;
						}
						else{
							$scope.branchInfo.State.OnOff = false;
						}
					}).catch(function (response){
						$scope.networkFailure=true;
					});
		}
	}
	
	$scope.paginationNavigation = function($event){
		var element = $event;
		$rootScope.selectedMeterNumberBcmMeters = element.currentTarget.firstElementChild.innerText;
		
		for(var i=0; i<$rootScope.paginationNumbersBcmMeters.length; i++){
			if(Number($rootScope.paginationNumbersBcmMeters[i].number)==Number($rootScope.selectedMeterNumberBcmMeters)){
				$rootScope.paginationNumbersBcmMeters[i].className = 'active';
			}
			else{
				$rootScope.paginationNumbersBcmMeters[i].className = '';
			}
		}
		 $interval.cancel($scope.bcmMetersPanelPromise);
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchMeter/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanelBcmMeters+'/'+$rootScope.selectedMeterNumberBcmMeters)
		.success(function(response) {						
			$scope.branchDetailsCurrent = response.Current;
			$scope.branchDetailsPower = response.Power;

			switch($scope.branchDetailsCurrent.Status)
			{
				case 'Unknown':
					$scope.branchDetailsCurrent.Status = 'UnknownIcon';
					break;

				case 'Alarm':
					$scope.branchDetailsCurrent.Status = 'AlarmIcon';
					break;

				case 'Warning':
					$scope.branchDetailsCurrent.Status = 'WarningIcon';
					break;

				case 'Normal':
					$scope.branchDetailsCurrent.Status = 'UI_Normal';
					break;
			}

		}).catch(function (response){
			$scope.networkFailure=true;
		});
		
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?BranchConfig/submeters/'+$rootScope.selectedDeviceId+'/'+$scope.selectedPanel+'/'+$rootScope.selectedMeterNumberBcmMeters)
					.success(function(response) {
						$scope.branchInfo = response;
						if($scope.branchInfo.State.OnOff == 'On'){
							$scope.branchInfo.State.OnOff = true;
						}
						else{
							$scope.branchInfo.State.OnOff = false;
						}
					}).catch(function (response){
						$scope.networkFailure=true;
					});
	}	

});

// PDU Metering Home Controller
app.controller('PduMeteringHomeController', function($scope, $http, $timeout, $interval, $rootScope) {
	
	$rootScope.titleHeader = 'PDU'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.activeEventsDisplay = false;
	$scope.showBar = false;
	$scope.showPie = false;
	$rootScope.bgTheme = 'black';
	$scope.showSystemState = false;	
	
	$scope.invokeServices = function () {
					
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?VoltageIN')
			.success(function(response) {						
				$scope.voltageIn = response.LL;
				$scope.showBar = true;
				
				// Input Bar Graph binding
				$scope.labelsIn = [Math.floor($scope.voltageIn.AB), Math.floor($scope.voltageIn.BC), Math.floor($scope.voltageIn.CA)];	
				$scope.dataIn = 	[$scope.voltageIn.AB, $scope.voltageIn.BC, $scope.voltageIn.CA];	
				$scope.optionsBar1 = {
									responsive: false,
									scales: {
										xAxes: [{
											barPercentage: .7,
											gridLines: {
												drawBorder: false,
												display: false
											}
										}],
										yAxes: [{
													ticks: {
														display: false,
														beginAtZero:true,
														max: 480
													},
													 gridLines: {
														drawBorder: false,
														display: false
													}
												}
											]
										},
									   animation: false
								};
				$scope.colors = ["#0c74da", "#0c74da", "#0c74da"];

			}).catch(function (response){
				$scope.networkFailure=true;
			});

		// Load Pie Chart Binding 
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
			.success(function(response) {
				$scope.power = response.Load;
				$scope.kW = response.kW;
				$scope.showPie = true;
				
				$scope.labelspie = [$scope.power.Total, 100-$scope.power.Total];
				$scope.datapie = [$scope.power.Total, 100-$scope.power.Total];
				$scope.colorspie = ["#0b74da", "#272727"];
				$scope.optionspie = {
									  responsive: false,
									  rotation: 1 * (3/4*Math.PI),
									  circumference: 1 * (3/2*Math.PI),
									  cutoutPercentage: 86,
									  elements: { arc: { 
															borderWidth: 0,
															borderColor: '#0b74da'
														} 
												},
									   animation: false
								};
								
				
								
			}).catch(function (response){
				$scope.networkFailure=true;
			});

		// Output Bar Graph Binding
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Voltage')
			.success(function(response) {
				
				// Output Graph Values
				$scope.voltageOut = response.LN;
				$scope.colors = ["#0c74da", "#0c74da", "#0c74da"];
				$scope.labelsOut = [Math.floor($scope.voltageOut.AN), Math.floor($scope.voltageOut.BN), Math.floor($scope.voltageOut.CN)];
				$scope.dataOut = 	[$scope.voltageOut.AN, $scope.voltageOut.BN, $scope.voltageOut.CN];
				$scope.showBar = true;
				
				$scope.optionsBar2 = {
									responsive: false,
									scales: {
										xAxes: [{
											barPercentage: .7,
											gridLines: {
												drawBorder: false,
												display: false
											}
										}],
										yAxes: [{
													ticks: {
														display: false,
														beginAtZero:true,
														max: 120
													},
													 gridLines: {
														drawBorder: false,
														display: false
													}
												}
											]
										},
									   animation: false
								};
				$scope.colors = ["#0c74da", "#0c74da", "#0c74da"];

			}).catch(function (response){
				$scope.networkFailure=true;
			});

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Phase')
			.success(function(response) {
				$scope.phase = response;

			}).catch(function (response){
				$scope.networkFailure=true;
			});

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Energy')
			.success(function(response) {
				$scope.energy = response;

			}).catch(function (response){
				$scope.networkFailure=true;
			});

		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
			.success(function(response) {
				$scope.rating = response.Rating;
			}).catch(function (response){
				$scope.networkFailure=true;
			});
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?sysInfo')
			.success(function(response) {
				$scope.aboutInfo = response.info;
			}).catch(function (response){
				$scope.networkFailure=true;
			});
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?ethernet')
			.success(function(response) {
				$scope.networkDetails = response.Ethernet;
			}).catch(function (response){
				$scope.networkFailure=true;
			});		

		$http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?status')
		.success(function(response) {
			$scope.showSystemState = true;
			$scope.systemState = response.status[0].status;
			switch($scope.systemState)
			{
				case 'UNKNOWN':
					$scope.systemStateSource = 'UnknownIcon';
					break;

				case 'ALARM':
					$scope.systemStateSource = 'AlarmIcon';
					break;

				case 'WARNING':
					$scope.systemStateSource = 'WarningIcon';
					break;

				case 'NORMAL':
					$scope.systemStateSource = 'UI_Normal';
					break;
			}

			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
	}
	
	$scope.eventRows = false;
	
	// Color & Icons for Active Events
	$scope.applyColor = function(){
		for(var i=0; i<$scope.values.length; i++){
				switch($scope.values[i].type){
					case 'A':
						$scope.values[i].colorFilterType = 'color-type-alarm-home';
						$scope.values[i].StatusIcon = 'UI_ErrorCircle1_24';
						break;
					case 'I':
						$scope.values[i].colorFilterType = 'color-type-information-home';
						$scope.values[i].StatusIcon = 'UI_InformationCircle2_24';
						break;
					case 'W':
						$scope.values[i].colorFilterType = 'color-type-warning-home';
						$scope.values[i].StatusIcon = 'UI_WarningCircle2_24';
						break;
				}
			}
	}
	
	// Bind Active Events
	$scope.start = 0;
	$scope.size = EVENTS_PER_PAGE;
	var urlcount = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?eventcount?start=' + $scope.start + ',size=' + $scope.size +',active=1';			
	
	$http.get(urlcount)
	 .success(function (response){
		$scope.filterCount = response.eventcount[0].filterCount;
		$scope.totalPages = Math.ceil($scope.filterCount/15);
		
		$http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size +',active=1')
			.success(function(response) {
				$scope.totalPages = Math.ceil(response.event[1].Activecnt/15);
				$scope.values = [];
				
				response.event[2].Evt;
				
				// Fixing the SN as the response has reverse order
				for(var i=0; (i<response.event[2].Evt.length && i<2); i++){
					$scope.values.push(response.event[2].Evt[i]);
				}
				
				
				
				if($scope.values.length >0){
					$scope.eventRows = true;
				}
				
				// Fixing the SN as the response has reverse order
				for(var i=0; (i<$scope.values.length && i<2); i++){
					$scope.values[i].SN = ((EVENTS_PER_PAGE * $scope.currentPage + 1) - EVENTS_PER_PAGE + $scope.values.length) - $scope.values[i].SN;
				}							
				$scope.applyColor();
				$rootScope.eventCounter = response.event[1].Activecnt;
				if($rootScope.eventCounter>0){
					$("#active-event-counter-id").removeClass("event-notify-hide");
				}else{
					$("#active-event-counter-id").addClass("event-notify-hide");
				}
			}).catch(function (response){
				$scope.networkFailure=true;
			});
		}).catch(function (response){
			$scope.networkFailure=true;
		});	
	
					
	// Setting the text
	Chart.pluginService.register({
	  beforeDraw: function(chart) {
		  
			// For Pie Chart
			if(chart.config.type == "doughnut" && chart.chart.canvas.id == "pduPieChart"){
								
				var width = chart.chart.width,
					height = chart.chart.height/1.25,
					ctx = chart.chart.ctx;
				
				ctx.restore();
				var fontSize = (height / 114).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Light";
				ctx.textBaseline = "middle";
				ctx.fillStyle = '#d2d2d2';
					
				var fontSize = (height / 57).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Medium";
				
				var text = $scope.kW.Total,
						textX = Math.round((width - ctx.measureText(text).width)/2),
						textY = height/2*1.5;
				ctx.fillText(text, textX, textY)
				
				var fontSize = (height / 114).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Light";
				var text = "kW",
						textX = Math.round((width - ctx.measureText(text).width)/2),
						textY = height/2*2;
				ctx.fillText(text, textX, textY)
				
				ctx.save();
				
			}else if(chart.chart.canvas.id == "pduBar1" || chart.chart.canvas.id == "pduBar2"){
				
				// Bar Chart Properties
				
				var width = chart.chart.width,
					height = chart.chart.height,
					ctx = chart.chart.ctx;

				ctx.restore();
				var fontSize = (height / 226).toFixed(2);
				ctx.font = fontSize + "em HelveticaNeueETPro-Light";
				ctx.textBaseline = "middle";
				ctx.fillStyle = '#d2d2d2';
				

				var text = "", 
					textX = Math.round((width - ctx.measureText(text).width)/2)-85,
					textY = height/2-50;
					
				if(ctx.canvas.id == "bar1"){
					ctx.moveTo(textX+45, textY+10);
					ctx.lineTo(textX+125, textY+10);
				}else{
					ctx.moveTo(textX+45, textY+25);
					ctx.lineTo(textX+125, textY+25);
				}
				
				ctx.strokeStyle = "#858585";
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				console.log(ctx);
				if(ctx.canvas.id == "bar1"){
					ctx.moveTo(textX+45, textY);
					ctx.lineTo(textX+125, textY);
				}else{
					ctx.moveTo(textX+45, textY);
					ctx.lineTo(textX+125, textY);
				}
				ctx.stroke();
				
				ctx.fillText(text, textX+180, textY);
				
				ctx.save();
				
			}
			
	  }
	});
	
	$scope.invokeServices();
	$scope.promisePduHome = $interval(function(){										
										$scope.invokeServices();											
									}, DATADELAY);

	$scope.$on('$destroy', function () {
		$rootScope.bgTheme = 'white';
        $interval.cancel($scope.promisePduHome);
    });
	

});

app.controller('EventController', function($scope, $http, $rootScope, $interval, $timeout, $interval, $filter) {
		
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);	
	$rootScope.titleHeader = 'Event Log';
	$rootScope.activeEventsDisplay = false;
	$rootScope.bgTheme = 'white';
	
	if ( angular.isDefined($rootScope.pduMeteringHomePromise) ){
	}
	if($rootScope.activeEventsDisplay == true){
		$scope.activeEventsMode = true;		
	}else{
		$scope.activeEventsMode = false;
		$rootScope.activeEventsDisplay = false;
	}
	
	$scope.hidePopover = function(){				
		 $('[data-toggle="popover"]').popover('hide');
	}
	
	$scope.$on('$destroy', function () {
        $('[data-toggle="popover"]').popover('hide');
    });

	$scope.calenderFrom = $scope.calenderTo = new Date();
	$scope.toggleCalendar = function($event){
		if($event.currentTarget.checked==true){
			// Remove disbaled From Calendar
			$event.currentTarget.parentElement.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.removeAttribute('disabled');
			// Remove disbaled To Calendar
			$event.currentTarget.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.removeAttribute('disabled');
		}else{
			// Remove disbaled From Calendar
			$event.currentTarget.parentElement.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.setAttribute('disabled','disabled');
			// Remove disbaled To Calendar
			$event.currentTarget.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.setAttribute('disabled','disabled');
		}
	}
	

	$scope.applyColor = function(){
		for(var i=0; i<$scope.values.length; i++){
			switch($scope.values[i].type){
				case 'A':
					$scope.values[i].colorFilterType = 'color-type-alarm';
					$scope.values[i].StatusIcon = 'UI_ErrorCircle1_24';
					break;
				case 'I':
					$scope.values[i].colorFilterType = 'color-type-information';
					$scope.values[i].StatusIcon = 'UI_InformationCircle2_24';
					break;
				case 'W':
					$scope.values[i].colorFilterType = 'color-type-warning';
					$scope.values[i].StatusIcon = 'UI_WarningCircle2_24';
					break;
			}
		}
	}

	$scope.eventData = function() {
		
		// For all the Events
		if(!$scope.activeEventsMode){
			var url = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size;			
			var urlcount = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?eventcount?start=' + $scope.start + ',size=' + $scope.size;

			if ($scope.active == true) {
				url = url + ',active=1';
				urlcount = urlcount + ',active=1';
			}
			if ($scope.alarm == true) {
				url = url + ',alarm=1';
				urlcount = urlcount + ',alarm=1';
			}
			if ($scope.info == true) {
				url = url + ',info=1';
				urlcount = urlcount + ',info=1';
			}
			if ($scope.warn == true) {
				url = url + ',warn=1';
				urlcount = urlcount + ',warn=1';
			}
			if ($scope.reqack == true) {
				url = url + ',reqack=1';
				urlcount = urlcount + ',reqack=1';
			}
			if ($scope.waveform == true) {
				url = url + ',waveform=1';
				urlcount = urlcount + ',waveform=1';
			}
			if ($scope.calender == true) {
				var fdate, todate;
				try {
					fDate = $filter('date')($scope.calenderFrom, "dd/MM/yyyy");
					toDate = $filter('date')($scope.calenderTo, "dd/MM/yyyy");
					url = url + ',sdate=' + fDate + ',enddate=' + toDate;
				}
				catch (err) {
					
				}
			}					
			$http.get(urlcount)
			 .success(function (response){
					$scope.filterCount = response.eventcount[0].filterCount;
					$scope.totalPages = Math.ceil($scope.filterCount/15);
					
					$http.get(url)
					 .success(function(responseEvt) {
						$rootScope.eventCounter = responseEvt.event[1].Activecnt;
						if($rootScope.eventCounter>0){
							$("#active-event-counter-id").removeClass("event-notify-hide");
						}else{
							$("#active-event-counter-id").addClass("event-notify-hide");
						}								
						$scope.values = responseEvt.event[2].Evt;	
						
						// Fixing the SN as the response has reverse order						
						for(var i=0; i<$scope.values.length; i++){
							$scope.values[i].SN = ((EVENTS_PER_PAGE * $scope.currentPage + 1) - EVENTS_PER_PAGE + $scope.values.length) - $scope.values[i].SN;
						}
						
						$scope.applyColor();
					}).catch(function (responseEvt){
						$scope.networkFailure=true;
					});	
				}).catch(function (response){
					$scope.networkFailure=true;
				});				
		}else{	
			var urlcount = 'http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?eventcount?start=' + $scope.start + ',size=' + $scope.size +',active=1';
			
			$http.get(urlcount)
			 .success(function (response){
					$scope.filterCount = response.eventcount[0].filterCount;
					$scope.totalPages = Math.ceil($scope.filterCount/15);
					
					$http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?event?start=' + $scope.start + ',size=' + $scope.size +',active=1')
						.success(function(response) {
							$scope.totalPages = Math.ceil(response.event[1].Activecnt/15);
							$scope.values = response.event[2].Evt;
							
							// Fixing the SN as the response has reverse order
							for(var i=0; i<$scope.values.length; i++){
								$scope.values[i].SN = ((EVENTS_PER_PAGE * $scope.currentPage + 1) - EVENTS_PER_PAGE + $scope.values.length) - $scope.values[i].SN;
							}							
							$scope.applyColor();
							$rootScope.eventCounter = response.event[1].Activecnt;
							if($rootScope.eventCounter>0){
								$("#active-event-counter-id").removeClass("event-notify-hide");
							}else{
								$("#active-event-counter-id").addClass("event-notify-hide");
							}
						}).catch(function (response){
							$scope.networkFailure=true;
						});
					}).catch(function (response){
						$scope.networkFailure=true;
					});	
		}			
    }

	$scope.prevEvent= function(){
		if($scope.currentPage>1){
			$scope.currentPage--;
			$scope.start-=15;
			$scope.eventData();
		}
	}

	$scope.nextEvent= function(){
		if($scope.currentPage < $scope.totalPages){
			$scope.currentPage++;
			$scope.start+=15;
			$scope.eventData();
		}
	}

	$scope.allEventsView = function(){
		$scope.currentPage = 1;
		$scope.start = 0;
		$scope.size = EVENTS_PER_PAGE;		
		$scope.eventData();

	}
	$scope.activeEventsView = function(){	
		
		$scope.currentPage = 1;
		$scope.start = 0;
		$scope.size = EVENTS_PER_PAGE;
		$scope.eventData();
		
	}

	// Sub Menu Navigation
	$scope.eventsSubMenu = function($event, i) {

		var element = $event;
		var filterItem = element.currentTarget.innerText;
		var subMenuCount = element.currentTarget.parentElement.parentElement.childElementCount;
		var currentSubMenuItem = element.currentTarget.parentElement;
		var subMenuItem = element.currentTarget.parentElement.parentElement.firstElementChild;

		for(var i=0; i<subMenuCount; i++){
			if(subMenuItem.innerText.trim()==currentSubMenuItem.innerText.trim()){
				subMenuItem.className = "sub-active-link";
			}
			else{
				subMenuItem.className = "sub-inactive-link";
			}
			subMenuItem = subMenuItem.nextElementSibling
		}

		switch(filterItem)
		{
			case 'ALL':
				$scope.activeEventsMode = false;
				$scope.allEventsView(); // Service Call for all Event Logs
				break;
			case 'ACTIVE':
				$scope.activeEventsMode = true;
				$scope.activeEventsView(); // Service Call for Active Event Logs
				break;
		}
	};

	if($scope.activeEventsMode == false){
		$scope.allEventsView();
	}else{
		$scope.activeEventsView();
	}
});

app.controller('PduMeteringMetersController', function($scope, $http, $timeout, $interval, $rootScope, $location) {
	
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	
	$rootScope.titleHeader = 'PDU'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.titleSubHeader = 'Metering';
	$scope.inputMode = false;
	$rootScope.activeEventsDisplay = false;
	$scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
	$scope.editMode = false;
	
	// To toggle between Graph & Table View
	$scope.toggleViewTableGraph = function($event, i) {		
		var element = $event;
		var filterItem = element.currentTarget.id.trim();
		
		switch(filterItem){
			case "graphModeId":
				$scope.toggleViewMode = {"graph": true, "table": false, "settings": false};
				break;
			case "tableModeId":
				$scope.toggleViewMode = {"graph": false, "table": true, "settings": false};
			break;
			case "settingsModeId":
			{
				$scope.toggleViewMode = {"graph": false, "table": false, "settings": true};
				// Configuration View	
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
							.success(function(response) {
								$scope.inVoltage = response.Rating.InVoltage;
								$scope.outVoltage = response.Rating.OutVoltage;
								$scope.current = response.Rating.Current;
								$scope.kw = response.Rating.kW;
								$scope.configurationFrequency = response.Rating.Frequency;
								$scope.line = response.CT.Line;
								$scope.neutral = response.CT.Neutral;

								$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
								.success(function(response) {
									$scope.demandPeriod = response.Power.demandperiod;
								}).catch(function (response){
									$scope.networkFailure=true;
								});
							}).catch(function (response){
								$scope.networkFailure=true;
							});
				
				// Limits View
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
							.success(function(response) {
								$scope.limitsInfo = response;;

							}).catch(function (response){
								$scope.networkFailure=true;
							});
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig/attributes')
						.success(function(response) {
							// Warning Attribute values
							$scope.warningInputOVAttributes = response.Warning.InputOV;
							$scope.warningInputUVAttributes = response.Warning.InputUV;
							$scope.warningOutputOVAttributes = response.Warning.OutputOV;
							$scope.warningOutputUVAttributes = response.Warning.OutputUV;
							$scope.warningOverCurrentAttributes = response.Warning.OverCurrent;

							// Alarm Attribute values
							$scope.inputOVAttributes = response.Alarm.InputOV;
							$scope.inputUVAttributes = response.Alarm.InputUV;
							$scope.outputOVAttributes = response.Alarm.OutputOV;
							$scope.outputUVAttributes = response.Alarm.OutputUV;
							$scope.overCurrentAttributes = response.Alarm.OverCurrent;
							$scope.neutralCurrentAttributes = response.Alarm.NutralCurrent;
							$scope.groundCurrentAttributes = response.Alarm.GndCurrent;
							$scope.alarmfrequencyAttributes = response.Alarm.Frequency;

						}).catch(function (response){
							$scope.networkFailure=true;
						});
						
			}
			break;
		}

		// Setting the style for Graph/Table Link
		var currentItem = element.currentTarget.parentElement.firstElementChild;
		for(var i=0;i<element.currentTarget.parentElement.childElementCount;i++)
		{
			// Reset the class name of each element
			currentItem.className = '';
			if(currentItem.id.trim() == filterItem){
				currentItem.className = 'active-text-link';
			}
			currentItem = currentItem.nextElementSibling
		}
		
		// Check for Output View
		if(!$scope.inputMode){
			$interval.cancel($scope.promise2);
			$scope.outputView();
			$scope.promise1 = $interval(function () {
								$scope.outputView();
						  }, DATADELAY);
			$scope.$on('$destroy', function () {
				$interval.cancel($scope.promise1);
			});
		}else{
			$interval.cancel($scope.promise1);
			$scope.inputView();
			$scope.promise2 = $interval(function () {
								$scope.inputView();
						  }, DATADELAY);

			$scope.$on('$destroy', function () {
				$interval.cancel($scope.promise2);
			});
		}
	}

	// Edit and Bind the required value
	$scope.editModeFeatureValue = function(data, requiredParameter, requiredParameter2, requiredParameter3){
		if($scope.editMode == false){
			$scope.editMode = true;
		}
		$scope.filterItemSubmenu = requiredParameter3;
		switch($scope.filterItemSubmenu){
				case 'Limits':											
					$scope.limitsInfo[requiredParameter][requiredParameter2] = data;
					break;
		}
	}

	$scope.saveChanges = function(){
		var postBody = null;
		$scope.editMode = false;
		switch($scope.filterItemSubmenu){			
			case 'Limits':
				postBody = JSON.parse(JSON.stringify($scope.limitsInfo));
				$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig', postBody)
					.success(function(response) {
						var test = response;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				break;
					
	}
	}

	$scope.discardChanges = function(){
		$scope.editMode = false;
	}

	$scope.outputView = function(){

		// Graphical View
		if($scope.toggleViewMode.graph){
			$scope.colors = ["#3e9ce7", "#3e9ce7", "#3e9ce7"];
			$scope.options = {
								scales: {
									xAxes: [{
										categoryPercentage: 0.25,
									}],
									yAxes: [{
										ticks: {
											beginAtZero:true
										}
									}]
								}
							};
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Voltage')
				.success(function(response) {
					$scope.voltage = response.LL;
					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
						.success(function(response) {
							$scope.outVoltage = response.Rating.OutVoltage;
							$scope.voltage.AB = ($scope.voltage.AB/$scope.outVoltage)*100;
							$scope.voltage.BC = ($scope.voltage.BC/$scope.outVoltage)*100;
							$scope.voltage.CA = ($scope.voltage.CA/$scope.outVoltage)*100;

							$scope.labels = ['A', 'B', 'C'];
							$scope.data = 	[$scope.voltage.AB, $scope.voltage.BC, $scope.voltage.CA];

						}).catch(function(response){
							$scope.networkFailure=true;
						});
				}).catch(function(response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
				.success(function(response) {
					$scope.power = response.Load;
					$scope.labelsPower = ['L1', 'L2', 'L3'];
					$scope.dataPower = 	[$scope.power.L1, $scope.power.L2, $scope.power.L3];
				}).catch(function (response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsV')
				.success(function(response) {
					$scope.harmonicsV = response.Components;
					$scope.colorsVoltageHarmonics =	[
													  {
														backgroundColor: '#2E92FA'
													  },
													  {
														backgroundColor: '#BCD0D4'
													  },
													  {
														backgroundColor: '#9292FA'
													  }
													 ];
					$scope.harmonicsV.L1.shift();
					$scope.harmonicsV.L2.shift(); 
					$scope.harmonicsV.L3.shift();

					$scope.labelsVoltageHarmonics = ['Fund', '3', '5', '7', '9'];
					$scope.seriesVoltageHarmonics = ['L1', 'L2', 'L3'];
					$scope.dataVoltageHarmonics = [$scope.harmonicsV.L1, $scope.harmonicsV.L2, $scope.harmonicsV.L3];

				}).catch(function (response){
					$scope.networkFailure=true;
					});
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsI')
				.success(function(response) {
					$scope.harmonicsI = response.Components;
					$scope.colorsCurrentHarmonics =	[
													  {
														backgroundColor: '#2E92FA'
													  },
													  {
														backgroundColor: '#BCD0D4'
													  },
													  {
														backgroundColor: '#9292FA'
													  }
													 ];
					$scope.harmonicsI.L1.shift();
					$scope.harmonicsI.L2.shift(); 
					$scope.harmonicsI.L3.shift();
					
					$scope.labelsCurrentHarmonics = ['Fund', '3', '5', '7', '9'];
					$scope.seriesCurrentHarmonics = ['L1', 'L2', 'L3'];
					$scope.dataCurrentHarmonics = [$scope.harmonicsI.L1, $scope.harmonicsI.L2, $scope.harmonicsI.L3];
				}).catch(function (response){
					$scope.networkFailure=true;
				});
		}
		// Table View
		else if($scope.toggleViewMode.table){
			
			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?VoltageIN')
				.success(function(response) {
					$scope.voltageInput = response.LL;

				}).catch(function(response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Voltage')
				.success(function(response) {
					$scope.voltage = response.LN;

				}).catch(function(response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Current')
				.success(function(response) {
					$scope.currentRms = response.RMS;
					$scope.currentNg = response.NG;

				}).catch(function(response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Power')
				.success(function(response) {
					$scope.power = response;

				}).catch(function(response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsV')
				.success(function(response) {
					$scope.harmonicsVThd = response.THD;

				}).catch(function(response){
					$scope.networkFailure=true;
				});

			$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?HarmonicsI')
				.success(function(response) {
					$scope.harmonicsIThd = response.THD;

				}).catch(function(response){
					$scope.networkFailure=true;
				});

		}

	}
	
	// This function is not called as the Input data is not used
	$scope.inputView = function(){		
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?VoltageIN')
			.success(function(response) {
				$scope.voltageInput = response.LL;

			}).catch(function(response){
				$scope.networkFailure=true;
			});		
	}

	$scope.outputView();
	$scope.promise1 = $interval(function () {
								$scope.outputView();
						  }, DATADELAY);

	$scope.$on('$destroy', function () {
				$interval.cancel($scope.promise1);
			});

});

app.controller('PduMeteringSettingsController', function($scope, $filter, $http, $timeout, $interval, $rootScope, $location) {
	
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'PDU'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.titleSubHeader = 'Settings';
	$scope.viewModes = {'Configuration':true, 'Limits':false, 'Network': false, 'Protocols': false, 'Email':false, 'General':false};
	$scope.editMode = false;
	$rootScope.activeEventsDisplay = false;

	// Attributes for Protocols, Email, General Settings
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig/attributes')
				.success(function(response) {
					$scope.sysConfigAttributes = response;

				}).catch(function (response){
					$scope.networkFailure=true;
				});
	

	// Configuration View	
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
				.success(function(response) {
					$scope.inVoltage = response.Rating.InVoltage;
					$scope.outVoltage = response.Rating.OutVoltage;
					$scope.current = response.Rating.Current;
					$scope.kw = response.Rating.kW;
					$scope.configurationFrequency = response.Rating.Frequency;
					$scope.line = response.CT.Line;
					$scope.neutral = response.CT.Neutral;

					$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
					.success(function(response) {
						$scope.demandPeriod = response.Power.demandperiod;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
				}).catch(function (response){
					$scope.networkFailure=true;
				});
	
	// Limits View
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig')
				.success(function(response) {
					$scope.limitsInfo = response;;

				}).catch(function (response){
					$scope.networkFailure=true;
				});
		$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig/attributes')
				.success(function(response) {
					// Warning Attribute values
					$scope.warningInputOVAttributes = response.Warning.InputOV;
					$scope.warningInputUVAttributes = response.Warning.InputUV;
					$scope.warningOutputOVAttributes = response.Warning.OutputOV;
					$scope.warningOutputUVAttributes = response.Warning.OutputUV;
					$scope.warningOverCurrentAttributes = response.Warning.OverCurrent;

					// Alarm Attribute values
					$scope.inputOVAttributes = response.Alarm.InputOV;
					$scope.inputUVAttributes = response.Alarm.InputUV;
					$scope.outputOVAttributes = response.Alarm.OutputOV;
					$scope.outputUVAttributes = response.Alarm.OutputUV;
					$scope.overCurrentAttributes = response.Alarm.OverCurrent;
					$scope.neutralCurrentAttributes = response.Alarm.NutralCurrent;
					$scope.groundCurrentAttributes = response.Alarm.GndCurrent;
					$scope.alarmfrequencyAttributes = response.Alarm.Frequency;

				}).catch(function (response){
					$scope.networkFailure=true;
				});
				
	// Network View		
	$http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?ethernet')
		.success(function(response) {
			$scope.ipaddress = response.ethernet[0].ipaddress;
			$scope.gateway = response.ethernet[0].gateway;					
			$scope.subnet = response.ethernet[0].subnet;
		}).catch(function (response){
			$scope.networkFailure=true;
		});
			
	// Invoke Protocol View Services under PDU Settings
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
		.success(function(response) {
			$scope.protocols = response.Protocols;

			if($scope.protocols.modbusTCPOnOff == "Off"){
				$scope.protocols.modbusTCPOnOff = false;
			}else{
				$scope.protocols.modbusTCPOnOff = true;
			}

			if($scope.protocols.modbusRTUOnOff == "Off"){
				$scope.protocols.modbusRTUOnOff = false;
			}else{
				$scope.protocols.modbusRTUOnOff = true;
			}

			if($scope.protocols.SSH == "Off"){
				$scope.protocols.SSH = false;
			}else{
				$scope.protocols.SSH = true;
			}

			if($scope.protocols.Web == "Off"){
				$scope.protocols.Web = false;
			}else{
				$scope.protocols.Web = true;
			}

			if($scope.protocols.SNMP == "Off"){
				$scope.protocols.SNMP = false;
			}else{
				$scope.protocols.SNMP = true;
			}

			if($scope.protocols.TFTPOnOf == "Off"){
				$scope.protocols.TFTPOnOf = false;
			}else{
				$scope.protocols.TFTPOnOf = true;
			}

			// For Baud Select Box
			switch($scope.protocols.Baud){
				case $scope.sysConfigAttributes.Protocols.Baud[0]:
					$scope.selectorId = {
						status: 1
					};
					break;
				case $scope.sysConfigAttributes.Protocols.Baud[1]:
					$scope.selectorId = {
						status: 2
					};
					break;
				case $scope.sysConfigAttributes.Protocols.Baud[2]:
					$scope.selectorId = {
						status: 3
					};
					break;
				default	:
					$scope.selectorId = {
						status: 4
					};
			}

			$scope.statuses = [
				{value: 1, text: $scope.sysConfigAttributes.Protocols.Baud[0]},
				{value: 2, text: $scope.sysConfigAttributes.Protocols.Baud[1]},
				{value: 3, text: $scope.sysConfigAttributes.Protocols.Baud[2]},
				{value: 4, text: $scope.sysConfigAttributes.Protocols.Baud[3]}
			];

			$scope.showStatus = function() {
				var selected = $filter('filter')($scope.statuses, {value: $scope.selectorId.status});
				return ($scope.selectorId.status && selected.length) ? selected[0].text : 'Not set';
			};

			// For Parity Select Box
			switch($scope.protocols.Parity){
				case $scope.sysConfigAttributes.Protocols.Parity[0]:
					$scope.selectorIdParity = {
						status: 1
					};
					break;
				case $scope.sysConfigAttributes.Protocols.Parity[1]:
					$scope.selectorIdParity = {
						status: 2
					};
					break;
				default :
					$scope.selectorIdParity = {
						status: 3
					};
			}


			$scope.statusesParity = [
				{value: 1, text: $scope.sysConfigAttributes.Protocols.Parity[0]},
				{value: 2, text: $scope.sysConfigAttributes.Protocols.Parity[1]},
				{value: 3, text: $scope.sysConfigAttributes.Protocols.Parity[2]}
			];

			$scope.showStatusParity = function() {
				var selected = $filter('filter')($scope.statusesParity, {value: $scope.selectorIdParity.status});
				return ($scope.selectorIdParity.status && selected.length) ? selected[0].text : 'Not set';
			};

		}).catch(function (response){
			$scope.networkFailure=true;
		});
				
	// Invoke Email View Services under PDU Settings
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
		.success(function(response) {
			$scope.email = response.Email;

			if($scope.email.EmailOnOff == "Off"){
				$scope.EmailOnOff = false;
			}else{
				$scope.EmailOnOff = true;
			}

		}).catch(function (response){
			$scope.networkFailure=true;
		});
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?emailNotify')
		.success(function(response) {
			$scope.emailNotify = response;

			if($scope.emailNotify.Application.Email1 == "No"){
				$scope.emailNotify.Application.Email1 = false;
			}else{
				$scope.emailNotify.Application.Email1 = true;
			}
			if($scope.emailNotify.Application.Email2 == "No"){
				$scope.emailNotify.Application.Email2 = false;
			}else{
				$scope.emailNotify.Application.Email2 = true;
			}
			if($scope.emailNotify.Application.Service == "No"){
				$scope.emailNotify.Application.Service = false;
			}else{
				$scope.emailNotify.Application.Service = true;
			}

			if($scope.emailNotify.LogDump.Email1 == "No"){
				$scope.emailNotify.LogDump.Email1 = false;
			}else{
				$scope.emailNotify.LogDump.Email1 = true;
			}
			if($scope.emailNotify.LogDump.Email2 == "No"){
				$scope.emailNotify.LogDump.Email2 = false;
			}else{
				$scope.emailNotify.LogDump.Email2 = true;
			}
			if($scope.emailNotify.LogDump.Service == "No"){
				$scope.emailNotify.LogDump.Service = false;
			}else{
				$scope.emailNotify.LogDump.Service = true;
			}

			if($scope.emailNotify.Alerts.Email1 == "No"){
				$scope.emailNotify.Alerts.Email1 = false;
			}else{
				$scope.emailNotify.Alerts.Email1 = true;
			}
			if($scope.emailNotify.Alerts.Email2 == "No"){
				$scope.emailNotify.Alerts.Email2 = false;
			}else{
				$scope.emailNotify.Alerts.Email2 = true;
			}
			if($scope.emailNotify.Alerts.Service == "No"){
				$scope.emailNotify.Alerts.Service = false;
			}else{
				$scope.emailNotify.Alerts.Service = true;
			}

			switch($scope.emailNotify.Content.Last){
				case "Hour":
					document.getElementById("lasthourId").checked = true;
					break;
				case "Day":
					document.getElementById("lastdayId").checked = true;
					break;
				case "20":
					document.getElementById("last20Id").checked = true;
					break;
			}
		}).catch(function (response){
			$scope.networkFailure=true;
		});
				
	// General View 
	$scope.contrast = 20;		
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
		.success(function(response) {
			$scope.general1 = response.Genaral;
			$scope.contrast = $scope.general1.Contrast;

			if($scope.general1.Audio == "Off"){
				$scope.general1.Audio = "glyphicon audible-alarm glyphicon-volume-off";
			}else{
				$scope.general1.Audio = "glyphicon audible-alarm glyphicon-volume-up"
			}

			if($scope.general1.NTPOnOff == "Off"){
				$scope.general1.NTPOnOff = false;
			}else{
				$scope.general1.NTPOnOff = true;
			}

			if($scope.general1.ManualRestart == "Off"){
				$scope.general1.ManualRestart = false;
			}else{
				$scope.general1.ManualRestart = true;
			}

			if($scope.general1.Security == "Off"){
				$scope.general1.Security = false;
			}else{
				$scope.general1.Security = true;
			}


			// For TimeZone Select Box
			switch($scope.general1.TimeZone){
				case $scope.sysConfigAttributes.Genaral.TimeZone[0]:
					$scope.selectorIdTimezone = {
						status: 1
					};
					break;
				case $scope.sysConfigAttributes.Genaral.TimeZone[1]:
					$scope.selectorIdTimezone = {
						status: 2
					};
					break;
				case $scope.sysConfigAttributes.Genaral.TimeZone[2]:
					$scope.selectorIdTimezone = {
						status: 3
					};
					break;
				case $scope.sysConfigAttributes.Genaral.TimeZone[3]:
					$scope.selectorIdTimezone = {
						status: 4
					};
					break;
				case $scope.sysConfigAttributes.Genaral.TimeZone[4]:
					$scope.selectorIdTimezone = {
						status: 5
					};
					break;
				case $scope.sysConfigAttributes.Genaral.TimeZone[5]:
					$scope.selectorIdTimezone = {
						status: 6
					};
					break;
				default	:
					$scope.selectorIdTimezone = {
						status: 7
					};
			}

			$scope.statusesTimezone = [
				{value: 1, text: $scope.sysConfigAttributes.Genaral.TimeZone[0]},
				{value: 2, text: $scope.sysConfigAttributes.Genaral.TimeZone[1]},
				{value: 3, text: $scope.sysConfigAttributes.Genaral.TimeZone[2]},
				{value: 4, text: $scope.sysConfigAttributes.Genaral.TimeZone[3]},
				{value: 5, text: $scope.sysConfigAttributes.Genaral.TimeZone[4]},
				{value: 6, text: $scope.sysConfigAttributes.Genaral.TimeZone[5]},
				{value: 7, text: $scope.sysConfigAttributes.Genaral.TimeZone[6]}
			];

			$scope.showStatusTimezone = function() {
				var selected = $filter('filter')($scope.statusesTimezone, {value: $scope.selectorIdTimezone.status});
				return ($scope.selectorIdTimezone.status && selected.length) ? selected[0].text : 'Not set';
			};

		}).catch(function (response){
			$scope.networkFailure=true;
		});
				
	//Date & Time
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?datetime')
		.success(function(response) {
			$scope.datetime = response;					
		}).catch(function (response){
			$scope.networkFailure=true;
		});
	
	// Functionality for editing the checkbox parameters in Settings. This will display only the save, discard container, but the binding happens via model defined in the view
	$scope.editModeFeatureState = function(settingsParameter){
		$scope.filterItemSubmenu = settingsParameter;
		if($scope.editMode == false){
			$scope.editMode = true;
		}
	}

	// Edit and Bind the required value
	$scope.editModeFeatureValue = function(data, requiredParameter, requiredParameter2, requiredParameter3){
		if($scope.editMode == false){
			$scope.editMode = true;
		}
		$scope.filterItemSubmenu = requiredParameter3;
		switch($scope.filterItemSubmenu){
				case 'Protocols':
					$scope.protocols[requiredParameter] = data;
					break;
				case 'Email':
					$scope.email[requiredParameter] = data;
					break;
				case 'General':
					if(requiredParameter!='Audio'){
						$scope.general1[requiredParameter] = data;
					}
					else{
						if(data=='glyphicon audible-alarm glyphicon-volume-up'){
							$scope.general1[requiredParameter] = "glyphicon audible-alarm glyphicon-volume-off";
						}
						else{
							$scope.general1[requiredParameter] = "glyphicon audible-alarm glyphicon-volume-up";
						}
					}
					break;
				case 'Limits':											
					$scope.limitsInfo[requiredParameter][requiredParameter2] = data;
					break;
		}
	}

	$scope.saveChanges = function(){
		var postBody = null;
		$scope.editMode = false;
		
		// Protocols POST API Call
		postBody = JSON.parse(JSON.stringify($scope.protocols));
		postBody = {"Protocols": postBody};

		if(postBody.Protocols.modbusTCPOnOff == false ){
			postBody.Protocols.modbusTCPOnOff = "Off";
		}else{
			postBody.Protocols.modbusTCPOnOff = "On";
		}

		if(postBody.Protocols.modbusRTUOnOff == false){
			postBody.Protocols.modbusRTUOnOff = "Off";
		}else{
			postBody.Protocols.modbusRTUOnOff = "On";
		}

		if(postBody.Protocols.SSH == false){
			postBody.Protocols.SSH = "Off";
		}else{
			postBody.Protocols.SSH = "On";
		}

		if(postBody.Protocols.Web == false){
			postBody.Protocols.Web = "Off";
		}else{
			postBody.Protocols.Web = "On";
		}

		if(postBody.Protocols.SNMP == false){
			postBody.Protocols.SNMP = "Off";
		}else{
			postBody.Protocols.SNMP = "On";
		}		
		$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig', postBody).
			success(function(response) {
				
			}).catch(function (response){
				$scope.networkFailure=true;
			});
			
		// General POST API Call
		postBody = JSON.parse(JSON.stringify($scope.general1));
		postBody = {"Genaral": postBody};

		if(postBody.Genaral.NTPOnOff == false){
			postBody.Genaral.NTPOnOff = "Off";
		}else{
			postBody.Genaral.NTPOnOff = "On";
		}

		if(postBody.Genaral.ManualRestart == false){
			postBody.Genaral.ManualRestart = "Off";
		}else{
			postBody.Genaral.ManualRestart = "On";
		}

		if(postBody.Genaral.Security == false){
			postBody.Genaral.Security = "Off";
		}else{
			postBody.Genaral.Security = "On";
		}

		if(postBody.Genaral.Audio == 'glyphicon audible-alarm glyphicon-volume-off'){
			postBody.Genaral.Audio = "Off";
		}else{
			postBody.Genaral.Audio = "On";
		}
		$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig', postBody)
			.success(function(response) {
				
			}).catch(function (response){
				$scope.networkFailure=true;
			});
		

		// Limits POST API Call
		postBody = JSON.parse(JSON.stringify($scope.limitsInfo));
		$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?Userconfig', postBody)
			.success(function(response) {
				
			}).catch(function (response){
				$scope.networkFailure=true;
			});
				
		// POST call for Email
		if($scope.EmailOnOff == false){
			$scope.email.EmailOnOff = "Off";
		}else{
			$scope.email.EmailOnOff = "On";
		}
		postBody = JSON.parse(JSON.stringify({"Email": $scope.email}));	
		$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig', postBody)
		.success(function(rest){
			
			// Settings parameters for Email Notify
			if($scope.emailNotify.Application.Email1 == false){
			$scope.emailNotify.Application.Email1 = "No";
			}else{
				$scope.emailNotify.Application.Email1 = "Yes";
			}
			if($scope.emailNotify.Application.Email2 == false){
				$scope.emailNotify.Application.Email2 = "No";
			}else{
				$scope.emailNotify.Application.Email2 = "Yes";
			}
			if($scope.emailNotify.Application.Service == false){
				$scope.emailNotify.Application.Service = "No";
			}else{
				$scope.emailNotify.Application.Service = "Yes";
			}

			if($scope.emailNotify.LogDump.Email1 == false){
				$scope.emailNotify.LogDump.Email1 = "No";
			}else{
				$scope.emailNotify.LogDump.Email1 = "Yes";
			}
			if($scope.emailNotify.LogDump.Email2 == false){
				$scope.emailNotify.LogDump.Email2 = "No";
			}else{
				$scope.emailNotify.LogDump.Email2 = "Yes";
			}
			if($scope.emailNotify.LogDump.Service == false){
				$scope.emailNotify.LogDump.Service = "No";
			}else{
				$scope.emailNotify.LogDump.Service = "Yes";
			}

			if($scope.emailNotify.Alerts.Email1 == false){
				$scope.emailNotify.Alerts.Email1 = "No";
			}else{
				$scope.emailNotify.Alerts.Email1 = "Yes";
			}
			if($scope.emailNotify.Alerts.Email2 == false){
				$scope.emailNotify.Alerts.Email2 = "No";
			}else{
				$scope.emailNotify.Alerts.Email2 = "Yes";
			}
			if($scope.emailNotify.Alerts.Service == false){
				$scope.emailNotify.Alerts.Service = "No";
			}else{
				$scope.emailNotify.Alerts.Service = "Yes";
			}

			if(document.getElementById("lasthourId").checked == true){
				$scope.emailNotify.Content.Last = "Hour";
			}else if(document.getElementById("lastdayId").checked == true){
				$scope.emailNotify.Content.Last = "Day";
			}else{
				$scope.emailNotify.Content.Last = "20";
			}

			// POST call For Email Notification
			postBody = JSON.parse(JSON.stringify($scope.emailNotify));
			$http.post('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?emailNotify', postBody)
			.success(function(rest) {
				
				$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?emailNotify')
				.success(function(response) {
					$scope.emailNotify = response;

					if($scope.emailNotify.Application.Email1 == "No"){
						$scope.emailNotify.Application.Email1 = false;
					}else{
						$scope.emailNotify.Application.Email1 = true;
					}
					if($scope.emailNotify.Application.Email2 == "No"){
						$scope.emailNotify.Application.Email2 = false;
					}else{
						$scope.emailNotify.Application.Email2 = true;
					}
					if($scope.emailNotify.Application.Service == "No"){
						$scope.emailNotify.Application.Service = false;
					}else{
						$scope.emailNotify.Application.Service = true;
					}

					if($scope.emailNotify.LogDump.Email1 == "No"){
						$scope.emailNotify.LogDump.Email1 = false;
					}else{
						$scope.emailNotify.LogDump.Email1 = true;
					}
					if($scope.emailNotify.LogDump.Email2 == "No"){
						$scope.emailNotify.LogDump.Email2 = false;
					}else{
						$scope.emailNotify.LogDump.Email2 = true;
					}
					if($scope.emailNotify.LogDump.Service == "No"){
						$scope.emailNotify.LogDump.Service = false;
					}else{
						$scope.emailNotify.LogDump.Service = true;
					}

					if($scope.emailNotify.Alerts.Email1 == "No"){
						$scope.emailNotify.Alerts.Email1 = false;
					}else{
						$scope.emailNotify.Alerts.Email1 = true;
					}
					if($scope.emailNotify.Alerts.Email2 == "No"){
						$scope.emailNotify.Alerts.Email2 = false;
					}else{
						$scope.emailNotify.Alerts.Email2 = true;
					}
					if($scope.emailNotify.Alerts.Service == "No"){
						$scope.emailNotify.Alerts.Service = false;
					}else{
						$scope.emailNotify.Alerts.Service = true;
					}

					switch($scope.emailNotify.Content.Last){
						case "Hour":
							document.getElementById("lasthourId").checked = true;
							break;
						case "Day":
							document.getElementById("lastdayId").checked = true;
							break;
						case "20":
							document.getElementById("last20Id").checked = true;
							break;
					}


				}).catch(function (response){
					$scope.networkFailure=true;
				});						

			  });			
		});					
	}
	$scope.discardChanges = function(){
		$scope.editMode = false;
	}

});

app.controller('HelpController', function($scope, $interval, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.activeEventsDisplay = false;
	$rootScope.titleHeader = 'Help';
});

app.controller('ServiceController', function($scope, $rootScope, $http, $interval, $timeout, $filter) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$scope.isBackgroundTask = false;
	$rootScope.titleHeader = 'Service';
	$rootScope.titleSubHeader = 'Service';
	$scope.viewModes = {'Reports':true, 'Upgrade':false, 'Reset': false, 'Calibration': false};
	$scope.dumpStatusView = false;
	$rootScope.activeEventsDisplay = false;	

	$scope.usbMode = function(){
		document.getElementById("usbReportId").checked = true;
		document.getElementById("usbUpgradeId").checked = true;
	}
	$scope.tftpMode = function(){		
	}

	$scope.selectAllChange = function($event){
		var element = $event;
		var selectedId = element.currentTarget.id
		if(document.getElementById("selectallId").checked == true){
			document.getElementById("logId").checked = true;
			document.getElementById("paramId").checked = true;
			document.getElementById("tlmId").checked = true;
			document.getElementById("waveformsId").checked = true;
		}else{
			document.getElementById("logId").checked = false;
			document.getElementById("paramId").checked = false;
			document.getElementById("tlmId").checked = false;
			document.getElementById("waveformsId").checked = false;
		}
	}

	// check if USB device is mounted
	$scope.usbMountCall = function(){
		$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?USBdevice?mount')
			.success(function(response) {
				$scope.usbMount = response.USBmount;
				if($scope.usbMount != 'NULL'){
					$scope.usbMode();
				}else{
					document.getElementById("usbReportId").disabled = true;
					document.getElementById("usbUpgradeId").disabled = true;					
					document.getElementById("tftpReportId").checked = true;
					document.getElementById("tftpUpgradeId").checked = true;
				}
			}).catch(function (response){
				$scope.networkFailure=true;
			});
	}
	
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
					.success(function(response) {
						$scope.protocols = response.Protocols;
					}).catch(function (response){
						$scope.networkFailure=true;
					});
	$http.get('http://' + HOSTNAME2 + ':' + PORT + '/getdata.cgi?devicestatus')
						.success(function(response) {
							$scope.deviceStatuses = response.devicestatus;
							$scope.selectedDevice = $scope.deviceStatuses[0];
						}).catch(function (response){
							$scope.networkFailure=true;
						});

	$scope.usbMountCall();

	// Invoke dump status service`for Reports
	$scope.dumpStatusCall = function(){
		$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?dumpstatus')
				.success(function(response) {
					$scope.dumpStatusView = true;
					$scope.dumpstatus =	response.dumpstatus;
					$scope.dumppercent = response.dumppercen;
				}).catch(function (response){
					$scope.networkFailure=true;
				});

		$scope.timeoutCount = 0;

		$rootScope.dumpStatusPromise =
			$interval(function () {
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?dumpstatus')
				.success(function(response) {
					$scope.dumpStatusView = true;
					
					// Unknown Case
					if((response.dumpstatus == 'Unknown' || response.dumpstatus == 'File not found' || response.dumpstatus == 'Create folder failed' ||  response.dumpstatus ==  'Failure to open port' || response.dumpstatus == 'Failed to Send email to address 1'  || response.dumpstatus == 'Failed to Send email to address 2') && response.dumppercen == '0'){
						$scope.dumpStatusView = false
						$interval.cancel($rootScope.dumpStatusPromise);;
						$scope.timeoutView = true;
						$timeout(function(){
							$scope.timeoutView = false;
							$scope.dumpStatusView = false;
							$scope.isBackgroundTask = false;
						}, SUCCESSDELAY);
					}
					else if(response.dumpstatus == 'Success' && response.dumppercen == '100'){
						// Upon 100% success transfer
						$scope.dumpstatus =	response.dumpstatus;
						$scope.dumppercent = response.dumppercen;
						$interval.cancel($rootScope.dumpStatusPromise);						
						if(document.getElementById("emailId").checked == true){
							$scope.successMessage = "Email Sent Successfully"
						}else{						
							$scope.successMessage = "Saved Successfully"
						}
						if(document.getElementById("emailId").checked == true)
						{
							$timeout(function(){
								$scope.dumpStatusView = false;
								$scope.successView = true;
								
								$interval.cancel($rootScope.dumpStatusPromise);
								
								$timeout(function(){
									$scope.successView = false;
									$scope.isBackgroundTask = false;
								}, SUCCESSDELAY);
							}, EMAIL_SUCCESS_DELAY); // 15 seconds delay for displaying success message considering the server background task
						}else{
							$scope.dumpStatusView = false;
							$scope.successView = true;
							$timeout(function(){
								$scope.successView = false;
								$scope.isBackgroundTask = false;
							}, SUCCESSDELAY);
						}
						//$scope.usbMountCall();
					}else { // Time out case and File not Found Case
						
						$scope.dumpstatus =	response.dumpstatus;
						$scope.dumppercent = response.dumppercen;

						//timeout for 1 minute
						$scope.timeoutCount++;
						if($scope.timeoutCount>11 && $scope.timeoutCount<13){
							$scope.dumpStatusView = false;
							$scope.timeoutView = true;
						}else if($scope.timeoutCount>11 && $scope.timeoutCount<14){
							$interval.cancel($rootScope.dumpStatusPromise);
							$scope.timeoutView = false;
							$scope.dumpStatusView = false;
							$scope.isBackgroundTask = false;
						}
					}
				}).catch(function (response){
					$scope.networkFailure=true;
				});
			}, DUMPSTATUSDELAY);
	}

	// Invoke upgrade status service`
	$scope.upgradeStatusCall = function(){
		$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?status')
				.success(function(response) {
					$scope.dumpStatusView = true;
					$scope.dumpstatus =	response.dumpstatus;
					$scope.dumppercent = response.dumppercen;
				}).catch(function (response){
					$scope.networkFailure=true;
				});
		$scope.timeoutCount = 0;
		$rootScope.upgradeStatusPromise =
			$interval(function () {
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?status')
				.success(function(response) {
					$scope.dumpStatusView = true;
					
					if((response.dumpstatus == 'Unknown' || response.dumpstatus == 'File not found' || response.dumpstatus == 'Burn Error on Download' ||  response.dumpstatus ==  'Failure to open port' || response.dumpstatus == 'No response on Download'  || response.dumpstatus == 'Download failed') && response.dumppercen == '0'){
						$scope.dumpStatusView = false
						$interval.cancel($rootScope.upgradeStatusPromise);
						$scope.timeoutView = true;
						$timeout(function(){
							$scope.timeoutView = false;
							$scope.dumpStatusView = false;
							$scope.isBackgroundTask = false;
						}, SUCCESSDELAY);
					}
					else if(response.UpgradeStatus == 'Success' && response.Upgradepercen == '100'){
						// Upon 100% success transfer
						$scope.dumpstatus =	response.UpgradeStatus;
						$scope.dumppercent = response.Upgradepercen;
						$interval.cancel($rootScope.upgradeStatusPromise);
						$scope.dumpStatusView = false;
						$scope.successMessage = "Upgraded Successfully"
						$scope.successView = true;
						$timeout(function(){
							$scope.successView = false;
							$scope.isBackgroundTask = false;
						}, SUCCESSDELAY);	
					}
					else{
						$scope.dumpstatus =	response.UpgradeStatus;
						$scope.dumppercent = response.Upgradepercen;

						//timeout for 20 seconds
						$scope.timeoutCount++;
						if($scope.timeoutCount>5 && $scope.timeoutCount<7){
							$scope.dumpStatusView = false;
							$scope.timeoutView = true;
						}else if($scope.timeoutCount>5 && $scope.timeoutCount<8){
							$interval.cancel($rootScope.upgradeStatusPromise);
							$scope.timeoutView = false;
							$scope.dumpStatusView = false;
							$scope.isBackgroundTask = false;
						}
					}
				}).catch(function (response){
					$scope.networkFailure=true;
				});
			}, UPGRADESTATUSDELAY);
	}

	// parameters rquired for Service->Reports
	$scope.parametersRequired = function(){
		var parameters="";
		if(document.getElementById("logId").checked == true){
			parameters = "log";
		}
		if(document.getElementById("paramId").checked == true){
			if(parameters != ""){
				parameters = parameters + ",param";
			}else{
				parameters = "param";
			}
		}
		if(document.getElementById("tlmId").checked == true){
			if(parameters != ""){
				parameters = parameters + ",tlm";
			}else{
				parameters = "tlm";
			}
		}
		if(document.getElementById("waveformsId").checked == true){
			if(parameters != ""){
				parameters = parameters + ",waveform";
			}else{
				parameters = "waveform";
			}
		}
		if(document.getElementById("selectallId").checked == true){
			parameters = "all";
		}
		return parameters;
	}

	// parameters rquired for Service->Reset
	$scope.parametersRequiredReset = function(){
		var parameters="";
		if(document.getElementById("mdId").checked == true){
			parameters = "MD";
		}
		if(document.getElementById("peakId").checked == true){
			if(parameters != ""){
				parameters = parameters + ",maxmin";
			}else{
				parameters = "maxmin";
			}
		}
		if(document.getElementById("energyId").checked == true){
			if(parameters != ""){
				parameters = parameters + ",power";
			}else{
				parameters = "power";
			}
		}
		if(document.getElementById("alarmId").checked == true){
			if(parameters != ""){
				parameters = parameters + ",fault";
			}else{
				parameters = "fault";
			}
		}
		return parameters;
	}

	//Invoke upon submit Report
	$scope.generateReportInvoke = function(){
		if($scope.viewModes.Reset != true){
			$scope.isBackgroundTask = true;
		}
		$scope.successView = false;
		var parameters="";
		$interval.cancel($rootScope.dumpStatusPromise);
		$interval.cancel($rootScope.upgradeStatusPromise);		
		$scope.dumpStatusView = false;
		
		if(true){
			parameters = $scope.parametersRequired();
			if(document.getElementById("usbReportId").checked == true){
				//API call for usb
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?usb,'+parameters)
					.success(function(response) {
						if(response.service  || response.error == "dump in progress"){
							$scope.dumpStatusCall();
						}
					}).catch(function (response){
						$scope.networkFailure=true;
						$scope.isBackgroundTask = false;
					});
			}
			else if(document.getElementById("tftpReportId").checked == true){
				// API call for tftp
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?tftp,'+parameters)
					.success(function(response) {
						if(response.service || response.error == "dump in progress"){
							$scope.dumpStatusCall();
						}
					}).catch(function (response){
						$scope.networkFailure=true;
						$scope.isBackgroundTask = false;
					});
			}
			else if(document.getElementById("emailId").checked == true){
				// API call for tftp
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?service?email,'+parameters)
					.success(function(response) {
						if(response.service || response.error){
							$scope.dumpStatusCall();
						}
					}).catch(function (response){
						$scope.networkFailure=true;
						$scope.isBackgroundTask = false;
					});
			}
		}

	}
	
	//Invoke upon submit Upgrade
	$scope.generateUpgradeInvoke = function(){
		if($scope.viewModes.Reset != true){
			$scope.isBackgroundTask = true;
		}
		$scope.successView = false;
		var parameters="";
		$interval.cancel($rootScope.dumpStatusPromise);
		$interval.cancel($rootScope.upgradeStatusPromise);		
		$scope.dumpStatusView = false;
		
		if(true){
			if(document.getElementById("usbUpgradeId").checked == true){
				//API call for usb
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?usb,'+$scope.protocols.TFTPFileName)
					.success(function(response) {
						if(response.upgrade  || response.error == "upgrade in progress"){
							$scope.upgradeStatusCall();
						}
					}).catch(function (response){
						$scope.networkFailure=true;
						$scope.isBackgroundTask = false;
					});
			}
			else if(document.getElementById("tftpUpgradeId").checked == true){
				// API call for tftp
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?upgrade?tftp,'+$scope.protocols.TFTPFileName)
					.success(function(response) {
						if(response.upgrade || response.error == "upgrade in progress"){
							$scope.upgradeStatusCall();
						}
					}).catch(function (response){
						$scope.networkFailure=true;
						$scope.isBackgroundTask = false;
					});
			}
		}
	}
	
	//Invoke upon submit Reset
	$scope.generateResetInvoke = function(){
		if($scope.viewModes.Reset != true){
			$scope.isBackgroundTask = true;
		}
		$scope.successView = false;
		var parameters="";
		$interval.cancel($rootScope.dumpStatusPromise);
		$interval.cancel($rootScope.upgradeStatusPromise);		
		$scope.dumpStatusView = false;
		
		if(true){
			parameters = $scope.parametersRequiredReset();
			//API call for Reset
				$http.get('http://' + HOSTNAME2 + ':' + PORT + '/service.cgi?reset?parameter='+parameters+',ID='+$scope.selectedDevice.Id)
					.success(function(response) {	
						$scope.isBackgroundTask = true;
						$scope.successMessage = "Reset Successful"
						$scope.successView = true;						
						$timeout(function(){
							$scope.isBackgroundTask = false;
							$scope.successView = false;								
						}, 2000);
													
					}).catch(function (response){
						$scope.networkFailure=true;
						alert(JSON.stringify(response));
						$scope.isBackgroundTask = false;
					});

		}

	}
	
	$scope.deviceIdChanged = function($event, i){
		var element = $event;	
	}
	
	$scope.resetViewModes = function(){
		$scope.viewModes.Reports = false;
		$scope.viewModes.Upgrade = false;
		$scope.viewModes.Reset = false;
		$scope.viewModes.Calibration = false;
	}
});
app.controller('AboutController', function($rootScope, $scope, $http, $interval) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'About';
	$rootScope.titleSubHeader = 'About';
	$scope.activeSystemMode = true;
	$rootScope.activeEventsDisplay = false;

	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?FactoryConfig')
		.success(function(response) {
			$scope.rating = response.Rating;
		}).catch(function (response){
			$scope.networkFailure=true;
		});
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?sysInfo')
		.success(function(response) {
			$scope.aboutInfo = response.info;
			$scope.swVersion = response.info.SWVerMajor+'.'+response.info.SWVerMinor;
		}).catch(function (response){
			$scope.networkFailure=true;
		});
	$http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?devicestatus')
		.success(function(response) {
			$scope.deviceStaus = response.devicestatus[0];
			$scope.meterSwVersion = Number($scope.deviceStaus.Majorver)+'.'+$scope.deviceStaus.Minorver;
		}).catch(function (response){
			$scope.networkFailure=true;
		});

	// Sub Menu Navigation
	$scope.aboutSubMenu = function($event, i) {

		var element = $event;
		var filterItem = element.currentTarget.innerText;
		var subMenuCount = element.currentTarget.parentElement.parentElement.childElementCount;
		var currentSubMenuItem = element.currentTarget.parentElement;
		var subMenuItem = element.currentTarget.parentElement.parentElement.firstElementChild;

		for(var i=0; i<subMenuCount; i++){
			if(subMenuItem.innerText.trim()==currentSubMenuItem.innerText.trim()){
				subMenuItem.className = "sub-active-link";
			}
			else{
				subMenuItem.className = "sub-inactive-link";
			}
			subMenuItem = subMenuItem.nextElementSibling
		}

		switch(filterItem)
		{
			case 'System':
				$scope.activeSystemMode = true;
				break;
			case 'Software':
				$scope.activeSystemMode = false;
				break;
		}
	};

});
