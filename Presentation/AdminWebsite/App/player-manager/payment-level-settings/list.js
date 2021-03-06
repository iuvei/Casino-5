﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var ViewModel, app, i18n, nav, security;
    require("controls/grid");
    nav = require("nav");
    i18n = require("i18next");
    app = require("durandal/app");
    security = require("security/security");
    return ViewModel = (function(_super) {
      __extends(ViewModel, _super);

      function ViewModel() {
        var _ref;
        ViewModel.__super__.constructor.apply(this, arguments);
        this.isEditAllowed = ko.observable(security.isOperationAllowed(security.permissions.update, security.categories.paymentLevelSettings));
        this.noRecordsFound = ko.observable(false);
        this.rowId = ko.observable();
        this.selectedRowId = ko.observable();
        this.brandNameSearchPattern = ko.observable();
        this.Search = ko.observable();
        _ref = ko.observableArrays(), this.brands = _ref[0], this.licensees = _ref[1], this.paymentGateways = _ref[2], this.statuses = _ref[3], this.paymentTypes = _ref[4], this.paymentMethods = _ref[5], this.currencies = _ref[6], this.paymentLevels = _ref[7];
        this.filtersCriteria = ko.computed((function(_this) {
          return function() {
            var brand, criteria, licensee;
            licensee = _this.licensees;
            brand = _this.brands;
            criteria = {};
            if (licensee != null) {
              criteria['Brand.LicenseeName'] = licensee;
            }
            if (brand != null) {
              criteria['Brand.Name'] = brand;
            }
            return criteria;
          };
        })(this));
      }

      ViewModel.prototype.reloadGrid = function() {
        return $("#payment-level-settings-grid").trigger("reload");
      };

      ViewModel.prototype.rowChange = function(row) {
        return this.noRecordsFound(($("#payment-level-settings-grid")[0].gridParam("reccount")) === 0);
      };

      ViewModel.prototype.activate = function() {
        ViewModel.__super__.activate.apply(this, arguments);
        $.get('Licensee/Licensees?useFilter=true').done((function(_this) {
          return function(response) {
            var item, _i, _len, _ref, _results;
            _ref = response.licensees;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results.push(_this.licensees.push(item.name));
            }
            return _results;
          };
        })(this));
        $.get('/PaymentSettings/BrandsList').done((function(_this) {
          return function(response) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = response.length; _i < _len; _i++) {
              item = response[_i];
              _results.push(_this.brands.push(item));
            }
            return _results;
          };
        })(this));
        $.get("/PaymentSettings/PaymentTypesList").done((function(_this) {
          return function(response) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = response.length; _i < _len; _i++) {
              item = response[_i];
              _results.push(_this.paymentTypes.push(item));
            }
            return _results;
          };
        })(this));
        $.get("/PaymentSettings/PaymenMethodsList").done((function(_this) {
          return function(response) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = response.length; _i < _len; _i++) {
              item = response[_i];
              _results.push(_this.paymentMethods.push(item));
            }
            return _results;
          };
        })(this));
        $.get("/PaymentSettings/CurrencyList").done((function(_this) {
          return function(response) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = response.length; _i < _len; _i++) {
              item = response[_i];
              _results.push(_this.currencies.push(item));
            }
            return _results;
          };
        })(this));
        return $.get("/PaymentLevel/GetPaymentLevels").done((function(_this) {
          return function(response) {
            var item, _i, _len, _ref, _results;
            _ref = response.data.paymentLevels;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results.push(_this.paymentLevels.push(item.name));
            }
            return _results;
          };
        })(this));
      };

      ViewModel.prototype.openEditTab = function() {
        var grid, playerData, selectedData;
        grid = $("#payment-level-settings-grid")[0];
        selectedData = grid.gridParam("selarrrow");
        playerData = [];
        if (selectedData.length > 0) {
          ko.utils.arrayForEach(selectedData, (function(_this) {
            return function(playerid) {
              var row;
              row = grid.getRowData(playerid);
              row.id = playerid;
              return playerData.push(row);
            };
          })(this));
          return nav.open({
            path: "player-manager/payment-level-settings/setPaymentLevel",
            title: i18n.t("app:playerManager.paymentLevelSettings.setPaymentLevel"),
            data: {
              playerData: playerData,
              brandId: playerData[0].BrandId,
              currency: playerData[0].Currency
            }
          });
        }
      };

      return ViewModel;

    })(require("vmGrid"));
  });

}).call(this);
