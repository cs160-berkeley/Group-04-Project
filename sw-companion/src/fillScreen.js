import Header from 'header';

import {
  CircleSlider
} from 'slider';

import {
    Button,
    ButtonBehavior,
} from 'buttons';

/* GLOBAL VARIABLE SLIDERS */
var redVal = 0;
var greenVal = 0;
var blueVal = 0;
var alphaVal = 0;

// var updatingColor = false;

// var deviceURL = "";

var whiteSkin = new Skin( { fill:"white" } );
var titleStyle = new Style( { font: "bold 28px", color:"black" } );
var valueStyle = new Style( { font: "24px", color:"black"});

var rgbLabel = new Label({height:30, string:"RGB", style: valueStyle});
var alphaLabel = new Label({height:30, string:"Opacity", style: valueStyle});
let circleRadius = 10;
let margin = 10;
let backgroundSkin = new Skin({ fill: '#F0F0F0' });
let ColorSlider = CircleSlider.template($ => ({ left: margin, right: margin, top: margin, bottom: margin }));

let redSliderData = {
  label:"red",
  min:0,
  max:1,
  value:0,
  circleColor: "red",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let greenSliderData = {
  label:"green",
  min:0,
  max:1,
  value:0,
  circleColor: "green",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let blueSliderData = {
  label: "blue",
  min:0,
  max:1,
  value:0,
  circleColor: "blue",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let alphaSliderData = {
  label: "alpha",
  min:0,
  max:1,
  value:1,
  circleColor: "black",
  strokeColor: "#8E9595",
  strokeWidth: 10,
  radius: circleRadius
};

let redColorSlider = new ColorSlider(redSliderData);
let greenColorSlider = new ColorSlider(greenSliderData);
let blueColorSlider = new ColorSlider(blueSliderData);
let alphaColorSlider = new ColorSlider(alphaSliderData);


let WindowPreview = Container.template($ => ({
  bottom: 38, width: 100, height: 100,
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
}));

let SliderContainer = Column.template($ => ({
  top: 0, left: 0, right: 0,
  active: true,
  contents: [
    new Header(),
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
            redVal = Math.floor(value * 255);
          } else if (color == "green") {
            greenVal = Math.floor(value * 255);
          } else if (color == "blue") {
            blueVal = Math.floor(value * 255);
          } else if (color == "alpha") {
            alphaVal = value.toFixed(2);
          }

          let colorString = "rgba(" + redVal + "," + greenVal + "," + blueVal + "," + alphaVal + ")";
          canvas.container.container.replace(canvas.container.container.last,
          		new WindowPreview({windowFillColor: colorString}));
          // trace(colorString + "\n");
          // application.skin = new Skin(colorString);
          //application.remove(curSampleWindow);
          //curSampleWindow = new sampleWindow({windowFillColor: colorString});
          //application.add(curSampleWindow);

          // trace(deviceURL + "updateColor\n");
          //updatingColor = true;
          // application.invoke(new Message(deviceURL + "updateColor"), Message.JSON);
          // application.invoke(new Message("/delayReadPins"));
        }
      },
    }),
  ],
}));

let FillScreen = Container.template($ => ({
	top: 0, bottom: 0, left: 0, right: 0,
	skin: new Skin({ fill: "white" }),
	contents: [
		new SliderContainer(),
		new WindowPreview({ windowFillColor: $.windowFillColor })
	]
}));

export default FillScreen;