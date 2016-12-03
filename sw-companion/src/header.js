import {
	headerSkin
} from 'utils';


let notification_image = Picture.template($ => ({
  height: 60,
  url: "assets/header.png",
  aspect:"fit",

  behavior:Behavior({
    changeImageURL (container, data) {
      if (container.url !== data.url) {
      	container.url = data.url;
      }
  }})
}));



let header = Container.template($ => ({
	top: 0, left: 0, right: 0, height: 60,
	skin: headerSkin,
	contents: [
		new notification_image(),
	]
}));

export default header;
