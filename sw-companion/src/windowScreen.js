import Header from 'header';
import Square from 'square';
import SquareContainer from 'squareContainer';

import {
	whiteSkin,
	bigTextStyle
} from 'utils';

let WindowScreen = Column.template($ => {
	let numWindows = 0;
	let firstSquareContainer = new SquareContainer({
		top: 30
	});
	let secondSquareContainer = new SquareContainer({
		top: 30
	});
	
	let windows = $.state.locations[$.locationName];
	for (let window in windows) {
		if (windows.hasOwnProperty(window)) {
			numWindows += 1;
			let colorData = windows[window];
			let r = Math.floor(colorData.r).toString();
			let g = Math.floor(colorData.g).toString();
			let b = Math.floor(colorData.b).toString();
			let a = colorData.a.toString();
			let colorString = "rgba(" + r + "," + g + "," + b + "," + a + ")";
			let square = new Square({
				windowName: window,
				type: "Window",
				state: $.state,
				locationName: $.locationName,
				fill: colorString
			});
			if (numWindows > 2) {
				secondSquareContainer.add(square);
			} else {
				firstSquareContainer.add(square);
			}
		}
	}
	return {
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
									screen: "Home",
									state: $.state
								});
							}
						})
					}),
					new Text({
						left: "-120", right: 0, top: 8,
						string: $.locationName,
						style: bigTextStyle
					}),
					new Picture({
						url: "assets/add.png",
						aspect: "fit",
						height: 35,
						left: "-120",
						active: true,
						behavior: Behavior({
							onTouchEnded: (content) => {
								application.distribute('onAddWindow', {
									locationName: $.locationName,
									state: $.state,
									numWindows: numWindows
								});
							}
						})
					}),
				]
			}),
			firstSquareContainer,
			secondSquareContainer
		]
	}
});

export default WindowScreen;