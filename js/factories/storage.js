'use strict';



app.factory("Storage", function(Formater){
    var Storage = function() {
        var pub = {};

        var constructor = function() {
            createLocalStorage();
            return pub;
        };

        /**
         * checks if localStorage already exists if not create   e
         */
        var createLocalStorage = function() {
            if(!localStorage["people"] || !localStorage["debts"]) {
                pub.clearStorage();
            }
        };

        /**
         * checks if person is already in database
         * @param _arr - array to check
         * @param _name - name to check
         * @returns {number} - true if name is already in database else false
         */
        var isPersonInArray = function(_arr, _name) {
            for(var idx in _arr) {
                if(_arr[idx].name === _name) {
                    return idx;
                }
            }
            return -1;
        };

        /**
         * find an item in an sorted array by dividing the array in two half
         * @param array   -  array where you look
         * @param search  - search pattern
         * @param _start  - just for recursion (don't give parameter)
         * @param _length - just for recursion (don't give parameter)
         */
        var findInList = function(array, search, _start, _length) {
            var start   = (typeof _start  !== 'undefined') ? _start: 0,
                length  = (typeof _length !== 'undefined') ? _length : array.length,
                middle  = Math.floor(start/2 + 0.5) + Math.floor(length/2);



            if(array[middle].dID === search) {
                console.log("found");
                return middle;
            }

            if(start > middle || length === 0) {
                console.log("not found");
                return -1;
            }

            if(search < array[middle].dID) {
                return findInList(array, search, start, middle);
            }

            if(search > array[middle].dID) {
                return findInList(array, search, middle, length);
            }

            return -1;
        };

        /**
         * searches for all indexes to a given personID
         * @param _personID
         * @returns {Array}
         */
        var getIdxFromDebtsById = function(_personID) {
            var arr  = JSON.parse(localStorage["debts"]).arr,
                rtnArr = [];

            for(var idx in arr) {
                if(arr[idx].pID === _personID) {
                    rtnArr.push(idx);
                }
            }

            return rtnArr;
        };


        /**
         * adds person to storage
         * @param _name - name
         * @return {number} - returns id of currently added person
         */
        pub.addPerson = function(_name) {
            var people    = JSON.parse(localStorage["people"]),
                pID       = people.arr.length;

            if(isPersonInArray(people.arr, _name) !== -1) {
                console.log("name is already in database");
                return -1;
            }

            people.arr.push({
                pID:  pID,
                name: _name
            });

            localStorage["people"] = JSON.stringify(people);
            return pID;
        };

        /**
         * adds a debt to a personID
         * @param _personID - id of the person
         * @param _debt - amount of money
         * @param {string} [_usage="no usage defined"]
         */
        pub.addDebt = function(_personName, _debt, _usage) {
            var people = JSON.parse(localStorage["people"]),
                pID   = isPersonInArray(people.arr, _personName),
                debts = JSON.parse(localStorage["debts"]),
                id    = (debts.arr.length === 0) ? 1 : debts.arr[debts.arr.length -1].dID +1;

            if(pID === -1) {
                pID = pub.addPerson(_personName);
            }

            var debt = {
                dID:       id,
                pID:       parseInt(pID),
                debt:      parseFloat(_debt),
                usage:     (typeof _usage !== "undefined") ? _usage : "no usage defined",
                timestamp: new Date().getTime()
            };

            debts.arr.push(debt);
            localStorage["debts"] = JSON.stringify(debts);

            return true;
        };

        /**
         * removes an debt by its id
         * @param _debtID
         */
        pub.removeDebt = function(_debtID) {
            var debts  = JSON.parse(localStorage["debts"]),
                arrIdx  = findInList(debts.arr, _debtID, 0, debts.length);


            if(arrIdx !== -1) {
                debts.arr.splice(arrIdx,1);
            } else {
                console.log("no debt found =,(");
            }

            localStorage["debts"] = JSON.stringify(debts);
        };

        /**
         * removes all entries to a given id of a person
         * @param _personID
         */
        pub.bulkRemoveDebts = function(_personID) {
            var idxList = getIdxFromDebtsById(_personID),
                debts   = JSON.parse(localStorage["debts"]);

            for(var i = 0; i < idxList.length; i++) {
                var idx = idxList[i] - i;
                debts.arr.splice(idx, 1);
            }

            localStorage["debts"] = JSON.stringify(debts);
        };

        /**
         * returns name from an id
         * @param _personID - id of the person
         * @returns {string} - name of the person
         */
        pub.getNameFromID = function(_personID) {
            var peopleArr = JSON.parse(localStorage["people"]).arr;

            for(var idx in peopleArr) {
                if(peopleArr[idx].pID === parseInt(_personID)) {
                    return peopleArr[idx].name;
                }
            }

            return "undefined";
        };

        /**
         * returns all debts to a given personID
         * @param _personID - personID
         * @returns {Array} - an objects array
         */
        pub.getDebtsFromID = function (_personID) {
            var arr    = JSON.parse(localStorage["debts"]).arr,
                rtnArr = [];

            for(var idx in arr) {
                if(arr[idx].pID === parseInt(_personID)) {
                    var debt = arr[idx];

                    debt.timestamp = Formater.timestampToAgo(debt.timestamp);
                    debt.debt      = Formater.floatToMoney(debt.debt);

                    rtnArr.push(debt);
                }
            }
            return rtnArr;
        };

        /**
         * returns sum of all debts to an given id
         * @param _personID - id of the person
         * @returns {number} - sum of all debts
         */
        pub.getSumOfBorrowedMoney = function(_personID) {
            var debts = pub.getDebtsFromID(_personID),
                sum = 0;

            for(var idx in debts) { sum += debts[idx].debt; }

            return sum;
        };

        /**
         * returns an array with all open debts
         * @returns {Array}
         */
        pub.getOverview = function() {
            var debtsArr  = JSON.parse(localStorage["debts"]).arr,
                peopleArr = JSON.parse(localStorage["people"]).arr,
                rtnArr    = [];

            for(var idx in peopleArr) {
                var pID       = peopleArr[idx].pID,
                    debtsList = getIdxFromDebtsById(pID),
                    sum = 0;


                for(var dIdx in debtsList) {
                    var i = debtsList[dIdx];

                    sum += debtsArr[i].debt;
                }

                if(sum !== 0) {
                    peopleArr[idx].sum = Formater.floatToMoney(sum);
                    rtnArr.push(peopleArr[idx]);
                }
            }

            return rtnArr;
        };

        /**
         * deletes everything from local storage
         */
        pub.clearStorage = function() {
            var emptyEntity = { arr: [] };
            localStorage["people"] = JSON.stringify(emptyEntity);
            localStorage["debts"]   = JSON.stringify(emptyEntity);
        };

        return constructor.apply(null, arguments);
    };

    return new Storage;
});