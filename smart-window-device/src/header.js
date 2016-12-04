import {
	headerSkin
} from 'utils';

let header = Container.template($ => ({
	top: 0, left: 0, right: 0, height: 60,
	skin: headerSkin,
	contents: [
		new Picture({
			url: "assets/header.png",
			aspect: "fit",
			height: 60
		})
	]
}));

export default header;