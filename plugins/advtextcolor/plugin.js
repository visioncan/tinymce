/**
 * plugin min.js
 *
 * pitch textcolor
 */

tinymce.PluginManager.add('advtextcolor', function(editor, url) {
    var storedColors = [];
  	function mapColors() {
  		var i, colors = [], colorMap;

  		colorMap = editor.settings.textcolor_map || [
  			"000000", "Black",
  			"993300", "Burnt orange",
  			"333300", "Dark olive",
  			"003300", "Dark green",
  			"003366", "Dark azure",
  			"000080", "Navy Blue",
  			"333399", "Indigo",
  			"333333", "Very dark gray",
  			"800000", "Maroon",
  			"FF6600", "Orange",
  			"808000", "Olive",
  			"008000", "Green",
  			"008080", "Teal",
  			"0000FF", "Blue",
  			"666699", "Grayish blue",
  			"808080", "Gray",
  			"FF0000", "Red",
  			"FF9900", "Amber",
  			"99CC00", "Yellow green",
  			"339966", "Sea green",
  			"33CCCC", "Turquoise",
  			"3366FF", "Royal blue",
  			"800080", "Purple",
  			"999999", "Medium gray",
  			"FF00FF", "Magenta",
  			"FFCC00", "Gold",
  			"FFFF00", "Yellow",
  			"00FF00", "Lime",
  			"00FFFF", "Aqua",
  			"00CCFF", "Sky blue",
  			"993366", "Brown",
  			"C0C0C0", "Silver",
  			"FF99CC", "Pink",
  			"FFCC99", "Peach",
  			"FFFF99", "Light yellow",
  			"CCFFCC", "Pale green",
  			"CCFFFF", "Pale cyan",
  			"99CCFF", "Light sky blue",
  			"CC99FF", "Plum",
  			"FFFFFF", "White"
  		];

  		for (i = 0; i < colorMap.length; i += 2) {
  			colors.push({
  				text: colorMap[i + 1],
  				color: colorMap[i]
  			});
  		}

  		return colors;
  	}

    // Storage color
    function getStorageColor () {
        if (window.localStorage && window.localStorage.getItem('color'))  {
            storedColors = JSON.parse(window.localStorage["color"]);
        }
    }

    function saveColortoStorage (color) {
        var saveColors = [];

        storedColors.push(color.replace("#", ""));
        if (storedColors.length > 16) {
            saveColors = storedColors.slice(-16);
        }else {
            saveColors = storedColors;
        }
        // console.log(saveColors);
        if (window.localStorage) {
            window.localStorage['color'] = JSON.stringify(saveColors);
        }
    }


	function renderColorPicker() {
		var ctrl = this, colors, color, html, last, rows, cols, x, y, i;

		colors = mapColors();
        getStorageColor();
		html = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="presentation" cellspacing="0"><tbody>';
		last = colors.length - 1;
		rows = editor.settings.textcolor_rows || 5;
		cols = editor.settings.textcolor_cols || 8;

		for (y = 0; y < rows; y++) {
			html += '<tr>';

			for (x = 0; x < cols; x++) {
				i = y * cols + x;

				if (i > last) {
					html += '<td></td>';
				} else {
					color = colors[i];
					html += (
						'<td class="mce-grid-cell">' +
							'<div id="' + ctrl._id + '-' + i + '"' +
								' data-mce-color="' + color.color + '"' +
								' role="option"' +
								' tabIndex="-1"' +
								' style="' + (color ? 'background-color: #' + color.color : '') + '"' +
								' title="' + color.text + '">' +
							'</div>' +
						'</td>'
					);
				}
			}

			html += '</tr>';
		}

		html += '</tbody></table>';

        // storedColors
        if (storedColors.length != 0) {
            html += '<div id="mce-recent-pick-colors">';
            html += renderRecentColorsHtml();
            html += '</div>';
        }
        // more color
        var more_color = '更多顏色';
        html += (
              '<div class="mce-menu-item">' +
              '<button id="advtextcolor-showmorecolor" data-action="advtextcolor-popup" style="margin:0 auto;cursor:pointer;width:100%;text-align:center;" type="button">'+ more_color +'</button>' +
              '</div>'
            );

		return html;
	}


    function renderRecentColorsHtml () {
        var html = '',
            recentColors = storedColors;
        recentColors.reverse();
        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="presentation" cellspacing="0"><tbody>';
        for (var u = 0; u < 2; u++) {
            html += '<tr>';

            for (var i = 0; i < 8; i++) {
                var color;
                if (i < recentColors.length ) {
                    color = recentColors[i + u * 8];
                }else {
                    color = "ffffff";
                }
                html += (
                    '<td>' +
                    '<div' +
                        ' data-mce-color="' + color + '"' +
                        ' role="option"' +
                        ' tabIndex="-1"' +
                        ' style="' + (color ? 'background-color: #' + color : '') + '"' +
                        ' title="' + color + '">' +
                    '</div>' +
                    '</td>'
                    );
            };

            html += '</tr>';
        }
        html += '</tbody></table>';
        return html;
    }


	function onPanelClick(e) {
        var buttonCtrl = this.parent();
        if (e.target.getAttribute('data-mce-color')) {
            setSelectedColor(e, buttonCtrl);

        } else if (e.target.getAttribute('data-action') == 'advtextcolor-popup') {
            openColorPicker(e, buttonCtrl);
        }
	}

    function setSelectedColor (e, buttonCtrl) {
        var value;
        if ((value = e.target.getAttribute('data-mce-color'))) {
            buttonCtrl.hidePanel();
            value = '#' + value;
            buttonCtrl.color(value);
            editor.execCommand(buttonCtrl.settings.selectcmd, false, value);
        }
    }

    function openColorPicker (e, buttonCtrl) {
        buttonCtrl.hidePanel();
        var win, submitColor;

        submitColor = function (e) {
            var fr = $('.mce-container-body>iframe')[0];
            var color = fr.contentDocument.getElementById("color").value;

            saveColortoStorage(color);

            buttonCtrl.color(color);
            editor.execCommand(buttonCtrl.settings.selectcmd, false, color);

            var recentColorDiv = document.getElementById("mce-recent-pick-colors");
            if (recentColorDiv !== null) {
                recentColorDiv.innerHTML = '';
                recentColorDiv.innerHTML = renderRecentColorsHtml();
            };
            win.close();
        };

        win = editor.windowManager.open({
            title: '色盤',
            url: url + '/colorpicker.html',
            width: 280,
            height: 320,
            buttons: [{
                text: 'Ok',
                subtype: 'primary',
                onclick: submitColor
            },{
                text: 'Cancel',
                onclick: 'close'
            }]
        });
    }


	function onButtonClick() {
		var self = this;

		if (self._color) {
			editor.execCommand(self.settings.selectcmd, false, self._color);
		}
	}

	editor.addButton('forecolor', {
		type: 'colorbutton',
		tooltip: 'Text color',
		selectcmd: 'ForeColor',
		panel: {
			html: renderColorPicker,
			onclick: onPanelClick
		},
		onclick: onButtonClick
	});

	editor.addButton('backcolor', {
		type: 'colorbutton',
		tooltip: 'Background color',
		selectcmd: 'HiliteColor',
		panel: {
			html: renderColorPicker,
			onclick: onPanelClick
		},
		onclick: onButtonClick
	});
});
