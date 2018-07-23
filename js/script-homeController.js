app.controller('HomeController', function($scope, $http, $timeout, $location, $interval, $rootScope) {
	$interval.cancel($rootScope.dumpStatusPromise);
	$interval.cancel($rootScope.upgradeStatusPromise);
	$rootScope.titleHeader = 'Power Distribution';
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