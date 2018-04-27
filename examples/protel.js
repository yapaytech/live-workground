import { isActiveTab, store, DahiHelper } from './__helpers';
const Help = new DahiHelper({ ref: 'protel' });
const { _ } = window;
var main = require('../src/lib/dahiNotify')();
if (main.dahiTarget) {
    let not = main.dahiNotify;
    main = main.dahiTarget;
    main.dahiNotify = not;
}

const wait = 5000;

const tracks = {
    //'/urunler/micros-res-3700-restoran-yonetim-ve-pos-sistemi/': { message: 'Merhaba! MICROS POS sistemi hakkında aklınıza takılan bir şey olursa mesaj gönderebilirsiniz.', wait },
    //'/urunler/opera-otel-yonetim-sistemi-pms/': { message: 'Merhaba! Opera otel yönetim sistemi hakkında daha fazla bilgi almak ya da aklınıza takılan sorulara yanıt bulmak isterseniz mesaj gönderebilirsiniz.', wait },
    //'/urunler/': { message: 'Merhaba! Firmamızın ürünleri hakkında size yardımcı olmamı ister misiniz?', wait },
    '/en/products/opera-hotel-management-system-pms/': { message: 'Hi there! Would you like me to help you about Opera PMS solution? Send me a message, then.', wait },
    //'/cozumler/restoran-ve-kafe-cozumleri/': { message: 'Merhaba! Restoran ve kafe işletmelerine özel teknoloji çözümlerimiz hakkında size yardımcı olmamı ister misiniz?', wait },
    //'/urunler/suite8-otel-yonetim-sistemi-pms/': { message: 'Merhaba! Suite8 otel yönetim sistemi hakkında daha fazla bilgi almak ya da aklınıza takılan sorulara yanıt bulmak isterseniz mesaj gönderebilirsiniz.	', wait },
    //'/urunler/materials-control-stok-kontrol-ve-maliyet-yonetim-cozumu/	': { message: 'Merhaba! Materials Control stok takip ve maliyet yönetim sistemi hakkında daha fazla bilgi almak isterseniz mesaj gönderebilirsiniz.', wait },
    //'/cozumler/otel-cozumleri/': { message: 'Merhaba! Firmamız tarafından sizlere sunulan otellere özgü teknoloji çözümleri hakkında size yardımcı olmamı ister misiniz?', wait },
    //'/cozumler/': { message: 'Merhaba! Firmamızın tarafından sektörlere özel olarak sunulan çözümler hakkında ayrıntılı bilgi almak isterseniz bana mesaj gönderebilirsiniz.', wait },

};
const defaultMessage = '';
const start = (e, check) => {
    if (!check) return;
    let shown = store('protel/shown');
    let tracking = store('protel/tracking');
    let defaultShown = store('protel/defaultShown');
    let last = store('protel/lastMessage');
    console.log('last', last);
    console.log('shown', shown, defaultShown);
    if (shown) { showSelected(); return; }
    if (defaultShown) showSelected();

    //if (shown || !isActiveTab()) return;
    let pathname = main.location.pathname;
    console.log('pathname', pathname , tracking);
    //showDefault();
    if (tracks[pathname] && pathname !== tracking) {
        //start | reset
        console.log('start');
        store('protel/tracking', pathname);
        invoke();
    } else if (!tracks[pathname] && tracking) {
        // restart
        console.log('new');
        clearTimeout();
        invoke();
    } else if (!tracks[pathname] || !tracking)
        showDefault();
};
const showDefault = () => {
    console.log('showDefault started');
    let defaultShown = store('protel/defaultShown');
    if (!defaultShown && defaultMessage) {
        main.dahiNotify({ type: 'set/resetSolid' });
        store('protel/lastMessage',defaultMessage);
        Help.sendBot({ type: 'text', text: defaultMessage, hash: true });
        store('protel/defaultShown', true);
    }
};
const showSelected = () => {
    console.log('showSelected started');
    let tracking = store('protel/tracking');
    let message = (tracks[tracking] && tracks[tracking].message) || defaultMessage;
    let last = store('protel/lastMessage');
    if (last === message) return;
    let ms = { type: 'text', text: message, hash: true };
    main.dahiNotify({ type: 'set/resetSolid' });
    store('protel/lastMessage',message);
    Help.sendBot(ms);
};
const invoke = () => {
    console.log("invoke started");
    let tracking = store('protel/tracking');
    let wait = (tracks[tracking] && tracks[tracking].wait) || wait;
    setTimeout(() => {
        let tracking = store('protel/tracking');
        let message = tracks[tracking] && tracks[tracking].message;
        let ms = { type: 'text', text: message, hash: true };
        if (!store('protel/shown')) {    
            store('protel/lastMessage',message);
            main.dahiNotify({ type: 'set/resetSolid' });
            Help.sendBot(ms);
        }
        store('protel/shown', true);
    }, wait);
};
main.dahiNotify({ type: 'on/pageActive', data: start });
//main.dahiNotify({ type: 'on/interaction', data: showDefault, hash: true })
start(null, isActiveTab());


