require.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app',
        jquery: 'vendor/jquery.min'
    }
});

require(['jquery', 'wdf/widget-config'], function($, WidgetConfig) {

    // load the widget configuration
    var config = new WidgetConfig();
    config.on('config-initialized', function(event, data) {
        $('#group1').css('background', config.preferences['Color 1']);
    });
    config.on('config-error', function() {
        $('#group1').text('Error loading preferences');
    });
    config.init();
});