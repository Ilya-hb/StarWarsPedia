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
    // const categorieBtn = ['.films-search', '.people-search', '.planets-search', '.species-search', '.starships-search', '.vehicles-search'];
    // const links = ['https://swapi.dev/api/films/', 'https://swapi.dev/api/people/', 'https://swapi.dev/api/planets/', 'https://swapi.dev/api/species/', 'https://swapi.dev/api/starships', 'https://swapi.dev/api/vehicles/'];
    let outputContainer = $('#output-container');
    const categorieBtns = {
        '.films-search': 'https://swapi.dev/api/films/',
        '.people-search': 'https://swapi.dev/api/people/',
        '.planets-search': 'https://swapi.dev/api/people/',
        '.species-search': 'https://swapi.dev/api/species/',
        '.starships-search': 'https://swapi.dev/api/starships',
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
            } else {
                render(data,);
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
                        // console.log(`key:${k} \nvalue: ${v}`);
                        if (k === 'title' || k === 'name') {
                            outputContainer.append(`<h3>${k}: ${v}</h3>`);
                        }
                        else if (Array.isArray(v)) {
                            return;
                        }
                        else { outputContainer.append(`<p>${k}: ${v}</p><hr>`); }

                    });
                })

            } else {
                // console.log('Data is not an Array!');
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
        scrollToAnchor('search-anchor');
    }

}))