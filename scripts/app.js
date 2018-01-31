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
    function getTimeIntervals(t){
        intervals = [];
        toMillisecconds = 60000;

        // get first interval
        intervals.push(t * toMillisecconds);

        // get second interval
        intervals.push(t * (toMillisecconds * 2));

        // get third interval
        intervals.push(t * (toMillisecconds * 3));

        return intervals;
    }

    config.on('config-initialized', function(event, data) {

        // Loop through all the widget preferences, find the colors, and add them to array. Also get the timer interval and save it to a var to work with.
        var colors = [];
        var timerInterval;
        for (var preferenceKey in config.preferences) {
            if(preferenceKey.toLowerCase().indexOf('color') >= 0) {
                colors.push(config.preferences[preferenceKey]);
            } else if(preferenceKey.toLowerCase().indexOf('time') >= 0) {
                timerInterval = config.preferences[preferenceKey];
            }
        }

        // get all times together
        var intervals = getTimeIntervals(timerInterval);
        console.log(intervals);

        // countdown timer 1 second = 1000 milliseconds. 60 seconds (1 minute) = 60000 milliseconds. 30 minutes = 180000 milliseconds.
        var n = timerInterval;

        // function to create per minute countdown clock
        var tm = setInterval(countDown, 60000);

        function countDown(elem){
            n--;
            if(n === 0){
                clearInterval(tm);
            }
            $(elem).find('.time-remain').text(n + ' minutes remaining');
            console.log(n);
        }


        // Get all the divs we're gonna work with, get three random colors, then set them colors
        $('.time-block').each(function(index) {
            var that = $(this);
            color = getRandomColor(colors);
            setColor(color, that);
            switch(index) {
                case 0:
                    that.find('.time-remain').text(timerInterval + ' minutes remaining');
                    break;
                case 1:
                    countDown(that);
                    break;
                case 2:
                    that.find('.time-remain').text(timerInterval * 3 + ' minutes remaining');
                    break;
            }
        });




    });
    config.on('config-error', function() {
        $('#error').text('Error loading SignageLive widget preferences');
    });

    config.init();

});