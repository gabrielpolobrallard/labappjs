/**
*  Module
*
* Description
*/
angular.module('sbAdminApp').controller('AnalisisControllerMain', ['$scope', '$http', '$q', '$compile', 'myConfig','$state','pacientesParaLista','AnalisisLista','ObraSocialLista','MedicosLista','GrupoSanguineoLista','EstadosLista','PacienteDataService', function ($scope, $http, $q, $compile, myConfig,$state,pacientesParaLista,AnalisisLista,ObraSocialLista,MedicosLista,GrupoSanguineoLista,EstadosLista,PacienteDataService) {
	
	window.analisisScope = $scope;
	var anactrl = this;
	
	anactrl.ListaAnalisis=AnalisisLista;
	anactrl.pacientesList=pacientesParaLista;
	anactrl.ObraSocialLista=ObraSocialLista;
	anactrl.MedicosLista=MedicosLista;
	anactrl.GrupoSanguineoLista=GrupoSanguineoLista;
	anactrl.estadosList=EstadosLista;
	

	//$scope.anactrl=anactrl;
	
	anactrl.formatearDatos= function (){
		var arrayAnalisis = [];

		var asignarNombrePaciente = function(id){
			var nombrep = "";
			for (var i = anactrl.pacientesList.length - 1; i >= 0; i--) {
				if( anactrl.pacientesList[i].PacienteId==id)
				{
					nombrep=anactrl.pacientesList[i].Nombre;
					break;
				}
			}
			return nombrep;

		};
		var asignarEstadoDescripcion= function(id){
			var estTmp = "";
			for (var i = anactrl.estadosList.length - 1; i >= 0; i--) {
				if( anactrl.estadosList[i].EstadoId==id)
				{
					estTmp = anactrl.estadosList[i].Detalle;
					break;
				}
			}
			return estTmp;
		};


		for (var i = anactrl.ListaAnalisis.length - 1; i >= 0; i--) {
			anactrl.ListaAnalisis[i].PacienteNombre = asignarNombrePaciente(anactrl.ListaAnalisis[i].PacienteId);
			anactrl.ListaAnalisis[i].EstadoDescripcion = asignarEstadoDescripcion(anactrl.ListaAnalisis[i].EstadoId);

		}




	};

	anactrl.formatearDatos();

	$scope.models = {
		changeInfo: [],
		searchText: '',
		selectedCars: [],
		analisisDataSource: anactrl.ListaAnalisis,
		state: {
			sortKey: 'FechaSolicitud',
			sortDirection: 'DEC'
		}
	};

	$scope.analisisTableColumnDefinition = [
	{
		columnHeaderDisplayName: 'Id',
		displayProperty: 'AnalisisId',
		sortKey: 'AnalisisId',
		//columnSearchProperty: 'name',
		visible: false
	},
	{
		columnHeaderDisplayName: 'Paciente',
		displayProperty: 'PacienteNombre',
		sortKey: 'PacienteNombre',
		columnSearchProperty: 'PacienteNombre',
		visible: true
	},
	{
		columnHeaderTemplate: '<span><i class="glyphicon glyphicon-calendar"></i> Fecha de Pedido</span>',
		template: '<strong>{{ item.FechaSolicitud }}</strong>',
		sortKey: 'FechaSolicitud',
		width: '12em',
		columnSearchProperty: 'FechaSolicitud'
	},
	{
		columnHeaderTemplate: '<span><i class="glyphicon glyphicon-calendar"></i> Fecha de Entrega</span>',
		template: '<strong>{{ item.FechaEntrega }}</strong>',
		sortKey: 'FechaEntrega',
		width: '12em',
		columnSearchProperty: 'FechaEntrega'
	},
	{
		columnHeaderDisplayName: 'Estado',
		displayProperty: 'EstadoDescripcion',
		sortKey: 'EstadoDescripcion',
		columnSearchProperty: 'EstadoDescripcion',
		visible: true
	},
	{
		columnHeaderDisplayName: 'Precio',
		displayProperty: 'PrecioVenta',
		cellFilter: 'currency',
		sortKey: 'PrecioVenta',
		width: '9em',
		columnSearchProperty: 'PrecioVenta'
	},
	{
		columnHeaderDisplayName: 'Editar',
		templateUrl: 'views/dashboard/analisis/tree/buyCell.html',
		width: '4em'
	}
	];

	$scope.onDragChange = function(o, n, data) {
		$scope.models.changeInfo.push({
			startPosition: o,
			endPosition: n,
			data: data
		});
	};

	$scope.onStateChange = function(state) {
		alert(JSON.stringify(state));
	};

    // ========== ui handlers ========== //
    $scope.Editar = function (id) {
    	$state.go('dashboard.analisiseditar', {analisisId: id }, {reload: false});
    };

    $scope.rowExpanded = function (obj) {

    	
    };


    $scope.checkRowSelected = function (item, index) {
    	var found = false;
    	$scope.models.selectedCars.forEach(function (selectedItem) {
    		if (item.id === selectedItem.id) {
    			found = true;
    		}
    	});
    	return found ? 'info row-' + index : 'row-' + index;
    };



}]
);//cierra controller.





angular.module('sbAdminApp').controller('AnalisisControllerEditar', ['$scope','$filter','AnalisisData','PacienteDataService','OtrosDatos','$modal',function($scope,$filter,AnalisisData,PacienteDataService,OtrosDatos,$modal){
	window.eAscope = $scope;
	console.log(OtrosDatos);
	
	$scope.OtrosDatos = OtrosDatos;
	AnalisisData.FechaSolicitud = new Date(AnalisisData.FechaSolicitud);
	AnalisisData.FechaEntrega = new Date(AnalisisData.FechaEntrega);
	$scope.Analisis = AnalisisData;

	$scope.tabData   = [
	{
		heading: 'General',
		route:   'dashboard.analisiseditar.general'
	},
	{
		heading: 'Detalles de Analisis',
		route:   'dashboard.analisiseditar.detalle',
		disable: false
	}
	];


	
	

	$scope.showStatus = function(user) {
		var selected = [];
		if(user.EstadoId) {
			selected = $filter('filter')($scope.OtrosDatos.Estados, {EstadoId: user.EstadoId});
		}
		return selected.length ? selected[0].Detalle : 'Not set';
	};

	$scope.showUnidadMedidas = function(user) {
		var selected = [];
		if(user.UnidadMedidaId) {
			selected = $filter('filter')($scope.OtrosDatos.UnidadMedidas, {UnidadMedidaId: user.UnidadMedidaId});
		}
		return selected.length ? selected[0].Detalle : 'Not set';
	};




	$scope.animationsEnabled = true;
	$scope.openModalNuevoAnalisisDetalle = function (size) {
		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: "../../../views/dashboard/analisis/tabs/modalnuevoanalisisdetalle.html",
			controller: "modalNuevoAnalisisDetalleController",
			size: size,
			resolve: {
				AnalisisDetalleActual:function(){
					return $scope.Analisis.AnalisisDetalles;
				},
				TodaLaData:function()
				{
					var obj = {};
					obj.OtrosDatos=OtrosDatos;
					return obj;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			$scope.paciente.GrupoSanguineoId = selectedItem;
			cambiarDescripcionGrupo();
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};



}]);



angular.module('sbAdminApp').controller('modalNuevoAnalisisDetalleController', ['$scope','AnalisisDetalleActual','TodaLaData','$modalInstance', function($scope,AnalisisDetalleActual,TodaLaData,$modalInstance){
	window.sMAD=$scope;
	$scope.Ad = AnalisisDetalleActual;
	$scope.TodaLaData=TodaLaData;



}]);//