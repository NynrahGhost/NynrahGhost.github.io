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
    $("#cartPopup").hide();
    $("#cartSuccess").hide();
    $("#cartRestrict").hide();
    $('.cart').click(function(){ Cart(); return false; });
    $(document).on('click', '.button-remove',function () {CartRemove(this); return false;});
    $(document).on('click', '.button-minus',function () {CartMinus(this); return false;});
    $(document).on('click', '.button-plus',function () {CartPlus(this); return false;});
});

let cart = new Map();
let cartMoney = new Map();

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
                $('.product-grid').append($(`<div class="col-sm-4 product" data-product-id="${id}">
                    <div class="panel panel-primary">
                        <div class="panel-heading">${name}</div>
                        <div class="panel panel-body h-50">
                            <img src="${image_url}" alt="${name}" class="img-fluid product-image center-block">
                        </div>
                        <div class="panel-footer text-right" >${prices} 
                            <button type="button" class="btn btn-success">
                                <span class="glyphicon glyphicon-shopping-cart"></span>
                            </button>
                        </div>
                    </div>
                </div>`));
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
    url: 'https://nit.tron.net.ua/api/category/list',
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
                $('.product-grid').append($(`<div class="col-sm-4 product" data-product-id="${id}">
                    <div class="panel panel-primary">
                        <div class="panel-heading">${name}</div>
                        <div class="panel panel-body">
                            <img src="${image_url}" alt="${name}" class="img-fluid product-image center-block">
                        </div>
                        <div class="panel-footer text-right" >${prices} 
                            <button type="button" class="btn btn-success">
                                <span class="glyphicon glyphicon-shopping-cart"></span>
                            </button>
                        </div>
                    </div>
                </div>`));
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
        url: 'https://nit.tron.net.ua/api/product/' + $(element).attr("data-product-id"),
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

            $('.product-grid').append($(`<div class="row product product-background" data-product-id="${json.id}">
                <div class="cart-product-image col-sm-6">
                    <b>${json.name}</b><br/>
                    <img src="${json.image_url}" alt="${json.name}" class="img-fluid cart-product-image">
                </div>
                <div class="col-sm-6">
                    <div class="scrollbar-near-moon product-description">${desc}<br/></div>
                    <div class="h-50">${prices} 
                        <button type="button" class="btn btn-success">
                            <span class="glyphicon glyphicon-shopping-cart"></span>
                        </button>
                    </div>
                </div>
            </div>`)
            );
            console.log('Added to grid');
            $('.product button').click(function(){ ProductToCart(this); return false; });
        },

        error: function(xhr){
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

function ProductToCart(element) {
    let id = $(element.parentElement.parentElement.parentElement).attr("data-product-id");
    $("#cartPopup").show();
    setTimeout(function(){
        $("#cartPopup").hide();
    }, 2000);

    if(cart.has(id)) {
        cart.set(id, cart.get(id) + 1);
    } else {
        //alert($(element.parentElement.parentElement.parentElement).children('.product-price').first().text());
        cart.set(id, 1);
        //cartMoney.set(id, $(element.parentElement.parentElement.parentElement).children('.product-price').text());
    }
    //alert("Added!" + id + " " + cart.get(id));
}

function Cart() {

    if(cart.size == 0) {
        $("#cartRestrict").show();
        setTimeout(function(){
            $("#cartRestrict").hide();
        }, 2000);
        return;
    }
    $('.product-grid').empty();

    $('.product-grid').append($(`<div class="cart-product-description">`));

    for(let [k, v] of cart) {

        if(v == 0) {
            continue;
        }
        jQuery.ajax({
            url: 'https://nit.tron.net.ua/api/product/' + k,
            method: 'get',
            dataType: 'json',
            success: function(json){
                console.log('Loaded via AJAX!');
                console.table(json);

                let price = 0;
                if(json.special_price == null) {
                    price = json.price;
                } else {
                    price = json.special_price;
                }

                cartMoney.set(k, price);

                $('.cart-product-description').append($(`<div class="row product-background cart-product" cart-product-id="${k}">
                <div class="cart-product-image col-sm-6">
                    <b>${json.name}</b><br/>
                    <img src="${json.image_url}" alt="${json.name}" class="img-fluid cart-product-image">
                </div>
                    <br/>
                <div class="col-sm-6 cart-buttons"><span class="product-price"><b id="product-${k}">${price}<span style="font-size:80%;"> грн.</span></b></span>
                                    <button type="button" class="btn btn-danger button-remove"><i class="glyphicon glyphicon-remove-sign"></i></button>
                                    <button type="button" class="btn btn-warning button-minus"><i class="glyphicon glyphicon-minus-sign"></i></button>
                                    <button id="${k}" type="button" class="btn btn-info">${v}</button>
                                    <button type="button" class="btn btn-primary button-plus"><i class="glyphicon glyphicon-plus-sign"></i></button></div>
            </div>`)
                );
                UpdateCart();
                console.log('Added to grid');
            },

            error: function(xhr){
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            },
        });
    }

    $('.product-grid').append($(`<br/><div class="cart-product cart-middle col-12">
        <button type="button" class="btn btn-danger button-remove" id="button-clear"><i class="glyphicon glyphicon-trash"></i></button>
        <span class="product-price"><b id="overall-price"></b></span>
    </div><bt/>`));

    $('.product-grid').append($(`</div class="product-description"><br/>`));
    $('.product-grid').append($(`
            <div class="bootstrap-iso"><br/>
            <div class="alert alert-danger" id="error-popup"></div>
 <div class="container-fluid">
  <div class="row">
   <div class="col-md-6 col-sm-6 col-xs-12">
    <form method="post">
     <div class="form-group ">
      <label class="control-label " for="form-name">
       Name
      </label>
      <input class="form-control" id="form-name" name="form-name" type="text"/>
     </div>
     <div class="form-group ">
      <label class="control-label " for="form-email">
       Email
      </label>
      <input class="form-control" id="form-email" name="form-email" type="text"/>
      <span class="help-block" id="hint_form-email">
      </span>
     </div>
     <div class="form-group ">
      <label class="control-label " for="form-phone">
       Phone number
      </label>
      <input class="form-control" id="form-phone" name="form-phone" type="text"/>
     </div>
     <div class="form-group">
      <div>
       <button class="btn btn-primary submit-button" name="submit" type="submit">
        Submit
       </button>
      </div>
     </div>
    </form>
   </div>
    <div class="col-md-6 col-sm-6 col-xs-12">
        
    </div>
  </div>
 </div>
</div>
    `));

    $('#button-clear').click(function(){ CartClear(); return false; });
    $('.submit-button').click(function(){ Submit(); return false; });
    UpdateCart();
    $('#error-popup').hide();
}

function Submit() {

    $('#error-popup').hide();
    event.preventDefault();

    let name = $('#form-name').val();
    let email = $('#form-email').val();
    let phone = $('#form-phone').val();

    let data = `name=${name}&email=${email}&phone=${phone}`;

    for(let [k, v] of cart) {
        if(v == 0) {
            continue;
        }
        data += `&products[${k}]=${v}`;
    }

    data += "&token=kqbbSihLAg-keWJGW6ea";
    $.ajax({
        url: 'https://nit.tron.net.ua/api/order/add',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function(json) {
            if(json.status == "error") {
                let arr = Object.values(json.errors);
                let msg = "<strong>Error!</strong>";
                for(let i = 0; i < arr.length; i++) {
                    msg += " " + arr[i];
                }
                $('#error-popup').show();
                $('#error-popup').html(msg);
            }else {
                CartClear();
                $("#cartSuccess").show();
                setTimeout(function(){
                    $("#cartSuccess").hide();
                }, 2000);
            }
            console.log(json);
        },
        error: function(json) {
            console.log(json);
        },
    });
}

function CartRemove(element) {
    let id = $(element.parentElement.parentElement).attr("cart-product-id");
    cart.delete(id);
    cartMoney.delete(id);
    $(element.parentElement.parentElement).remove()
    UpdateCart()
}

function CartMinus(element) {
    let id = $(element.parentElement.parentElement).attr("cart-product-id");
    let val = parseInt($('#' + id).text());
    if(val <= 1) {
        CartRemove(element);
    }
    val--;
    $('#' + id).text(val);
    cart.set(id, val);
    UpdateCart()
}

function CartPlus(element) {
    let id = $(element.parentElement.parentElement).attr("cart-product-id");
    let val = parseInt($('#' + id).text());
    val++;
    $('#' + id).text(val);
    cart.set(id, val);
    UpdateCart()
}

function CartClear() {
    $('.cart-product').remove();
    cart.clear();
    cartMoney.clear();
    GetAllProducts();
    UpdateCart()
}

function UpdateCart() {
    let overallPrice = 0;
    for (let [k, v] of cartMoney) {
        overallPrice += cart.get(k) * v;
    }
    $('#overall-price').html(overallPrice + '<span style="font-size:80%;"> грн.</span>');
}

function popUpAlert(element) {
    element.classList.toggle("show");
}

function popUpCart(element) {

}