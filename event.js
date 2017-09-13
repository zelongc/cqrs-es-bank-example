/**
 * Created by nick on 2017/8/16.
 */
const Bank = require('./readmodel');
const es = require('eventstore')({
    type: 'mongodb',
    host: 'localhost',                          // optional
    port: 27017,                                // optional
    dbName: 'eventstore',                       // optional
    eventsCollectionName: 'events',             // optional
    snapshotsCollectionName: 'snapshots',       // optional
    transactionsCollectionName: 'transactions', // optional
    timeout: 10000                              // optional
});

/**
 * ----------------------A list of listeners listening to events.------------
 *  For example, the es.on('connect') listen to the 'connect' event.
 */

es.on('connect', function () {
    console.log('storage connected');
});

es.on('disconnect', function () {
    console.log('connection to storage is gone');
});

es.on('createUser', function (cmd) {
    bank.createAccount(cmd);
    // console.log(bank.getAccounts(cmd));
});

es.on('deposit', function (cmd) {
    bank.depositMoney(cmd);
});

es.on('withdraw', function (cmd) {
    bank.withdrawMoney(cmd);
});

es.defineEventMappings({
    id: 'id',
    commitId: 'commitId',
    commitSequence: 'commitSequence',
    commitStamp: 'commitStamp',
    streamRevision: 'streamRevision'
});

/**
 * Initialize the event store
 * @param {string} event command.
 */
es.init(function () {
    // have to be after the init of the event store.
    console.log('Setp 1, Finish initializing the event store.');
    // initialize the ReadModel for Bank.
    bank.initialization(es);
    console.log('Step2, Finish initializing the ReadModel.')
});

// new object of ReadModel
const bank = new Bank();


/**
 * Mock API request after the system is initialized.
 */
setTimeout(() => {

    let command = {method: "createUser", name: "Zeyu", age: 23, accountID: 1234123123123};
    let command2 = {method: "deposit", accountID: 1234123123123, amount: 100};
<<<<<<< HEAD
    let command3 = {method: "withdraw", accountID: 1234123123123, amount: 9000};

    console.log('Someone says Hi');
    handler(command3);
=======
    let command3 = {method: "withdraw", accountID: 1234123123123, amount: 40};

    console.log('Someone says Hi');
    handler(command2);
>>>>>>> 9226279dc00bd39f8771628405ed24f6ed9352d2

    // initialize the readModel.
    console.log(bank.getAccounts());
    console.log(bank.getBalances());
}, 1000);

/**
 * Handle request command (event).
 * @param {command} cmd.
 */
handler = function (cmd) {
    switch (cmd.method) {
        case 'createUser':
            console.log('creating a User');
            // Validation!!!!
            createUser(cmd);
            break;
        case 'deposit' :
            console.log('depositing...');
            deposit(cmd);
            break;
        case 'withdraw':
            console.log('withdrawing..');
            withdraw(cmd);
            break;
    }
};

/**
 * Create User:  Handle createUser command, persist this command to event (store in database.)
 * @param {command} cmd.
 */
createUser = function (cmd) {

    es.getEventStream({
        aggregateId: '1',
        aggregate: 'bank',          // optional
        context: 'createUser'                 // optional
    }, function (err, stream) {
        stream.addEvent(cmd);
        stream.commit(function (err, stream) {
            // console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
            // tell the readmodel the event has been saved.
            es.emit(cmd.method, cmd)
        });
    });

};
/**
 * Deposit:  Handle deposit command, persist this command to event (store in database.)
 * @param {command} cmd.
 */
deposit = function (cmd) {
    es.getEventStream({
        aggregateId: '1',
        aggregate: 'bank',
        context: 'deposit and withdraw'
    }, function (err, stream) {
        stream.addEvent(cmd);
        stream.commit(function (err, stream) {
            es.emit(cmd.method, cmd)
        })
    })
};
/**
 * Withdraw:  Handle withdrwal command, persist this command to event (store in database.)
 * @param {command} cmd.
 */
withdraw = function (cmd) {
    es.getEventStream({
        aggregateId: '1',
        aggregate: 'bank',
        context: 'deposit and withdraw'
    }, function (err, stream) {
        stream.addEvent(cmd);
        stream.commit(function (err, stream) {
            es.emit(cmd.method, cmd)
        })
    })
};


module.exports.es = es;