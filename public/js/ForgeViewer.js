var viewer;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    //new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById('forgeViewer')).start('https://dukedhx.github.io/Forge-Workshop/shaver/0.svf');
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Toolbar','CustomPropertyPanelExtension'] });
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    var tree;
    viewer.getObjectTree(function (objTree) {
      tree = objTree;
      var root = tree.root;
      var allDbIds = getAlldbIds(root);
      viewer.fitToView(allDbIds);
    });
    viewer.toolbar.getControl('settingsTools').setVisible(false);
    viewer.toolbar.getControl('modelTools').setVisible(false);
    viewer.toolbar.getControl('navTools').setVisible(false);
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}
function getAlldbIds(root) {
  var alldbId = [];
  if (!root) {
    return alldbId;
  }
  var queue = [];
  queue.push(root); //push the root into queue
  while (queue.length > 0) {
    var node = queue.shift(); // the current node
    alldbId.push(node.dbId);
    if (node.children) {
      // put all the children in the queue too
      for (var i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
      }
    }
  };
  return alldbId;
};
//var selection = viewer.getSelection();
/*viewer.getProperties(selection[0], function (result) {
  const props = result.properties;
  for (let i = 0; i < props.length; i++) {
    const property = props[i];
    if (property.hidden) return;

    const category = props[i].displayCategory;
    if (category && typeof category === 'string' && category !== '') {
      // The property group you want 
      console.log(category);
    }
  }
});*/

