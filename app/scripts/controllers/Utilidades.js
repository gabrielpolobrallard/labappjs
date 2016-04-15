//Paciente
angular.module('sbAdminApp').factory('Utilidades', function() {
	var interfaz ={};
	interfaz.getById=function(id,myArray){
		for (var i = myArray.length - 1; i >= 0; i--) {
			if(myArray[i].Id == id)
				return myArray[i];
		}
	};
	interfaz.EsDuplicado= function(id,myArray){
		for (var i = myArray.length - 1; i >= 0; i--) {
			if (myArray[i].Id=== id)
			{
				return true;

			}
		}
	};
	return interfaz;
});