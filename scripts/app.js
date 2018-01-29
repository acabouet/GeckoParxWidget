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
    var n_match;
    config.on('config-initialized', function(event, data) {

        // For 1st Box
        $('#group1').css('background', config.preferences['Color 1']);

        // Get name of color preference from hex-code
        n_match = ntc.name(config.preferences['Color 1']);
        $('#group1').find('span.color').text(n_match[1]);


    });
    config.on('config-error', function() {
        $('#group1').text('Error loading preferences');
    });
    config.init();
});