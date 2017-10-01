/**
 * Created by U160964 on 5/16/2017.
 */

(function() {
    "use strict";

    angular.module('app.uds').component('sourceTypes', {
        templateUrl: 'app/views/sourceTypesView.html',
        controller: 'SourceTypesController'

    });
    angular.module('app.uds').controller('SourceTypesController', ['$scope', 'FileUploader',

          function($scope, FileUploader) {
              var sourceFile, targetFile;
              var uploader = $scope.uploader = new FileUploader({});
              $scope.files = [];
              uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                  console.info('onWhenAddingFileFailed', item, filter, options);
              };
              uploader.onAfterAddingFile = function(fileItem) {
                  $scope.files.push(fileItem);
                  console.info('onAfterAddingFile', fileItem);
              };
/*
              uploader.onAfterAddingAll = function(addedFileItems) {

                  console.info('onAfterAddingAll', addedFileItems);
              };

              uploader.onBeforeUploadItem = function(item) {
                  console.info('onBeforeUploadItem', item);
              };
              uploader.onProgressItem = function(fileItem, progress) {
                  console.info('onProgressItem', fileItem, progress);
              };
              uploader.onProgressAll = function(progress) {
                  console.info('onProgressAll', progress);
              };
              uploader.onSuccessItem = function(fileItem, response, status, headers) {
                  console.info('onSuccessItem', fileItem, response, status, headers);
              };
              uploader.onErrorItem = function(fileItem, response, status, headers) {
                  console.info('onErrorItem', fileItem, response, status, headers);
              };
              uploader.onCancelItem = function(fileItem, response, status, headers) {
                  console.info('onCancelItem', fileItem, response, status, headers);
              };
              uploader.onCompleteItem = function(fileItem, response, status, headers) {
                  console.info('onCompleteItem', fileItem, response, status, headers);
              };
              uploader.onCompleteAll = function() {
                  console.info('onCompleteAll');
              };

              console.info('uploader', uploader);
*/

////////////////////////

              $scope.filesLoaded = true;
              $scope.keysLoaded = true;
              $scope.currentStep = 1;
              $scope.sourceTypes = ['File', 'Table'];
              $scope.sourceKeyArray = [];
              $scope.targetKeyArray = [];

              $scope.checkLoadedFiles = function(){
                  if($scope.files.length === 2 && $scope.userForm.$valid){
                      $scope.filesLoaded = false;
                      $('#btn-step-1').focus();
                  }
                  return $scope.filesLoaded;
              };

              $scope.checkReconcile = function(){
                  return $scope.map.length === 0;
              };

              $scope.checkLoadedKeys = function(){
                  if($scope.inputKey && $scope.inputKey !== '' && $scope.targetKey && $scope.targetKey !== ''){
                      $scope.keysLoaded = false;
                  }
                  return $scope.keysLoaded;
              };

              $scope.reset = function () {
//                  $scope.userForm.$setPristine();
                  $scope.inputType = null;
                  $scope.targetType = null;
                  uploader.queue.forEach(function(item){
                      item.remove();
                  });
                  $('#file1').val(null);
                  $('#file2').val(null);
                  $scope.userForm.$setPristine();
                  $scope.userForm.$setUntouched();
                  $scope.files = [];
                  $scope.filesLoaded = true;
//                  $scope.files.forEach(function(item){
//                      item.remove();
//                  });
                  $scope.currentStep = 1;
              };

              $scope.reconcile = function(){
                  $('#result').addClass('capitalize');
              };
              $scope.map = [];
              $scope.addKeys = function(){
                  var src = $scope.inputKey;//$('#srcSelect').val();
                  var src1 = $scope.targetKey;//$('#srcTarget').val();
                  if(src !== '' && src1 !== ''){
                      $scope.map.push({'source':{'name':src}, 'target':{'name':src1}})
                  }
              };

              $scope.setStep = function () {
                  $scope.currentStep++;
              };

              $scope.showSelectionPage = function () {
                  sourceFile = $("#sourceFile").val();
                  targetFile = $("#targetFile").val();
                  $scope.sourceArray = [];
                  getKeyArray('data/source.csv','sourceArray');
                  $scope.targetArray = [];
                  getKeyArray('data/target.csv', 'targetArray');
                  $scope.setStep();
              };


              function getKeyArray(source,key) {
                  $.ajax({
                      url: source,
                      dataType: 'text'
                  }).done(function (dt) {

                      var allRows = dt.split(/\r?\n|\r/);
                      var headers = allRows[0].split(',');
                      $scope[key] = allRows[0].split(',');
                      var data = {};
                      headers.forEach(function(head, i){
                          if (!data[head]){
                              data[head] = []
                          }
                          allRows.forEach(function(item, idx){
                              if(idx > 0){
                                  var row = item.split(',');
                                  data[head].push(row[i]);
                              }
                          });
                      });
                      if(key === 'sourceArray'){
                          $scope.sourceKeyArray = data['Acct_ref_nb'];
                      }else{
                          $scope.targetKeyArray = data['NPV_score'];
                      }
                      $scope.$apply();

               });

              }
/*
              $.ajax({
                  url: 'data/source.csv',
                  dataType: 'text',
              }).done(function (data) {
                  debugger
                  var allRows = data.split(/\r?\n|\r/);
                  var aaaa = allRows[0].split(',');
                  debugger
              });
/*
              function successFunction(data) {
                  var allRows = data.split(/\r?\n|\r/);
                  var table = '<table>';
                  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
                      if (singleRow === 0) {
                          table += '<thead>';
                          table += '<tr>';
                      } else {
                          table += '<tr>';
                      }
                      var rowCells = allRows[singleRow].split(',');
                      for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
                          if (singleRow === 0) {
                              table += '<th>';
                              table += rowCells[rowCell];
                              table += '</th>';
                          } else {
                              table += '<td>';
                              table += rowCells[rowCell];
                              table += '</td>';
                          }
                      }
                      if (singleRow === 0) {
                          table += '</tr>';
                          table += '</thead>';
                          table += '<tbody>';
                      } else {
                          table += '</tr>';
                      }
                  }
                  table += '</tbody>';
                  table += '</table>';
                  $('body').append(table);
              }

              $scope.formSubmit = function() {
                  if(loginService.login($scope.username, $scope.password)) {
                      $scope.error = '';
                      $scope.username = '';
                      $scope.password = '';
                      $location.url('/sorEntities');
                  } else {
                      $scope.error = "Incorrect username/password !";
                  }
              };
*/
        }]);

})();
