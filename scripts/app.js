// @TODO - take the colors out of the array once they're set for no repeats.

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

    // Get random color
    function getRandomColor(arr){
        arr.sort(function() {
            return Math.round(Math.random());
        });
        return arr.pop();
    }

    // Get timeInterval, timeInterval * 2, and timeInterval * 3 - for first, second, and third groups
    // 1 second = 1000 milliseconds. 60 seconds (1 minute) = 60000 milliseconds. 30 minutes = 180000 milliseconds.
    // Get the timer intervals in increments (1, x2, x3) and I need to get those same intervals in milliseconds
    function getTimeIntervals(t){
        var intervals = {};
        toMillisecconds = 60000;

        for (i = 1; i <= 3; i++) {
            intervals[i] = {
                'minutes' : t * i,
                'milliseconds' : (t * i) * toMillisecconds
            }
        }

        return intervals;
    }

    config.on('config-initialized', function(event, data) {

        // Loop through all the widget preferences, find the colors, and add them to array. Also get the timer interval and save it to a var to work with.
        var colors = [];
        var timerInterval;
        var position;
        var tm = {};
        var timeBlocks = {
            0: document.getElementById('group1'),
            1: document.getElementById('group2'),
            2: document.getElementById('group3')
        };

        for (var preferenceKey in config.preferences) {
            if(preferenceKey.toLowerCase().indexOf('color') >= 0) {
                colors.push(config.preferences[preferenceKey]);
            } else if(preferenceKey.toLowerCase().indexOf('time') >= 0) {
                timerInterval = config.preferences[preferenceKey];
            }
        }

        // get all times together
        var intervals = getTimeIntervals(timerInterval);

        function getBlockId(id) {
            idnumber = id.slice(-1);
            return idnumber;
        }

        // Get all the divs we're gonna work with, get three random colors, then set them colors
        $('.time-block').each(function() {
            var that = $(this);
            var color = getRandomColor(colors);
            setColor(color, that);

            // Set appropriate countdown timer for each div
            var id = that.prop('id');
            var position = getBlockId(id);
            var interval = intervals[position].minutes;


            // This sets a working timer but the same for all three divs for some reason
            $(that).find('.time-remain').text(interval + ' minutes remaining');

            tm[position] = setInterval(function(){
                interval--;
                if(interval === 0){
                    clearInterval(tm[position]);
                }

                $(that).find('.time-remain').text(interval + ' minutes remaining');
                console.log(interval);
            }, 60000)
        });

    });
    config.on('config-error', function() {
        $('#error').text('Error loading SignageLive widget preferences');
    });

    config.init();

});