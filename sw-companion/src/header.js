import {
	headerSkin
} from 'utils';


let notification_image = Picture.template($ => ({
  height: 35, 
  left:0,
  right:240,
  url: "assets/window.png",
  aspect:"fit",

  behavior:Behavior({
    changeImageURL (container, data) {
      trace("yo");
      container.url = data.url;
  }})
}));



let header = Container.template($ => ({
	top: 0, left: 0, right: 0, height: 60,
	skin: headerSkin,
	contents: [
		new notification_image(),
		new Text({
			left: 65, right: 0,
			string: "Smart Window",
			style: new Style({
				color: "white",
				font: "bold 35px"
			})
		})
	]
}));

export default header;