const main = require('../src/lib/dahiNotify')();
const { svg, _, $ } = window;
const { isActiveTab, store } = require('./__helpers');


store("testdeneme", { x: 1 })
main.isActiveTab = isActiveTab;
var $table = $('<table class="demo-table" />');
_.each(svg, (it, i) => {
    $table.append(`<tr><td>${i}</td><td><div class="demo-svg">${it}</td></tr>`);
})
var $m = $(main.document.body);
$m.append($table);
$(main.document.head).append(`
<style>
    .r1{
        position: absolute;
    left: 10px;
    bottom: 0;
    width:400px;
    }
    .r2{
        position: absolute;
        bottom:0px;
        left:0px;right:0px;
    }
    .message{
padding:5px;
margin:5px;
border:1px solid black;
    }
    .demo-svg {
        width:24px;
        height:24px;
        margin:5px;
    }
    .demo-svg svg{
        height: 100%;
    width: 100%;
    fill: black;
    }
    .demo-table {
        display: flex;flex-wrap: wrap;border: 1px solid;padding: 10px;max-width: 500px;
    }
    .demo-table tr{
border:1px solid gray;
    }
</style>
`)

var $r = $('<button>add message</button>');
var $c = $('<div class="r1"><div class="r2"></div></div>')
let cont = $c.find('.r2');
let x = 0;
let i = 0;
let stack = [];
let resize = (h) => {
    x = x + h;
    if (h > 0) cont.css({ bottom: h * -1 }).animate({ bottom: 0 }, 'fast');
    //cont.animate({ height: x+5 }, h > 0 ? 'fast' : 0);
    $c.animate({ height: x + 5 }, h > 0 ? 'fast' : 0);
}
$r.on('click', () => {
    let ne = $("<div class='message'>test - " + (i++) + "</div>");
    ne.css({ height: Math.floor(Math.random() * 60) + 40 })
    cont.append(ne);
    ne.css({ visibility: 'hidden' });
    let h = ne.outerHeight(true) - 5;
    resize(h);
    ne.css({ visibility: '', 'opacity': 0 })
        .animate(
            { opacity: 1 },
            { queue: false, duration: 'slow' }
        );
    stack.push(ne);
    if (stack.length > 3) {
        let rem = stack.shift();
        let rem_h = rem.outerHeight(true);
        rem.animate(
            { opacity: 0 },
            {
                queue: false, duration: 'fast', done: () => {
                    rem.remove();
                    resize(-1 * (rem_h - 5));
                }
            }
        );
    }
})

var $testJson = $('<textarea></textarea>');
$testJson.val('{type:"__",data:{"type":"horizontal","__":"slider","array":[{"title":"SLOGAN BASKILI RELAX FİT JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/beyaz-slogan-baskili-relax-fit-jean-pantolon_p_29528"}],"subtitle":"Fiyatı: 259.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018045002-jean-pantolon-636501469628677135.jpg"},{"title":"SERPME İNCİ BASKILI JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/indigo-serpme-inci-baskili-jean-pantolon_p_29531"}],"subtitle":"Fiyatı: 299.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018048629-jean-pantolon-636501469400142511.jpg"},{"title":"RENKLİ KRİSTAL TAŞ APLİKELİ SKİNNY FİT JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/indigo-renkli-kristal-tas-aplikeli-skinny-fit-jean-pantolon_p_29530"}],"subtitle":"Fiyatı: 399.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018047629-jean-pantolon-636501470021152306.jpg"},{"title":"YANLARI KUŞ GÖZÜ ŞERİTLİ JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/indigo-yanlari-kus-gozu-seritli-jean-pantolon_p_29525"}],"subtitle":"Fiyatı: 299.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018042629-jean-pantolon-636501469112534214.jpg"},{"title":"BOYA VE ESKİTME EFEKTLİ JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/indigo-boya-ve-eskitme-efektli-jean-pantolon_p_29524"}],"subtitle":"Fiyatı: 259.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018041629-jean-pantolon-636501469029908761.jpg"},{"title":"RENK GEÇİŞLİ RELAX FİT JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/indigo-renk-gecisli-relax-fit-jean-pantolon_p_29521"}],"subtitle":"Fiyatı: 259.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/636546584116980915.jpg"},{"title":"TROK BASKILI RENK GEÇİŞLİ FLARE FİT JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/indigo-trok-baskili-renk-gecisli-flare-fit-jean-pantolon_p_29529"}],"subtitle":"Fiyatı: 299.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018046629-jean-pantolon-636501469265003849.jpg"},{"title":"ŞİMŞEK FİGÜR NAKIŞLI RELAX FİT JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/koyu-indigo-simsek-figur-nakisli-relax-fit-jean-pantolon_p_29526"}],"subtitle":"Fiyatı: 259.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018043AC7-jean-pantolon-636501459804949693.jpg"},{"title":"YANLARI SLOGAN ŞERİTLİ JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/koyu-indigo-yanlari-slogan-seritli-jean-pantolon_p_29527"}],"subtitle":"Fiyatı: 259.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018044AC7-jean-pantolon-636501459862363681.jpg"},{"title":"KUŞ GÖZÜ ÜZERİ HALKA GEÇİŞLİ RELAX FİT JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/antrasit-kus-gozu-uzeri-halka-gecisli-relax-fit-jean-pantolon_p_29520"}],"subtitle":"Fiyatı: 259.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018037036-jean-pantolon-636501469065231026.jpg"},{"title":"OTANTİK BEL NAKIŞLI YAN PÜSKÜLLÜ JEAN PANTOLON","buttons":[{"title":"Görüntüle","type":"web_url","payload":"/urun/acik-indigo-otantik-bel-nakisli-yan-puskullu-jean-pantolon_p_29523"}],"subtitle":"Fiyatı: 299.00.","image_url":"https://st-twist.mncdn.com/twist/mnresize/386/515/Content/media/ProductImg/original/TS1180018040CC2-jean-pantolon-636501459738665075.jpg"}]}}')
var $test = $('<button>Send MS</button>');

$test.on('click', () => {
    var val = $testJson.val();
    try {
        val = eval(`(${val})`);
        main.dahiNotify({ ref: 'test', type: 'send/bot', data: val });
    } catch (error) {
        console.error(error);
    }
})

var $cont = $('<div class="sender" />')
$cont.append([$testJson, $test]);

$m.append([$r, $c, $cont]);

main.dahiNotify({ type: 'on/interaction', data: () => { } });
main.dahiNotify({ type: 'on/state', data: () => { } });
main.dahiNotify({ type: 'on/message', data: () => { } });
main.dahiNotify({ type: 'on/input/focus', data: () => { } });
main.dahiNotify({ type: 'on/input/change', data: () => { } });
main.dahiNotify({
    type: 'on/pageActive', data: (e, type) => {
        //if (!type) return;
        console.log("page is >", type)
    }
});
/*
let instaMess = () => {
    let message = {
        type: 'custom',
        array: [{
            title: 'Satın Almayı Unutma !',
            subtitle: 'Sepetinizde 2 adet ürün bulunmaktadır.\nToplam Tutar : 568,20 TL',
            buttons: [{
                title: 'Sepete Git',
                type: 'web_url',
                url: 'https://www.hotic.com.tr/Cart'
            }]
        }]

    }
    main.dahiNotify({ type: 'send/bot', data: message });
}*/
//instaMess();

