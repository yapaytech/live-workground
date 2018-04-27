import { createFrame, frameToDocument, isActiveTab, store, DahiHelper } from './__helpers';

const Help = new DahiHelper({ ref: 'twist-core' });
const { $q, _: main } = Help;


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
        _.assignIn(page_info, getCategoryInfo());
        console.log("category",page_info);
        
    }
    else if (is_search) {
        page_info.page_type = 'search';
        page_info.search_query = is_search ? loc.search : '';

    }

    return page_info;
}

function getCategoryInfo(path_name) {
    if (!path_name) path_name = main.location.path_name;
    let category = {
        category_id: main.departmentId || path_name.match(/c_(\d+)/)[1] || 0,
        category_name: $('<textarea />').html(main.departmentName).text()
    }
    return category;
}

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
    let { google_tag_params } = main;
    debugger;
    let product_info = {
        title,
        url,
        code,
        id,
        price,
        old_price,
        images,
        sizes,
        combines,
        google_tag: google_tag_params || {}
    };
    return product_info;
}



function getProductSizeInfo() {

    let sizes = $(main.document).find('#addBasketForm .js-size ul li');
    var sizeArray = [];
    $(sizes).map(function () {
        var size = { spec2: $(this).attr('spec2'), pdescid: $(this).attr('pdescid'), pid: $(this).attr('pid'), alt: $(this).attr('alt'), stock: !$(this).attr('nostock') };
        sizeArray.push(size);
    }).get();
    return sizeArray;
}

module.exports = { getPageInfo, getProductInfo, getProductSizeInfo, getCategoryInfo };