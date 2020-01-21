  function getServerUrl() {
    return document.location.protocol + '//' + document.location.host;
  }

  class PropertiesPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
    constructor( viewer,dbId) {
      super( viewer );
      this.setNodeProperties( dbId );
      
    }

    async setNodeProperties( dbId ) {
      this.propertyNodeId = dbId;

      if( !this.viewer ) return;

      try {
        this.setTitle('My Panel');
        viewer.setPropertyPanel(this);
        console.log(this.addProperty('test', 'john', '約束'));
        console.log('yes');
      } catch( error ) {
        //this.showDefaultProperties();
      }
    }
  }