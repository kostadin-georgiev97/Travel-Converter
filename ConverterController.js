"use strict";

var converterView = new ConverterView(),
    converterModel= new ConverterModel(),
    converterController = null;

function ConverterController () {

    this.refreshCurrenciesFromData = function () {
        let xhr = new XMLHttpRequest();
        xhr.open("get", "https://devweb2019.cis.strath.ac.uk/~aes02112/ecbxml.php");

        xhr.onreadystatechange = function () {
            let DONE = 4, OK = 200;

            if(xhr.readyState === DONE) {
                if(xhr.status === OK) {
                    let serverReply = (xhr.responseText),
                        parser = new DOMParser(),
                        xmlDoc = parser.parseFromString(serverReply, "text/xml"),
                        currencies = xmlDoc.getElementsByTagName("Cube");

                    for(let i = 0; i < currencies.length; i++) {
                        let code = currencies[i].getAttribute("currency"),
                            rate = currencies[i].getAttribute("rate");

                        if(code !== null && rate !== null) {
                            let currency = new Currency(code, rate);

                            converterModel.addCurrency(currency);
                        }
                    }

                    converterController.updateHomeCurrencies();
                    converterController.updateDestCurrencies();

                    converterController.syncLocalStorage();
                }
            } else {
                //console.log("Error: " + xhr.status);
            }
        };

        xhr.send(null);
    };

    this.updateHomeToDest = function () {
        let home = converterModel.getHomeCurrency().getCode(),
            dest = converterModel.getDestinationCurrency().getCode();

        converterView.updateHomeAndDestSelect(home, dest);
        converterView.updateHomeToDestLabel(home, dest);
    };

    this.updateHomeCurrencies = function () {
        let currencies = converterModel.getCurrencies();
        for(let i = 0; i < currencies.length; i++) {
            let selected = "";
            if(currencies[i].getCode() === converterModel.getHomeCurrency().getCode()) {
                selected = " selected";
            }
            converterView.addHomeCurrencySelectOption(currencies[i].getCode(), selected);
        }
    };

    this.updateDestCurrencies = function () {
        let currencies = converterModel.getCurrencies();
        for(let i = 0; i < currencies.length; i++) {
            let selected = "";
            if(currencies[i].getCode() === converterModel.getDestinationCurrency().getCode()) {
                selected = " selected";
            }
            converterView.addDestCurrencySelectOption(currencies[i].getCode(), selected);
        }
    };

    this.updateBankFee = function () {
        converterView.updateBankFeeSelect(converterModel.getBankFee());
    };

    this.syncLocalStorage = function () {
        if(window.localStorage) {
            if(typeof(localStorage) !== "undefined") {
                let home = JSON.parse(localStorage.getItem("homeCurrency")),
                    dest = JSON.parse(localStorage.getItem("destinationCurrency")),
                    bankFee = JSON.parse(localStorage.getItem("bankFee"));

                if(home !== null) {
                    converterModel.setHomeCurrency(new Currency(home.code, home.rate));
                } else {
                    home = new Currency("GBP", converterModel.getRate("GBP"));
                    converterModel.setHomeCurrency(new Currency(home.getCode(), home.getRate()));
                }
                if(dest !== null) {
                    converterModel.setDestinationCurrency(new Currency(dest.code, dest.rate));
                } else {
                    dest = new Currency("EUR", converterModel.getRate("EUR"));
                    converterModel.setHomeCurrency(new Currency(dest.getCode(), dest.getRate()));
                }
                if(bankFee !== null) {
                    converterModel.setBankFee(bankFee);
                } else {
                    bankFee = 0;
                    converterModel.setBankFee(bankFee);
                }

                converterController.updateHomeCurrencies();
                converterController.updateDestCurrencies();
                converterController.updateBankFee();
                converterController.updateHomeToDest();
                converterView.updateResultCurrency(converterModel.getHomeCurrency().getCode());
            }
        }
    };

    this.init = function () {
        converterController.refreshCurrenciesFromData();
        setInterval(converterController.refreshCurrenciesFromData(), 10000);

        converterView.setHomeCurrencySelectCallback( function () {
            converterController.updateHomeCurrencies();
        }, function () {
            let code = converterView.getHomeCurrency(),
                rate = converterModel.getRate(code);

            converterModel.setHomeCurrency(new Currency(code, rate));
            converterController.updateHomeToDest();
            converterView.getResultValue().innerHTML = "0";
            converterView.updateResultCurrency(code);
        });

        converterView.setDestCurrencySelectCallback( function () {
            converterController.updateDestCurrencies();
        }, function () {
            let code = converterView.getDestCurrency(),
                rate = converterModel.getRate(code);

            converterModel.setDestinationCurrency(new Currency(code, rate));
            converterController.updateHomeToDest();
            converterView.getResultValue().innerHTML = "0";
            converterView.updateResultCurrency(converterModel.getHomeCurrency().getCode());
        });

        converterView.setBankFeeSelectCallback( function () {
            converterModel.setBankFee(converterView.getBankFee());
        });

        converterController.setCalculatorButtonsCallback();

    };

    this.setCalculatorButtonsCallback = function () {
        let buttons = converterView.getButtons(),
            resultValue = converterView.getResultValue();

        for(let i = 0; i < buttons.length; i++) {
            if(["0","1","2","3","4","5","6","7","8","9"].includes(buttons[i].value)) {
                buttons[i].addEventListener("click", function () {
                    if (resultValue.innerHTML === "0") {
                        resultValue.innerHTML = buttons[i].value;
                    } else {
                        if(converterView.getResultCurrency().innerHTML === converterModel.getDestinationCurrency().getCode()) {
                            resultValue.innerHTML = buttons[i].value;
                            converterView.updateResultCurrency(converterModel.getHomeCurrency().getCode());
                        } else {
                            resultValue.innerHTML += buttons[i].value;
                        }
                    }
                });
            } else if(buttons[i].value === "C") {
                buttons[i].addEventListener("click", function () {
                    if(converterView.getResultCurrency().innerHTML === converterModel.getDestinationCurrency().getCode()) {
                        converterView.updateResultCurrency(converterModel.getHomeCurrency().getCode());
                    }
                    resultValue.innerHTML = "0";
                });
            } else if(buttons[i].value === "=") {
                buttons[i].addEventListener("click", function () {
                    let multiplier = resultValue.innerHTML,
                        home = converterModel.getHomeCurrency(),
                        dest = converterModel.getDestinationCurrency(),
                        result = converterModel.convert(multiplier, home, dest);

                    converterView.updateResultValue(result);
                    converterView.updateResultCurrency(converterModel.getDestinationCurrency().getCode());
                });
            } else {
                /* No such button */
            }
        }
    };

}

converterController = new ConverterController();
window.addEventListener("load", converterController.init);