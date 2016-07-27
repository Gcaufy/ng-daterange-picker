var app = angular.module('myApp', ['ngDaterangePicker']);
app.controller('myCtrl', function($scope) {

    // 初始选择值从今天到10天后
    $scope.mydate = {start: new Date(), end: new Date(+new Date() + 10 * 24 * 3600 * 1000)};

    // 点击事件
    $scope.click = function (date, e) {
        console.log('Clicked Date: ' + format(date));
    };
    // 选择完成事件
    $scope.select = function (start, end, e) {
        if (end - start > 20 * 24 * 3600 * 1000) {
            alert('It\'s more than 20 days');
            return false; // 返回false放弃选择
        }
        console.log('Selected ' + (1 + (end - start) / 1000 / 3600 / 24) + ' day: ' + format(start) + ' - ' + format(end) + '.');
    };

    function format(date) {
        return date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
    }
});