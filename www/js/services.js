angular.module('app.services', [])

.factory('DataFactory', function($window) {
  //var ObjProfile={coycode:"",srvcode:"",qno:"",qrcode:"",userid:""} 
    var ProfileKey="hitsqprofile"; 
  
function initProfile(){
  var ObjProfile={coycode:"",srvcode:"",qno:"",qrcode:"",userid:"",datecode:"",notif:"0"} 
  $window.localStorage[ProfileKey] = angular.toJson(ObjProfile);
}
  
return{
  initProfile: function(){
    initProfile(); 
    var StrProfile=$window.localStorage[ProfileKey];   
    return angular.fromJson(StrProfile);
  },
  setProfile: function(ObjNewProfile){
    $window.localStorage[ProfileKey] = angular.toJson(ObjNewProfile);    
    var StrProfile=$window.localStorage[ProfileKey];   
    return angular.fromJson(StrProfile);
  },
  getProfile:function(){
      var StrProfile=$window.localStorage[ProfileKey];    
      if (!(angular.isDefined(StrProfile))) {
        initProfile();
        StrProfile=$window.localStorage[ProfileKey];   
      }    
      return angular.fromJson(StrProfile);
  }
}/*return*/ 
})/*factory*/  

.service('DataService', function($http){
	var BASE_URL = "https://script.google.com/macros/s/AKfycbxCQnaD1dcPULfhU_Xdxv18g5Ku2-W3Z5h75MMeKVhSMX1oLVA/exec?";
	return {    
		RequestGet: function(requestparam){
			return $http.get(BASE_URL+requestparam).then(function(response){
        //console.log(response);
				return response;
			});
		}/*RequestGet*/
    ,
    RequestPost: function(requestparam){
        return $http({
          method  : 'POST',
          url     : BASE_URL,
          data    : requestparam, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
          .then(function(response) {
            //console.log(response);
            return response;
            if (data.errors) {//data.errors
            } else {//data.message
              return(data);
            }
          });	
		}/*RequestPost*/
 
  }
}) ;