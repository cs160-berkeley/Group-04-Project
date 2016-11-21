import {
	whiteSkin
} from 'utils';

let square = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	active: true,
	contents: [
		new Container({
			top: 0, width: 85, height: 85,
			skin: new Skin({
				stroke: "black",
				borders: {
					left: 2,
					right: 2,
					top: 2,
					bottom: 2
				},
				fill: whiteSkin
			})
		}),
		new Text({
			top: 90, left: 0, right: 0,
			string: $.name, style: new Style({
				color: "black",
				font: "20px"
			})
		})
	],
	behavior: Behavior({
		onTouchEnded: (content) => {
			application.distribute('onSquarePressed', $);
		}
	})
}));

export default square;