/**
 * Created by nick on 6/9/17.
 */


class Bank {

    /**
     * Bank readRodel constructor.
     *  balances = { AccountID : Balance}
     *  accounts = { name : AccountID}
     */
    constructor() {
        this.modelName = 'Bank';
        // balances = { 001:100
        //              002:200}
        this.balances = {};
        // accounts = { nick : 001}
        this.accounts = {};
    }

    /**
     * Initial the ReadModel.
     * @param {eventstore} es
     */
    initialization(es) {
        // this.initialAccount(es);
        this.initialBalances(es);
    }

    /**
     * Response to query, get all the accounts in the memory.
     */
    getAccounts() {
        return this.accounts
    }

    /**
     * Response to query, get all the balance information in the memory.
     */
    getBalances() {
        return this.balances
    }

    /**
     * setAccount Information
     */
    setAccount(name, accountID) {
        // console.log('I am setting accountID', name, accountID);
        this.accounts[name] = accountID;
        this.balances[accountID] = 0
    }

    /**
     * Add balance.
     * @param {Number} accountID. the ID of account
     * @param {Number} amount. the money going to be added.
     */
    addBalance(accountID, amount) {
        this.balances[accountID] = this.balances[accountID] + amount
    }

    /**
     * Deduct balance.
     * @param {Number} accountID. the ID of account
     * @param {Number} amount. the money going to be withdraw.
     */
    deductBalance(accountID, amount) {
        if (amount >= this.balances[accountID]) {
            this.balances[accountID] = this.balances[accountID] - amount
        }
        else {
            throw new Error("No enough balance")
        }
    }

    /**
     * Deposit
     * @param {command} cmd. the command
     */
    depositMoney(cmd) {
        let accountID = cmd.accountID
            , amount = cmd.amount;
        if (this.balances[accountID] !== undefined) {
            this.addBalance(accountID, amount)
        } else {
            throw new Error("Account does not exist!")
        }
    }

    /**
     * Withdraw
     * @param {command} cmd command.
     */
    withdrawMoney(cmd) {
        let accountID = cmd.accountID
            , amount = cmd.amount;

        if (this.balances[accountID] !== undefined) {
            this.deductBalance(accountID, amount)
        } else {
            throw new Error("Account does not exist!")
        }
    }

    /**
     * Create Account.
     * @param {command} cmd command.
     */
    createAccount(cmd) {
        let name = cmd.name;
        this.setAccount(name, cmd.accountID);

    }

    /**
     * Initialize Account Information
     * @param {Object} es EventStore.
     */
    // initialAccount(es) {
    //     let self = this;
    //     es.getEventStream({
    //         aggregateId: '1',
    //         aggregate: 'bank',          // optional
    //         context: 'createUser'                 // optional
    //     }, function (err, stream) {
    //
    //         let evts = stream.events;
    //
    //         while (evts) {
    //             for (let i = 0; i < evts.length; i++) {
    //                 let name = evts[i].payload.name,
    //                     accountId = evts[i].payload.accountID;
    //                 self.setAccount(name, accountId);
    //             }
    //             // retrieve next page of events.
    //             evts = evts.next;
    //         }
    //
    //     });
    // }

    /**
     * Initialize Balances Information
     * @param {Object} es EventStore.
     */
    initialBalances(es) {
        let self = this;
        es.getEventStream({
            aggregateId: '1',
            // aggregate: 'bank',
            // context: 'deposit and withdraw'
        }, function (err, stream) {

            let evts = stream.events;

            while (evts) {
                for (let i = 0; i < evts.length; i++) {
                    let method = evts[i].payload.method,
                        evt = evts[i].payload;
                        console.log(method)
                    switch (method) {


                    switch (method) {
                        case "createUser":
                            self.createAccount(evt);
                        case "deposit":
                            self.depositMoney(evt);
                            break;
                        case "withdraw":
                            self.withdrawMoney(evt);
                            break;
                    }
                }
                // retrieve next page of events.
                evts = evts.next;
            }

        });
    }
}


module.exports = Bank;