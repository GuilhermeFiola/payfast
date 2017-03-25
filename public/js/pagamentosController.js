angular.module('app', []).controller('pagamentosController', function($scope, $http) {
    
    /*$http.jsonp('http://localhost:3000/pagamentos').success(function ( data ) {
        console.log(data);
    }, function(err) {
        console.log(err);
    });*/

    $http.get('http://localhost:3000/pagamentos').
        then(function(response) {
            
            $scope.pagamentos = response.data;
        }, function(err) {
            console.log(err);
    });
});