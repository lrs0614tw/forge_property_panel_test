var viewer;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Toolbar'] });
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