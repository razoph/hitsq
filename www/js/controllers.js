angular.module('app.controllers', [])
  
.controller('hITSQCtrl', ['$scope', '$stateParams', '$window', '$ionicPlatform', 'DataFactory', 'DataService', '$ionicLoading', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$window,$ionicPlatform,DataFactory,DataService,$ionicLoading,$ionicPopup)  {

/*get local date to iso string*/
Date.prototype.toIsoString=function(){var t=-this.getTimezoneOffset(),e=t>=0?"+":"-",s=function(t){var e=Math.floor(Math.abs(t));return(10>e?"0":"")+e};return this.getFullYear()+"-"+s(this.getMonth()+1)+"-"+s(this.getDate())+"T"+s(this.getHours())+":"+s(this.getMinutes())+":"+s(this.getSeconds())+e+s(t/60)+":"+s(t%60)};

/* check date validity */
function isValidDateCode(strDateCode){
    var strToday=new Date().toIsoString().substring(0, 10)
    return (strDateCode===strToday)
}

function alertInvalidDateCode() {
      var alertPopup = $ionicPopup.alert({
         title: 'Error',
         template: 'Invalid QR Number'
      });
      alertPopup.then(function(res) {
          //
      });
};  
   
  $scope.setFirebase=function(){
    var ref = firebase.database().ref().child( $scope.profile.coycode+"-"+ $scope.profile.srvcode);
    // var ref = firebase.database().ref().child( 'C01-S01');    
    ref.on("value", function(snapshot){
        
        /* get realtime data */
        console.log(snapshot.val());
        obj=snapshot.val();
        var qcallno =obj.qcallno;
        var qcallparts =qcallno.split("-");
    
        /* compare current no and user no*/
        if (parseInt(qcallparts[0])>parseInt($scope.profile.qno)){
            firebase.database().goOffline();
            $scope.data.message='-----'; /*current no*/
            $scope.data.countername='';
            console.log($scope.data.message);            
        }else{
            /* display realtime data */
            $scope.data.message=qcallparts[0]; /*current no*/
            $scope.data.countername=qcallparts[1].replace("_", " ");
            console.log($scope.data.message);            
        }
        $scope.$apply();
        
      }, function(errorobj){
            console.log("error:"+errorobj);
      });    
  }

$scope.sendProfileData=function(ObjProfile){
    ObjProfile.cmd="adddevice";
  var sendparameters=Object.keys(ObjProfile).map((i)=>i+'='+ObjProfile[i]).join('&');   
  console.log(sendparameters);
  $ionicLoading.show();
  DataService.RequestPost(sendparameters)
    .then(function(response){
        console.log(response);
        if (response.data && response.data.length){
            //console.log(response.data);
            var arrresponse=response.data;
            $scope.profile.coysrv=arrresponse[0].srvname+", "+arrresponse[0].coyname;
            $scope.profile=DataFactory.setProfile($scope.profile);      
            $scope.setFirebase();
    }
      alert('Data Sent');
     })
     .finally(function(){ 
       $ionicLoading.hide();
     });           
};

function onScanSuccess(result){
    console.log('ScanQr Success');
    console.log(result);
      var qrParts = result.split(":");
      
      if (isValidDateCode(qrParts[4])===false){
          alertInvalidDateCode();
          return;
      }
      
      if((qrParts[0]=='MOB') && (qrParts[3]!="00000")){
        $scope.profile.coycode=qrParts[1];
        $scope.profile.srvcode=qrParts[2];
        $scope.profile.qno=qrParts[3];
        $scope.profile.datecode=qrParts[4];
        $scope.profile.qrcode=result;        
        //$scope.refreshpage();
        //$scope.setFirebase();
        $scope.profile=DataFactory.setProfile($scope.profile);
        $scope.sendProfileData($scope.profile);     
      }
      
}
function onScanFailure(error) {
    console.log('ScanQr Failed');
          alert("Scanning failed: " + error);
      }
      
$scope.beginScanQr = function () {
    console.log('begin Scan Qr');
    document.addEventListener("deviceready", function () {
        //alert(456);
        console.log('deviceReady');
        $scope.results = "result here.";
        var params={
            text_title: "'Scan Your Code'", // Android only 
            text_instructions: "'Point your camera at the QR code.'", // Android only 
            camera:"back" , // "front" || "back",defaults to "back" 
            flash: "auto",// "on" || "off" || "auto"  defaults to "auto". See Quirks 
            drawSight: true // true || false,defaults to true, 
            //create a red sight/line in the center of the scanner view. 
            };
    cloudSky.zBar.scan(params, onScanSuccess, onScanFailure);
});
}

$scope.beginEnterQr=function(){
    console.log("begin manual enter qr code");
var manualqrcode = prompt("Please enter qr code name", "MOB:C0:S0:0000:2000-01-01");
    if (manualqrcode != null) {
        //alert(manualqrcode);
      var qrParts = manualqrcode.split(":");

      if (isValidDateCode(qrParts[4])===false){
          alertInvalidDateCode();
          return;
      }      
      
      if((qrParts[0]=='MOB') && (qrParts[3]!="00000")){
        $scope.profile.coycode=qrParts[1];
        $scope.profile.srvcode=qrParts[2];
        $scope.profile.qno=qrParts[3];
        $scope.profile.datecode=qrParts[4];
        $scope.profile.qrcode=manualqrcode;        
        //$scope.refreshpage();
        //$scope.setFirebase();
        $scope.profile=DataFactory.setProfile($scope.profile);
        $scope.sendProfileData($scope.profile);
      }
    }
} 



$scope.$on('$ionicView.loaded', function(){
$ionicPlatform.ready(function() {    
if (angular.isDefined(window.plugins)){    
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    var notificationOpenedCallback = function(jsonData) {
      //alert("Notification opened:\n" + JSON.stringify(jsonData));
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    // TODO: Update with your OneSignal AppId before running.
    window.plugins.OneSignal
      .startInit("ce5cc3c9-8599-4960-8c02-0486ed08db72")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
      
    window.plugins.OneSignal.addSubscriptionObserver(function (state) {
      //console.log("Push Subscription state changed: " + angular.fromJson(state));
      console.log("Push Subscription state changed: " + JSON.stringify(state));
      //console.log(state);
      //console.log(state.to.userId);
      if (angular.isDefined(state.to.userId)){
          var strTest=state.to.userId;
          console.log(strTest);
          if ((strTest) && (strTest!='')){
              console.log('if2:'+strTest);
              $scope.profile.deviceid=state.to.userId;
              $scope.profile=DataFactory.setProfile($scope.profile);
              $scope.onesignalstatus=true;
              console.log('device registered to onesignal for first time');
              $scope.$apply();
          }/*if (state.to.userID!='')*/
      }/*if (angular.isDefined(state.to.userId))*/
      
});/*window.plugins.OneSignal.addSubscriptionObserver*/
}/*angular.isDefined(window.plugins)*/
});/*$ionicPlatform.ready*/


  $scope.onesignalstatus=false;
  $scope.profile=DataFactory.getProfile();
  $scope.data = {'message':'0'};
  console.log($scope.profile);

  if (($scope.onesignalstatus==false) && 
   (angular.isDefined($scope.profile.deviceid)) &&
      ($scope.profile.deviceid!='')
         ){
            $scope.onesignalstatus=true;
            console.log('device registered to onesignal already');
            $scope.setFirebase();
         }

});/*viewloaded*/
//$scope.onesignalstatus=true; /*test*/


$scope.$on('$ionicView.enter', function(){
    $scope.profile=DataFactory.getProfile();
    var strDateCode=$scope.profile.datecode;
    if (isValidDateCode(strDateCode)===false){
        
        var manualqrcode = "MOB:C0:S0:0000:2001-01-01";
        var qrParts = manualqrcode.split(":");
        $scope.profile.coycode=qrParts[1];
        $scope.profile.srvcode=qrParts[2];
        $scope.profile.qno=qrParts[3];
        $scope.profile.datecode=qrParts[4];
        $scope.profile.qrcode=manualqrcode; 
        $scope.profile=DataFactory.setProfile($scope.profile);
        
        /* future recommendation
        $scope.profile=DataFactory.initProfile();
        */
    }
});

}/*controller*/
])
 