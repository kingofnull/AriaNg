(function () {
    'use strict';

    angular.module('ariaNg').factory('ariaNgCommonService', ['$location', '$timeout', '$base64', 'SweetAlert', '$translate', 'ariaNgConstants', function ($location, $timeout, $base64, SweetAlert, $translate, ariaNgConstants) {
        return {
            generateUniqueId: function () {
                var sourceId = ariaNgConstants.appPrefix + '_' + Math.round(new Date().getTime() / 1000) + '_' + Math.random();
                var hashedId = $base64.encode(sourceId);

                return hashedId;
            },
            showDialog: function (title, text, type) {
                $timeout(function () {
                    SweetAlert.swal({
                        title: $translate.instant(title),
                        text: $translate.instant(text),
                        type: type,
                        confirmButtonText: $translate.instant('OK')
                    });
                }, 100);
            },
            showError: function (text) {
                this.showDialog('Error', text, 'error');
            },
            showOperationSucceeded: function (text) {
                this.showDialog('Operation Succeeded', text, 'success');
            },
            confirm: function (title, text, type, callback, notClose) {
                var options = {
                    title: $translate.instant(title),
                    text: $translate.instant(text),
                    type: type,
                    showCancelButton: true,
                    showLoaderOnConfirm: !!notClose,
                    closeOnConfirm: !notClose,
                    confirmButtonText: $translate.instant('OK'),
                    cancelButtonText: $translate.instant('Cancel')
                };

                if (type == 'warning') {
                    options.confirmButtonColor = '#F39C12';
                }

                SweetAlert.swal(options, function (isConfirm) {
                    if (!isConfirm) {
                        return;
                    }

                    if (callback) {
                        callback();
                    }
                });
            },
            extendArray: function (sourceArray, targetArray, keyProperty) {
                if (!targetArray || !sourceArray || sourceArray.length != targetArray.length) {
                    return false;
                }

                for (var i = 0; i < targetArray.length; i++) {
                    if (targetArray[i][keyProperty] == sourceArray[i][keyProperty]) {
                        angular.extend(targetArray[i], sourceArray[i]);
                    } else {
                        return false;
                    }
                }

                return true;
            },
            copyObjectTo: function (from, to) {
                if (!to) {
                    return from;
                }

                for (var name in from) {
                    if (!from.hasOwnProperty(name)) {
                        continue;
                    }

                    var fromValue = from[name];
                    var toValue = to[name];

                    if (angular.isObject(fromValue) || angular.isArray(fromValue)) {
                        to[name] = this.copyObjectTo(from[name], to[name]);
                    } else {
                        if (fromValue != toValue) {
                            to[name] = fromValue;
                        }
                    }
                }

                return to;
            },
            parseOrderType: function (value) {
                var values = value.split(':');

                var obj = {
                    type: values[0],
                    order: values[1],
                    equals: function (obj) {
                        if (angular.isUndefined(obj.order)) {
                            return this.type === obj.type;
                        } else {
                            return this.type === obj.type && this.order === obj.order;
                        }
                    },
                    getValue: function () {
                        return this.type + ":" + this.order;
                    }
                };

                Object.defineProperty(obj, 'reverse', {
                    get: function () {
                        return this.order === 'desc';
                    },
                    set: function (value) {
                        this.order = (value ? 'desc' : 'asc');
                    }
                });

                return obj;
            },
            getTimeOptions: function (timeList, withDisabled) {
                var options = [];

                if (withDisabled) {
                    options.push({
                        name: 'Disabled',
                        value: 0,
                        optionValue: 0
                    });
                }

                if (!angular.isArray(timeList) || timeList.length < 1) {
                    return options;
                }

                for (var i = 0; i < timeList.length; i++) {
                    var time = timeList[i];
                    var name = '';
                    var value = time;

                    if (time < 1000) {
                        value = time;
                        name = (value == 1 ? 'format.time.millisecond' : 'format.time.milliseconds');
                    } else if (time < 1000 * 60) {
                        value = time / 1000;
                        name = (value == 1 ? 'format.time.second' : 'format.time.seconds');
                    } else if (time < 1000 * 60 * 24) {
                        value = time / 1000 / 60;
                        name = (value == 1 ? 'format.time.minute' : 'format.time.minutes');
                    } else {
                        value = time / 1000 / 60 / 24;
                        name = (value == 1 ? 'format.time.hour' : 'format.time.hours');
                    }

                    options.push({
                        name: name,
                        value: value,
                        optionValue: time
                    })
                }

                return options;
            }
        };
    }]);
})();
