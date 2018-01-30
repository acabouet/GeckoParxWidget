require.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app',
        jquery: 'vendor/jquery.min',
        ntc: 'vendor/ntc'
    }
});

require(['jquery', 'wdf/widget-config', 'ntc'], function($, WidgetConfig) {

    // load the widget configuration
    var config = new WidgetConfig();

    // function to apply a color to the background of a div and also get it's name for displaying in the .color span
    function setColor($color, $div) {
        $n_match = ntc.name($color);
        $div.css('background', $color);
        $div.find('span.color').text($n_match[1]);
    }


    // Get a random number 0 to 9;
    function getRandomNumber(arr) {
        if($.isArray(arr)) {
            return Math.floor(Math.random()*arr.length);
        } else {
            return Math.floor(Math.random() * 9);
        }
    }


    config.on('config-initialized', function(event, data) {


        // Loop through all the widget preferences, find the colors, and add them to array. Also get the time interval and save it to a var to work with.
        var colors = [];
        var timeInterval;
        for (var preferenceKey in config.preferences) {
            if(preferenceKey.toLowerCase().indexOf('color') >= 0) {
                colors.push(config.preferences[preferenceKey]);
            } else if(preferenceKey.toLowerCase().indexOf('time') >= 0) {
                timeInterval = config.preferences[preferenceKey];
            }
        }

        // Get all the divs we're gonna work with, get three random colors, then set them colors
        $('.time-block').each(function() {
            rand = getRandomNumber(colors);
            setColor(colors[rand], $(this));
        });


    });
    config.on('config-error', function() {
        $('#error').text('Error loading SignageLive widget preferences');
    });
    config.init();
});