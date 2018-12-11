import './scss/main.scss';
import 'bootstrap';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

console.log('Hello!');
console.log(`The time is ${new Date()}`);

$( document ).ready(function() {
    $('#AllProducts').click(function(){ GetAllProducts(); return false; });
    GetAllProducts();
});

let cart = new Map();

function GetCategory(element) {

    console.log('Category ' + $(element).attr("category-id"));

    $('.product-grid').empty();

    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/product/list/category/' + $(element).attr("category-id"),
        method: 'get',
        dataType: 'json',
        success: function(json){
            console.log('Loaded via AJAX!');
            console.table(json);
            json.forEach(({id, name, image_url, description, price, special_price,}) => {
                let prices = '';
                if(special_price == null){
                    prices += '<span class="product-price"><b>' + price;
                }else{
                    prices += '<span style="text-decoration: line-through;">' + price + '</span> <span class="product-price product-special-price"><b>' + special_price;
                }
                prices += '<span style="font-size:80%;"> грн.</span></b></span>'
                $('.product-grid').append($(`<div class="col-sm-4 product" data-product-id="${id}"><div class="panel panel-primary">
            <div class="panel-heading">${name}</div>
            <div class="panel panel-body h-50">
                <img src="${image_url}" alt="${name}" class="img-fluid product-image center-block"></div>
            <div class="panel-footer text-right" >${prices} <button type="button" class="btn btn-success">
                <span class="glyphicon glyphicon-shopping-cart"></span></button></div>
            </div></div>`));
            });
            $('.product').click(function(){ GetProduct(this); return false; });
            $('.product button').click(function(){ ProductToCart(this); return false; });
            console.log('Added to grid');
        },

        error: function(xhr){
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },

    });

}

jQuery.ajax({
    url: 'http://nit.tron.net.ua/api/category/list',
    method: 'get',
    dataType: 'json',
    success: function(json){
        console.log('Loaded via AJAX!');
        console.table(json);
        json.forEach(
                ({id, name, description,}) => {
                    $('.dropdown-menu').append($(`<li><a href="#" class="category-entry" category-id="${id}">${name}
                    <p class="category-description">${description}</p>
                    </a></li>`))
                }
        );
        $('.category-entry').click(function(){ GetCategory(this); return false; });
        console.log('Added to grid');
    },

    error: function(xhr){
        alert("An error occured: " + xhr.status + " " + xhr.statusText);
    },
});

function GetAllProducts() {

    $('.product-grid').empty();

    jQuery.ajax({
        url: 'https://nit.tron.net.ua/api/product/list',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log('Loaded via AJAX!');
            console.table(json);
            json.forEach(({id, name, image_url, description, price, special_price,}) => {
                let prices = '';
                if (special_price == null) {
                    prices += '<span class="product-price"><b>' + price;
                } else {
                    prices += '<span style="text-decoration: line-through;">' + price + '</span> <span class="product-price product-special-price"><b>' + special_price;
                }
                prices += '<span style="font-size:80%;"> грн.</span></b></span>';
                $('.product-grid').append($(`<div class="col-sm-4 product" data-product-id="${id}"><div class="panel panel-primary">
            <div class="panel-heading">${name}</div>
            <div class="panel panel-body h-50">
                <img src="${image_url}" alt="${name}" class="img-fluid product-image center-block"></div>
            <div class="panel-footer text-right" >${prices} <button type="button" class="btn btn-success">
                <span class="glyphicon glyphicon-shopping-cart"></span></button></div>
            </div></div>`));
            });
            console.log('Added to grid');
            $('.product').click(function(){ GetProduct(this); return false; });
            $('.product button').click(function(){ ProductToCart(this); return false; });
        },

        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },

    });
}

function GetProduct(element) {

    $('.product-grid').empty();

    jQuery.ajax({
        url: 'http://nit.tron.net.ua/api/product/' + $(element).attr("data-product-id"),
        method: 'get',
        dataType: 'json',
        success: function(json){
            console.log('Loaded via AJAX!');
            console.table(json);

            let prices = '';
            if (json.special_price == null) {
                prices += '<span class="product-price"><b>' + json.price;
            } else {
                prices += '<span style="text-decoration: line-through;">' + json.price + '</span> <span class="product-price product-special-price"><b>' + json.special_price;
            }
            prices += '<span style="font-size:80%;"> грн.</span></b></span>';

            let link;
            let desc = json.description;
            let start = desc.indexOf("http");
            if(start != -1) {
                link = desc.substring(start, desc.length);
                desc = desc.replace(link, `<a href="${link}">${link}</a>`);
            }

            $('.product-grid').append($(`<div class="row product-background">
                <div><img src="${json.image_url}" alt="${json.name}" class="col-sm-6 img-fluid product-image center-block"></div>
                <div class="col-sm-6 scrollbar-near-moon product-description">${desc}</div><br/><div class="h-50">${prices} <button type="button" class="btn btn-success">
                <span class="glyphicon glyphicon-shopping-cart"></span></button></div></div><`)
            );
            console.log('Added to grid');
        },

        error: function(xhr){
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

function ProductToCart(element) {
    let id = $(element.parentElement.parentElement.parentElement).attr("data-product-id");
    if(cart.has(id)) {
        cart.set(id, cart.get(id) + 1);
    } else {
        cart.set(id, 1);
    }
    alert("Added!" + id + " " + cart.get(id));
    alert(cart);
}

function Cart() {


}
