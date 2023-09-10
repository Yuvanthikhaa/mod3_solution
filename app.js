(function () {
  'use strict';
  angular.module('NarrowItDown', [])

    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('APIBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")

NarrowItDownController.$inject = ['MenuSearchService' ];
function NarrowItDownController(MenuSearchService) {
    var menu = this;

    menu.narrow = function(searchTerm) {

         MenuSearchService.getMatchedMenuItems(menu.searchTerm)
            .then(function (response) {
              menu.list = response;            
            })
            .catch(function (error) {
               console.log("error in click function: " + error);
            }) ;
            return menu.list
    };
    
      menu.removeItem  = function (itemIndex) {
        MenuSearchService.removeItem(itemIndex);
      };
    };

 MenuSearchService.$inject = ['$http', 'APIBasePath' ,  '$timeout' , '$q'];
function MenuSearchService($http, APIBasePath ,   timeout, $q) {
    var service = this;
    var foundItems = [];
      service.getMatchedMenuItems = function(searchTerm) {
      return $http({method: "GET", url: (APIBasePath+"/menu_items.json")})
        .then(function (response) {
         
          var keys = Object.keys(response.data) 
          keys.forEach(function (key) {
            var items = response.data[key].menu_items
            items.forEach(function(item){
            if ((item.name.toLowerCase().indexOf(searchTerm) !== -1) || 
            (item.description.toLowerCase().indexOf(searchTerm) !== -1))    {
           var foundObj = {
               "name": item.name,
               "description": item.description
              };
            foundItems.push(foundObj );
            };
            });
          });
        return foundItems;
      }).catch(function (error) {
        console.log("error in service method: "+ error);
      })  ;
    }    ;

    service.removeItem = function (itemIndex) {
      foundItems.splice(itemIndex, 1);
    };



  }
})();
