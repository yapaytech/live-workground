import { createFrame, frameToDocument, isActiveTab, store, DahiHelper } from './__helpers';
import { getPageInfo } from './twist-core';
const Help = new DahiHelper({ ref: 'twist-crawler' });
const { $q, _: main } = Help;


function loadPage() {

    let data = getPageInfo();
    console.log("data",data);
    Help.addActivity(data);
}

loadPage();
