# AngularJS Daterange Picker

H5原生提供的日期选择功能体验不好, 而且各种坑, 于是便写了这个基于Angularjs的时间区间选择器. 感谢[@liqunyang]()的构建样式代码.

线上DEMO: [https://www.madcoder.cn/demos/ng-daterange-picker/example/index.html](https://www.madcoder.cn/demos/ng-daterange-picker/example/index.html)

扫码DEMO: ![QR Code](https://github.com/gcaufy/ng-daterange-picker/raw/master/screenshots/qr.png)

![Daterange Picker](https://github.com/gcaufy/ng-daterange-picker/raw/master/screenshots/daterangepicker.png)

### Usage

加入代码引用:
```html
<link rel="stylesheet" href="dist/css/ng-daterange-picker.min.css" />
<script src="dist/js/ng-daterange-picker.min.js"></script>
```
模块依赖注入:
```javascript
var app = angular.module('myApp', ['ngDaterangePicker']);
```
HTML:
```html
<ng-daterange-picker ng-dp-model="mydate" ng-dp-months="3" ng-dp-start-date="today" ng-dp-days="48" ng-dp-disable-old="0" ng-dp-disable-oneday="0" ng-dp-evt-click="click" ng-dp-evt-select="select"></ng-daterange-picker>
```

### 参数说明:
|  参数 | 类型 | 说明
| ----- | ---- | ----
| ng-dp-model | Object | 双向绑定的选择结果
| ng-dp-months | Number | 显示几个月的日历
| ng-dp-start-month | Number | 从几月份开始, '1': 从今年1月份开始, '-2': 从上上个月开始, '+2': 从下下个月开始
| ng-dp-start-date | String | 开始日期, 'today' 或者 '2016/07/26'. 与month参数冲突时, 优先以此参数计算
| ng-dp-days | Number | 显示多少天, 与month参数冲突时, 优先以此参数计算
| ng-dp-disable-old | boolean | 是否禁用小于今天的日期
| ng-dp-disable-oneday | boolean | 是否禁用选择起止时间为同一天
| ng-dp-evt-click | Function | 点击事件, 返回false取消选择
| ng-dp-evt-select | Function | 选择成功事件, 返回false取消选择

### 实例:
```javascript
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
```
