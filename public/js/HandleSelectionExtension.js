class HandleSelectionExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('HandleSelectionExtension has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('HandleSelectionExtension has been unloaded');
        return true;
    }

    
    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('handleSelectionExtensionButton');
        this._button.onClick = (ev) => {
            var it = viewer.model.getData().instanceTree;
            var allDbIdsStr = Object.keys(it.nodeAccess.dbIdToIndex);
            var a = allDbIdsStr.map(function (id) { return parseInt(id) });
            var s = document.getElementById('sel');
            var i;
            //for (i=75683;i<75837;i++)
            //for(i=75842;i<75847;i++)
            for (i = 0; i < a.length; i++) {
                var dbid = a[i];
                var nodeFinalName = it.getNodeName(dbid);
                try {
                    if (nodeFinalName.includes("洗衣机 [")) {
                        var new_option = new Option(dbid.toString() + ":" + nodeFinalName, dbid);
                        s.options.add(new_option);
                    }
                } catch (error) {

                }

            }

            /*var rootId = it.getRootId();
            var rootName = it.getNodeName( rootId );
            it.enumNodeChildren( rootId, function( childId ) {
                var childName = it.getNodeName(childId);
            });*/

        };
        this._button.setToolTip('Handle Selection Extension');
        this._button.addClass('handleSelectionExtensionIcon');
        this._group.addControl(this._button);
    }
}
Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);
