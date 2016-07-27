/**
 * It's a AngularJS mobile daterange picker.
 * @version  v1.0.0
 * @author Gcaufy <gcaufy@gmail.com>
 * @link http://www.madcoder.cn/
 * @copyright Copyright &copy; 2015
 * @license http://www.madcoder.cn/license/
 */
(function (DATEPICKER_DIRECTIVE) {
    var m = angular.module('ngDaterangePicker', []);
    m.version = '1.0.0';


    function getCalendar(year, month, from, end) {
        var date = new Date(year, month, 1), start = date.getDay(), days = new Date(year, month + 1, 0).getDate(), day = 0, week = 0, i = 0, p = 0, cal = [], fromFlag = false;
        if (from) {
            var fromYear = from.getFullYear(), fromMon = from.getMonth();
            fromFlag = (date - new Date(fromYear, fromMon, 1));
            if (fromFlag < 0) 
                return [];
        }
        if (end) {
            var endYear = end.getFullYear(), endMon = end.getMonth();
            endFlag = (date - new Date(endYear, endMon, 1));
            if (endFlag > 0) 
                return [];
        }
        while(day < days) {
            cal[week] = [];
            for (i = 0; i < 7; i++) {
                cal[week][i] = ((week === 0 && i < start) || day >= days) ? '' : (++day);
            }
            week++;
        }
        if (fromFlag === 0) {
            var count = getMonthWeek(from);
            cal = cal.slice(count - 1);
            cal[0] = cal[0].map(function (v) {
                return (v < from.getDate()) ? '' : v;
            });
        }
        if (endFlag === 0) {
            var count = getMonthWeek(end);
            cal = cal.splice(0, count);
            cal[cal.length - 1] = cal[cal.length - 1].map(function (v) {
                return (v <= end.getDate()) ? v : '';
            });
        }
        return cal;
    }

    function getMonthWeek(date) {
        var w = date.getDay(), d = date.getDate();
        return Math.ceil((d + 6 - w) / 7); 
    }

    function getDateOnly(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    m.directive('ngDaterangePicker', ['$parse', '$compile', function($parse, $compile) {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                ngDpModel: '='  //the modal in parent scope
            },
            template: '<div class="page-date">\
                            <div class="page-date-hd">\
                                <table class="table-week">\
                                  <thead>\
                                    <tr>\
                                      <td>日</td>\
                                      <td>一</td>\
                                      <td>二</td>\
                                      <td>三</td>\
                                      <td>四</td>\
                                      <td>五</td>\
                                      <td>六</td>\
                                    </tr>\
                                  </thead>\
                                </table>\
                              </div>\
                        <div class="page-date-bd">\
                            <table class="table-day" ng-repeat="(k, mon) in monthData">\
                                <thead>\
                                    <tr><td class="month" colspan="7">{{getMonth(day, k, $index)}}</td></tr>\
                                </thead>\
                                <tbody>\
                                    <tr ng-repeat="week in mon">\
                                        <td ng-repeat="day in week track by $index" ng-class="loadClassName(k, day)" ng-click="select(k, day, $event)">{{day}}</td>\
                                    </tr>\
                                </tbody>\
                            </table>\
                        </div>\
            ',
            link: function(scope, element, attrs) {
                var date = new Date(), today = date.getDate(), year = date.getFullYear(), month = date.getMonth(), 
                    months = [], monthData = {}, i = attrs.ngDpMonths, monthCount = i, startMonth = month, startYear = year, k, obj, tmp, startDate = null, fromDate = null, endDate = null;

                var disableOld = !!(+attrs.ngDpDisableOld), showDays = attrs.ngDpDays;

                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                if (attrs.ngDpStartDate && new Date(attrs.ngDpStartDate)) {
                    if (attrs.ngDpStartDate === 'today') {
                        startDate = date;
                    } else if (+new Date(attrs.ngDpStartDate))
                        startDate = new Date(attrs.ngDpStartDate);
                }
                // -1 从上个月开始, +1 从下月开始, 1 从1月开始 
                if (!isNaN(attrs.ngDpStartMonth)) {
                    if (attrs.ngDpStartMonth.indexOf('-') !== -1 || attrs.ngDpStartMonth.indexOf('+') !== -1) {
                        startMonth = startMonth + parseInt(attrs.ngDpStartMonth);
                    } else {
                        startMonth = parseInt(attrs.ngDpStartMonth) - 1;
                    }
                }

                startDate = startDate || new Date(year, month, 1);
                startMonth = startDate.getMonth();
                startYear = startDate.getFullYear();

                if (!isNaN(showDays)) {
                    tmp = +startDate + (showDays - 1) * 24 * 3600 * 1000;
                    endDate = new Date(tmp);
                    monthCount = endDate.getMonth() - startDate.getMonth() + 1;
                    i = monthCount;
                }


                while(i--) {
                    k = startMonth + monthCount - i - 1;
                    obj = getCalendar(startYear, (startMonth + monthCount - i - 1), startDate, endDate);
                    tmp = new Date(startYear, k, 1);
                    monthData[tmp.getFullYear() + '-' + (tmp.getMonth() + 1)] = obj;
                }
                
                scope.monthData = monthData;
                scope.months = months;
                scope.today = today;

                scope.ngDpModel = scope.ngDpModel || {};
                if (scope.ngDpModel.start || scope.ngDpModel.end) {
                    scope.ngDpModel.start = (scope.ngDpModel.start instanceof Date) ? getDateOnly(scope.ngDpModel.start) : undefined;
                    scope.ngDpModel.end = (scope.ngDpModel.end instanceof Date) ? getDateOnly(scope.ngDpModel.end) : undefined;
                }
                if (scope.ngDpModel.start && scope.ngDpModel.end) {
                    if (scope.ngDpModel.end - scope.ngDpModel.start <= 0)
                        scope.ngDpModel.end = undefined;
                } else if (!scope.ngDpModel.start && scope.ngDpModel.end) {
                    scope.ngDpModel.start = scope.ngDpModel.end;
                    scope.ngDpModel.end = undefined;
                }



                function runAction(k) {
                    var fn = scope.$parent[attrs[k]];
                    return (typeof(fn) === 'function') ? fn.apply(scope.$parent, Array.prototype.slice.call(arguments, 1)) : null;
                }

                scope.select = function (k, d, e) {
                    var tmp = k.split('-');
                    var start = scope.ngDpModel.start;
                    var end = scope.ngDpModel.end;
                    var select = new Date(tmp[0], tmp[1] - 1, d);

                    if (disableOld && select - date < 0) {
                        return;
                    }

                    if (runAction('ngDpEvtClick', select, e) === false)
                        return;
                    if (start && end) {
                        scope.ngDpModel.end = undefined;
                        scope.ngDpModel.start = select;
                    } else if (start) {
                        if (select - start <= 0) {
                            scope.ngDpModel.start = select;
                        } else {
                            if (runAction('ngDpEvtSelect', scope.ngDpModel.start, select, e) === false)
                                return;
                            scope.ngDpModel.end = select;
                        }
                    } else {
                        scope.ngDpModel.start = select;
                    }
                };

                scope.loadClassName = function (k, d) {
                    var cname = [], tmp = k.split('-'), select = new Date(tmp[0], tmp[1] - 1, d), start, end;
                    if (!d)
                        return cname;
                    if (select - date < 0 && disableOld)
                        cname.push('old');
                    if (select - date === 0)
                        cname.push('today');

                    start = scope.ngDpModel.start;
                    end = scope.ngDpModel.end;
                    if (start || end) {
                        if (start - select === 0) {
                            cname.push('active');
                            cname.push('start');
                        }
                        if (end - select === 0) {
                            cname.push('active');
                            cname.push('end');
                        }
                        if (start && end && start - select < 0 && end - select > 0) {
                            cname.push('active');
                        }
                    }
                    return cname;
                };

                scope.getMonth = function (day, date, index) {
                    var tmp = date.split('-');
                    return tmp[0] + '年' + tmp[1] + '月';
                }
            }
        };
    }]);
})();