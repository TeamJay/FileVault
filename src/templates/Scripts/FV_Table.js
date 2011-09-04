function Table(string_TableName) {
	this.Table = document.createElement('table');
	this.Table.id = string_TableName;
	this.Table.name = string_TableName;
	this.Table.style.border = "1px";
	this.Table.style.backgroundColor = "lightslategray";
	this.Table.setAttribute("class", "sortable");
	this.Table.setAttribute("className", "sortable");
	this.Table.style.borderCollapse = "collapse";

	this.THead = this.Table.createTHead();

	this.TBody = document.createElement("tbody");
	this.Table.appendChild(this.TBody);
	this.TBody.id = "body";
 
	this.RowCounter = 1;
 
}

Table.prototype.ReturnSelectedRow = function() {
	var SelectedRow = null;
	for(var i =1; i < this.Table.rows.length; i++) {
		if(this.Table.rows[i].getAttribute("selected") == "true") { SelectedRow = this.Table.rows[i]; }
	}
	
	return SelectedRow;
}
 
Table.prototype.ColumnHeaders = function(object_RowData) {
 
	var CRow = this.THead.insertRow(0);
	for(var key in object_RowData) {
		var CCell = CRow.insertCell(-1);
		CCell.innerHTML = key;
	}

	
}
 
Table.prototype.AddRow = function (object_RowData) {

	var CRow = this.TBody.insertRow(-1);
	//for(var i=0; i<array_RowData.length; i++) {
	for(var key in object_RowData) {
		
		var CCell = CRow.insertCell(-1);
		CCell.id = key
		CRow.setAttribute("selected", false);
		CCell.innerHTML = object_RowData[key];	
		CCell.onmouseover = this.create(this,this.MouseOver);
		CCell.onmouseout = this.create(this,this.MouseOut);
		CCell.onclick = this.create(this, this.SelectRow);
	}
 
	this.RowCounter++;
}



Table.prototype.AddStreamButton = function() {

	var StreamColumn = this.Table.rows[0].insertCell(-1);
	StreamColumn.innerHTML = "Stream";

	for(var i=1; i< this.Table.rows.length; i++) {
		var CCell = this.Table.rows[i].insertCell(-1);
		CCell.innerHTML = "Click to Stream";
		CCell.style.cursor = 'pointer';
		CCell.style.backgroundColor = "blue";
		CCell.style.fontWeight = "bold";
		CCell.onclick = this.create(this, this.LaunchModal);
	}
}

Table.prototype.LaunchModal = function(e) {
	for(var i=0; i<this.Table.rows.length; i++) {
		for(var j=0; j<this.Table.rows[i].cells.length; j++) {
			if(e.target == this.Table.rows[i].cells[j]) {
				var Modal = new ModalStream(this.Table.rows[i]);	
			}
		}
	}	
}

Table.prototype.create = function(obj, func){
    var f = function(){
        var target = arguments.callee.target;
        var func = arguments.callee.func;
        return func.apply(target, arguments);
    };
    
    f.target = obj;
    f.func = func;
    return f;
}

 
Table.prototype.ReturnTable = function() {
	return this.Table;
}

Table.prototype.SelectRow = function(e) {

	for(var i =0; i< e.target.parentElement.parentElement.rows.length; i++) {
		e.target.parentElement.parentElement.rows[i].setAttribute("Selected", false);
		e.target.parentElement.parentElement.rows[i].style.backgroundColor = "lightslategray";
	}
	
	if(e.target.parentElement.getAttribute("selected") == "false") {
		
		e.target.parentElement.style.backgroundColor = "#8888FF";
		e.target.parentElement.setAttribute("Selected", true);
	}
}

Table.prototype.MouseOver = function(e) {
	e.target.parentElement.style.backgroundColor = "#8888FF";
}

Table.prototype.MouseOut = function(e) {
	if(e.target.parentElement.getAttribute("selected") == "false") {
		e.target.parentElement.style.backgroundColor = "lightslategray";
	}
}
 
