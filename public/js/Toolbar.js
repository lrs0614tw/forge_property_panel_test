class Toolbar extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        var _viewer = viewer;
    }
    load() {
        this.createToolbar();
        console.log('Autodesk.Research.TtIf.Extension.Toolbar loaded');
        return true;
    };
    unload() {
        this.deleteToolbar();
        console.log('Autodesk.Research.TtIf.Extension.Toolbar unloaded');
        return true;
    };
    createToolbar() {
        var toolbar = new Autodesk.Viewing.UI.ToolBar('toolbar-TtIf');
        var ctrlGroup = new Autodesk.Viewing.UI.ControlGroup(
            'Autodesk.Research.TtIf.Extension.Toolbar.ControlGroup'
        );
        ctrlGroup.addClass('toolbar-vertical-group');
        const modelStructurePanel = new ModelStructurePanel(viewer, '設備列表');
        // Names, icons and tooltips for our toolbar buttons
        var names = ['CGB1', 'CGB2', 'CGB3'];
        var icons = ['list', 'wrench', 'sunglasses'];
        var tips = ['Equipment List', 'Show/Hide ToolBar', 'Isolate'];
        var buttonList=[];
        // Operations for when the buttons are clicked
        var clicks =
            [
                function () {

                    modelStructurePanel.setVisible(!modelStructurePanel.isVisible());
                },
                function () {
                    viewer.toolbar.getControl('settingsTools').setVisible(true);
                    viewer.toolbar.getControl('modelTools').setVisible(true);
                    viewer.toolbar.getControl('navTools').setVisible(true);
                    
                },
                function () { 
                    var DBids = viewer.impl.selector.getAggregateSelection(); 
                    try {
                    viewer.isolate(DBids[0].selection);
                    } catch (error) {
                        buttonList[2].setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
                    }
                }
            ]
        // Operations for when buttons are unclicked (i.e. toggled off)
        // If false, then the button won't have any 'state'
        var unclicks =
            [
                function () {
                    modelStructurePanel.setVisible(!modelStructurePanel.isVisible());
                },
                function () {
                    viewer.toolbar.getControl('settingsTools').setVisible(false);
                    viewer.toolbar.getControl('modelTools').setVisible(false);
                    viewer.toolbar.getControl('navTools').setVisible(false);
                },
                function () {  
                    viewer.showAll();
                }
            ]
        // The loop to create our buttons
        var button;
        for (var i = 0; i < names.length; i++) {
            // Start by creating the button
            button = new Autodesk.Viewing.UI.Button(
                'Autodesk.Research.TtIf.Extension.Toolbar.' + names[i]
            );
            // Assign an icon
            if (icons[i] && icons[i] !== '') {
                button.icon.classList.add('myicon');
                button.icon.classList.add('glyphicon');
                button.icon.classList.add('glyphicon-' + icons[i]);
            }
            // Set the tooltip
            button.setToolTip(tips[i]);
            // Only create a toggler for our button if it has an unclick operation
            if (unclicks[i]) {
                button.onClick = this.createToggler(button, clicks[i], unclicks[i]);
            }
            else {
                button.onClick = clicks[i];
            }
            ctrlGroup.addControl(button);
            buttonList.push(button);
        }
        toolbar.addControl(ctrlGroup);
        var toolbarDivHtml = '<div id="divToolbar"> </div>';
        $(viewer.container).append(toolbarDivHtml);
        // We want our toolbar to be centered vertically on the page
        toolbar.centerToolBar = function () {
            $('#divToolbar').css({
                'top':'calc(4% + ' + toolbar.getDimensions().height + 'px)'
            });
            $('.adn-model-structure-panel').css({
                'width': '15%',
                'height': '50%',
            });
            $('.adn-docking-panel').css({
                'top': 'calc(4% + ' + toolbar.getDimensions().height + 'px)',
                'left':'calc(1% + ' + toolbar.getDimensions().width + 'px)',
                'position': 'absolute',
            });
        };
        /*toolbar.addEventListener(
            Autodesk.Viewing.UI.ToolBar.Event.SIZE_CHANGED,
            toolbar.centerToolBar
        );*/
        // Start by placing our toolbar off-screen (top: 0%)
        $('#divToolbar').css({
            //'top': '0%',
            'left': '1%',
            'position': 'absolute',
        });
        $('#divToolbar')[0].appendChild(toolbar.container);
        // After a delay we'll center it on screen
        setTimeout(function () { toolbar.centerToolBar(); }, 100);
        modelStructurePanel.addVisibilityListener(function( visible ) {
            if( visible)
              {
                  viewer.onPanelVisible( modelStructurePanel, viewer );
              }
            console.log(buttonList);
            buttonList[0].setState( visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE );
          });
    }
    deleteToolbar() {
        $('#divToolbar').remove();
    }
    createToggler(button, click, unclick) {
        return function () {
            var state = button.getState();
            if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {
                button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
                click();
            } else if (state === Autodesk.Viewing.UI.Button.State.ACTIVE) {
                button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
                unclick();
            }
        };
    }
    setVisibility(panel, flag) {
        if (panel) panel.setVisible(flag);
    }
}
try {
    Autodesk.Viewing.theExtensionManager.registerExtension('Toolbar', Toolbar);
} catch (error) {
    console.log('error');
}
