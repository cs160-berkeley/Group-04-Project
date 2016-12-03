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
import AddWindowScreen from 'addWindow';
import SuccessScreen from 'successWindow';
import FillScreen from 'fillScreen';
import Pins from "pins";
import Header from 'header';
import { NotificationScreenTemplate } from "notificationScreen"
import { NotificationScreenNotificationTemplate } from "notificationScreen"
import ShareWindow from 'shareWindow';

import {
	WaitingForDeviceScreen,
	ErrorScreen
} from 'utilScreens';

import {
	mediumTextStyle,
	whiteSkin
} from 'utils';

var deviceURL = "";
var currentLocation = "";
var currentWindow = "";

Handler.bind("/discover", Behavior({
  onInvoke: function(handler, message){
    deviceURL = JSON.parse(message.requestText).url;
    trace("CONNECTED TO DEVICE\n");
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

let state = {
	locations: {
		"Office": {
			"Window 1": {
				r: 255,
				g: 0,
				b: 0,
				a: 0.5,
	      		updatingColorFromDevice: true,
			},
			"Window 2": {
				r: 0,
				g: 100,
				b: 48,
				a: 0.9,
	      		updatingColorFromDevice: true,
			}
		},
		"Home": {
			"Window 1": {
				r: 185,
				g: 94,
				b: 23,
				a: 0.8,
	      		updatingColorFromDevice: true,
			}
		}
	}
};

Handler.bind("/syncColorToCompanion", Behavior({
  onInvoke: function(handler, message){
    // application.distribute("onReadSensor", data);

    remotePins.invoke("/colorSensor/getColor", result => {
      remotePins.invoke("/alpha/read", value => {
        state.locations[currentLocation][currentWindow].r = result.r;
        state.locations[currentLocation][currentWindow].g = result.g;
        state.locations[currentLocation][currentWindow].b = result.b;
        state.locations[currentLocation][currentWindow].a = value;
        application.empty();
        application.add(new SpecificWindow({ state: state, locationName: currentLocation, windowName: currentWindow }));
      });
    });

    // updatingColorLabel.string = "Updating Color...";
    // application.invoke(new Message("/doneSyncingColor"));
  }
}));

let remotePins;

application.behavior = Behavior({
	onAddWindow: (container, data) => {
		application.empty();
		remotePins.invoke("/isWindowActive/write", 1);
		application.add(new AddWindowScreen(data));
	},
	onSuccessAdd: (container, data) => {
		application.empty();
    	remotePins.invoke("/windowSynched/write", 1);
		application.add(new SuccessScreen(data));
	},
	onSuccessShare: (container, data) => {
 		application.empty();
 		//remotePins.invoke("", 1);
 		application.add(new SuccessScreen(data));
 	},
 	onShareWindow: (container, data) => {
 		application.empty();
 		application.add(new ShareWindow(data));
 	},
  	onFinishSuccess:(container, data) => {
		application.empty();
    currentLocation = data.locationName;
    currentWindow = data.windowName;
		application.add(new SpecificWindow(data));
	},
	onSquarePressed: (container, data) => {
		application.empty();
		switch (data.type) {
			case "Location":
				application.add(new WindowScreen(data));
				break;
			case "Window":
				application.add(new SpecificWindow(data));
        currentLocation = data.locationName;
        currentWindow = data.windowName;
				break;
			default:
				application.add(new LocationScreen(data));
		}
	},
	onBackPressed: (container, data) => {
		application.empty();
		switch (data.screen) {
			case "Location":
				application.add(new WindowScreen(data));
				break;
			case "Home":
				application.add(new LocationScreen(data));
				break;
			case "Specific Window":
        currentLocation = data.locationName;
        currentWindow = data.windowName;

        trace(currentLocation + "\n");
        trace(currentWindow + "\n");

        application.invoke(new Message(deviceURL + "syncColorToDevice?" + serializeQuery({
          r: state.locations[currentLocation][currentWindow].r,
          g: state.locations[currentLocation][currentWindow].g,
          b: state.locations[currentLocation][currentWindow].b,
          a: state.locations[currentLocation][currentWindow].a
        })));
				application.add(new SpecificWindow(data));
				break;
			default:
				application.add(new LocationScreen(data));
		}
	},
	onFillPressed: (container, data) => {
		application.empty();
    application.add(new FillScreen({ state: state, locationName: currentLocation, windowName: currentWindow }));
	},


  onLaunch(application) {
    application.add(new WaitingForDeviceScreen());
    let discoveryInstance = Pins.discover(
        connectionDesc => {
          trace("ah");
            if (connectionDesc.name == "smart-window-pins") {
                trace("Connecting to remote pins\n");
                remotePins = Pins.connect(connectionDesc);
                application.empty();
                application.add(new LocationScreen({ state: state }));
            }
        },
        connectionDesc => {
            if (connectionDesc.name == "smart-window-pins") {
                trace("Disconnected from remote pins\n");
                remotePins = undefined;
                application.empty();
                application.add(new ErrorScreen());
            }
        }
    );
    application.shared = true;
    application.discover("sw-device.project.kinoma.marvell.com");
  },
  onQuit(application) {
     trace("URL: " + deviceURL + "\n");
     application.shared = false;
     application.forget("sw-device.project.kinoma.marvell.com");
  },
});
