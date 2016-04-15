angular.module('sbAdminApp')
.factory('PacienteDataService', ['$http', 'myConfig','$q',function ($http, myConfig,$q) {

  var urlBase = myConfig.apiUrl + 'paciente';
  var interfaz = {};
  interfaz.getPacientes = function () {
    return $http.get(urlBase);
  };

  interfaz.getPacientesParaLista = function () {

    return $http.get(urlBase + '/getallforlist').then(function (response) {
      return response.data;
    });

  };
  interfaz.getPacientePorId = function (id) {

   return  $http.get(urlBase + '/' + id)
   .success(function(data) {
    return data;
  });

 };

 interfaz.insertarPaciente = function (cust) {
  return $http.post(urlBase, cust);
};

interfaz.updatePaciente = function (cust) {
  return $http.put(urlBase + '/'+cust.PacienteId,cust);
};

interfaz.deletePaciente = function (id) {
  return $http.delete(urlBase + '/' + id);
};

interfaz.getOsForCombo = function () {
  return $http.get(myConfig.apiUrl + 'obrasocial/getallforcombo').success(function(data) {
   return data.data;
 });
};
interfaz.getGruposSanguineosForCombo = function () {
  return $http.get(myConfig.apiUrl + 'gruposanguineo/getallforcombo').success(function(data) {
   return data.data;
 });
};
interfaz.getMedicosForCombo = function () {
 return $http.get(myConfig.apiUrl + 'medicos/getallforcombo').success(function(data) {
  return data.data;
});
};
//Analisis 
interfaz.getAllEstados = function(){
  return $http.get(myConfig.apiUrl + 'estado').success(function(data) {
    return data.data;
  });
};
interfaz.getSucursal = function(sucursalId){

  return $http.get(myConfig.apiUrl + 'sucursal/'+sucursalId).success(function(data) {
    return data.data;
  });
};
interfaz.getAllAnalisisLista = function(){

  return $http.get(myConfig.apiUrl + 'analisis/').success(function(data) {
    return data.data;
  });
};
interfaz.getAnalisisById = function(id){

  return $http.get(myConfig.apiUrl + 'analisis/'+id).success(function(data) {
    return data.data;
  });
};
interfaz.getDetalleAnalisisList = function(analisisId){

  return $http.get(myConfig.apiUrl + 'analisis/getdetalleanalisislist/'+ analisisId).success(function(data) {
    return data;
  });
};
interfaz.getDetalleAnalisisListFull = function(analisisId){

  return $http.get(myConfig.apiUrl + 'analisis/getdetalleanalisislistfull/'+ analisisId).success(function(data) {
    return data;
  });
};
interfaz.getAllTipoMuestras = function(){

  return $http.get(myConfig.apiUrl + 'analisis/getallMuestras').success(function(data) {
    return data;
  });
};

interfaz.getAllUnidadMedidas = function(){

  return $http.get(myConfig.apiUrl + 'analisis/getallunidadmedida').success(function(data) {
    return data;
  });
};
interfaz.getAllNombreCampoAnalisis = function(){

  return $http.get(myConfig.apiUrl + 'analisis/GetAllNombreCampoAnalisis').success(function(data) {
    return data;
  });
};
interfaz.getAllDeterminacionesAnalisis = function(){

  return $http.get(myConfig.apiUrl + 'analisis/GetAllDeterminacionAnalisis').success(function(data) {
    return data;
  });
};


return interfaz;
}]);