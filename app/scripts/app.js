'use strict';
/**
* @ngdoc overview
* @name sbAdminApp
* @description
* # sbAdminApp
*
* Main module of the application.
*/
var sbAdminApp = angular.module('sbAdminApp', [
  'oc.lazyLoad',
  'ui.router',
  'ui.bootstrap',
  'angular-loading-bar',
  'datatables',
  'datatables.bootstrap',
  'jkuri.datepicker',
  'ngFileUpload',
  'ngSanitize',
  'adaptv.adaptStrap',
  'ui.router.tabs',
  'ngResource',
  'xeditable'
  ])
.config(['$httpProvider','$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($httpProvider,$stateProvider,$urlRouterProvider,$ocLazyLoadProvider,DTOptionsBuilder,DTColumnDefBuilder,$timeout,PacienteDataService) {
  $ocLazyLoadProvider.config({
    debug:false,
    events:true,
    cache:false
  });
  $urlRouterProvider.otherwise('/dashboard/home');
  $stateProvider
  .state('dashboard', {
    url:'/dashboard',
    templateUrl: 'views/dashboard/main.html',
    resolve: {
      loadMyDirectives:function($ocLazyLoad){
        return $ocLazyLoad.load(
        {
          name:'sbAdminApp',
          files:[
          'scripts/directives/header/header.js',
          'scripts/directives/header/header-notification/header-notification.js',
          'scripts/directives/sidebar/sidebar.js',
          'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
          ]
        }),
        $ocLazyLoad.load(
        {
          name:'toggle-switch',
          files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
          ]
        }),
        $ocLazyLoad.load(
        {
          name:'ngAnimate',
          files:['bower_components/angular-animate/angular-animate.js']
        })
        $ocLazyLoad.load(
        {
          name:'ngCookies',
          files:['bower_components/angular-cookies/angular-cookies.js']
        })
        $ocLazyLoad.load(
        {
          name:'ngResource',
          files:['bower_components/angular-resource/angular-resource.js']
        })
        $ocLazyLoad.load(
        {
          name:'ngSanitize',
          files:['bower_components/angular-sanitize/angular-sanitize.js']
        })
        $ocLazyLoad.load(
        {
          name:'ngTouch',
          files:['bower_components/angular-touch/angular-touch.js']
        })
      }
    }
  })
  .state('dashboard.home',{
    url:'/home',
    controller: 'MainCtrl',
    templateUrl:'views/dashboard/home.html',
    resolve: {
      loadMyFiles:function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name:'sbAdminApp',
          files:[
          'scripts/controllers/main.js',
          'scripts/directives/timeline/timeline.js',
          'scripts/directives/notifications/notifications.js',
          'scripts/directives/chat/chat.js',
          'scripts/directives/dashboard/stats/stats.js'
          ]
        })
      }
    }
  })
  .state('dashboard.pacientes', {
    templateUrl:'views/dashboard/Pacientes/index.html',
    url:'/pacientes',
    controller:'pacienteController'

  }
  )
  .state('dashboard.editarpaciente',{
    templateUrl:'views/dashboard/Pacientes/editar.html',
    url:'/editarpaciente/:id',
    controller:'EditarPacienteController'

  })
  .state('dashboard.nuevopaciente',{
    templateUrl:'views/dashboard/Pacientes/editar.html',
    url:'/editarpaciente',
    controller:'EditarPacienteController'

  })
  .state('dashboard.analisis',{
    templateUrl:'views/dashboard/analisis/index.html',
    url:'/analisis',
    controller:'AnalisisControllerMain',
    resolve:{
      pacientesParaLista: function (PacienteDataService) {
        return PacienteDataService.getPacientesParaLista().then(function (response) {
          return response;
        });},
        AnalisisLista: function (PacienteDataService) {
          return PacienteDataService.getAllAnalisisLista().then(function(response){
            return response.data;
          });},
          ObraSocialLista: function (PacienteDataService) {
            return PacienteDataService.getOsForCombo().then(function(response){
              return response.data;
            });},
            MedicosLista: function (PacienteDataService) {
              return PacienteDataService.getMedicosForCombo().then(function(response){
                return response.data;
              });},
              GrupoSanguineoLista: function (PacienteDataService) {
                return PacienteDataService.getGruposSanguineosForCombo().then(function(response){
                  return response.data;
                });},
                EstadosLista: function (PacienteDataService) {
                  return PacienteDataService.getAllEstados().then(function(response){
                    return response.data;
                  });}

                }})
  .state('dashboard.analisiseditar',{
    templateUrl:'views/dashboard/analisis/editaranalisis.html',
    url:'/analisiseditar:{analisisId:int}',
    controller:'AnalisisControllerEditar',
    resolve:{
      AnalisisData: function ($stateParams,PacienteDataService) {
        return PacienteDataService.getAnalisisById($stateParams.analisisId).then(function(response) {
          return response.data;
        });},
        OtrosDatos: function(PacienteDataService){
          var obj = {};
          PacienteDataService.getAllNombreCampoAnalisis().then(function(response)
          {
            obj.NombreCampos=response.data;
          });
          PacienteDataService.getAllDeterminacionesAnalisis().then(function(response)
          {
            obj.Determinaciones=response.data;
          });
          PacienteDataService.getAllEstados().then(function(response){
            obj.Estados= response.data;
          });
          PacienteDataService.getAllTipoMuestras().then(function(response){
            obj.TipoMuestras = response.data;
          });
          PacienteDataService.getAllUnidadMedidas().then(function(response){
           obj.UnidadMedidas= response.data;
         });
          PacienteDataService.getPacientesParaLista().then(function (response) {
           obj.Pacientes= response;
         });
          PacienteDataService.getOsForCombo().then(function(response){
            obj.ObrasSociales= response.data;
          });
          PacienteDataService.getMedicosForCombo().then(function(response){
            obj.Medicos= response.data;
          });
          PacienteDataService.getGruposSanguineosForCombo().then(function(response){
            obj.GruposSanguineos= response.data;
          });
          return obj;
        }
      }
    })
  .state('dashboard.analisiseditar.general', {
    url:'/general',
    templateUrl: 'views/dashboard/analisis/tabs/editargeneral.html'
  }).state('dashboard.analisiseditar.detalle', {
    url:         '/detalle',
    templateUrl: 'views/dashboard/analisis/tabs/editardetalle.html'
  })
  .state('dashboard.form',{
    templateUrl:'views/form.html',
    url:'/form'
  })
  .state('dashboard.blank',{
    templateUrl:'views/pages/blank.html',
    url:'/blank'
  })
  .state('login',{
    templateUrl:'views/pages/login.html',
    url:'/login'
  })
  .state('dashboard.chart',{
    templateUrl:'views/chart.html',
    url:'/chart',
    controller:'ChartCtrl',
    resolve: {
      loadMyFile:function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name:'chart.js',
          files:[
          'bower_components/angular-chart.js/dist/angular-chart.min.js',
          'bower_components/angular-chart.js/dist/angular-chart.css'
          ]
        }),
        $ocLazyLoad.load({
          name:'sbAdminApp',
          files:['scripts/controllers/chartContoller.js']
        })
      }
    }
  })
  .state('dashboard.table',{
    templateUrl:'views/table.html',
    url:'/table'
  })
  .state('dashboard.panels-wells',{
    templateUrl:'views/ui-elements/panels-wells.html',
    url:'/panels-wells'
  })
  .state('dashboard.buttons',{
    templateUrl:'views/ui-elements/buttons.html',
    url:'/buttons'
  })
  .state('dashboard.notifications',{
    templateUrl:'views/ui-elements/notifications.html',
    url:'/notifications'
  })
  .state('dashboard.typography',{
    templateUrl:'views/ui-elements/typography.html',
    url:'/typography'
  })
  .state('dashboard.icons',{
    templateUrl:'views/ui-elements/icons.html',
    url:'/icons'
  })
  .state('dashboard.grid',{
    templateUrl:'views/ui-elements/grid.html',
    url:'/grid'
  })
}]);


sbAdminApp.run(function(editableOptions) {
editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

sbAdminApp.constant('myConfig', {
  appName: 'Laboratorio',
  appVersion: 2.0,
  apiUrl: 'http://localhost:10344/api/'
});