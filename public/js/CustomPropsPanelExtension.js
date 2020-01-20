class CustomPropsPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
    constructor(viewer) {
        super(viewer);
        var panel = this;
        panel.setTitle('My Panel');
        panel.addProperty('test', 'john', 'new cat', null);
        //propertyPanel.setVisible(true)
    }
    initializeMoveHandlers(draggableElement) {
        // do nothing here; panel won't be draggable    
    }
    createTitleBar(title)
    {

    }
}