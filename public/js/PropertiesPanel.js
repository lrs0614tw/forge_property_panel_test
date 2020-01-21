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
        this.addProperty('廠牌','EVERGUSH 九如牌','資訊1');
        this.addProperty('型號','V460AH','資訊');
        this.addProperty('馬力','1/2HP','資訊1');
        this.addProperty('電壓','單相110/220V*60HZ; 單相220~240V*50HZ','資訊');
        this.addProperty('最高揚程','45M','資訊');
        this.addProperty('最大水量','72LPM','資訊');
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