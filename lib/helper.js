export function getMain() { return window.top || window.parent || window; }

export function createFrame({ document = document, cont, url, html, onload }) {
    var frame = document.createElement('iframe');
    $(frame).attr('src', url || 'about:blank');
    $(frame).attr('style', 'display:none;');
    if (onload) frame.onload = onload;
    $(cont).append(frame);
    if (html) {
        var doc = frameToDocument(frame);
        doc.open();
        doc.write(html);
        doc.close();
    }
    return frame;
};

export function frameToDocument(frame) {
    return frame && (frame.contentDocument || frame.contentWindow.document);
};

export function isActiveTab() {
    var page = getMain();

    var hidden;
    if (typeof page.document.hidden !== 'undefined') {
        hidden = 'hidden';
    } else if (typeof page.document.msHidden !== 'undefined') {
        hidden = 'msHidden';
    } else if (typeof page.document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
    }
    return !page.document[hidden];

}

export function tryJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
};

export function store(key, value) {
    var main = getMain(), __store_base = '';
    if (!main.localStorage || !key) return;
    try {
        if (typeof value !== 'undefined') {
            main.localStorage.setItem(__store_base + key, JSON.stringify(value));
            return true;
        }
        else return tryJson(main.localStorage.getItem(__store_base + key));
    } catch (e) {
        console.error('localStorage Error', e.message);
        return;
    }
}

export function hashId(len = 8) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export class TabChecker {
    constructor() {
        this.hash = hashId();
    }
    check(hash) {
        return this.hash === hash;
    }
}
export class Observer {
    constructor(id, config, cb) {
        if (!id) throw new Error('id bulunamadı');
        this.target = document.getElementById(id);
        this.config = config || { attributes: true, childList: true };
        this.cb = cb;
        this.observer = new MutationObserver(this.cb);
    }
    observe() {
        return this.observer.observe(this.target, this.config);
    }
    disconnect() {
        this.observer.disconnect();
    }

}

export class DahiHelper {
    constructor({ ref }) {
        this._ = getMain();
        this.keeper = this._.dahiKeeper;
        if (this._.dahiTarget) {
            let not = this._.dahiNotify;
            this._ = this._.dahiTarget;
            this._.dahiNotify = not;
        }
        this.ref = ref || '';
        this.tabs = new TabChecker();
    }
    get chat() {
        return this.keeper.chat;
    }
    get dahiNotify() {
        return this._.dahiNotify;
    }
    get $q() {
        return (q) => $(q, this._.document);
    }
    addActivity(data) {
        this.chat.client.activity.run(data);
    }
    setEvent(type, fn) {
        this.dahiNotify({ ref: this.ref, type: 'set/event', data: { type, fn } });
    }
    sendBot(data) {
        this.dahiNotify({ ref: this.ref, type: 'send/bot', data });
    }
    sendUser(data) {
        console.log("sendUser",data);
        this.dahiNotify({ ref: this.ref, type: 'send/user', data });
    }
    promo(data, fn) {
        this.dahiNotify({ ref: this.ref, type: 'set/trigger', data: { data, fn } });
    }
}