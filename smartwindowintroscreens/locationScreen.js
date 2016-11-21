import Header from 'header';
import Square from 'square';
import SquareContainer from 'squareContainer';

import {
	whiteSkin,
	bigTextStyle
} from 'utils';

let LocationScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	active: true, skin: whiteSkin,
	contents: [
		new Header(),
		new Line({
			top: 20, left: 0, right: 0,
			contents: [
				new Text({
					left: 0, right: 0, top: 0,
					string: "Locations",
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
			type: "Location",
			contents: [
				new Square({
					name: "Office",
					type: "Location"
				}),
				new Square({
					name: "Museum",
					type: "Location"
				})
			]
		}),
		new SquareContainer({
			top: 30,
			contents: [
				new Square({
					name: "Exhibit",
					type: "Location"
				}),
				new Square({
					name: "Home",
					type: "Location"
				})
			]
		})
	]
}));

export default LocationScreen;