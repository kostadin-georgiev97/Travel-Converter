"use strict";

function ConverterModel () {

    var currencies = [new Currency("EUR", 1)],
        homeCurrency = new Currency("GBP", 0.86580),
        destinationCurrency = new Currency("EUR", 1.0),
        bankFee = 0;

    this.convert = function (amount, home, dest) {
        let result = amount * (dest.getRate() / home.getRate());
        // Apply bank fee
        result += (bankFee / 100) * result;
        //Round to 2 decimals
        result = Math.round(result * 100) / 100;

        return result;
    };

    this.addCurrency = function (currency) {
        if(currencies.length > 0) {
            let exists = false,
                i;

            for (i = 0; i < currencies.length; i++) {
                if (currencies[i].getCode() === currency.getCode()) {
                    exists = true;
                    break;
                }
            }

            if (exists) {
                currencies[i].setRate(currency.getRate());
            } else {
                currencies.push(currency);
            }
        } else {
            currencies.push(currency);
        }
    };

    this.getRate = function (code) {
        if(currencies.length > 0) {
            for (let i = 0; i < currencies.length; i++) {
                if (currencies[i].getCode() === code) {
                    return currencies[i].getRate();
                }
            }
        } else {
            return -1;
        }
    };

    this.getCurrencies = function () {
        return currencies;
    };

    this.getHomeCurrency = function () {
        return homeCurrency;
    };

    this.setHomeCurrency = function (currency) {
        if(destinationCurrency.getCode() === currency.getCode()) {
            destinationCurrency = homeCurrency;
            let destCurr = '{"code": "' + destinationCurrency.getCode() + '", "rate": "' + destinationCurrency.getRate() + '"}';
            localStorage.setItem("destinationCurrency", destCurr);
        }
        homeCurrency = currency;
        let homeCurr = '{"code": "' + homeCurrency.getCode() + '", "rate": "' + homeCurrency.getRate() + '"}';
        localStorage.setItem("homeCurrency", homeCurr);
    };

    this.getDestinationCurrency = function () {
        return destinationCurrency;
    };

    this.setDestinationCurrency = function (currency) {
        if(homeCurrency.getCode() === currency.getCode()) {
            homeCurrency = destinationCurrency;
            let homeCurr = '{"code": "' + homeCurrency.getCode() + '", "rate": "' + homeCurrency.getRate() + '"}';
            localStorage.setItem("homeCurrency", homeCurr);
        }
        destinationCurrency = currency;
        let destCurr = '{"code": "' + destinationCurrency.getCode() + '", "rate": "' + destinationCurrency.getRate() + '"}';
        localStorage.setItem("destinationCurrency", destCurr);
    };

    this.setBankFee = function (percent) {
        bankFee = percent;
        localStorage.setItem("bankFee", JSON.stringify(bankFee));
    };

    this.getBankFee = function () {
        return bankFee;
    }

}

function Currency (Code, Rate) {

    var code = Code,
        rate = Rate;

    this.getCode = function () {
        return code;
    };
    this.getRate = function () {
        return rate;
    };
    this.setCode = function (newCode) {
        code = newCode;
    };
    this.setRate = function (newRate) {
        rate =  newRate;
    };

}