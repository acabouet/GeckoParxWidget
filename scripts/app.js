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

    // function to get a random color and apply the *same* color to the background and also get it's name for displaying in the .color span
    function setColor($color, $div) {
        $n_match = ntc.name($color);
        $div.css('background', $color);
        $div.find('span.color').text($n_match[1]);
    }

    config.on('config-initialized', function(event, data) {

        // Loop through all the widget preferences, find the colors, and add them to array
        var colors = [];
        for (var preferenceKey in config.preferences) {
            if(preferenceKey.toLowerCase().indexOf('color') >= 0) {
                colors.push(config.preferences[preferenceKey]);
            }
        }
        // Get a random number between 0 and 8 (based on length of colors array which is 9 colors)
        var rand = Math.floor(Math.random()*colors.length);

        // Set color of first div
        setColor(colors[rand], $('#group1'));


    });
    config.on('config-error', function() {
        $('#error').text('Error loading SignageLive widget preferences');
    });
    config.init();
});