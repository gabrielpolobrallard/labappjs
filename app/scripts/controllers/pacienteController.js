/**
 *  Module
 *
 * Description
 */
 angular.module('sbAdminApp').controller('pacienteController',
    ['$scope', '$http', '$q', '$compile', 'myConfig','PacienteDataService','DTOptionsBuilder','DTColumnDefBuilder','$state',
    function ($scope, $http, $q, $compile, myConfig,PacienteDataService,DTOptionsBuilder,DTColumnDefBuilder,$state) {
        window.myscope = $scope;

        $scope.pacientesData = [];
        $http.get(myConfig.apiUrl + 'paciente/getallforlist').
        success(function (data, status, headers, config) {
            $.each(data, function (i, pac) {
                var ptemp = {
                    Id: pac.PacienteId,
                    Nombre: pac.Nombre,
                    Dni: pac.Dni != null ? pac.Dni : ' ',
                    Sexo: pac.Sexo != null ? pac.Sexo : ' ',
                    GrupoSanguineo: pac.GrupoSanguineo != null ? pac.GrupoSanguineo : ' '
                };
                $scope.pacientesData.push(ptemp);
            }
            );
            
            
        });



        var vm = this;
        vm.message = '';
        vm.persons = {};
        dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('frtip')
        .withPaginationType('full_numbers');
        dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5)
        ];

        $scope.editPerson = function (person) {
            vm.message = 'You are trying to edit the row: ' + JSON.stringify(person);
            console.log(vm.message);
        };
        $scope.deletePerson = function (personId) {
          PacienteDataService.deletePaciente(personId);
          var comArr = eval($scope.pacientesData);
          for (var i = comArr.length - 1; i >= 0; i--) {
            if($scope.pacientesData[i].Id == personId)
            {
             $scope.pacientesData.splice($scope.pacientesData[i].Id,1);
             break;
         };
     }
      $state.go('dashboard.pacientes', {}, {reload: true});
 }
}

]
);

 angular.module('sbAdminApp').controller('EditarPacienteController',
    ['$scope', '$http', '$stateParams', '$modal', '$log', '$filter', 'myConfig', 'Utilidades', 'PacienteDataService', 'Upload', '$timeout','$state', function ($scope, $http, $stateParams, $modal, $log, $filter, myConfig, Utilidades, PacienteDataService, Upload, $timeout,$state) {
        window.esteScope = $scope;
        $scope.paciente = {};
        var esNuevo = true;
        if( $stateParams.id != undefined && $stateParams.id != null){
            esNuevo=false;
            PacienteDataService.getPacientePorId($stateParams.id).then(function (response) {
                $scope.paciente = response.data;
                setMedicos();
                setOs();
            });
        };

        PacienteDataService.getOsForCombo().then(function (response) {
            $scope.obrasociallist = response.data;

        });
        PacienteDataService.getMedicosForCombo().then(function (response) {
            $scope.medicosFullList = response.data;
        });
        PacienteDataService.getGruposSanguineosForCombo().then(function (response) {
            $scope.gruposanguineolist = response.data;
        });


        var setMedicos = function () {


            $scope.paciente.Medico = [];
            var medicoTmp = {};

            for (var i = $scope.paciente.MedicosList.length - 1; i >= 0; i--) {
                medicoTmp = Utilidades.getById($scope.paciente.MedicosList[i], $scope.medicosFullList);
                $scope.paciente.Medico.push(medicoTmp);
            }
        }


        var setOs = function () {
            $scope.paciente.ObraSocial = [];
            var OsTmp = {};
            for (var i = $scope.paciente.ObrasSocialesList.length - 1; i >= 0; i--) {
                medicoTmp = Utilidades.getById($scope.paciente.ObrasSocialesList[i], $scope.obrasociallist);
                $scope.paciente.ObraSocial.push(medicoTmp);
            }
        }




        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: '',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }


        $scope.animationsEnabled = true;
        $scope.openGrupoModal = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "../../../views/dashboard/Pacientes/modalEditar.html",
                controller: "ModalControllerGrupo",
                size: size,
                resolve: {
                    gruposanguineolista: function () {
                        return $scope.gruposanguineolist;
                    },
                    grupoActual: function () {
                        return $scope.paciente.GrupoSanguineoId;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.paciente.GrupoSanguineoId = selectedItem;
                cambiarDescripcionGrupo();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        function cambiarDescripcionGrupo() {
            $scope.paciente.GrupoDescripcion = Utilidades.getById($scope.paciente.GrupoSanguineoId, $scope.gruposanguineolist).Nombre;
        }

//Modal Medico
$scope.openMedicoModal = function (size) {
    var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: "../../../views/dashboard/Pacientes/modalEditarMedicos1.html",
        controller: "ModalControllerMedicos",
        size: size,
        resolve: {
            medicosLista: function () {
                return $scope.medicosFullList;
            },
            medicosActuales: function () {
                return $scope.paciente.Medico;
            }
        }
    });
    modalInstance.result.then(function (selectedItem) {
        console.log(selectedItem);
        if (selectedItem != null && selectedItem != undefined) {
            try {
                $scope.paciente.Medico = [];
                $scope.paciente.Medico = selectedItem;
            }
            catch (err) {
                $log.info('Hubo un error');
            }
        }
    }, function () {
        $log.info('Modal dismissed at: ' + new Date());
    });
};

        //Modal ObraSocial
        $scope.openOsModal = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "../../../views/dashboard/Pacientes/modalEditarOs.html",
                controller: "ModalControllerOs",
                size: size,
                resolve: {
                    obrasSocialesFullLista: function () {
                        return $scope.obrasociallist;
                    },
                    obrasSocialesMyList: function(){
                        return $scope.paciente.ObraSocial;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
                if (selectedItem != null && selectedItem != undefined) {
                    try {
                        $scope.paciente.ObraSocial = [];
                        $scope.paciente.ObraSocial = selectedItem;
                    }
                    catch (err) {
                        $log.info('Hubo un error');
                    }
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };



        $scope.Update = function(paciente){
            var pacienteAModificar = {
                PacienteId:paciente.PacienteId,
                Nombre:paciente.Nombre,
                Apellido:paciente.Apellido,
                Dni:paciente.Dni,
                Email:paciente.Email,
                Telefono:paciente.Telefono,
                Direccion:paciente.Direccion,
                FechaAlta:paciente.FechaAlta,
                FechaNacimiento:paciente.FechaNacimiento,
                GrupoSanguineoId:paciente.GrupoSanguineoId,
                GrupoDescripcion:paciente.GrupoDescripcion,
                Borrado:paciente.Borrado,
                Foto:paciente.Foto,
                Observacion:paciente.Observacion,
                SexoId:paciente.SexoId,
                ObraSocial: [],
                DonanteId:paciente.DonanteId,
                Medico:[] 
            };

            copiarOsyMedicos();
            function copiarOsyMedicos()
            {
                for (var i = $scope.paciente.ObraSocial.length - 1; i >= 0; i--) {

                    pacienteAModificar.ObraSocial.push({ ObraSocialId: $scope.paciente.ObraSocial[i].Id});
                }
                for (var i =  $scope.paciente.Medico.length - 1; i >= 0; i--) {
                   pacienteAModificar.Medico.push({Id: $scope.paciente.Medico[i].Id});
               }
           }

         if(esNuevo){//Post
            PacienteDataService.insertarPaciente(pacienteAModificar).then(function(data){
                console.log(data);
                $state.go('dashboard.editarpaciente', {id: data.data.PacienteId }, {reload: false});


            })
        }
        else
         {//Put
           var res = PacienteDataService.updatePaciente(pacienteAModificar).then(function(data){ return data;})
       }
   };

    }//cierra controllerfn
    ]//cierra requireds
);//cierra controller
angular.module('sbAdminApp').controller('ModalControllerGrupo', ['$scope', '$modalInstance', 'gruposanguineolista', 'grupoActual', function ($scope, $modalInstance, gruposanguineolista, grupoActual) {
    $scope.grupoElegido = grupoActual;
    $scope.gruposanguineoli = gruposanguineolista;
    $scope.okGrupo = function () {
        $modalInstance.close(Number($scope.grupoElegido));
    };
    $scope.cancelGrupo = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

angular.module('sbAdminApp').controller('ModalControllerMedicos', ['$scope', '$modalInstance', 'medicosLista', 'medicosActuales', 'Utilidades', function ($scope, $modalInstance, medicosLista, medicosActuales, Utilidades) {
    window.ScopeModal = $scope;
    if (medicosActuales !== null)
        $scope.medicosActuales = medicosActuales;
    else $scope.medicosActuales = [];
    $scope.medicoElegido = {};
    $scope.medicosLista = medicosLista;
    $scope.quitarMedico = function (myId) {
        for (var i = medicosActuales.length - 1; i >= 0; i--) {
            if ($scope.medicosActuales[i].Id === Number(myId)) {
                $scope.medicosActuales.splice(i, 1);
            }
        }
    };
    $scope.agregarMedico = function (m) {
        var res = Utilidades.getById(m, $scope.medicosLista);
        if (!Utilidades.EsDuplicado(res.Id, $scope.medicosActuales)) {
            $scope.medicosActuales.push(res);
        }
        else {
            console.log('Este medico ya existe.');
        }
    };
    $scope.okMedico = function () {
        $modalInstance.close($scope.medicosActuales);
    };
    $scope.cancelMedico = function () {
        $modalInstance.dismiss('cancel');
    };
}
]);



angular.module('sbAdminApp').controller('ModalControllerOs', ['$scope', '$modalInstance', 'obrasSocialesFullLista', 'obrasSocialesMyList', 'Utilidades', function ($scope, $modalInstance, obrasSocialesFullLista, obrasSocialesMyList, Utilidades) {
    window.ScopeModal = $scope;
    if (obrasSocialesMyList != null)
        $scope.obrasSocialesMyList = obrasSocialesMyList;
    else $scope.obrasSocialesMyList = [];
    $scope.OsElegida = {};
    $scope.obrasSocialesFullLista = obrasSocialesFullLista;
    $scope.quitarOs = function (myId) {
        for (var i = obrasSocialesMyList.length - 1; i >= 0; i--) {
            if ($scope.obrasSocialesMyList[i].Id === Number(myId)) {
                $scope.obrasSocialesMyList.splice(i, 1);
            }
        }
    };
    $scope.agregarOs= function (m) {
        var res = Utilidades.getById(m, $scope.obrasSocialesFullLista);
        if (!Utilidades.EsDuplicado(res.Id, $scope.obrasSocialesMyList)) {
            $scope.obrasSocialesMyList.push(res);
        }
        else {
            console.log('Esta Os ya existe.');
        }
    };
    $scope.okOs = function () {
        $modalInstance.close($scope.obrasSocialesMyList);
    };
    $scope.cancelOs = function () {
        $modalInstance.dismiss('cancel');
    };
}
]);