import { createFrame, frameToDocument, isActiveTab, store, DahiHelper } from './__helpers';
import { getPageInfo, getProductInfo, getProductSizeInfo, getCategoryInfo } from './twist-core';


const Help = new DahiHelper({ ref: 'twist' });
//import { setTimeout } from 'timers';
const { _ } = window;
const { $q, _: main } = Help;
const myLib = {};

var existTriggers = [
    //{ method: 'getProductCombines', text: 'Kombinin tüm parçalarına bak.', page: 'product', active: true },
    //{ method: 'getInterestings', text: 'Bu ürünler ilgini çekebilir.', page: 'product', active: true },
    { method: 'getDailyTrendsByPage', text: 'Bu ürüne bakanlar bunlara da baktı.', page: 'product', active: true },

    { method: 'getMostVisited', text: 'En çok ziyaret edilen ürünler.', page: 'home', active: true },
    //{ method: 'getVisitedProducts', text: 'Bunlara tekrar göz atmak ister misin?', page: "home", active: true }
    { method: 'getPopularByCategory', text: 'Bu kategorideki popüler ürünlerimiz.', page: 'category', active: true },
    { method: 'getBasketOnLoad', text: '', page: 'home', active: true },
    { method: 'getInviteFriendMessage', text: '', page: 'home', active: true }

];


var intervalList = [];
var userCache;
var listenAddBasketButtonOnlyOne = true;




function loadPage() {

    console.log('loadPage');


    if (userCache) {
        getUserProfile();
    }

    let data = getPageInfo();
    Help.addActivity(data);

    data['event_type'] = 'page_load';

    let message = { type: 'event', data };
    //let message = { type: 'text', message: 'Aradığınız kriterlerde ürün bulunamadı.' };

    console.log(message);

    if (data.page_type === 'product') {
        listenAddBasketButton();
        setVisitedProducts(data);
    }

    getOrders();


    // Help.dahiNotify({ ref: "twist.dll", type: "send/user", data: message });
    setPageInterval(data, 9000);
}

loadPage();


function listenAddBasketButton() {

    console.log("size :", $(main.document).find('.js-add-to-cart'));

    $(main.document).find('.js-add-to-cart')[1].onclick = function () {

        if (!listenAddBasketButtonOnlyOne) return;
        listenAddBasketButtonOnlyOne = false;
        var addBasketData = { method: 'getProductCombines', text: 'Bu ürünün kombin ürünleri', page: 'product', active: true };
        existTriggers.unshift(addBasketData);

        //        _.each(intervalList, (item) => {
        //            console.log("intervalList :"+item);
        //            clearInterval(item);
        //        });

        //        intervalList = [];

        //       let data = getPageInfo();
        //       console.log("setPageInterval 1")
        //       setPageInterval(data, 1000);
    };


}

var interactionIntervalId = -1;
var promptSituation = true;

function chatInteraction(a, b, c, __user) {

    clearInterval(interactionIntervalId);
    promptSituation = false;
    interactionIntervalId = setInterval(function () {
        console.log('interaction off');
        promptSituation = true;
        clearTimeout(interactionIntervalId);
    }, 10000);
}

function setVisitedProducts(data) {

    var visitedProducts = [];

    visitedProducts = store('visitedProducts');

    if (visitedProducts === null)
        visitedProducts = [];
    else {
        var index = visitedProducts.indexOf(data.product_id);
        if (index > -1) {
            visitedProducts.splice(index, 1);
        }
    }
    visitedProducts.push(data.product_id);

    store('visitedProducts', visitedProducts);

    var visitedProductsDetail = store('visitedProductsDetail');
    if (visitedProductsDetail === null)
        visitedProductsDetail = {};
    visitedProductsDetail[data.product_id] = data.product_detail;
    store('visitedProductsDetail', visitedProductsDetail);

}

function getVisitedProducts() {

    let keys = store('visitedProducts');
    let det = store('visitedProductsDetail');

    let cards = [];
    if (keys && keys.length >= 0)
        $.each(keys, (i, key) => {
            //cards.push(generateProductCard(det[key]));
            cards.push(det[key]);
        });

    return cards;
}

function showVisitedProducts(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let cards = [];
    let products = getVisitedProducts();
    $.each(products, (i, key) => {
        cards.push(generateProductCard(key));
    });
    let ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: cards } };
    Help.sendBot(ms);
}
/*
function clearPageInterval(page_data, duration) {

    each(intervalList, (item) => {
        console.log(item);
        clearInterval(item);
    });

}
*/
function setPageInterval(page_data, duration) {

    var intervalId = setInterval(function () { showPrompt(page_data); }, duration);

    intervalList.push(intervalId);

}

function showPrompt(page_data) {


    if (!Help.chat.page.cv.isOnline || Help.chat.page.cv.isOnline > 1) return;
    if (promptSituation === false)
        return;
    let exist_page_triggers = existTriggers.filter(function (item) {
        return item.page === page_data.page_type && item.active === true;
    });
    //let trigger = exist_page_triggers && exist_page_triggers[Math.random(0,exist_page_triggers.length)];

    console.log("setPageInterval showPrompt" + exist_page_triggers[0]);

    if (exist_page_triggers && exist_page_triggers[0]) {

        var exist_page_trigger = exist_page_triggers[0];
        console.log(exist_page_trigger);
        let result = myLib[exist_page_trigger.method]();

        if (result && result.length >= 0) {

            Help.sendBot({ type: 'text', text: exist_page_trigger.text });
            let cards = [];
            $.each(result, (i, item) => {
                if (cards.length >= 10) return;
                cards.push(generateProductCard(item));
            });
            var ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: cards } };
            Help.sendBot(ms);
        }
        exist_page_trigger.active = false;
        /*
        exist_page_triggers = existTriggers.filter(function (item) {
            return item.page_type === page_data.page_type && item.active === true;
        });
 
        
        if (exist_page_triggers !== null) {
            setPageInterval(page_data, 9000);
        }
        */
    }
}

function userProfile(cb) {
    if (userCache) return cb(userCache);
    var frame = createFrame({
        url: 'https://www.twist.com.tr/Uye/KisiselBilgiler',
        document: main.document,
        cont: main.document.body,
        onload: () => {


            let doc = frameToDocument(frame);

            let name = $(doc).find('#Contact_Name').val();
            let surname = $(doc).find('#Contact_Surname').val();
            let email = $(doc).find('#Contact_Email').val();
            let sex = $(doc).find('#select2-Contact_Sex-container').attr('title');
            let mobile = $(doc).find('#Contact_Mobile').val();
            let birth_year = $(doc).find('#select2-Contact_BirthYear-container').attr('title');
            let birth_month = $(doc).find('#select2-Contact_BirthMonth-container').attr('title');
            let birth_day = $(doc).find('#select2-Contact_BirthDay-container').attr('title');

            var contact = userCache = { name, surname, email, sex, mobile, birth: birth_day + '-' + birth_month + '-' + birth_year };

            cb(contact);
            store('user_info', contact);

            $(frame).remove();
        }
    });
}
var orders;
var last_saved_orders_time = 0;
function getOrders() {
    let now = new Date().getTime();
    if (store('orders') && (last_saved_orders_time - now < (60 * 60 * 1000))) return orders;
    var frame = createFrame({
        url: 'https://www.twist.com.tr/Uye/Siparislerim',
        document: main.document,
        cont: main.document.body,
        onload: () => {

            let doc = frameToDocument(frame);

            var orders = [];

            $(doc).find('#profile-siparislerim tbody tr').map(function (d) {


                var code = $(this).find('td:first a').text();
                var detailUrl = $(this).find('td:first a').attr('href');
                var date = $(this).find('td:nth-child(2)').text();

                var status = $(this).find('td:nth-child(5) i').hasClass('siparis-teslim-edildi-icon');
                var statusDesc = $(this).find('td:nth-child(5) span').text();

                var order = { code: code, detailUrl: detailUrl, date: date, status: status, statusDesc: statusDesc };

                var orderShipStatus = !!$(this).find('td:nth-child(4) a');

                if (orderShipStatus === true) {

                    var shipTracingUrl = $(this).find('td:nth-child(4) a').attr('href');
                    var shipTracingTitle = $(this).find('td:nth-child(4) a').attr('title');


                    order['shipTracingUrl'] = shipTracingUrl;
                    order['shipTracingTitle'] = shipTracingTitle;

                }
                else {
                    var shipTracingTitle = $(this).find('td:nth-child(4)').text();
                    order['shipTracingTitle'] = shipTracingTitle;

                }
                // console.log("order2 :" + order);

                orders.push(order);

            }).get();
            last_saved_orders_time = now;
            store('orders', orders);

            $(frame).remove();
        }
    });
}

function getUserProfile(a, b, c, __user) {
    userProfile(console.log);
}
/*
function getProductSizeInfo() {

    let sizes = $(main.document).find('#addBasketForm .js-size ul li');
    var sizeArray = [];
    $(sizes).map(function () {
        var size = { spec2: $(this).attr('spec2'), pdescid: $(this).attr('pdescid'), pid: $(this).attr('pid'), alt: $(this).attr('alt'), stock: !$(this).attr('nostock') };
        sizeArray.push(size);
    }).get();
    return sizeArray;
}
*/
function addFavoritex(a, b, c, __user) {
    console.log('function addFavorite');

    var b = $(main.document).find('.product-favorite:first');
    var e = b.parents('form');
    var a = b.attr('data-id');

    main.addFavorite(a, e);
}

function slickSliderToArray(items) {
    let ret = [];
    let add_list = {};
    $.each(items, (i, item) => {

        let image = $(item).find('.rsImg').attr('src');
        let title = $(item).find('.product-title a').text().replace(/\r?\n|\r|\s+/g, ' ').trim();
        let price = $(item).find('.product-price').text().replace(/\r?\n|\r|\s+/g, ' ').trim();
        let url = $(item).find('a').attr('href');
        if (!add_list[title]) {
            ret.push({
                image,
                title,
                price,
                url
            });
            add_list[title] = true;
        }
    });
    console.log(add_list);
    return ret;
}

function getInterestings() {
    let $slider = $(main.document).find('.seg-wrapper .seg-item');
    let interestings = slickSliderToArray($slider);
    return interestings;
}

function showInterestings(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let ints = getInterestings();


    let cards = [];
    $.each(ints, (i, item) => {
        if (cards.length >= 10) return false;
        cards.push(generateProductCard(item));
    });

    console.log('cards', cards);
    let ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: cards } };

    Help.sendBot(ms);
}
function getMostVisited() {
    Help.sendUser({ type: 'event', data: { payload: 'twist_most_visited_products' } });
}

function getDailyTrendsByPage() {
    let url = main.location.href.replace(main.location.search, '');
    console.log("url ---> ", url);
    Help.sendUser({ type: 'event', data: { payload: 'twist_daily_trends_by_page ' + url } });
}
function getPopularByCategory() {
    let { category_name } = getCategoryInfo();
    if (category_name)
        Help.sendUser({ type: 'event', data: { payload: 'twist_get_popular_by_category ' + category_name } });
}


main.getBasketx = getBasketx();

function getBasketx(){

    let basket = getBasketInfo();

    console.log("basket :"+basket);    

}

function getBasketOnLoad(basket) {

    if(!basket)
        basket = getBasketInfo();
    if (basket && !basket.is_empty_basket) {
        let message = {
            type: 'custom',
            array: [{
                title: 'Satın Almayı Unutma!',
                subtitle: `Sepetinizde ${basket.number_of_products} adet ürün bulunmaktadır.\nToplam Tutar : ${basket.total}`,
                buttons: [{
                    title: 'Sepete Git',
                    type: 'web_url',
                    url: 'https://www.twist.com.tr/sepet'
                }]
            }]

        }
        main.dahiNotify({ type: 'send/bot', data: message });
    }
}
function getInviteFriendMessage() {
    let message = {
        type: 'custom',
        array: [{
            title: 'Arkadaşınla Beraber Bak!',
            subtitle: 'Arkadaşınla beraber alışveriş yapmak ister misin?',
            buttons: [{
                title: 'Evet, Davet Et',
                type: 'web_url',
                url: 'action://open/share'
            }]
        }]
    }
    main.dahiNotify({ type: 'send/bot', data: message });
}

function getProductCombines() {
    let page = getPageInfo();
    if (page.page_type !== 'product') return [];
    let $combines = $(main.document).find('.js-combin-slider .slick-slide');
    let combines = [];
    let add_list = [];
    $.each($combines, (i, item) => {

        let $thumb = $(item).find('.product-thumb .js-thumb-slider div');
        let images = [];
        $.each($thumb, (j, t) => {
            let img = $(t).find('.rsImg').attr('src');
            images.push(img);
        });
        let $info = $(item).find('dl');
        let id = $(item).find('.product-quicklook').attr('data-pid');
        let title = $($info).find('.product-title a').attr('title');
        let price = $($info).find('.product-price').text().replace(/\r?\n|\r|\s+/g, ' ').trim();
        let old_price = $($info).find('.product-old-price').text().replace(/\r?\n|\r|\s+/g, ' ').trim();
        let url = $($info).find('.product-title a').attr('href');
        if (!add_list[id]) {
            add_list[id] = true;
            combines.push({
                images,
                id,
                title,
                url,
                price,
                old_price
            });
        }

    });
    console.log(combines);
    console.log(add_list);

    return combines;
}

function showCombines(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let combines = getProductCombines();
    let cards = [];
    $.each(combines, (i, item) => {
        if (cards.length >= 10) return false;
        cards.push(generateProductCard(item));
    });
    let ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: cards } };

    Help.sendBot(ms);
}
/*
function getProductInfo() {

    let sizes = getProductSizeInfo();


    let combines = !!$(main.document).find('.js-combin-slider .slick-slide');

    let $productDetail = $(main.document).find('.productDetail .wrapper');
    let $productDescription = $(main.document).find('.product-description .figcaption');
    let $productDetailAside = $(main.document).find('.product-detail-aside');
    let images = [];
    let $images = $($productDetail).find('.js-thumbs-slick .slick-slide div div img');
    $.each($images, (i, img) => {
        images.push($(img).attr('src'));
    });
    let title = $($productDetail).find('.figcaption .product-title').text();

    let code = $($productDetail).find('.figcaption .pcode').text().replace(/\r?\n|\r|\s+/g, ' ').trim();

    let id = $($productDetail).find('.figcaption #ProductDescriptionId').attr('value');
    let price = $($productDetailAside).find('.product-info .product-price').text().replace(/\r?\n|\r|\s+/g, ' ').trim();

    let old_price = $($productDetailAside).find('.product-info .product-old-price').text().replace(/\r?\n|\r|\s+/g, ' ').trim();

    let url = main.location.href;

    let product_info = {
        title,
        url,
        code,
        id,
        price,
        old_price,
        images,
        sizes,
        combines
    };

    console.log('product_info', product_info);
    return product_info;

}
*/



function getBasketInfo() {
    let is_empty_basket = $(main.document).find('#usercontents .js-offnav').attr('title') === ('Sepetinizde ürün bulunmamaktadır..' || 'There are no items in your cart..');

    let number_of_products = is_empty_basket ? 0 : $(main.document).find('#usercontents .js-offnav span').text();

    let total = 0;

    let basket_products = is_empty_basket ? '' : $(main.document).find('#rightMenu .basket-list ul li');

    var products_in_basket = [];
    $.each(basket_products, (i, item) => {
        let $li = $(item);
        if ($li.find('.figcaption').length == 0) {
            total = $li.find('p').text();
            return;
        }
        var f = (dd) => $li.find(`dd[${dd}]`).attr(dd);
        let prod = {
            'name': $li.find('dt').text(),
            'href': $li.find('dt a').attr('href'),
            'color': f('data-color'),
            'quantity': f('data-quantity'),
            'size': f('data-variant'),
            'price': $li.find('p span').text()
        };
        products_in_basket.push(prod);
    });
    let basket_info = {
        is_empty_basket,
        number_of_products,
        total,
        products_in_basket
    };
    return basket_info;
}

var interactionIntervalId = -1;
var promptSituation = true;


function chatInteraction(a, b, c, __user) {

    clearInterval(interactionIntervalId);
    promptSituation = false;
    interactionIntervalId = setInterval(function () {
        console.log('interaction off');
        promptSituation = true;
        clearTimeout(interactionIntervalId);
    }, 10000);
}


Help.dahiNotify({ type: 'on/interaction', data: chatInteraction });
//Help.dahiNotify({type:'on/state',data:chatInteraction});
Help.dahiNotify({ type: 'on/message', data: chatInteraction });
Help.dahiNotify({ type: 'on/input/focus', data: chatInteraction });
Help.dahiNotify({ type: 'on/input/change', data: chatInteraction });


function showBasket(a, b, c, __user) {

    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let basket = getBasketInfo();
    if (basket.is_empty_basket) return false;
    let products = basket.products_in_basket;
    let cards = [];
    $.each(products, (i, item) => {
        console.log(item);
        let card = {
            title: `${item.name}  - ${item.price}`,
            subtitle: `Renk : ${item.color}\nBeden : ${item.size}\nAdet : ${item.quantity}`,
            image_url: '',
            buttons: [{
                title: 'Sayfasına git',
                type: 'web_url',
                url: main.location.origin + item.href
            }]
        };
        cards.push(card);
    });
    let ms = { type: 'custom', array: cards };

    Help.sendBot(ms);
    console.log('basket', basket);
}
/*
function getPageInfo() {
    let loc = main.location;
    let path_name = loc.pathname;
    let is_home = /^\/$/.test(path_name);
    let is_product = /^\/urun\//.test(path_name);
    let is_category = /c_(\d+)/.test(path_name);
    let is_search = path_name === '/bul';

    let page_info = { 'page_type': 'other' };

    if (is_home)
        page_info.page_type = 'home';
    else if (is_product) {
        page_info.page_type = 'product';
        page_info.product_id = is_product ? path_name.match(/p_(\d+)/)[1] : 0;
        page_info.product_detail = getProductInfo();

    }
    else if (is_category) {
        page_info.page_type = 'category';
        page_info.category_id = is_category ? path_name.match(/c_(\d+)/)[1] : 0;

    }
    else if (is_search) {
        page_info.page_type = 'search';
        page_info.search_query = is_search ? loc.search : '';

    }

    return page_info;
}
*/
function update() {
    let page_info = getPageInfo();
    let basket_info = getBasketInfo();

    let ext = {
        page_info,
        basket_info
    };
    if (page_info.page_type === 'product') ext.product_info = getProductInfo();
    console.log(ext);
    return ext;
}

function productInfoMessage(a, b, c, __user) {

    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let ext = update();
    var ms = {};
    var ret = [];

    if (ext.page_info.page_type !== 'product') ms = { type: 'text', text: 'Ürün bilgisi bulunamadı.' };
    else {
        let item = ext.product_info;
        console.log('item', item);
        ret.push(generateProductCard(item));

        ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: ret } };
    }

    Help.sendBot(ms);
}

function generateProductCard(item) {
    let card = {
        title: item.title,
        buttons: [
            {
                title: 'Görüntüle',
                type: 'web_url',
                url: item.url
            }
        ]
    };
    card.subtitle = ` ${item.price}`;
    //card.subtitle += item.old_price ? ` Eski Fiyatı: ${item.old_price}.` : "";
    card.subtitle = card.subtitle.trim();
    card.image_url = item.images ? item.images[0] : item.image;
    return card;
}

function sizeMessage(a, b, c, __user) {

    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let ext = update();
    console.log('ext', ext);
    let ms = {};
    if (ext.page_info.page_type !== 'product') ms = { type: 'text', text: 'Ürün bilgisi bulunamadı.' };
    else {
        let size_array = ext.product_info.sizes;
        let sizes = '';

        $.each(size_array, (i, s) => {
            console.log('s', s);
            if (s.stock) sizes += s.alt + ' ';
        });
        ms = { type: 'text', text: `Beden seçenekleri : ${sizes}` };

    }

    Help.sendBot(ms);
}

function getTopSellers() {
    let $slider = $(main.document).find('.seg-reco-wrapper .slick-list .seg-item');
    let topSellers = slickSliderToArray($slider);

    console.log(topSellers);
    return topSellers;
}

function showTopSellers(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;

    let topSellers = getTopSellers();
    let cards = [];
    $.each(topSellers, (i, item) => {
        if (cards.length >= 10) return false;
        cards.push(generateProductCard(item));
    });

    let ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: cards } };

    Help.sendBot(ms);
}
var newest = [];
function getNewests(cat, cb) {
    //if (newest && newest[cat]) return cb(newest[cat]);
    console.log('cb', cb);
    console.log('cat', cat);

    var frame = createFrame({
        url: `https://www.twist.com.tr${cat}?o=IsNew`,
        document: main.document,
        cont: main.document.body,
        onload: () => {
            let doc = frameToDocument(frame);
            let items = [];
            let $list = $(doc).find('.productList .product-list .productListUl .product');

            console.log('$list', $list);
            $.each($list, (i, item) => {
                let id = $(item).attr('data-product-id');
                let imp = $(item).attr('data-impression');
                let pic = $(item).find('.p-picture .currentSlide').attr('data-src');
                let url = $(item).find('.p-info a').attr('href');
                imp = eval(`(${imp})`);
                let product = {
                    title: imp.name,
                    price: imp.price,
                    image: pic,
                    code: imp.id,
                    id,
                    url
                };
                items.push(product);
            });
            // userCache = items;
            cb(items);
            //store("",items)

            $(frame).remove();
        }
    });
}

function showNewests(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let page_type = getPageInfo().page_type;
    if (page_type !== 'category') return;

    let cat = main.location.pathname;
    console.log('cat', cat);
    //cat = 'jean-pantolon-c_728'
    let cards = [];

    getNewests(cat, (cb) => {
        $.each(cb, (i, p) => {
            console.log(p);
            cards.push(generateProductCard(p));
        });
        console.log(cards);
        let ms = { type: '__', data: { type: 'horizontal', '__': 'slider', array: cards } };
        Help.sendBot(ms);
    });


}

function getProductDescription() {
    let $desc = $(main.document).find('.accordion-explanation');
    let text = '';
    let p = $($desc).find('p').text();
    let $li = $($desc).find('.urun-detay-ul li');
    let ref = $($desc).find('div[tabindex=Reference3]').text().replace(/\r?\n|\r|\s+/g, ' ').trim();
    text += p + '\n';
    if ($li.length > 0) {
        $.each($li, (i, li) => {
            text += $(li).text().trim() + '\n';
        });
    }
    text += ref;

    console.log('text', text);
    return text;
}

function showProductDescription(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let text = getProductDescription();
    let ms = { type: 'text', text: text };

    Help.sendBot(ms);
}

function searchSize(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let size = c.size;
    console.log('size', size);

    let sizes = getProductSizeInfo();
    let f = _.find(sizes, { 'alt': size });
    console.log('found', f);

    let ms = {};
    if (f) {
        if (f.stock) ms = { type: 'text', text: 'Evet, istediğiniz beden bulunmakta.' };
        else ms = { type: 'text', text: 'Üzgünüm, istediğiniz beden stoklarımızda kalmamış.' };
    }
    else ms = { type: 'text', text: 'Üzgünüm, bu bedenden bulunmamaktadır.' };

    Help.sendBot(ms);
}

function showCargo(a, b, c, __user) {
    if ((c.__user && __user.uid !== c.__user)) return;
    if (!isActiveTab()) return false;
    let ms;
    let login = isLogin();
    if (!login) ms = { type: 'custom', array: [{ 'title': 'Lütfen önce giriş yapınız', buttons: [{ 'title': 'Giriş Yap', 'type': 'web_url', 'url': 'https://www.twist.com.tr/Uye' }] }] };
    else {
        let orders = store('orders');
        console.log('text', c.text);
        let cards = [];
        $.each(orders, (i, o) => {
            if (!o.status) return;
            let card = {
                title: `Kod : ${o.code} \nTarih: ${(o.date).trim()}\nDurum : ${o.statusDesc}`,
                buttons: [
                    {
                        title: c.text || 'Detay',
                        type: 'web_url',
                        url: 'https://www.twist.com.tr' + o.detailUrl

                    },
                    {
                        title: o.shipTracingTitle,
                        type: 'web_url',
                        url: o.shipTracingUrl
                    }
                ]
            };
            cards.push(card);

        });
        ms = { type: 'custom', array: cards };
    }


    Help.sendBot(ms);

}

function isLogin() {
    let ret = $(main.document).find('.login-signup');
    console.log('ret', ret, ret.length);
    return ret.length === 0;
}

myLib.getProductCombines = getProductCombines;
myLib.getInterestings = getInterestings;
myLib.getVisitedProducts = getVisitedProducts;
myLib.getMostVisited = getMostVisited;
myLib.getDailyTrendsByPage = getDailyTrendsByPage;
myLib.getPopularByCategory = getPopularByCategory;
myLib.getBasketOnLoad = getBasketOnLoad;
myLib.getInviteFriendMessage = getInviteFriendMessage;

Help.setEvent('twist/size_message', sizeMessage);
Help.setEvent('twist/product_info_message', productInfoMessage);
Help.setEvent('twist/product_info', getProductInfo);
Help.setEvent('twist/update', update);
Help.setEvent('twist/load_page', loadPage);
Help.setEvent('twist/show_combines', showCombines);
Help.setEvent('twist/show_interestings', showInterestings);
Help.setEvent('twist/show_top_sellers', showTopSellers);
Help.setEvent('twist/show_basket', showBasket);
Help.setEvent('twist/show_desc', showProductDescription);
Help.setEvent('twist/search_size', searchSize);
Help.setEvent('twist/get_orders', getOrders);
Help.setEvent('twist/show_newests', showNewests);
Help.setEvent('twist/show_cargo', showCargo);
Help.setEvent('twist/getProductSizeInfo', getProductSizeInfo);
Help.setEvent('twist/addFavorite', addFavoritex);
Help.setEvent('twist/getUserProfile', getUserProfile);
Help.setEvent('twist/show_visited_products', showVisitedProducts);
Help.setEvent('twist/chat_interaction', chatInteraction);

// Help.promo({
//     wait:1000,
// }, (lib, cb) => {

//    cb({type:'text',text:'deneme'})
// })

main.dahiNotify({ type: 'on/interaction', data: chatInteraction });
//main.dahiNotify({type:'on/state',data:chatInteraction});
main.dahiNotify({ type: 'on/message', data: chatInteraction });
main.dahiNotify({ type: 'on/input/focus', data: chatInteraction });
main.dahiNotify({ type: 'on/input/change', data: chatInteraction });
