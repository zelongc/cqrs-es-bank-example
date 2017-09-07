# A sample of CQRS + Event Sourcing

This is a naive sample of the CQRS/ Event Sourcing implemention in Node.js
## Dependencies

mongodb

eventstore

### Installation

To install the dependencies:
```
clone Balabala
npm install
```
To run it:
```
node event
```
### Some explanations

#### How it works.

1.  The eventstore got connected at first then the ReadModel is initialized.

2.  Any incoming commands(event) will firstly be handled by the command handler and passed to corresponding function. 
after the command is stored in the database as event. the handler will emit this event to the listener. then the ReadModel
update the in-memory data.
3.  A scheduling method is used to mimic an api request.

A api request is a command. for example:
```
let command = {method: "createUser", name: "Zeyu", age: 23, accountID: 1234123123123};
let command2 = {method: "deposit", accountID: 222, amount: 100};
let command3 = {method: "withdraw", accountID: 222, amount: 40};

```
In event.js, the  ```handler(command)``` is used to pass the command to the handler.

###  Comparision with CRUD

The ReadModel will handle read-operation instead of the querying the event storage directly.

The create-operation update-operation and delete-operation will be treated as events. and the event will be persisted in the eventstore.
the readModel can be rebuilt by replaying those event.




