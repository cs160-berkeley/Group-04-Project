import Header from 'header';

import {
	whiteSkin,
	bigTextStyle,
	mediumTextStyle,
	smallTextStyle,
	leftButtonColor,
	rightButtonColor
} from 'utils';

let SpecificWindow = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0,
	active: true, skin: whiteSkin,
	contents: [
		new Header(),
		//new Line({
		//	top: 0,
		//	left: 0,
		//	width: 320,
		//	height: 25,
		//	contents: [
		//		new Text({
		//			left: "-155", right: 0,
		//			align: "center",
		//			string: "Locations > " + $.name,
		//			style: smallTextStyle
		//		}),
		//
		//	]
		//}),
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
								screen: "Location",
								name: $.locationName
							});
						}
					})
				}),
				new Text({
					left: "-100", right: 0, top: 8,
					string: $.name,
					style: bigTextStyle
				}),
				new Picture({
					url: "assets/share.png",
					aspect: "fit",
					height: 30,
					left: "-100"
				}),
			]
		}),
		new Container({
			top: 30, width: 230, height: 230,
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
		new Line({
			top: 40, height: 60, width: 320,
			skin: whiteSkin,
			contents: [
				new Container({
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					skin: new Skin({
						stroke: "black",
						borders: {
							left: 2,
							right: 2,
							top: 2,
							bottom: 2
						},
						fill: leftButtonColor
					}),
					contents: [
						new Text({
							left: 0,
							right: 0,
							string: "Image",
							style: mediumTextStyle
						})
					]
				}),
				new Container({
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					active: true,
					skin: new Skin({
						stroke: "black",
						borders: {
							left: 2,
							right: 2,
							top: 2,
							bottom: 2
						},
						fill: rightButtonColor
					}),
					contents: [
						new Text({
							left: 0,
							right: 0,
							string: "Fill",
							style: mediumTextStyle
						})
					],
					behavior: Behavior({
						onTouchEnded: (content) => {
							application.distribute('onFillPressed', {
								r: 10,
								g: 20,
								b: 30,
								a: 50,
							});
						}
					})
				})
			]
		})
	]
}));

export default SpecificWindow;
