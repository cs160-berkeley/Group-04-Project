let Pins = require("pins");

import Header from 'header';

import {
  whiteSkin,
  bigTextStyle,
  mediumTextStyle,
  smallTextStyle,
  leftButtonColor,
  rightButtonColor
} from 'utils';

/* APPLICATION */

var companionURL = "";

var onFillScreen = false;
let colorString = "";
var updatingAppColorString = new Text({left: 0, right: 0, string: "Updating color on app...", style: mediumTextStyle });

var smallBlackStyle = new Style( { font: "bold 20px", color:"black"});
var mediumBlackStyle = new Style( { font: "25px", color:"black"});

let SpecificWindow = Column.template($ => {
  // colorString = "rgba(" + $.r + "," + $.g + "," + $.b + "," + $.a + ")";
  return {
    top: 0, left: 0, right: 0, bottom: 0,
    active: true, skin: whiteSkin,
    contents: [
      new Header(),
      new Line({
        top: 7, left: 0, right: 0,
        contents: [
          new Text({
            left: "-100", right: 0, top: 8,
            // string: $.name,
            style: bigTextStyle
          }),
        ]
      }),
      new Container({
        top: 3, width: 100, height: 100,
        skin: new Skin({
          stroke: "black",
          borders: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2
          },
          fill: colorString
        })
      }),
      new Line({
        top: 15, height: 35, width: 100,
        skin: whiteSkin,
        contents: [
          new Container({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            active: true,
            skin: new Skin({
              stroke: "black",
              borders: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2
              },
              fill: rightButtonColor
            }),
            contents: [
              new Text({
                left: 0,
                right: 0,
                string: "Fill",
                style: mediumTextStyle
              })
            ],
            behavior: Behavior({
              onTouchEnded: (content) => {
                application.empty();
                onFillScreen = true;
                application.add(new FillWindow());
              }
            })
          })
        ]
      })
    ]
  }
});

let WindowPreview = Container.template($ => ({
  top: 15, width: 100, height: 100,
  skin: new Skin({
    stroke: "green",
    borders: {
      left: 2,
      right: 2,
      top: 2,
      bottom: 2
    },
    fill: colorString
  }),
}));

let FillWindow = Column.template($ => {
  return {
    top: 0, left: 0, right: 0, bottom: 0,
    active: true, skin: whiteSkin,
    contents: [
      new Header(),
      new WindowPreview(),
      new Line({
        top: 15, height: 35, width: 100,
        skin: whiteSkin,
        contents: [
          new Container({
            top: 0, left: 0, right: 0, bottom: 0, active: true,
            skin: new Skin({
              stroke: "black",
              borders: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2
              },
              fill: leftButtonColor
            }),
            contents: [
              new Text({
                left: 0,
                right: 0,
                string: "Sync",
                style: mediumTextStyle
              })
            ],
            behavior: Behavior({
              onTouchEnded: (content) => {
                application.invoke(new Message(companionURL + "syncColorToCompanion"));
                application.empty();
                onFillScreen = false;
                application.add(updatingAppColorString);
                application.invoke(new Message("/delayUpdateColor"));
              }
            })
          })
        ]
      })
    ]
  }
});

Handler.bind("/delayUpdateColor", {
    onInvoke: function(handler, message){
        handler.wait(1200);
    },
    onComplete(handler, message, json){
       trace("done updating companion app \n");
       application.remove(updatingAppColorString);
       application.add(new SpecificWindow());
    }
});

let updatingColorLabel = Label.template($ => ({
	top: 20, string: "Enter this code on the app: ",
	style: smallBlackStyle
}));

let codeLabel = Label.template($ => ({
	top: 30, string: "3F9WINDOW08D",
	style: mediumTextStyle
}));

let MainContainer = Column.template($ => ({
  left: 0, right: 0, top: 0, height: 200, skin: whiteSkin,
  contents: [
    new Header(),
    new updatingColorLabel(),
    new codeLabel()
  ]
}));

var buttonReader;
let pollWindow = (result) => {
	if (result) {
    	trace("Button on.\n");
    	application.empty();
    	application.add(new MainContainer());
    	buttonReader.close();
	} else {
	}
};

var syncButtonReader;
let pollSyncWindow = (result) => {
  if (result) {
      application.empty();
      colorString = "rgba(255, 255, 255, 1)";
      application.add(new SpecificWindow());
      syncButtonReader.close();
  } else {
  }
};

Handler.bind("/setTimeout", {    onInvoke: function(handler, message){        handler.wait(message.requestObject.duration);    }});let setTimeout = function(callback, duration, callbackArgs) {	new MessageWithObject("/setTimeout", {duration}).invoke().then(() => {		if (callback) callback(callbackArgs);	});}
var sharedReader;
var shared = false;
let pollShared = (result) => {
  if (result == 1) {
  	if (!shared) {
  		shared = true;
	  	application.add(new Container({
	  		top: 20, bottom: 20, right: 20, left: 20,
	  		skin: whiteSkin,
	  		contents: [
	  			new Text({
	  				left: 0, right: 0,
	  				string: "This window has been shared!",
	  				style: mediumBlackStyle
	  			})
	  		]
	  	}));
	  	setTimeout(() => { application.remove(application.last) }, 2000)
	}
  } else {
  	shared = false;
  }
};

Handler.bind("/discover", Behavior({
  onInvoke: function(handler, message){
    companionURL = JSON.parse(message.requestText).url;
    trace("CONNECTED TO COMPANION APP\n");
  }
}));

Handler.bind("/forget", Behavior({
  onInvoke: function(handler, message){
    companionURL = "";
    trace("FORGET COMPANION APP\n");
  }
}));

Handler.bind("/syncColorToDevice", Behavior({
  onInvoke: function(handler, message){
    var query = parseQuery(message.query);

    colorString = "rgba(" + query.r + "," + query.g + "," + query.b + "," + query.a + ")";

    application.empty();
    application.add(new SpecificWindow());
  }
}));

Handler.bind("/updateColor", Behavior({
  onInvoke: function(handler, message){
    trace("PRINTING MESSAGE\n");
    trace(message + "\n");
    updatingColorLabel.string = "Updating Color...";
    application.invoke(new Message("/doneUpdating"));
  }
}));

Handler.bind("/doneUpdating", {
    onInvoke: function(handler, message){
        handler.wait(0);
    },
    onComplete: function(handler, message){
        updatingColorLabel.string = " ";
    }
});

let initialContainer = Container.template($ => ({
	top: 0, bottom: 0, left: 0, right: 0,
	skin: whiteSkin,
	contents: [
		new Header(),
		new Text({
			left: 0, right: 0,
			style: mediumTextStyle,
			string: "Waiting for a Window to be Added on the Companion App..."
		})
	]
}));

application.behavior = Behavior({
	gotColor(application, result, alpha) {
    let r = Math.floor(result.r).toString();
    let g = Math.floor(result.g).toString();
    let b = Math.floor(result.b).toString();
    let a = alpha.toFixed(2).toString();
    colorString = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    application.empty();
    application.add(new FillWindow());
	},
	onLaunch(application) {
		Pins.configure({
			isWindowShared: {
		         require: "Digital", // use built-in digital BLL
		         pins: {
		            ground: { pin: 60, type: "Ground" },
		            digital: { pin: 61, direction: "output" },
		         }
		      },
			colorSensor: {
				require: "TCS34725",
				pins: {
					rgb: { sda: 27, clock: 29, integrationTime: 23 },
				}
			},
		      alpha: {
		        require: "Analog", //"Analog" if using the built-in BLL
		        pins: {
		          analog: { pin: 56 },
		          ground: { pin: 55, type: "Ground" },
		          power: { pin: 57, type: "Power", voltage: 3.3 }
		        }
		      },
		      isWindowActive: {
		         require: "Digital", // use built-in digital BLL
		         pins: {
		            ground: { pin: 51, type: "Ground" },
		            digital: { pin: 52, direction: "output" },
		         }
		      },
          windowSynched: {
             require: "Digital", // use built-in digital BLL
             pins: {
                ground: { pin: 53, type: "Ground" },
                digital: { pin: 54, direction: "output" },
             }
          },
		}, success => this.onPinsConfigured(application, success));
    application.discover("sw-companion.project.kinoma.marvell.com");
    application.shared = true;
    application.skin = whiteSkin;
	},
	onPinsConfigured(application, success) {
		application.add(new initialContainer());
		if (success) {
			Pins.repeat("/colorSensor/getColor", 500, result => {
				if (onFillScreen) {
					Pins.invoke("/alpha/read", value => {
		            	this.gotColor(application, result, value);
		        	});	
				}  
      	});
			Pins.share("ws", {zeroconf: true, name: "smart-window-pins"});
			buttonReader = Pins.repeat("/isWindowActive/read", 200, pollWindow);
      		syncButtonReader = Pins.repeat("/windowSynched/read", 200, pollSyncWindow);
      		sharedReader = Pins.repeat("/isWindowShared/read", 1000, pollShared);
		}
		else
			trace("failed to configure pins\n");
	},
  onQuit(application) {
    application.shared = false;
    trace("URL: " + companionURL + "\n");
    application.forget("sw-companion.project.kinoma.marvell.com");
  }
});

