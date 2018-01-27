var body = $('body'),
    weatherWidget = $('.weather-widget'),
    weatherIcon = $('.weather-icon'),
    weatherInfo = $('.weather-info');

weatherWidget.hide();

$.ajax({
        url: 'https://ipinfo.io/json',
        datatype: 'json'
    })
    .done(function (data, status, jqXHR) {
        var city = data.city,
            country = data.country;
        $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&units=metric&appid=5bb9772ce14141c33db6912d932ed466',
                datatype: 'json'
            })
            .done(function (data, testStatus, jqXHR) {
                success(data);
            })
            .fail(function (data, testStatus, jqXHR) {
                fail('An unexpected error occured, please refresh the page or check back later.');
            });
    })
    .fail(function (data, testStatus, jqXHR) {
        fail('An unexpected error occured, please refresh the page or check back later.');
    })
    .always(function() {
        $(".container").fadeIn(400).css("display", "flex");
    });

function success(data) {
    var icon = parseInt(data.weather[0].icon),
        template, gradient, color;
    switch (icon) {
    case 1:
        template = $('script[data-template="clear-sky"]').html();
        gradient = 'clear-sky-bg';
        color = 'clear-sky-color';
        break;
    case 2:
        template = $('script[data-template="few-clouds"]').html();
        gradient = 'few-clouds-bg';
        color = 'few-scattered-broken-clouds-color';
        break;
    case 3:
    case 4:
        template = $('script[data-template="scattered-broken-clouds"]').html();
        gradient = 'scattered-broken-clouds-bg';
        color = 'few-scattered-broken-clouds-color';
        break;
    case 9:
        template = $('script[data-template="shower-rain"]').html();
        gradient = 'shower-rain-bg';
        color = 'shower-rain-color';
        break;
    case 10:
        template = $('script[data-template="rain"]').html();
        gradient = 'rain-bg';
        color = 'shower-rain-color';
        break;
    case 11:
        template = $('script[data-template="thunderstrom"]').html();
        gradient = 'thunderstrom-bg';
        color = 'thunderstorm-color';
        break;
    case 13:
        template = $('script[data-template="snow"]').html();
        gradient = 'snow-bg';
        color = 'snow-color';
        break;
    case 50:
        template = $('script[data-template="mist"]').html();
        gradient = 'mist-bg';
        color = 'mist-color';
        break;
    }

    body.removeClass().addClass(gradient);
    $('#scale').removeClass().addClass(color);
    weatherIcon.html(template);

    $('#temp').html(Math.round(data.main.temp));
    $('.weather-info-desc').html(data.weather[0].description);
    $('#city').html(data.name);
    $('#country').html(data.sys.country);

    weatherWidget.fadeIn().css("display", "flex");
}

function fail(message) {
    weatherIcon.removeClass().addClass('hide');
    weatherInfo.removeClass().addClass('hide');
    $('footer').removeClass().addClass('hide');

    body.removeClass().addClass('error-bg');
    $('.error-message h4:nth-child(2)').text(message);
    $('.error-message').removeClass('hide');

    weatherWidget.fadeIn().css("display", "flex");
}

function celsiusConverter(convert, value) {
    return Math.round(convert ? (Number(value) * 9 / 5) + 32 : (Number(value) - 32) * 5 / 9);
}

$('#scale').on('click', function (e) {
    var temp = $(this).siblings('#temp'),
        scale = $(this).text();

    if (scale == 'C') {
        temp.text(celsiusConverter(true, temp.text()));
        $(this).text('F');
    } else {
        temp.text(celsiusConverter(false, temp.text()));
        $(this).text('C');
    }

    e.stopPropagation();
    e.preventDefault();
});
