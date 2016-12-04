import Header from 'header';

import {
  CircleSlider
} from 'slider';

import {
    Button,
    ButtonBehavior,
} from 'buttons';

import {
	bigTextStyle,
	whiteSkin,
	mediumTextStyle,
	colorButtonColor,
	whiteTextStyle
} from 'utils';

var titleStyle = new Style( { font: "bold 28px", color:"black" } );
var valueStyle = new Style( { font: "24px", color:"black"});

let circleRadius = 10;
let backgroundSkin = new Skin({ fill: '#F0F0F0' });
let ColorSlider = CircleSlider.template($ => ({
	left: 10, right: 10, top: 10, bottom: 10
}));


let WindowPreview = Line.template($ => ({
	bottom: 15,
	skin: whiteSkin,
	contents: [
		new Container({
			width: 100, height: 100,
			skin: new Skin({
				stroke: "green",
			    borders: {
			      left: 2,
			      right: 2,
			      top: 2,
			      bottom: 2
			    },
			    fill: $.windowFillColor
			})
		}),
		new Container({
            left: 50, width: 70, height: 40, active: true,
            skin: new Skin({
              stroke: "black",
              borders: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2
              },
              fill: colorButtonColor
            }),
            contents: [
              new Text({
                left: 0,
                right: 0,
                string: "Set",
                style: whiteTextStyle
              })
            ],
            behavior: Behavior({
              onTouchEnded: (content) => {
                application.distribute('onBackPressed', {
        					screen: "Specific Window",
        					windowName: windowName,
        					locationName: locationName,
        					state: state
        				});
              }
            })
	     })
	]
}));

let SliderContainer = Column.template($ => ({
  top: 0, left: 0, right: 0,
  active: true,
  contents: [
    new Header({state: state}),
    new Line({
		top: 10, left: 0, right: 0,
		contents: [
			new Picture({
				url: "assets/back.png",
				aspect: "fit",
				height: 45,
				active: true,
				behavior: Behavior({
					onTouchEnded: (content) => {
						application.distribute('onBackPressed', {
							screen: "Specific Window",
							windowName: windowName,
							locationName: locationName,
							state: state
						});
					}
				})
			}),
			new Text({
				left: "-70", right: 0, top: 8,
				string: "Edit " + $.windowName,
				style: bigTextStyle
			})
		]
	}),
    new Column({ top: 10, left: 10, right: 10, height: 230, skin: backgroundSkin,
      contents: [
        rgbLabel,
        redColorSlider,
        greenColorSlider,
        blueColorSlider,
        alphaLabel,
        alphaColorSlider
      ],
      Behavior: class extends Behavior {
        onChanged(canvas, value, color) {
          if (color == "red") {
            let redVal = Math.floor(value);
            state.locations[$.locationName][$.windowName].r = redVal;
          } else if (color == "green") {
            let greenVal = Math.floor(value);
            state.locations[$.locationName][$.windowName].g = greenVal;
          } else if (color == "blue") {
            let blueVal = Math.floor(value);
            state.locations[$.locationName][$.windowName].b = blueVal;
          } else if (color == "alpha") {
            let alphaVal = value.toFixed(2);
            state.locations[$.locationName][$.windowName].a = alphaVal;
          }

          let data = state.locations[$.locationName][$.windowName];

          data.updatingColorFromDevice = false;
          let colorString = "rgba(" + data.r + "," + data.g + "," + data.b + "," + data.a + ")";
          canvas.container.container.replace(canvas.container.container.last,
          		new WindowPreview({windowFillColor: colorString}));
        }
      },
    }),
  ],
}));

let state;
let redColorSlider;
let greenColorSlider;
let blueColorSlider;
let alphaColorSlider;
let rgbLabel;
let alphaLabel;
let locationName;
let windowName;

let FillScreen = Container.template($ => {
	state = $.state;
	locationName = $.locationName;
	windowName = $.windowName;
	let data = state.locations[$.locationName][$.windowName];
	let r = Math.floor(data.r).toString();
	let g = Math.floor(data.g).toString();
	let b = Math.floor(data.b).toString();
	let a = data.a.toString();
	let colorString = "rgba(" + r + "," + g + "," + b + "," + a + ")";

	let redSliderData = {
	  label:"red",
	  min:0,
	  max:255,
	  value: data.r,
	  circleColor: "red",
	  strokeColor: "#8E9595",
	  strokeWidth: 10,
	  radius: circleRadius
	};

	let greenSliderData = {
	  label:"green",
	  min:0,
	  max:255,
	  value: data.g,
	  circleColor: "green",
	  strokeColor: "#8E9595",
	  strokeWidth: 10,
	  radius: circleRadius
	};

	let blueSliderData = {
	  label: "blue",
	  min:0,
	  max:255,
	  value: data.b,
	  circleColor: "blue",
	  strokeColor: "#8E9595",
	  strokeWidth: 10,
	  radius: circleRadius
	};

	let alphaSliderData = {
	  label: "alpha",
	  min:0,
	  max:1,
	  value: data.a,
	  circleColor: "black",
	  strokeColor: "#8E9595",
	  strokeWidth: 10,
	  radius: circleRadius
	};

	redColorSlider = new ColorSlider(redSliderData);
	greenColorSlider = new ColorSlider(greenSliderData);
	blueColorSlider = new ColorSlider(blueSliderData);
	alphaColorSlider = new ColorSlider(alphaSliderData);
	rgbLabel = new Label({height:30, string:"RGB", style: valueStyle});
	alphaLabel = new Label({height:30, string:"Opacity", style: valueStyle});


	return {
		top: 0, bottom: 0, left: 0, right: 0,
		skin: whiteSkin,
		contents: [
			new SliderContainer($),
			new WindowPreview({ windowFillColor: colorString })
		]
	}
});

export default FillScreen;
