app.controller('PduMeteringHomeController', function($scope, $http, $timeout, $interval, $rootScope) {
	//MS - commenting this - testing purpose
//	$rootScope.titleHeader = 'PDU'+ ' - '+$rootScope.selectedDeviceId;
	$rootScope.titleHeader = 'PDU';
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
        //MS - to fetch the Audio information - new reqmt to match LCD UI: START
        $http.get('http://' + HOSTNAME + ':' + PORT + '/getdata.cgi?meters?SysConfig')
			.success(function(response) {
				$scope.sysConfigDetails = response.Genaral;
			}).catch(function (response){
				$scope.networkFailure=true;
			});
        //MS - to fetch the Audio information - new reqmt to match LCD UI: END
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