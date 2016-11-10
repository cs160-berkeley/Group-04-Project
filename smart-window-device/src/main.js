let Pins = require("pins");

/* APPLICATION */

var smallBlackStyle = new Style( { font: "bold 20px", color:"black"});

var updatingColorLabel = new Label({left:0, right:0, top:10, string: "HERE", style: smallBlackStyle});
let MainContainer = Column.template($ => ({
  left: 10, right: 10, bottom: 10, height: 40, skin: backgroundSkin,
  contents: [ updatingColorLabel ]
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
        handler.wait(4000);
    },
    onComplete: function(handler, message){
        updatingColorLabel.string = " ";
    }
});

application.behavior = Behavior({
	gotColor(application, result, alpha) {
    let r = Math.floor(result.r).toString();
    let g = Math.floor(result.g).toString();
    let b = Math.floor(result.b).toString();
    let a = alpha.toFixed(2).toString();
    let color = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		application.skin = new Skin(color);
	},
	onLaunch(application) {
		Pins.configure({
			colorSensor: {
				require: "TCS34725",
				pins: {
					rgb: { sda: 27, clock: 29, integrationTime: 23 },
					// led: { pin: 21 }
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
		}, success => this.onPinsConfigured(application, success));
    application.shared = true;
	},
	onPinsConfigured(application, success) {
		if (success) {
			Pins.repeat("/colorSensor/getColor", 33, result => {
        Pins.invoke("/alpha/read", value => {
          this.gotColor(application, result, value);
        });
      });

			Pins.share("ws", {zeroconf: true, name: "smart-window-pins"});
		}
		else
			trace("failed to configure pins\n");
	},
  onQuit(application) {
    application.shared = false;
  }
});

