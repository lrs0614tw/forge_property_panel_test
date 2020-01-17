class CustomPropsPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
    constructor(viewer) {
        super(viewer);
    }
    initializeMoveHandlers(draggableElement) {
        // do nothing here; panel won't be draggable    
    }
    getRemoteProps( dbId ) {
        return new Promise(( resolve, reject ) => {
          const srvUrl = getServerUrl();
          fetch( `${ srvUrl }/api/props?_expand=dataType&dbId=${ dbId }`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          })
            .then( ( response ) => {
              if( response.status === 200 ) {
                return response.json();
              } else {
                return reject( new Error( response.statusText ) );
              }
            })
            .then( ( data ) => {
              if( !data ) return reject( new Error( 'Failed to fetch properties from the server' ) );
  
              return resolve( data );
            })
            .catch( ( error ) => reject( new Error( error ) ) );
        });
      }
      getInfo( dbId ) {
        return new Promise(( resolve, reject ) => {
          this.viewer.getObjectTree(function( tree ) {
            const name = tree.getNodeName( dbId );
            return resolve( { dbId, name } );
          },
          function( code, msg ) {
            reject( { code, msg } );
          });
        });
      }
  
      async formatProps( dbId ) {
        const result = await this.getRemoteProps( dbId );
        const info = await this.getInfo( dbId );
  
        const props = [];
        for( let i=0; i < result.length; ++i ) {
          const data = result[i];
          props.push({
            attributeName: data.name,
            displayCategory: data.category,
            displayName: data.displayName,
            displayValue: data.value,
            hidden: data.flags & 1,
            precision: 0,
            type: data.dataType.serial,
            units: data.dataTypeContext
          });
        }
  
        return {
          dbId,
          name: info.name,
          properties: props
        };
      }
      async setNodeProperties( dbId ) {
        this.propertyNodeId = dbId;
  
        if( !this.viewer ) return;
  
        try {
          const result = await this.formatProps( dbId );
  
          this.setTitle( result.name, { localizeTitle: true } );
          this.setProperties( result.properties );
  
          this.resizeToContent();
        }catch{}
    }
}
/*async setNodeProperties(nodeId) {
    this.propertyNodeId = nodeId;

    if (!this.viewer) return;

    try {
        //const reuslt = await this.getRemoteProps(dbId);

        this.setTitle('reuslt.Name, { localizeTitle: true }');
        this.setProperties(reuslt.properties);
        this.highlight(this.viewer.searchText);

        this.resizeToContent();

        if (this.isVisible()) {
            /*const toolController = this.viewer.toolController,
                mx = toolController.lastClickX,
                my = toolController.lastClickY,
                panelRect = this.container.getBoundingClientRect(),
                px = panelRect.left,
                py = panelRect.top,
                pw = panelRect.width,
                ph = panelRect.height,
                canvasRect = this.viewer.canvas.getBoundingClientRect(),
                cx = canvasRect.left,
                cy = canvasRect.top,
                cw = canvasRect.width,
                ch = canvasRect.height;

            if ((px <= mx && mx < px + pw) && (py <= my && my < py + ph)) {
                if ((mx < px + (pw / 2)) && (mx + pw) < (cx + cw)) {
                    this.container.style.left = Math.round(mx - cx) + 'px';
                    this.container.dockRight = false;
                } else if (cx <= (mx - pw)) {
                    this.container.style.left = Math.round(mx - cx - pw) + 'px';
                    this.container.dockRight = false;
                } else if ((mx + pw) < (cx + cw)) {
                    this.container.style.left = Math.round(mx - cx) + 'px';
                    this.container.dockRight = false;
                } else if ((my + ph) < (cy + ch)) {
                    this.container.style.top = Math.round(my - cy) + 'px';
                    this.container.dockBottom = false;
                } else if (cy <= (my - ph)) {
                    this.container.style.top = Math.round(my - cy - ph) + 'px';
                    this.container.dockBottom = false;
                }
            }
            var i = 0;
        }
    } catch (error) {
        console.log('a');
        this.showDefaultProperties();
    }
}*/