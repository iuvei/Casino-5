﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  define(function(require) {
    var Balance, config;
    config = require("config");
    return Balance = (function() {
      function Balance() {
        this.playerId = ko.observable();
        this.balance = ko.observable({});
        this.gameBalance = ko.observable({});
      }

      Balance.prototype.activate = function(data) {
        var self;
        self = this;
        this.playerId(data.playerId);
        return $.ajax(config.adminApi('/PlayerInfo/GetBalances?playerId=' + this.playerId())).done(function(data) {
          self.balance({
            currency: data.balance.currency,
            mainBalance: data.balance.mainBalance,
            bonusBalance: data.balance.bonusBalance,
            playableBalance: data.balance.playableBalance,
            freeBalance: data.balance.freeBalance,
            totalBonus: data.balance.totalBonus,
            depositCount: data.balance.depositCount,
            totalDeposit: data.balance.totalDeposit,
            withdrawalCount: data.balance.withdrawalCount,
            totalWithdrawal: data.balance.totalWithdrawal,
            totalWin: data.balance.totalWin,
            totalLoss: data.balance.totalLoss,
            totalAdjustments: data.balance.totalAdjustments,
            totalCreditsRefund: data.balance.totalCreditsRefund,
            totalCreditsCancellation: data.balance.totalCreditsCancellation,
            totalChargeback: data.balance.totalChargeback,
            totalChargebackReversals: data.balance.totalChargebackReversals,
            totalWager: data.balance.totalWager,
            averageWagering: data.balance.averageWagering,
            averageDeposit: data.balance.averageDeposit,
            maxBalance: data.balance.maxBalance,
            totalWagering: data.depositWagering.totalWagering,
            wageringCompleted: data.depositWagering.totalWagering - data.depositWagering.wageringRequired,
            wageringRequired: data.depositWagering.wageringRequired
          });
          return self.gameBalance({
            product: data.gameBalance.product,
            balance: data.gameBalance.balance,
            bonusBalance: data.gameBalance.bonusBalance,
            bettingBalance: data.gameBalance.bettingBalance,
            totalBonus: data.gameBalance.totalBonus
          });
        });
      };

      return Balance;

    })();
  });

}).call(this);
