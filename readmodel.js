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
        this.initialAccount(es);
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
    }

    /**
     * Add balance.
     * @param {Number} accountID. the ID of account
     * @param {Number} amount. the money going to be added.
     */
    addBalance(accountID, amount) {
        if (!this.balances[accountID]) {
            this.balances[accountID] = amount
        } else {
            this.balances[accountID] = this.balances[accountID] + amount;
        }
    }

    /**
     * Deduct balance.
     * @param {Number} accountID. the ID of account
     * @param {Number} amount. the money going to be withdraw.
     */
    deductBalance(accountID, amount) {
        this.balances[accountID] = this.balances[accountID] - amount;
    }

    /**
     * Deposit
     * @param {command} cmd. the command
     */
    depositMoney(cmd) {
        let accountID = cmd.accountID
            , amount = cmd.amount;
        this.accounts[accountID] = this.accounts[accountID] + amount
    }
    /**
     * Withdraw
     * @param {command} cmd command.
     */
    withdrawMoney(cmd) {
        let accountID = cmd.accountID
            , amount = cmd.amount;
        this.accounts[accountID] = this.accounts[accountID] - amount
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
    initialAccount(es) {
        let self = this;
        es.getEventStream({
            aggregateId: '1',
            aggregate: 'bank',          // optional
            context: 'createUser'                 // optional
        }, function (err, stream) {

            let evts = stream.events;

            while (evts) {
                for (let i = 0; i < evts.length; i++) {
                    let name = evts[i].payload.name,
                        accountId = evts[i].payload.accountID;
                    self.setAccount(name, accountId);
                }
                // retrieve next page of events.
                evts = evts.next;
            }

        });
    }

    /**
     * Initialize Balances Information
     * @param {Object} es EventStore.
     */
    initialBalances(es) {
        let self = this;
        es.getEventStream({
            aggregateId: '1',
            aggregate: 'bank',
            context: 'deposit and withdraw'
        }, function (err, stream) {

            let evts = stream.events;

            while (evts) {
                for (let i = 0; i < evts.length; i++) {
                    let accountID = evts[i].payload.accountID,
                        amount = evts[i].payload.amount,
                        method = evts[i].payload.method;

                    switch (method) {
                        case 'deposit':
                            self.addBalance(accountID, amount);
                            break;
                        case 'withdraw':
                            self.deductBalance(accountID, amount);
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