/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */

import LocationScreen from 'locationScreen';
import WindowScreen from 'windowScreen';
import SpecificWindow from 'specificWindow';
import Pins from "pins";
import Header from 'header';

import {
  CircleSlider
} from 'slider';

import {
    Button,
    ButtonBehavior,
} from 'buttons';

/* GLOBAL VARIABLE SLIDERS */
var redVal = 0;
var greenVal = 0;
var blueVal = 0;
var alphaVal = 0;

var updatingColor = false;

var deviceURL = "";

var whiteSkin = new Skin( { fill:"white" } );
var titleStyle = new Style( { font: "bold 28px", color:"black" } );
var valueStyle = new Style( { font: "24px", color:"black"});

Handler.bind("/discover", Behavior({
  onInvoke: function(handler, message){
    deviceURL = JSON.parse(message.requestText).url;
    trace("CONNECTED TO DEVICE\n");
    trace(deviceURL + " DEVICE URL \n");
  }
}));
Handler.bind("/delay", {
    onInvoke: function(handler, message){
        handler.wait(4000);
    },
    onComplete: function(handler, message){
    trace("done with delay \n");
    }
});

Handler.bind("/forget", Behavior({
  onInvoke: function(handler, message){
    deviceURL = "";
    trace("FORGET DEVICE\n");
  }
}));

var rgbLabel = new Label({height:30, string:"RGB", style: valueStyle});
var alphaLabel = new Label({height:30, string:"Opacity", style: valueStyle});
let circleRadius = 10;
let margin = 10;
let backgroundSkin = new Skin({ fill: '#F0F0F0' });
let ColorSlider = CircleSlider.template($ => ({ left: margin, right: margin, top: margin, bottom: margin }));

let redSliderData = {
  label:"red",
  min:0,
  max:1,
  value:0,
  circleColor: "red",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let greenSliderData = {
  label:"green",
  min:0,
  max:1,
  value:0,
  circleColor: "green",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let blueSliderData = {
  label: "blue",
  min:0,
  max:1,
  value:0,
  circleColor: "blue",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let alphaSliderData = {
  label: "alpha",
  min:0,
  max:1,
  value:0,
  circleColor: "black",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

var rgbLabel = new Label({height:30, string:"RGB", style: valueStyle});
var sampleWindow = Container.template($ => ({
  bottom: 38, width: 100, height: 100,
  skin: new Skin({
    stroke: "black",
    borders: {
      left: 2,
      right: 2,
      top: 2,
      bottom: 2
    },
    fill: $.windowFillColor
  })
}));

Handler.bind("/delayReadPins", {
    onInvoke: function(handler, message){
        handler.wait(4000);
    },
    onComplete(handler, message, json){
       // trace("done waiting \n");
       // updatingColor = false;
    }
});

let MainContainer = Column.template($ => ({
  top: 0, left: 0, right: 0,
  active: true,
  contents: [
    new Header(),
    new Column({ top: 10, left: 10, right: 10, height: 230, skin: backgroundSkin,
      contents: [
        rgbLabel,
        redColorSlider,
        greenColorSlider,
        blueColorSlider,
        alphaLabel,
        alphaColorSlider
      ],
      Behavior: class extends Behavior {
        onChanged(canvas, value, color) {
          if (color == "red") {
            redVal = Math.floor(value * 255);
          } else if (color == "green") {
            greenVal = Math.floor(value * 255);
          } else if (color == "blue") {
            blueVal = Math.floor(value * 255);
          } else if (color == "alpha") {
            alphaVal = value.toFixed(2);
          }

          let colorString = "rgba(" + redVal + "," + greenVal + "," + blueVal + "," + alphaVal + ")";
          // trace(colorString + "\n");
          // application.skin = new Skin(colorString);
          application.remove(curSampleWindow);
          curSampleWindow = new sampleWindow({windowFillColor: colorString});
          application.add(curSampleWindow);

          // trace(deviceURL + "updateColor\n");
          updatingColor = true;
          // application.invoke(new Message(deviceURL + "updateColor"), Message.JSON);
          // application.invoke(new Message("/delayReadPins"));
        }
      },
    }),
  ],
}));

let remotePins;
let redColorSlider = new ColorSlider(redSliderData);
let greenColorSlider = new ColorSlider(greenSliderData);
let blueColorSlider = new ColorSlider(blueSliderData);
let alphaColorSlider = new ColorSlider(alphaSliderData);

let curSampleWindow;

application.behavior = Behavior({
	onSquarePressed: (container, data) => {
		application.empty();
		switch (data.type) {
			case "Location":
				application.add(new WindowScreen(data));
				break;
			case "Window":
				application.add(new SpecificWindow(data));
				break;
			default:
				application.add(new LocationScreen());
		}
	},
	onBackPressed: (container, data) => {
		application.empty();
		switch (data.screen) {
			case "Location":
				application.add(new WindowScreen(data));
				break;
			case "Home":
				application.add(new LocationScreen());
				break;
			default:
				application.add(new LocationScreen());
		}
	},
	onFillPressed: (container, data) => {
		application.empty();
    let mainContainer = new MainContainer();
    application.add( mainContainer );

    let r = Math.floor(data.r).toString();
    let g = Math.floor(data.g).toString();
    let b = Math.floor(data.b).toString();
    let a = data.a.toFixed(2).toString();
    let colorString = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    curSampleWindow = new sampleWindow({windowFillColor: colorString});
    application.add(curSampleWindow);
	},
	onLaunch(application) {
    let discoveryInstance = Pins.discover(
        connectionDesc => {
            if (connectionDesc.name == "smart-window-pins") {
                trace("Connecting to remote pins\n");
                remotePins = Pins.connect(connectionDesc);
                application.distribute("onReadSensor");
            }
        },
        connectionDesc => {
            if (connectionDesc.name == "smart-window-pins") {
                trace("Disconnected from remote pins\n");
                remotePins = undefined;
            }
        }
    ),
    // application.discover("smart-window-device.project.kinoma.marvell.com");
    // let mainContainer = new MainContainer();
    // application.add( mainContainer );
    // let colorString = "rgba(" + redVal + "," + greenVal + "," + blueVal + "," + alphaVal + ")";
    // application.skin = new Skin("white");
    // application.remove(curSampleWindow);
    // curSampleWindow = new sampleWindow({windowFillColor: colorString});
    // application.add(curSampleWindow);
  },
  onQuit(application) {
     trace("URL: " + deviceURL + "\n");
     // application.forget("smart-window-device.project.kinoma.marvell.com");
  },
  gotColor(application, result, alpha) {
    let r = Math.floor(result.r).toString();
    let g = Math.floor(result.g).toString();
    let b = Math.floor(result.b).toString();
    let a = alpha.toFixed(2).toString();
    let colorString = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    // application.skin = new Skin(colorString);
    application.remove(curSampleWindow);
    curSampleWindow = new sampleWindow({windowFillColor: colorString});
    application.add(curSampleWindow);
  },
  onReadSensor(application, value) {
    remotePins.repeat("/colorSensor/getColor", 33, result => {
        remotePins.invoke("/alpha/read", value => {
          if (!updatingColor) {
            this.gotColor(application, result, value);
          }
        });
      });
  }
});

application.add(new LocationScreen());
