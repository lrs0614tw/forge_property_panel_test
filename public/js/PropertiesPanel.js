 class PropertiesPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
    constructor( viewer) {
      super( viewer);
      this.setNodeProperties();
    }

    setNodeProperties() {
      //this.propertyNodeId = dbId;

      if( !this.viewer ) return;

      try {
        this.setTitle('My Panel');
        this.addProperty('TEST','HEHE','INFO');
        //viewer.setPropertyPanel(this);
        console.log('yes');
      } catch( error ) {
        //this.showDefaultProperties();
      }
    }
    setCProperties(dbIds)
    {
      var i;
      for(i=0;i<dbIds.length;i++)
      {
        this.addProperty('編碼',dbIds[i],'編號');
      }
    }
    showEnd()
    {
      //yeye
    }
    initializeMoveHandlers(draggableElement) {
      // do nothing here; panel won't be draggable    
    }
  }