var myApp = SAGE2_App.extend( {
    init: function(data) {
        // data: contains initialization parameters, such as `x`, `y`, `width`, `height`, and `date`
        this.SAGE2Init(<html-tag container for your app (eg. 'img', 'canvas')>, data);

        this.resizeEvents = "continuous";//see below for other options

        // initialize your variables
        this.myvalue = 5.0;
    },

    //load function allows application to begin with a particular state.  Needed for remote site collaboration.
    load: function(date) {
        //your load code here- update app based on this.state
    },

    draw: function(date) {
        // application specific 'draw'
        this.log("Draw");
    },

    resize: function(date) {
        // to do:  may be a super class resize
        // or your resize code here
        this.refresh(date); //redraw after resize
    },

    event: function(type, position, user, data, date) {
        // see event handling description below

        // may need to update state here

        // may need to redraw
        this.refresh(date);
    },

    move: function(date) {
        // this.sage2_x, this.sage2_y give x,y position of upper left corner of app in global wall coordinates
                // this.sage2_width, this.sage2_height give width and height of app in global wall coordinates
                // date: when it happened
        this.refresh(date);
       },

    quit: function() {
        // It's the end
        this.log("Done");
    }
});
