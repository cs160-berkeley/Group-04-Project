import {
	headerSkin
} from 'utils';

let header = Container.template($ => ({
	top: 0, left: 0, right: 0, height: 60,
	skin: headerSkin,
	contents: [
		new Picture({
			url: "assets/window.png",
			aspect: "fit",
			height: 35,
			left: 0,
			right: 240
		}),
		new Text({
			left: 65, right: 0,
			string: "Smart Window",
			style: new Style({
				color: "white",
				font: "bold 35px"
			})
		})
	]
}));

export default header;