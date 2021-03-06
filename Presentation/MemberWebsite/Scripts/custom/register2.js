﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var RegisterStep2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RegisterStep2 = (function() {
    var model;

    function RegisterStep2() {
      this.submitBonus = __bind(this.submitBonus, this);
      this.setAmount = __bind(this.setAmount, this);
      this.onErrorHandler = __bind(this.onErrorHandler, this);
      this.validateBonusCode = __bind(this.validateBonusCode, this);
      this.amount = ko.observable($("#hidden-amount").val()).extend({
        required: true,
        validatable: true
      });
      this.bonuscode = ko.observable().extend({
        validatable: true
      });
      this.selectedBonusId = ko.observable();
      this.isEnabled = ko.observable(false);
      this.submitDisabled = ko.observable(false);
      this.buttonTitle = ko.computed((function(_this) {
        return function() {
          if (_this.selectedBonusId()) {
            return "DEPOSIT AND GET BONUS";
          } else {
            return "DEPOSIT";
          }
        };
      })(this));
      this.selectBonus = (function(_this) {
        return function(id, requiredAmount) {
          if (requiredAmount > _this.amount()) {
            return false;
          }
          if (_this.selectedBonusId() === id) {
            return _this.selectedBonusId('');
          } else {
            return _this.selectedBonusId(id);
          }
        };
      })(this);
      this.onSubmit = (function(_this) {
        return function(formElement) {
          var data, field;
          if (isNaN(_this.amount())) {
            field = _this['amount'];
            if (field) {
              field.error = "You can enter only numbers";
              field.__valid__(false);
              return false;
            }
          }
          data = {
            amount: _this.amount()
          };
          return _this.validate('/api/validateonlinedepositamount', data, function() {
            var onlineDeposit;
            onlineDeposit = _this.createOnlineDepositObject(_this.selectedBonusId());
            return onlineDeposit.submitOnlineDeposit();
          });
        };
      })(this);
      this.createOnlineDepositObject = (function(_this) {
        return function(bonusId) {
          var onlineDeposit;
          onlineDeposit = new OnlineDepositModel("/home/registerstep4", '', function() {
            return popupAlert("Error occured.", "Contact an administrator.");
          });
          onlineDeposit.onlineAmount(_this.amount());
          return onlineDeposit.onlineDepositBonusId(bonusId);
        };
      })(this);
      this.validate = (function(_this) {
        return function(url, data, onSuccess) {
          return $.postJson(url, data).done(function(response) {
            if (response.hasError) {
              return _this.onErrorHandler(response);
            } else {
              return onSuccess(response);
            }
          }).fail(function(failResponse) {
            return _this.onErrorHandler(failResponse);
          });
        };
      })(this);
    }

    RegisterStep2.prototype.validateBonusCode = function() {
      return $.postJson("/api/ValidateFirstDepositBonus", {
        bonusCode: this.bonuscode(),
        depositAmount: this.amount()
      }).done((function(_this) {
        return function(response) {
          var field;
          if (!response.isValid) {
            field = _this['bonuscode'];
            if (field) {
              field.error = response.errors[0];
              return field.__valid__(false);
            }
          } else {
            return redirect('/home/registerstep2?bonusCode=' + response.bonus.code + "&amount=" + _this.amount());
          }
        };
      })(this));
    };

    RegisterStep2.prototype.onErrorHandler = function(failResponse) {
      var field, message;
      field = this['amount'];
      message = failResponse.errors['amount'];
      if (field) {
        field.error = message;
        return field.__valid__(false);
      }
    };

    RegisterStep2.prototype.setAmount = function(amount) {
      return this.amount(amount);
    };

    RegisterStep2.prototype.submitBonus = function() {};

    model = new RegisterStep2();

    ko.applyBindings(model, $("#register2-wrapper")[0]);

    return RegisterStep2;

  })();

}).call(this);
