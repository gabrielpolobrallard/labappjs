'use strict';

describe('Controller: ProbandogabrielCtrl', function () {

  // load the controller's module
  beforeEach(module('sbAdminApp'));

  var ProbandogabrielCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProbandogabrielCtrl = $controller('ProbandogabrielCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProbandogabrielCtrl.awesomeThings.length).toBe(3);
  });
});
