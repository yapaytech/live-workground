var main = require('./__helpers').getMain();
/*if (main.dahiTarget) {
    main = main.dahiTarget;
}*/
const check = () => $('.mobile-menu-overlay', main.document).css('opacity') === '1';
const work = () => {
    let it = $('#dahiWrap', main.document);
    if (check()) it.fadeIn();
    else it.fadeOut();
}
$(main.document).on('click', work);
$('.userMenu', main.document).on('click', work)
work();