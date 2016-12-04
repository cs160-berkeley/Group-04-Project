import Header from 'header';
import Square from 'square';
import SquareContainer from 'squareContainer';

import {
	whiteSkin,
	bigTextStyle
} from 'utils';

let LocationScreen = Column.template($ => {
	let numWindows = 0;
	let firstSquareContainer = new SquareContainer({
		top: 30
	});
	let secondSquareContainer = new SquareContainer({
		top: 30
	});
	for (let location in $.state.locations) {
		if ($.state.locations.hasOwnProperty(location)) {
			numWindows += 1;
			let square = new Square({
				locationName: location,
				type: "Location",
				state: $.state
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
			new Header($),
			new Line({
				top: 20, left: 0, right: 0,
				contents: [
					new Text({
						left: 0, right: 0, top: 0,
						string: "Locations",
						style: bigTextStyle
					})
				]
			}),
			firstSquareContainer,
			secondSquareContainer
		]
	}
});

export default LocationScreen;