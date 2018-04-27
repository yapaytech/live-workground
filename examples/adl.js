
import { createFrame, frameToDocument, isActiveTab } from './__helpers';
(() => {
    var main = require('../src/lib/dahiNotify')();
    if (main.dahiTarget) {
        main = main.dahiTarget;
    }
    /*try {

        let detail = $('.product-detail-left .product-detail-info').text();
        let price = $('.product-detail-right .product-detail-new-price').text();
        let product =
            {
                title: $('.product-detail-left .product-detail-name', main).text(),
                subtitle: $(), // optional 
                url: "http://www.twist.com.tr:80/urun/siyah-renk-gecisli-pantolon_p_29062?_sgm_campaign=scn_667c1533f8000&amp;_sgm_source=TW6170003197001&amp;_sgm_action=click", // required 
                images: ["https://st-twist.iyimarkalar.com/twist/mnresize/500/500/Content/media/ProductImg/original/TW6170003197001-siyah-pantolon-636477464288170276.jpg", "https://st-twist.iyimarkalar.com/twist/mnresize/500/500/Content/media/ProductImg/original/TW6170003197001-siyah-pantolon-636477464260028344.jpg", "https://st-twist.iyimarkalar.com/twist/mnresize/500/500/Content/media/ProductImg/original/TW6170003197001-siyah-pantolon-636477464271979142.jpg", "https://st-twist.iyimarkalar.com/twist/mnresize/500/500/Content/media/ProductImg/original/TW6170003197001-siyah-pantolon-636477452770070722.jpg", "https://st-twist.iyimarkalar.com/twist/mnresize/500/500/Content/media/ProductImg/original/TW6170003197001-siyah-pantolon-636477464279939610.jpg"]
            };
        console.log(product);
        window.dahiNotify({ ref: "adl.dll", type: "set/promote", data: product })
    } catch (error) {
        window.dahiNotify({ ref: "adl.dll", type: "log/error", data: error });
    }
    ↵ <div class="product-top">↵ <a class="product-name track-link product-box-link" title="Pantolon Etek" href="http://www.adl.com.tr/tr/p/pantolon-etek-26962" data-id="">↵ <img src="https://img-adl.mncdn.com/mnresize/350/350/thumbs/pantolon_etek_camel_114936_500.jpeg" alt="Pantolon Etek" class="img-responsive productimage" data-original="">↵ </a>↵ <div class="quick-view-link hidden-md hidden-sm hidden-xs">↵ <a href="#" data-fancybox-type="iframe" onclick="openQuickView('http://www.adl.com.tr/tr/p/pantolon-etek-26962?mode=quickview&amp;returnUrl=?q=pantolon&amp;fR[RankedCategoryName][0]=none', '', '', function(){ UpdateFlyoutCart(); });return false;" class="btn button-quickview quickView">HIZLI BAKIŞ</a>↵ </div>↵↵ <div class="product-discount">↵ <span> -%69 </span>↵ </div>↵ </div>↵↵ <a class="product-bottom" title="Pantolon Etek" href="http://www.adl.com.tr/tr/p/pantolon-etek-26962" data-id="">↵ <div class="product-name">Pantolon Etek</div>↵ <div class="product-prices">↵ <div class="productPriceContent">↵ <span class="product-old-price">129,90 TL</span>↵ <span class="product-price">39,90 TL</span>↵ <div class="insPriceDifferent">Kazancınız 90,00 TL</div></div>↵ </div>↵ </a>↵ " innerText : "-%69↵"
    */

    function adlSearch(text) {
        text = encodeURIComponent(text);
        var frame = createFrame({
            url: 'http://www.adl.com.tr/tr/c/tum-urunler-1?q=' + text,
            cont: main.document.body,
            onload: () => {
                let doc = frameToDocument(frame);
                let val = $(doc).find('.product-box');
                let raw = [];
                $.each(val, (i, item) => {
                    var $it = $(item);
                    var text = (cls) => $it.find(cls).text();
                    raw.push({
                        title: text('div.product-name'),
                        subtitle: '',
                        image_url: $it.find('.productimage').attr('src'),
                    });
                    if (i >= 9) return false;
                });
                var ms = { type: 'custom', array: raw };
                if (!raw.length) ms = { type: 'text', message: 'Aradığınız kriterlerde ürün bulunamadı.' }
                main.dahiNotify({ ref: "adl.dll", type: "send/bot", data: ms });
                $(frame).remove();
            }
        })
    }
    main.dahiNotify({ ref: "adl.dll", type: "set/event", data: { type: 'adl/search', fn: adlSearch } });
    var baseLanguageId = main.baseLanguageId, algoliasearch = main.algoliasearch;
    var APPLICATION_ID = 'WHZSQHAEU4';
    var SEARCH_ONLY_API_KEY = 'c4fdd891f12120bbf7fd0735891d56a6';
    var INDEX_NAME = 'products' + "_" + baseLanguageId;
    var INDEX_NAME_ASC = 'products' + "_" + baseLanguageId + "_asc";
    var INDEX_NAME_DESC = 'products' + "_" + baseLanguageId + "_desc";
    var INDEX_NAME_NEW = 'products' + "_" + baseLanguageId + "_new";


    var client = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
    var index = client.initIndex(INDEX_NAME);
    var index_asc = client.initIndex(INDEX_NAME_ASC);
    var index_desc = client.initIndex(INDEX_NAME_DESC);
    var index_new = client.initIndex(INDEX_NAME_NEW);
    //index.setSettings(AC_PARAMS);

    //var ac_algoliaHelper = algoliasearchHelper(ac_algolia, INDEX_NAME, AC_PARAMS);
    function adlSearch2(a, b, c, __user) {
        var text = c && c.__json && c.__json.text;
        if (!text || (c.__user && __user.uid !== c.__user)) return;
        index.search({ query: text, hitsPerPage: 10,attributesToRetrieve: ['Name', 'PriceFormatted', 'Url', 'ImageUrl', 'FullDescription', 'Price', 'OldPrice', 'OldPriceFormatted'], }, function (err, content) {
            if (err) {
                console.error(err);
                return;
            }
            let ret = [];
            $.each(content.hits, (i, item) => {
                if (item.FullDescription === 'Tanımsız') item.FullDescription = '';

                let price_desc = `Fiyatı: ${item.PriceFormatted}.`
                if (item.Price !== item.OldPrice) price_desc += `\nEski Fiyatı: ${item.OldPriceFormatted}.\nKazancınız : ${(item.OldPrice - item.Price).toFixed(2)} TL.`
                ret.push({
                    title: item.Name,
                    subtitle: `${price_desc}`.trim(),
                    image_url: item.ImageUrl,
                    "buttons": [{
                        "title": "Ürünün Sayfasına Git",
                        "type": "web_url",
                        "url": item.Url
                    }]
                })
            });
            var ms = { type: 'custom', array: ret };
            if (!ret.length) {
                ms =
                    {
                        "type": "text",
                        "text": "Üzgünüm, seni anlayamadım  🙄"
                    };
                main.dahiNotify({ ref: "adl.dll", type: "send/bot", data: ms });

                ms = {
                    "type": "button",
                    "text": "Aşağıdaki konularda bilgi almak ister misin?",
                    "buttons": [
                        {
                            "title": "İade ve değişim hakkında sorum var",
                            "type": "web_url",
                            "url": "http://www.adl.com.tr/tr/t/siparisiadedegisim"
                        },
                        {
                            "title": "İletişim sayfasına yönlenmek istiyorum",
                            "type": "web_url",
                            "url": "https://www.adl.com.tr/tr/contactus"
                        },
                        {
                            "title": "Tüm ürünleri görmek istiyorum",
                            "type": "postback",
                            "url": "__show_all"
                        }
                    ]
                };
                setTimeout(() => {
                    main.dahiNotify({ ref: "adl.dll", type: "send/bot", data: ms });
                }, 500);
    
            }else{
                main.dahiNotify({ ref: "adl.dll", type: "send/bot", data: ms });
            }
           
        });
    }

    function adlFilterSearch(a, b, c, __user) {
        var json = c && c.__json;

        if (!json || !json.x2 || (c.__user && __user.uid !== c.__user)) return;
        if (!isActiveTab()) return false;

        if (json.x2 === "Jean") json.x2 = "Jeans";
        if (json.x2 === "Şık Elbise") json.x2 = "Gece Elbisesi";
        if (json.x2 === "Tüm Elbiseler") json.x2 = "Elbise";
        if (json.x2 === "Outlet") json.x2 = "Süper Fiyatlar";

        let filter = `(Attr6:'${json.x2}' OR 'CategoryModels.Name':'${json.x2}')`
        if (json.x5) filter = `('CategoryModels.Name':'${json.x2}' AND 'CategoryModels.Name':'${json.x5}')`;
        if (json.x3 === 'Evet' && json.x4) filter += ` AND 'Attr3':'${json.x4}'`

        let fnc = function (err, content) {
            if (err) {
                console.error(err);
                return;
            }
            let ret = [];
            $.each(content.hits, (i, item) => {
                if (item.FullDescription === 'Tanımsız') item.FullDescription = '';

                let price_desc = `Fiyatı: ${item.PriceFormatted}.`
                if (item.Price !== item.OldPrice) price_desc += `\nEski Fiyatı: ${item.OldPriceFormatted}.\nKazancınız : ${(item.OldPrice - item.Price).toFixed(2)} TL.`
                ret.push({
                    title: item.Name,
                    subtitle: `${price_desc}`.trim(),
                    image_url: item.ImageUrl,
                    "buttons": [{
                        "title": "Ürünün Sayfasına Git",
                        "type": "web_url",
                        "url": item.Url
                    }]
                })
            });
            var ms = { type: 'custom', array: ret };
            if (!ret.length) ms = { type: 'text', text: 'Aradığınız kriterlerde ürün bulunamadı.' }
            main.dahiNotify({ ref: "adl.dll", type: "send/bot", data: ms });
        }
        let query = { filters: filter, hitsPerPage: 10, attributesToRetrieve: ['Name', 'PriceFormatted', 'Url', 'ImageUrl', 'FullDescription', 'Price', 'OldPrice', 'OldPriceFormatted'], }
        let order = json.order || "";
        switch (order) {
            case "ASC":
                index_asc.search(query, fnc);
                break;
            case "DESC":
                index_desc.search(query, fnc);
                break;
            case "NEW":
                index_desc.search(query, fnc);
                break;
            default:
                index.search(query, fnc);
                break;
        }
    }

    function adlSearchPriceAcs(a, b, c, __user) {
        var json = c && c.__json;

        if (!json || !json.x2 || (c.__user && __user.uid !== c.__user)) return;
        if (!isActiveTab()) return false;

        if (json.x2 === "Jean") json.x2 = "Jeans";
        if (json.x2 === "Şık Elbise") json.x2 = "Gece Elbisesi";
        if (json.x2 === "Tüm Elbiseler") json.x2 = "Elbise";
        if (json.x2 === "Outlet") json.x2 = "Süper Fiyatlar";
        let filter = `(Attr6:'${json.x2}' OR 'CategoryModels.Name':'${json.x2}')`
        if (json.x3 === 'Evet' && json.x4) filter += ` AND Attr3:${json.x4}`



    }
    main.dahiNotify({ ref: "adl.dll", type: "set/event", data: { type: 'adl/search2', fn: adlSearch2 } });

    main.dahiNotify({ ref: "adl.dll", type: "set/event", data: { type: 'adl/filterSearch', fn: adlFilterSearch } });

    index.search({ query: "boot", hitsPerPage: 10, attributesToRetrieve: ['Name', 'PriceFormatted', 'Url', 'ImageUrl', 'FullDescription'], }, () => { });
})();