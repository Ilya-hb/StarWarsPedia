import './scss/style.scss';
import 'bootstrap';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import $, { event, get } from 'jquery';
//import '../src/autocomplete.js';
$((function () {
    const select = $('#select');
    const submit = $('#submit');
    const input = $('#inp');
    const cardBtn = $('.card-btn');
    const loader = $('#loader');
    let outputContainer = $('#output-container');
    const categorieBtns = {
        '.films-search': 'https://swapi.dev/api/films/',
        '.people-search': 'https://swapi.dev/api/people/',
        '.planets-search': 'https://swapi.dev/api/people/',
        '.species-search': 'https://swapi.dev/api/species/',
        '.starships-search': 'https://swapi.dev/api/starships/',
        '.vehicles-search': 'https://swapi.dev/api/vehicles/'
    }

    $.each(Object.entries(categorieBtns).forEach(([key, value]) => {
        $(key).on('click', () => {
            loader.show();
            getData(value);
        })
    }));

    function scrollToAnchor(aid) {
        var aTag = $("a[name='" + aid + "']");
        $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
    }

    function getData(url) {
        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (data) {
            if (data.count === 0) {
                return render('', 'Not found');
                scrollToAnchor('search-anchor');
            } else {
                render(data,);
                scrollToAnchor('search-anchor');
            }
        }).fail(function (error) {
            render('', error.responseJSON.detail);
        })
    }
    submit.on('click', function (e) {
        let selectVal = select.val();
        let inputVal = input.val();
        loader.show();
        getData(`https://swapi.dev/api/${selectVal}/?search=${inputVal}`);
        e.preventDefault();
    })

    cardBtn.on('click', function () {
        getData(`https://swapi.dev/api/films/${this.id}`)
        scrollToAnchor('search-anchor');
        loader.show();
    })

    function render(data, error) {
        outputContainer.html('');
        // console.log('Data: ' + data);
        if (error) {
            outputContainer.html(`<h3>ERROR: ${error}</h3>`);
        } else {
            if (data.count >= 1) {
                $.each(Object.values(data['results']), (key, value) => {
                    $.each(value, (k, v) => {
                        if (k === 'title' || k === 'name') {
                            outputContainer.append(`<h3>${k}: ${v}</h3>`);
                        }
                        else if (Array.isArray(v)) {
                            outputContainer.append(`<p>${k}: </p>`);
                            $.each(v, (el, val) => {
                                outputContainer.append(`<a class="${el}${key}${k}">${val}</a><br>`);
                                
                                $(`.${el}${key}${k}`).on('click', (event) => {
                                    loader.show();
                                    $.ajax({
                                        url: val,
                                        method: 'GET',
                                    }).done(function (data) {
                                        $(`.${el}${key}${k}`).replaceWith(data.name)
                                        loader.hide();
                                    })
                                })
                            })
                        }
                        else { outputContainer.append(`<p>${k}: ${v}</p><hr>`); }
                    });
                })
            } else {
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'title' || key === 'name') {
                        outputContainer.append(`<h3>${key}: ${value}</h3>`);
                    }
                    else if (Array.isArray(value)) {
                        return;
                    }
                    else { outputContainer.append(`<p>${key}: ${value}</p><hr>`); }
                });
            }
        }
        loader.hide();
    }
}))