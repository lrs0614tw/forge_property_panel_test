class PropertiesPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, title, options) {
        options = options || {};

        //Height adjustment for scroll container, offset to height of the title bar and footer by default.
        if (!options.heightAdjustment)
            options.heightAdjustment = 70;

        if (!options.marginTop)
            options.marginTop = 0;

        if (!options.left)
            options.left = false;

        super(viewer.container, viewer.container.id + 'PropertiesPanel', title, options);
        $('.adn-model-structure-panel').css({
            'width': '15%',
            'height': '50%',
        });
        $('.adn-docking-panel').css({
            'top': 'calc(3% + ' + toolbar.getDimensions().height + 'px)',
            'left': 'calc(5% + ' + toolbar.getDimensions().width + 'px)'
        });

        this.createScrollContainer(options);
        this.viewer = viewer;
        this.options = options;
        this.uiCreated = false;

        this.addVisibilityListener((show) => {
            if (!show) {
                toolbar.addEventListener(Autodesk.Viewing.UI.Button.Event.STATE_CHANGED, "Autodesk.Research.TtIf.Extension.Toolbar.CGB1", Autodesk.Viewing.UI.Button.State.ACTIVE);

            };

            if (!this.uiCreated)
                this.createUI();
            //this.sizeToContent(this.container);
        });

    }
}