"use strict";

function ConverterView () {

    var homeCurrencySelect = document.getElementById("homeCurrency"),
        destCurrencySelect = document.getElementById("destinationCurrency"),
        bankFeeSelect = document.getElementById("bankFee"),
        homeToDestLabel = document.getElementById("homeToDestLabel"),
        resultValue = document.getElementById("resultValue"),
        resultCurrency = document.getElementById("resultCurrency"),
        buttons = document.getElementsByTagName("button");

    this.setHomeCurrencySelectCallback = function (onClick, onChange) {
        homeCurrencySelect.addEventListener("click", onClick);
        homeCurrencySelect.addEventListener("change", onChange);
    };
    this.addHomeCurrencySelectOption = function (currencyCode, selected) {
        let exists = false;

        for(let i = 0; i < homeCurrencySelect.options.length; i++) {
            if(homeCurrencySelect.options[i].value === currencyCode) {
                exists = true;
                break;
            }
        }

        if(!exists) {
            homeCurrencySelect.innerHTML += '<option value="' + currencyCode + '"' + selected + '>' + currencyCode + '</option>';
        }
    };

    this.getHomeCurrency = function () {
        return homeCurrencySelect.options[homeCurrencySelect.selectedIndex].value;
    };

    this.setDestCurrencySelectCallback = function (onClick, onChange) {
        destCurrencySelect.addEventListener("click", onClick);
        destCurrencySelect.addEventListener("change", onChange);
    };

    this.addDestCurrencySelectOption = function (currencyCode, selected) {
        let exists = false;

        for(let i = 0; i < destCurrencySelect.options.length; i++) {
            if(destCurrencySelect.options[i].value === currencyCode) {
                exists = true;
                break;
            }
        }

        if(!exists) {
            destCurrencySelect.innerHTML += '<option value="' + currencyCode + '"' + selected + '>' + currencyCode + '</option>';
        }
    };

    this.getDestCurrency = function () {
        return destCurrencySelect.options[destCurrencySelect.selectedIndex].value;
    };

    this.setBankFeeSelectCallback = function (onChange) {
        bankFeeSelect.addEventListener("change", onChange);
    };

    this.getBankFee = function () {
        return bankFeeSelect.options[bankFeeSelect.selectedIndex].value;
    };

    this.updateBankFeeSelect = function (percent) {
        for(let i = 0; i < bankFeeSelect.options.length; i++) {
            if(bankFeeSelect.options[i].value === percent) {
                bankFeeSelect.selectedIndex = i;
                break;
            }
        }
    };

    this.updateHomeAndDestSelect = function (homeCode, destCode) {
        for(let i = 0; i < homeCurrencySelect.options.length; i++) {
            if(homeCurrencySelect.options[i].value === homeCode) {
                homeCurrencySelect.selectedIndex = i.toString();
            }
        }
        for(let i = 0; i < destCurrencySelect.options.length; i++) {
            if(destCurrencySelect.options[i].value === destCode) {
                destCurrencySelect.selectedIndex = i.toString();
            }
        }
    };

    this.updateHomeToDestLabel = function (homeCode, destCode) {
        homeToDestLabel.innerHTML = homeCode + " > " + destCode;
    };

    this.getResultValue = function () {
        return resultValue;
    };

    this.updateResultValue = function (result) {
        resultValue.innerHTML = result;
    };

    this.getResultCurrency = function () {
        return resultCurrency;
    };

    this.updateResultCurrency = function (code) {
        resultCurrency.innerHTML = code;
    };

    this.getButtons = function () {
        return buttons;
    };

}