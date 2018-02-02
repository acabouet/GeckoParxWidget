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

    // Get ID number of time-block from the div id (e.g. id '#group1' returns 1)
    function getBlockId(id) {
        idnumber = id.slice(-1);
        return idnumber;
    }

    // Get timeInterval, timeInterval * 2, and timeInterval * 3 - for first, second, and third groups
    // 1 second = 1000 milliseconds. 60 seconds (1 minute) = 60000 milliseconds. 30 minutes = 180000 milliseconds.
    // Get the timer intervals in increments (1, x2, x3) and then get those same intervals in milliseconds
    function getTimeIntervals(t){
        var intervals = {};
        toMillisecconds = 60000;

        for (i = 1; i <= 9; i++) {
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
        var tm = {};
        var timeBlocks = $('.time-block');

        for (var preferenceKey in config.preferences) {
            if(preferenceKey.toLowerCase().indexOf('color') >= 0) {
                colors.push(config.preferences[preferenceKey]);
            } else if(preferenceKey.toLowerCase().indexOf('time') >= 0) {
                timerInterval = config.preferences[preferenceKey];
            }
        }

        // get all intervals together
        var intervals = getTimeIntervals(timerInterval);

        // Get all the divs we're gonna work with, get three random colors, then set them colors
        timeBlocks.each(function() {
            var that = $(this);
            var color = getRandomColor(colors);
            setColor(color, that);

            // Set appropriate countdown timer for each wristband color
            var id = that.prop('id');
            var position = getBlockId(id);
            var interval = intervals[position].minutes;

            // Get and display a countdown clock and current time + the interval so we can show when this wristband color's time will be up
            var now = new Date();
            var nextTime = now.getMinutes() + interval;
            now.setMinutes(nextTime);
            var timeUp = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            $(that).find('.time-remain').text(interval + ' minutes remaining');
            $(that).find('.time-up').text(timeUp);

            tm[position] = setInterval(function(){
                interval--;
                if(interval === 1) {
                    $(that).find('.time-remain').text('Your time is up!');
                } else if(interval === 0){
                    $(that).slideUp("slow", function() {
                        $(that).remove();
                        $('.time-block:lt(3)').show();
                    });
                    clearInterval(tm[position]);
                } else {
                    $(that).find('.time-remain').text(interval + ' minutes remaining');
                }
            }, 60000);

            $('.time-block').hide();
            $('.time-block:lt(3)').show();

        });


    });
    config.on('config-error', function() {
        $('#error').text('Error loading SignageLive widget preferences');
    });

    config.init();

});