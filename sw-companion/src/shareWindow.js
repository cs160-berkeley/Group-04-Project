
import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';

import {
	leftButtonColor,
	rightButtonColor,
	mediumTextStyle,
	whiteSkin
} from 'utils';

import KEYBOARD from 'keyboard';

import Header from 'header';

let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray' });
let fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldHintStyle = new Style({ color: '#aaa', font: '24px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let greenSkin = new Skin({ fill: "green" });
let redSkin = new Skin({ fill: "red" });
let whiteStyle = new Style({color:'white', font: 'bold 24px'})
let blackStyle = new Style({color:'black', font: 'bold 24px'})
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });
let headerSkin = new Skin({ fill: "#2D9CDB" });

let shareName;

let MyField = Container.template($ => ({
    width: 250, height: 75, skin: nameInputSkin, contents: [
        Scroller($, {
            left: 4, right: 4, top: 4, bottom: 4, active: true,
            Behavior: FieldScrollerBehavior, clip: true,
            contents: [
                Label($, {
                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,
                    style: fieldStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            shareName = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                        }
                    },
                }),
                Label($, {
                    left: 4, right: 4, top: 4, bottom: 4, style: fieldHintStyle,
                    string: "Enter Name of User", name: "hint"
                }),

            ]
        })
    ]
}));

let state;

let ShareWindow = Container.template($ => {
	state = $.state;
	return {
	    left: 0, right: 0, top: 0, bottom: 0,
	    skin: whiteSkin, active: true,
	    contents: [
	      new Header({state: state}),
	      new Label({
	      	left: 0, right: 0, bottom: 125, top: 0,
	      	style: blackStyle,
	      	string: "Share Window"
	      }),
	      MyField({name: ""}),
	      new Line({
				top: 420, height: 60, width: 320,
				skin: whiteSkin,
				contents: [
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
							fill: leftButtonColor
						}),
						contents: [
							new Text({
								left: 0,
								right: 0,
								string: "Cancel",
								style: mediumTextStyle
							})
						],
						behavior: Behavior({
							onTouchEnded: (content) => {
								application.distribute('onBackPressed', {
									screen: "Specific Window",
									state: state,
									windowName: $.windowName,
									locationName: $.locationName
								});
							}
						})
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
								string: "Share",
								style: mediumTextStyle
							})
						],
						behavior: Behavior({
							onTouchEnded: (content) => {
								state.shareName = shareName;
								state.shareWindow = $.windowName;
								application.distribute('onSuccessShare', {
									shareName: shareName,
									locationName: $.locationName,
									windowName: $.windowName,
									state: state
								});
							}
						})
					})
				]
			})
	    ],
	    Behavior: class extends Behavior {
	        onTouchEnded(content) {
	            KEYBOARD.hide();
	            content.focus();
	        }
	    }
	}
});

export default ShareWindow;
