class ModelStructurePanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, title, options) {
        options = options || {};

        //Height adjustment for scroll container, offset to height of the title bar and footer by default.
        if (!options.heightAdjustment)
            options.heightAdjustment = 70;

        if (!options.marginTop)
            options.marginTop = 0;

        if (!options.left)
            options.left = false;

        super(viewer.container, viewer.container.id + 'AdnModelStructurePanel', title, options);
        var toolbar = new Autodesk.Viewing.UI.ToolBar('toolbar-TtIf');
        this.container.classList.add('adn-docking-panel');
        this.container.classList.add('adn-model-structure-panel');
        $('.adn-model-structure-panel').css({
            'width': '15%',
            'height': '50%',
        });
        $('.adn-docking-panel').css({
            'top': 'calc(3% + ' + toolbar.getDimensions().height + 'px)',
            'left': 'calc(5% + ' + toolbar.getDimensions().width + 'px)'
        });

        this.createScrollContainer(options);
        console.log(options, this.options);
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
    initializeMoveHandlers(draggableElement) {
        // do nothing here; panel won't be draggable    
    }
    hasTask(model, dbId, matches) {
        return new Promise(function (resolve, reject) {
            const instanceTree = model.getData().instanceTree;

            model.getProperties(dbId, function (result) {
                const nodeName = instanceTree.getNodeName(dbId);
                const hasChildren = instanceTree.getChildCount(dbId) > 0;

                if (!result.properties || hasChildren)
                    return resolve();

                //for (let i = 0; i < result.properties.length; ++i) {
                const prop = result.properties[0];
                //check if we have a match
                if (!nodeName.includes("洗衣机 [") && !nodeName.includes("卧式水泵1 [")) {
                    return resolve();
                }

                let match = matches.find(node => node.text == prop.displayValue);

                if (!match) {
                    match = {
                        id: 'mat-' + guid(),
                        text: prop.displayValue,
                        children: [
                            {
                                id: dbId,
                                text: nodeName
                            }
                        ]
                    };

                    matches.push(match);
                } else {
                    match.children.push({
                        id: dbId,
                        text: nodeName
                    });
                }
                //}

                return resolve();
            }, function () {
                return reject();
            });
        });
    }

    executeTaskOnModelTree(model, task) {
        const taskResults = [];

        function _executeTaskOnModelTreeRec(dbId) {
            instanceTree.enumNodeChildren(dbId,
                function (childId) {
                    taskResults.push(task(model, childId));
                    _executeTaskOnModelTreeRec(childId);
                });
        }

        //get model instance tree and root component
        const instanceTree = model.getData().instanceTree;
        const rootId = instanceTree.getRootId();

        _executeTaskOnModelTreeRec(rootId);

        return taskResults;
    }

    buildTree() {
        const viewer = this.viewer;

        viewer.getObjectTree(() => {
            const matches = [];
            const taskThunk = (model, dbId) => {
                return this.hasTask(
                    model, dbId, matches);
            };
            const taskResults = this.executeTaskOnModelTree(
                viewer.model,
                taskThunk
            );
            Promise.all(taskResults)
                .then(() => {
                    console.log('Found ' + matches.length + ' matches');
                    console.log(matches);

                    $(this.treeContainer)
                        .on('select_node.jstree', function (e, data) {
                            //console.log(e, data);
                            if (!data) return;

                            let dbIds = [];
                            viewer.clearSelection();

                            if (data.node.id.contains('mat-')) {
                                dbIds = data.node.children.map(child => parseInt(child));

                            } else {
                                const dbId = parseInt(data.node.id);
                                dbIds = [dbId];
                            }

                            viewer.select(dbIds);
                            viewer.fitToView(dbIds);
                            setTimeout(function(){
                                zoom() //This will work fine
                            }, 1000)
                            
                        })
                        .jstree({
                            core: {
                                data: matches,
                                themes: {
                                    icons: false
                                }
                            }
                        });
                });
        },
            function (code, msg) {
                console.error(code, msg);
            });
    }

    createUI() {
        this.uiCreated = true;

        const div = document.createElement('div');

        const treeDiv = document.createElement('div');
        div.appendChild(treeDiv);
        this.treeContainer = treeDiv;

        this.scrollContainer.appendChild(div);

        this.buildTree();
    }
}
function guid() {

    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });

    return guid;
}
function zoom (){
    var nav = viewer.navigation;
    var pos = nav.getPosition();
    var target = nav.getTarget();
    var viewdir = new THREE.Vector3();
    viewdir.subVectors (pos, target).normalize();
    // zooms out by 100 along the view direction
    viewdir.multiplyScalar (50);
    pos.add(viewdir);
    nav.setPosition(pos);
}

/*class ModelStructurePanelExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        this.createUI = this.createUI.bind(this);
        this.onToolbarCreated = this.onToolbarCreated.bind(this);
    }

    onToolbarCreated() {
        this.viewer.removeEventListener(
            Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
            this.onToolbarCreated
        );
        this.createUI();
    }

    createUI() {
        const viewer = this.viewer;

        const modelStructurePanel = new ModelStructurePanel(viewer, '設備列表');

        this.panel = modelStructurePanel;
        //viewer.addPanel(modelStructurePanel);

        const structureButton = new Autodesk.Viewing.UI.Button('toolbar-adnModelStructureTool');
        structureButton.setToolTip('browser');
        structureButton.addClass('AdnModelStructurePanelExtensionIcon');
        structureButton.onClick = function () {
            modelStructurePanel.setVisible(!modelStructurePanel.isVisible());
        };

        const subToolbar = new Autodesk.Viewing.UI.ControlGroup('toolbar-adn-tools');
        subToolbar.addControl(structureButton);
        subToolbar.adnstructurebutton = structureButton;
        this.subToolbar = subToolbar;

        viewer.toolbar.addControl(this.subToolbar);

        modelStructurePanel.addVisibilityListener(function (visible) {
            if (visible)
                viewer.onPanelVisible(modelStructurePanel, viewer);

            structureButton.setState(visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
        });
    }

    load() {
        console.log('ModelStructurePanelExtension has been loaded');
        return true;
    }

    unload() {
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('ModelStructurePanelExtension has been unloaded');
        return true;
    }
}
try {
    Autodesk.Viewing.theExtensionManager.registerExtension('ModelStructurePanelExtension', ModelStructurePanelExtension);
} catch (error) {
}*/