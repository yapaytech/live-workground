import { isActiveTab, DahiHelper } from './__helpers';

const Help = new DahiHelper({ ref: 'flormar' });
const { _ } = window;

var main = require('../src/lib/dahiNotify')();
if (main.dahiTarget) {
    let not = main.dahiNotify;
    main = main.dahiTarget;
    main.dahiNotify = not;
}
const myLib = {};
const isBasket = () => { return /^\/(sepet|rollngo)\//.test(main.location.pathname); }
const defaultState = {
    inactiveBot: true,
    inactiveAgent: true,
    botActive: true,
    takenByAgent: false,
    waitingAgent: false,
    archived: false,
    closed: false
}
const getOldState = () => {
    let cv = Help.chat.page.cv;
    let state = (cv && cv.data && cv.data.state) || defaultState;
    return state;
}
const changeConversationState = (e, type) => {
    if (!type) return;
    changeCovnersationStateOnLoad(e, type);
}
const changeCovnersationStateOnLoad = (e, type) => {
    let is_basket = isBasket();
    //let state = getOldState(e);
    //let newState = {};
    console.log(is_basket);
    //console.log("newstate -->", newState, newState.waitingAgent);
    //main.dahiNotify({ type: 'send/conversationState', data: { type: 'setConversationState', }});

    main.dahiNotify({ type: 'send/conversationState', data: { type: 'setStatePartial', partial: { waitingAgent: is_basket, botActive: !is_basket } } });

}
main.dahiNotify({ type: 'on/pageActive', data: changeConversationState });
changeConversationState(null, isActiveTab());