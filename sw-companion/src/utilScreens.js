import Header from 'header';
import {
	mediumTextStyle,
	whiteSkin
} from 'utils';

export let WaitingForDeviceScreen = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: whiteSkin,
	contents: [
		new Header(),
		new Label({
			top: 0, bottom: 0, left: 0, right: 0,
			string: "Waiting for Device...",
			style: mediumTextStyle
		})
	]
}));

export let ErrorScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: whiteSkin,
	contents: [
		new Header(),
		new Text({
			top: 50, bottom: 0, left: 0, right: 0,
			string: "Oh no! The device was disconnected from the companion app!",
			style: mediumTextStyle
		}),
		new Picture({
			url: "assets/sad.jpg",
			aspect: "fit",
			height: 45,
			top: 0
		}),
		new Text({
			top: 20, bottom: 0, left: 0, right: 0,
			string: "Please restart the device and companion app.",
			style: mediumTextStyle
		})
	]
}));