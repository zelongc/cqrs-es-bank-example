/**
 * Created by nick on 6/9/17.
 */

const es = require('events');


class denormalizer {
    constructor() {
        this.content = {};
        this.events = [];
    }

    router(evt) {
        switch (evt.method) {
            case 'createUser':
                break;
            case 'deposit':
                break;
            case 'withdraw':
                break;
        }
    }

    getBalance() {
        es.getEvents('1',  function (err, evts) {
            // if (events.length === amount) {
            //   events.next(function (err, nextEvts) {}); // just call next to retrieve the next page...
            // } else {
            //   // finished...
            // }
        });
    }

}

