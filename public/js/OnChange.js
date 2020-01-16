function OnChange() {
    var v=viewer
    var s = document.getElementById('sel');
    var index=s.selectedIndex;
    var val = parseInt(s.options[index].value);
    
    var color = new THREE.Color("rgb(255, 102, 204)");
    v.setSelectionMode(Autodesk.Viewing.SelectionMode.LEAF_OBJECT);
    v.setSelectionColor(color,Autodesk.Viewing.SelectionMode.REGULAR );
    v.select([val],Autodesk.Viewing.SelectionMode.REGULAR);  
    v.isolate([val]);
    v.fitToView([val]);
}
