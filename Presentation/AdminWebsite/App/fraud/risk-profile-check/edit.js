﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["nav", "i18next", "security/security", "dateTimePicker", "EntityFormUtil", "shell"], function(nav, i18N, security, dateTimePicker, efu, shell) {
    var RiskProfileCheckViewModel;
    return RiskProfileCheckViewModel = (function() {
      var handleSaveFailure, handleSaveSuccess, naming, save;

      function RiskProfileCheckViewModel() {
        this.save = __bind(this.save, this);
        this.getBrandId = __bind(this.getBrandId, this);
        this.loadBonuses = __bind(this.loadBonuses, this);
        this.loadPaymentMethods = __bind(this.loadPaymentMethods, this);
        this.loadFraudRisks = __bind(this.loadFraudRisks, this);
        this.loadVipLevels = __bind(this.loadVipLevels, this);
        this.loadCurrencies = __bind(this.loadCurrencies, this);
        this.loadBrands = __bind(this.loadBrands, this);
        this.loadLicensees = __bind(this.loadLicensees, this);
        this.fillViewModel = __bind(this.fillViewModel, this);
        this.load = __bind(this.load, this);
        this.loadConfiguration = __bind(this.loadConfiguration, this);
        this.activate = __bind(this.activate, this);
        var bonusesFields, currencyField, fieldsList, paymentMethods, riskLevelsFields, vipLevelsField;
        this.message = ko.observable("");
        this.messageClass = ko.observable;
        this.form = new efu.Form(this);
        this.isReadOnly = ko.observable(false);
        efu.setupLicenseeField2(this);
        efu.setupBrandField2(this);
        this.dummyObservable = ko.observable();
        this.operators = ko.observableArray([
          {
            text: ">",
            value: 0
          }, {
            text: "<",
            value: 1
          }, {
            text: ">=",
            value: 2
          }, {
            text: "<=",
            value: 3
          }
        ]);
        currencyField = this.form.makeField("currency", ko.observable().extend({
          required: true
        })).hasOptions();
        currencyField.setSerializer(function() {
          return currencyField.value();
        }).setDisplay(ko.computed(function() {
          return currencyField.value();
        }));
        vipLevelsField = this.form.makeField("vipLevels", ko.observableArray([]).extend({
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  return val.length > 0;
                };
              })(this),
              message: "Should be at least one"
            }
          ]
        })).hasOptions();
        vipLevelsField.setSerializer(function() {
          return _.map(vipLevelsField.value(), (function(_this) {
            return function(item) {
              return item.id;
            };
          })(this));
        });
        this.form.makeField("hasAccountAge", ko.observable(false));
        this.form.makeField("accountAge", ko.observable(1).extend({
          formatInt: {
            allowNegative: false,
            allowEmpty: true
          },
          validatable: true,
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  _this.dummyObservable();
                  return !_this.fields.hasAccountAge() || val >= 1;
                };
              })(this),
              message: i18N.t("app:common.validationMessages.countMustBeGreaterOrEqualsTo", {
                count: 1
              })
            }
          ]
        }));
        this.form.makeField("accountAgeOperator", ko.observable());
        this.accountAgeOperatorTitle = ko.computed((function(_this) {
          return function() {
            return _this.getOperator(_this.fields.accountAgeOperator());
          };
        })(this));
        this.form.makeField("hasDepositCount", ko.observable(false));
        this.form.makeField("totalDepositCountOperator", ko.observable());
        this.totalDepositCountOperatorTitle = ko.computed((function(_this) {
          return function() {
            return _this.getOperator(_this.fields.totalDepositCountOperator());
          };
        })(this));
        this.form.makeField("totalDepositCountAmount", ko.observable(1).extend({
          formatInt: {
            allowNegative: false,
            allowEmpty: true
          },
          validatable: true,
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  _this.dummyObservable();
                  return !_this.fields.hasDepositCount() || val >= 1;
                };
              })(this),
              message: i18N.t("app:common.validationMessages.countMustBeGreaterOrEqualsTo", {
                count: 1
              })
            }
          ],
          max: {
            params: 2147483647,
            message: i18N.t("app:common.validationMessages.amountIsBiggerThenAllowed")
          }
        }));
        this.form.makeField("hasPaymentMethodCheck", ko.observable(false));
        this.paymentMethodsAssignControl = new efu.AssignControl();
        paymentMethods = this.form.makeField("paymentMethods", this.paymentMethodsAssignControl.assignedItems.extend({
          required: {
            message: "At least one payment method should be selected",
            onlyIf: ko.computed((function(_this) {
              return function() {
                return _this.form.fields.hasPaymentMethodCheck.value();
              };
            })(this))
          }
        }));
        paymentMethods.setSerializer(function() {
          var i, ids, values;
          ids = [];
          values = paymentMethods.value();
          i = 0;
          while (i < values.length) {
            ids[i] = values[i].id;
            i++;
          }
          return ids;
        });
        this.form.makeField("hasWithdrawalCount", ko.observable(false));
        this.form.makeField("totalWithdrawalCountOperator", ko.observable());
        this.totalWithdrawalCountOperatorTitle = ko.computed((function(_this) {
          return function() {
            return _this.getOperator(_this.fields.totalWithdrawalCountOperator());
          };
        })(this));
        this.form.makeField("totalWithdrawalCountAmount", ko.observable(1).extend({
          formatInt: {
            allowNegative: false,
            allowEmpty: true
          },
          required: true,
          validatable: true,
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  _this.dummyObservable();
                  return !_this.fields.hasWithdrawalCount() || val >= 1;
                };
              })(this),
              message: i18N.t("app:common.validationMessages.countMustBeGreaterOrEqualsTo", {
                count: 1
              })
            }
          ],
          max: {
            params: 2147483647,
            message: i18N.t("app:common.validationMessages.amountIsBiggerThenAllowed")
          }
        }));
        this.form.makeField("hasFraudRiskLevel", ko.observable(false));
        this.fraudRiskLevelsAssignControl = new efu.AssignControl();
        riskLevelsFields = this.form.makeField("riskLevels", this.fraudRiskLevelsAssignControl.assignedItems.extend({
          required: {
            message: "At least one risk level should be selected",
            onlyIf: ko.computed((function(_this) {
              return function() {
                return _this.form.fields.hasFraudRiskLevel.value();
              };
            })(this))
          }
        }));
        riskLevelsFields.setSerializer(function() {
          var i, ids, riskLevels;
          ids = [];
          riskLevels = riskLevelsFields.value();
          i = 0;
          while (i < riskLevels.length) {
            ids[i] = riskLevels[i].id;
            i++;
          }
          return ids;
        });
        this.form.makeField("hasBonusCheck", ko.observable(false));
        this.bonusesAssignControl = new efu.AssignControl();
        bonusesFields = this.form.makeField("bonuses", this.bonusesAssignControl.assignedItems.extend({
          required: {
            message: "At least one bonus should be selected",
            onlyIf: ko.computed((function(_this) {
              return function() {
                return _this.form.fields.hasBonusCheck.value();
              };
            })(this))
          }
        }));
        bonusesFields.setSerializer(function() {
          var bonuses, i, ids;
          ids = [];
          bonuses = bonusesFields.value();
          i = 0;
          while (i < bonuses.length) {
            ids[i] = bonuses[i].id;
            i++;
          }
          return ids;
        });
        this.form.makeField("hasWinLoss", ko.observable(false));
        this.form.makeField("winLossOperator", ko.observable());
        this.winLossOperatorTitle = ko.computed((function(_this) {
          return function() {
            return _this.getOperator(_this.fields.winLossOperator());
          };
        })(this));
        this.form.makeField("winLossAmount", ko.observable(0.0).extend({
          formatInt: {
            allowNegative: true,
            allowEmpty: true
          },
          validatable: true,
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  _this.dummyObservable();
                  return !_this.fields.hasWinLoss() || val >= -2147483648;
                };
              })(this),
              message: i18N.t("app:common.validationMessages.amountGreaterOrEquals", {
                amount: -2147483648
              })
            }
          ],
          min: {
            params: -2147483648,
            message: i18N.t("app:common.validationMessages.amountGreaterOrEquals", {
              amount: -2147483648
            })
          },
          max: {
            params: 2147483647,
            message: i18N.t("app:common.validationMessages.amountIsBiggerThenAllowed")
          },
          required: true
        }));
        this.form.makeField("hasWithdrawalAverageChange", ko.observable(false));
        this.form.makeField("withdrawalAverageChangeOperator", ko.observable());
        this.withdrawalAverageChangeOperatorTitle = ko.computed((function(_this) {
          return function() {
            return _this.getOperator(_this.fields.withdrawalAverageChangeOperator());
          };
        })(this));
        this.form.makeField("withdrawalAverageChangeAmount", ko.observable(0.0).extend({
          formatInt: {
            allowNegative: true,
            allowEmpty: true
          },
          required: true,
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  _this.dummyObservable();
                  return !_this.fields.hasWithdrawalAverageChange() || val >= -2147483648;
                };
              })(this),
              message: i18N.t("app:common.validationMessages.amountGreaterOrEquals", {
                amount: -2147483648
              })
            }
          ],
          min: {
            params: -2147483648,
            message: i18N.t("app:common.validationMessages.amountGreaterOrEquals", {
              amount: '–2147483648'
            })
          },
          max: {
            params: 2147483647,
            message: i18N.t("app:common.validationMessages.amountIsBiggerThenAllowed")
          }
        }));
        this.form.makeField("hasWinningsToDepositIncrease", ko.observable(false));
        this.form.makeField("winningsToDepositIncreaseOperator", ko.observable());
        this.winningsToDepositIncreaseOperatorTitle = ko.computed((function(_this) {
          return function() {
            return _this.getOperator(_this.fields.winningsToDepositIncreaseOperator());
          };
        })(this));
        this.form.makeField("winningsToDepositIncreaseAmount", ko.observable(0.0).extend({
          formatInt: {
            allowNegative: true,
            allowEmpty: true
          },
          required: true,
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  _this.dummyObservable();
                  return !_this.fields.hasWinningsToDepositIncrease() || val >= -2147483648;
                };
              })(this),
              message: i18N.t("app:common.validationMessages.amountGreaterOrEquals", {
                amount: -2147483648
              })
            }
          ],
          min: {
            params: -2147483648,
            message: i18N.t("app:common.validationMessages.amountGreaterOrEquals", {
              amount: '–2147483648'
            })
          },
          max: {
            params: 2147483647,
            message: i18N.t("app:common.validationMessages.amountIsBiggerThenAllowed")
          }
        }));
        this.form.makeField("id", ko.observable()).lockValue(true);
        fieldsList = ["licensee", "brand", "currency", "vipLevels", "hasAccountAge", "accountAge", "accountAgeOperator", "hasDepositCount", "totalDepositCountOperator", "totalDepositCountAmount", "hasPaymentMethodCheck", "paymentMethods", "hasWithdrawalCount", "totalWithdrawalCountOperator", "totalWithdrawalCountAmount", "hasFraudRiskLevel", "riskLevels", "hasBonusCheck", "bonuses", "hasWinLoss", "winLossOperator", "winLossAmount", "hasWithdrawalAverageChange", "withdrawalAverageChangeOperator", "withdrawalAverageChangeAmount", "hasWinningsToDepositIncrease", "winningsToDepositIncreaseOperator", "winningsToDepositIncreaseAmount"];
        efu.publishIds(this, "risk-check-", fieldsList);
        efu.addCommonMembers(this);
        this.form.publishIsReadOnly(fieldsList);
        this.getLicenseesUrl = function() {
          return "Licensee/Licensees?useFilter=true";
        };
        this.getBrandsUrl = (function(_this) {
          return function() {
            return "Licensee/GetActiveBrands?licensee=" + _this.form.fields.licensee.value().id;
          };
        })(this);
        this.form.fields.licensee.value.subscribe((function(_this) {
          return function() {
            return efu.loadBrands2(_this.getBrandsUrl, _this.form.fields.brand);
          };
        })(this));
        this.form.fields.brand.value.subscribe((function(_this) {
          return function() {
            $(_this.uiElement).parent().hide().prev().show();
            return $.when(_this.loadCurrencies(), _this.loadVipLevels(), _this.loadFraudRisks(), _this.loadBonuses()).done(function(r1, r2, r3, r4) {
              return $(_this.uiElement).parent().show().prev().hide();
            });
          };
        })(this));
        this.configuration = void 0;
      }

      RiskProfileCheckViewModel.prototype.activate = function(data) {
        var deferred;
        deferred = $.Deferred();
        this.fields.id(data ? data.id : null);
        this.submitted(data.editMode === false);
        if (this.fields.id()) {
          this.loadConfiguration(deferred);
        } else {
          this.load(deferred);
        }
        return deferred.promise();
      };

      RiskProfileCheckViewModel.prototype.loadConfiguration = function(deferred) {
        return $.ajax("riskprofilecheck/GetById?id=" + this.fields.id(), {
          success: (function(_this) {
            return function(response) {
              _this.configuration = response;
              _this.fillViewModel();
              return _this.load(deferred);
            };
          })(this)
        });
      };

      RiskProfileCheckViewModel.prototype.load = function(deferred) {
        return efu.loadLicensees2(this.getLicenseesUrl, this.form.fields.licensee, (function(_this) {
          return function() {
            return _this.loadLicensees(function() {
              return _this.loadBrands(function() {
                return $.when(_this.loadCurrencies(), _this.loadVipLevels(), _this.loadFraudRisks(), _this.loadBonuses(), _this.loadPaymentMethods()).done(function() {
                  return deferred.resolve();
                });
              });
            });
          };
        })(this));
      };

      RiskProfileCheckViewModel.prototype.fillViewModel = function() {
        this.fields.hasAccountAge(this.configuration.hasAccountAge);
        this.fields.accountAgeOperator(this.configuration.accountAgeOperator);
        this.fields.accountAge(this.configuration.accountAge);
        this.fields.hasDepositCount(this.configuration.hasDepositCount);
        this.fields.totalDepositCountOperator(this.configuration.totalDepositCountOperator);
        this.fields.totalDepositCountAmount(this.configuration.totalDepositCountAmount);
        this.fields.hasPaymentMethodCheck(this.configuration.hasPaymentMethodCheck);
        this.fields.hasWithdrawalCount(this.configuration.hasWithdrawalCount);
        this.fields.totalWithdrawalCountAmount(this.configuration.totalWithdrawalCountAmount);
        this.fields.totalWithdrawalCountOperator(this.configuration.totalWithdrawalCountOperator);
        this.fields.hasFraudRiskLevel(this.configuration.hasFraudRiskLevel);
        this.fields.hasBonusCheck(this.configuration.hasBonusCheck);
        this.fields.hasWinLoss(this.configuration.hasWinLoss);
        this.fields.winLossAmount(this.configuration.winLossAmount);
        this.fields.winLossOperator(this.configuration.winLossOperator);
        this.fields.hasWithdrawalAverageChange(this.configuration.hasWithdrawalAverageChange);
        this.fields.withdrawalAverageChangeOperator(this.configuration.withdrawalAverageChangeOperator);
        this.fields.withdrawalAverageChangeAmount(this.configuration.withdrawalAverageChangeAmount);
        this.fields.hasWinningsToDepositIncrease(this.configuration.hasWinningsToDepositIncrease);
        this.fields.winningsToDepositIncreaseOperator(this.configuration.winningsToDepositIncreaseOperator);
        return this.fields.winningsToDepositIncreaseAmount(this.configuration.winningsToDepositIncreaseAmount);
      };

      RiskProfileCheckViewModel.prototype.loadLicensees = function(callback) {
        var licenseeId, licensees;
        licenseeId = efu.getBrandLicenseeId(shell);
        licensees = this.form.fields.licensee.options();
        if (this.configuration) {
          licenseeId = this.configuration.licensee;
          this.form.fields["licensee"].isSet(true);
        }
        efu.selectLicensee2(this.form.fields.licensee, licenseeId);
        return efu.loadBrands2(this.getBrandsUrl, this.form.fields.brand, (function(_this) {
          return function() {
            return _this.callCallback(callback);
          };
        })(this));
      };

      RiskProfileCheckViewModel.prototype.loadBrands = function(callback) {
        var brandId;
        brandId = this.configuration ? this.configuration.brand : shell.brand().id();
        efu.selectBrand2(this.form.fields.brand, brandId);
        if (this.configuration) {
          this.form.fields["brand"].isSet(true);
        }
        return this.callCallback(callback);
      };

      RiskProfileCheckViewModel.prototype.loadCurrencies = function(callback) {
        var brandId, deferred;
        deferred = $.Deferred();
        brandId = this.getBrandId();
        if (brandId) {
          $.ajax("autoverification/getcurrencies?brandId=" + brandId).done((function(_this) {
            return function(response) {
              _this.form.fields.currency.setOptions(response.currencies);
              if (_this.configuration) {
                efu.selectOption(_this.form.fields.currency, function(item) {
                  return item === _this.configuration.currency;
                });
              }
              deferred.resolve();
              return _this.callCallback(callback);
            };
          })(this));
        } else {
          deferred.resolve();
          this.callCallback(callback);
        }
        return deferred.promise();
      };

      RiskProfileCheckViewModel.prototype.loadVipLevels = function(callback) {
        var brandId, deferred;
        deferred = $.Deferred();
        brandId = this.getBrandId();
        if (brandId) {
          $.ajax("RiskProfileCheck/getviplevels?brandId=" + brandId).done((function(_this) {
            return function(response) {
              var filter, selectedVipLevels;
              _this.form.fields.vipLevels.setOptions(response.vipLevels);
              filter = function(id) {
                var vipLevel, _i, _len, _ref;
                _ref = response.vipLevels;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  vipLevel = _ref[_i];
                  if (vipLevel.id === id) {
                    return vipLevel;
                  }
                }
              };
              if (_this.configuration && _this.configuration.vipLevels) {
                selectedVipLevels = _.filter(response.vipLevels, function(level) {
                  return _.any(_this.configuration.vipLevels, function(levelId) {
                    return level.id === levelId;
                  });
                });
                if (selectedVipLevels.length !== 0) {
                  _this.form.fields.vipLevels.value(selectedVipLevels);
                }
              }
              deferred.resolve();
              return _this.callCallback(callback);
            };
          })(this));
        } else {
          deferred.resolve();
          this.callCallback(callback);
        }
        return deferred.promise();
      };

      RiskProfileCheckViewModel.prototype.loadFraudRisks = function(callback) {
        var brandId, deferred;
        deferred = $.Deferred();
        brandId = this.getBrandId();
        if (brandId) {
          $.ajax("RiskProfileCheck/getfraudrisklevels?brandId=" + brandId).done((function(_this) {
            return function(response) {
              var assigned, item, notAssigned, _i, _len, _ref;
              assigned = [];
              notAssigned = [];
              if (_this.configuration) {
                _ref = response.riskLevels;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  item = _ref[_i];
                  if (_.contains(_this.configuration.riskLevels, item.id)) {
                    assigned.push(item);
                  } else {
                    notAssigned.push(item);
                  }
                }
              } else {
                notAssigned = response.riskLevels;
              }
              _this.fraudRiskLevelsAssignControl.assignedItems(assigned);
              _this.fraudRiskLevelsAssignControl.availableItems(notAssigned);
              deferred.resolve();
              return _this.callCallback(callback);
            };
          })(this));
        } else {
          deferred.resolve();
          this.callCallback(callback);
        }
        return deferred.promise();
      };

      RiskProfileCheckViewModel.prototype.loadPaymentMethods = function(callback) {
        var brandId, deferred;
        deferred = $.Deferred();
        brandId = this.getBrandId();
        if (brandId) {
          $.ajax("RiskProfileCheck/GetPaymentMethods").done((function(_this) {
            return function(response) {
              var assigned, item, notAssigned, _i, _len, _ref;
              assigned = [];
              notAssigned = [];
              if (_this.configuration) {
                _ref = response.paymentMethods;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  item = _ref[_i];
                  if (_.contains(_this.configuration.paymentMethods, item.id)) {
                    assigned.push(item);
                  } else {
                    notAssigned.push(item);
                  }
                }
              } else {
                notAssigned = response.paymentMethods;
              }
              _this.paymentMethodsAssignControl.assignedItems(assigned);
              _this.paymentMethodsAssignControl.availableItems(notAssigned);
              deferred.resolve();
              return _this.callCallback(callback);
            };
          })(this));
        } else {
          deferred.resolve();
          this.callCallback(callback);
        }
        return deferred.promise();
      };

      RiskProfileCheckViewModel.prototype.loadBonuses = function(callback) {
        var brandId, deferred;
        deferred = $.Deferred();
        brandId = this.getBrandId();
        if (brandId) {
          $.ajax("RiskProfileCheck/GetBonuses?brandId=" + brandId).done((function(_this) {
            return function(response) {
              var assigned, item, notAssigned, _i, _len, _ref;
              assigned = [];
              notAssigned = [];
              if (_this.configuration) {
                _ref = response.bonuses;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  item = _ref[_i];
                  if (_.contains(_this.configuration.bonuses, item.id)) {
                    assigned.push(item);
                  } else {
                    notAssigned.push(item);
                  }
                }
              } else {
                notAssigned = response.bonuses;
              }
              _this.bonusesAssignControl.assignedItems(assigned);
              _this.bonusesAssignControl.availableItems(notAssigned);
              deferred.resolve();
              return _this.callCallback(callback);
            };
          })(this));
        } else {
          deferred.resolve();
          this.callCallback(callback);
        }
        return deferred.promise();
      };

      RiskProfileCheckViewModel.prototype.getBrandId = function() {
        var brand;
        brand = this.form.fields.brand.value();
        if (brand) {
          return brand.id;
        } else {
          return null;
        }
      };

      RiskProfileCheckViewModel.prototype.getOperator = function(id) {
        if (id === 0) {
          return ">";
        }
        if (id === 1) {
          return "<";
        }
        if (id === 2) {
          return ">=";
        }
        if (id === 3) {
          return "<=";
        }
      };

      naming = {
        gridBodyId: "risk-profile-check-list",
        editUrl: "riskProfileCheck/AddOrUpdate"
      };

      efu.addCommonEditFunctions(RiskProfileCheckViewModel.prototype, naming);

      RiskProfileCheckViewModel.prototype.callCallback = function(callback) {
        if (callback) {
          return callback();
        }
      };

      RiskProfileCheckViewModel.prototype.serializeForm = function() {
        var res;
        res = this.form.getDataObject();
        return JSON.stringify(res);
      };

      save = RiskProfileCheckViewModel.prototype.save;

      RiskProfileCheckViewModel.prototype.save = function() {
        var hasErrors;
        hasErrors = false;
        this.dummyObservable(new Date());
        if (!hasErrors) {
          return save.call(this);
        }
      };

      handleSaveSuccess = RiskProfileCheckViewModel.prototype.handleSaveSuccess;

      RiskProfileCheckViewModel.prototype.handleSaveSuccess = function(response) {
        response.data = i18N.t("app:fraud.riskProfileCheck.messages." + response.data.code);
        handleSaveSuccess.call(this, response);
        return nav.title(i18N.t("app:fraud.riskProfileCheck.titles.view"));
      };

      handleSaveFailure = RiskProfileCheckViewModel.prototype.handleSaveFailure;

      RiskProfileCheckViewModel.prototype.handleSaveFailure = function(response) {
        response.data = response.data;
        handleSaveFailure.call(this, response);
        return nav.title(i18N.t("app:fraud.riskProfileCheck.titles.failure"));
      };

      return RiskProfileCheckViewModel;

    })();
  });

}).call(this);
