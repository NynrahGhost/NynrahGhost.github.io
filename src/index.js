import './scss/main.scss';
import 'bootstrap';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

console.log('Hello!');
console.log(`The time is ${new Date()}`);

//let _makeProduct = require('./modules/product-html');

jQuery.ajax({
    url: 'http://nit.tron.net.ua/api/category/list',
    method: 'get',
    dataType: 'json',
    success: function(json){
        console.log('Loaded via AJAX!');
        console.table(json);
        let i = 1;
        json.forEach(
                ({id, name, description,}) => {
                    if (i % 3 == 0) {
                        $('.category-list').append($(`<div class="row">`))
                        console.log('DONE!!!');
                    }
                    $('.category-list').append($(`<a href="#" class="list-group-item list-group-item-action" category-id="${id}">${name}
                    <p class="mb-1">${description}</p></a>`))
                    if (i % 3 == 0) {
                        $('.category-list').append($(`</div>`))
                    }
                    i += 1;
                }
        );
        console.log('Added to grid');
    },

    error: function(xhr){
        alert("An error occured: " + xhr.status + " " + xhr.statusText);
    },
});

jQuery.ajax({
    url: 'https://nit.tron.net.ua/api/product/list',
    method: 'get',
    dataType: 'json',
    success: function(json){
        console.log('Loaded via AJAX!');
        console.table(json);
        json.forEach(({id, name, image_url, description, price,}) => {
            /*if (id % 3 == 0) {
                $('.product-grid').append($(`</div>`))
                $('.product-grid').append($(`<div class="row">`))
            }*/
            $('.product-grid > .row').append($(`<div class="col-sm-4" data-product-id="${id}"><div class="panel panel-primary">
            <div class="panel-heading">${name}</div>
            <div class="panel panel-body" style="overflow: hidden;">
                <img src="${image_url}" alt="${name}" class="img-fluid product-image"></div>
            <div class="panel-footer" >${description}</div>
            </div></div>`));
        });
        console.log('Added to grid');
    },

    error: function(xhr){
        alert("An error occured: " + xhr.status + " " + xhr.statusText);
    },

});


