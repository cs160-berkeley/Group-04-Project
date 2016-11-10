import Header from 'header';
import Square from 'square';
import SquareContainer from 'squareContainer';

import {
	whiteSkin,
	bigTextStyle
} from 'utils';

let WindowScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	active: true, skin: whiteSkin,
	contents: [
		new Header(),
		new Line({
			top: 20, left: 0, right: 0,
			contents: [
				new Picture({
					url: "assets/back.png",
					aspect: "fit",
					height: 45,
					active: true,
					behavior: Behavior({
						onTouchEnded: (content) => {
							application.distribute('onBackPressed', {
								screen: "Home"
							});
						}
					})
				}),
				new Text({
					left: "-120", right: 0, top: 8,
					string: $.name,
					style: bigTextStyle
				}),
				new Picture({
					url: "assets/add.png",
					aspect: "fit",
					height: 35,
					left: "-120"
				}),
			]
		}),
		new SquareContainer({
			top: 30,
			contents: [
				new Square({
					name: "Window 1",
					type: "Window",
					locationName: $.name
				}),
				new Square({
					name: "Window 2",
					type: "Window",
					locationName: $.name
				})
			],
			
		}),
		new SquareContainer({
			top: 30,
			contents: [
				new Square({
					name: "Window 3",
					type: "Window",
					locationName: $.name
				}),
			]
		})
	]
}));

export default WindowScreen;