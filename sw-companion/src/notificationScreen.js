import {
    VerticalScroller,
    VerticalScrollbar,
} from 'scroller';
import Header from 'header';
import {
	whiteSkin,
	bigTextStyle
} from 'utils';

export var NotificationScreenNotificationTemplate = Container.template($ => ({
	left: 5, right: 5, top: 5, height: 90, name: $.name,
	skin: new Skin({fill:"#2D9CDB"}),
	contents: [
		new Label({ top: 10, left: 5, right: 5, string: $.name + " now has access to " + $.windowName + "!", style: new Style({ font: "18px", color: "#FFFFFF" })}),
		new Container ({
			bottom: 10, height: 40, width: 80, active: true,
			skin: new Skin({fill: "#FFFFFF"}),
			contents: [
				new Label({ string: "Dismiss", style: new Style({ font: "16px", color: "#2D9CDB" })}),
			],
			behavior: Behavior ({
				onTouchEnded: function(container) {
					container.bubble("zdestroy", {name: $.name});
				}
			})
		})
	],
}));

let state;

export var NotificationScreenTemplate = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: new Skin({fill: "#FFFFFF"}),
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
								state: state
							});
						}
					})
				}),
				new Text({
					left: "-120", right: 0, top: 8,
					string: "Notifications",
					style: bigTextStyle
				}),
			]
		}),
		new Column({
			top: 0, left: 0, right: 0,
			contents: [
		
			],
			behavior: Behavior ({
				onCreate: function(container, data) {
					state = $.state;
					//container.add(new NotificationScreenNotificationTemplate({ name: "Monkey" }));
					//container.add(new NotificationScreenNotificationTemplate({ name: data.name, number: data.number }));
				},
				createNotification: function(container, data) {
					container.add(new NotificationScreenNotificationTemplate({ name: data.name, windowName: data.windowName }));
				},
				zdestroy: function(container, data) {
					eval("container.remove(container." + data.name + ");");
				}
			}),
		})
	]
}));