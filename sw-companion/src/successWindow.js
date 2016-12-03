import Header from 'header';

let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray' });
let fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldHintStyle = new Style({ color: '#aaa', font: '24px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let whiteSkin = new Skin({ fill: "white" });
let greenSkin = new Skin({ fill: "green" });
let redSkin = new Skin({ fill: "red" });
let whiteStyle = new Style({color:'white', font: 'bold 24px'})
let blackStyle = new Style({color:'black', font: 'bold 24px'})
let blackSStyle = new Style({color:'black', font: '16px'})
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });
let headerSkin = new Skin({ fill: "#2D9CDB" });


let SuccessContainerTemplate = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0,
    skin: whiteSkin, active: true,
    contents: [
      new Header(),

      new Picture({width: 150,height:150,url:"assets/check.png"}),

      new Label({left:0,right:0,bottom:0,top:250,style:blackStyle,
          string: "SUCCESS!",
      }),
      new Label({left:0,right:0,bottom:0,top:350,style:blackSStyle,
          string: "Tap to continue!",
      }),
    ],
    active: true,
    behavior: Behavior({
      onTouchEnded: (content) => {
        application.distribute('onFinishSuccess', $);
      }
    })

}));

export default SuccessContainerTemplate;
