function TextBrowser() {
	this.MainWindow = MainWindow;
	this.Container = document.createElement("div");

	this.UploadButton = document.createElement("input");
	this.DownloadButton = document.createElement("button");
	this.SearchButton = document.createElement("button");
	this.FilterBy = document.createElement("select");
	//Filter list is document.createElement(option) then innerHTML for text...
	this.SearchBar = document.createElement("input");

	this.BrowserWindow = document.createElement("div");

	this.ReturnButton = document.createElement("button");

	this.Table = null;

	this.Output = [];
	this.Files = null

	this.GenerateLayout();
}

TextBrowser.prototype.Load = function () {
	this.MainWindow.appendChild(this.Container);
}

TextBrowser.prototype.GenerateLayout = function() {

	//Top Level Buttons

	this.UBdiv = document.createElement('div');
	this.UBdiv.style.position = "relative";
	this.UploadButton.type = 'file';
	this.UploadButton.id = 'files';
	this.UploadButton.name = 'files[]';
	this.UploadButton.multiple = true;
	this.UploadButton.style.width = "300px";
	this.UploadButton.style.height = "40px";
	this.UploadButton.style.fontSize = "20px";
	this.UBdiv.style.margin = "0px 0px 0px 300px";
	this.UploadButton.style.margin = "10px 0px 0px 0px";
	this.UBdiv.appendChild(this.UploadButton);
	this.UBdiv.style.float = "left";
	this.UBdiv.style.cssFloat = "left";
  	this.UploadButton.addEventListener('change',this.create(this, this.UploadButtonPress),false);

	this.DBdiv = document.createElement('div');
	this.DBdiv.style.position = "relative";
	this.DownloadButton.setAttribute('type','button');
	this.DownloadButton.innerHTML = "Download Text";
	this.DownloadButton.style.width = "200px";
	this.DownloadButton.style.height = "40px";
	this.DownloadButton.style.fontSize = "20px";
	this.DBdiv.style.margin = "0px 0px 0px 30px";
	this.DBdiv.appendChild(this.DownloadButton);
	this.DBdiv.style.float = "left";
	this.DBdiv.style.cssFloat = "left";
  	this.DownloadButton.onclick = this.create(this,this.DownloadButtonPress);

	this.Fdiv = document.createElement('div');
	this.Fdiv.style.position = "relative";
	this.Fdiv.innerHTML = "Filter Search By:";
	this.FilterBy.style.width = "200px";
	this.FilterBy.style.height = "30px";
	this.FilterBy.style.fontSize = "20px";
	this.Fdiv.style.color = "white";
	this.Fdiv.style.fontSize = "20px";
	this.Fdiv.style.margin = "10px 0px 0px 30px";
	this.FilterBy.style.margin = "0px 0px 0px 5px";
	this.Fdiv.appendChild(this.FilterBy);
	this.Fdiv.style.float = "left";
	this.Fdiv.style.cssFloat = "left";

	this.Sdiv = document.createElement('div');
	this.Sdiv.style.position = "relative";
	this.Sdiv.innerHTML = "";
	this.SearchBar.style.width = "200px";
	this.Sdiv.style.color = "white";
	this.SearchBar.style.fontSize = "20px";
	this.Sdiv.style.fontSize = "20px";
	this.SearchBar.style.margin = "0px 0px 0px 5px";
	this.Sdiv.style.margin = "8px 0px 0px 30px";
	this.Sdiv.appendChild(this.SearchBar);
	this.Sdiv.style.float = "left";
	this.Sdiv.style.cssFloat = "left";

	this.SBdiv = document.createElement('div');
	this.SBdiv.style.position = "relative";
	this.SearchButton.setAttribute('type','button');
	this.SearchButton.innerHTML = "Search";
	this.SearchButton.style.width = "60px";
	this.SearchButton.style.height = "30px";
	this.SearchButton.style.fontSize = "14px";
	this.SBdiv.style.margin = "7px 0px 0px 0px";
	this.SBdiv.appendChild(this.SearchButton);
	this.SBdiv.style.float = "left";
	this.SBdiv.style.cssFloat = "left";
  	this.SearchButton.onclick = this.create(this,this.SearchButtonPress);

  	this.AppendButtons();

	//The Library Browser Window
	this.BrowserWindow.style.backgroundColor = "rgba(218,218,218,1)";
	this.BrowserWindow.style.mozBorderRadius = "15px";
	this.BrowserWindow.style.borderRadius = "15px";
	this.BrowserWindow.style.position = "absolute";
	this.BrowserWindow.style.width = "1100px";
	this.BrowserWindow.style.height = "700px";
	this.BrowserWindow.style.margin = "55px 0px 0px 300px";
	this.BrowserWindow.style.overflow = "auto";

	this.TextBrowserMaker();

	this.Container.appendChild(this.BrowserWindow);
	

	//Return to Menu Button...
	this.RBdiv = document.createElement('div');
	this.ReturnButton.setAttribute('type','button');
	this.RBdiv.style.position = "absolute";
	this.ReturnButton.innerHTML = "Return to Main Menu";
	this.ReturnButton.style.width = "200px";
	this.ReturnButton.style.fontSize = "20px";
	this.RBdiv.style.fontSize = "20px";
	this.ReturnButton.style.margin = "0px 0px 0px 0px";
	this.RBdiv.style.margin = "765px 0px 0px 780px";
	this.RBdiv.appendChild(this.ReturnButton);
	this.RBdiv.style.float = "left";
	this.RBdiv.style.cssFloat = "left";
	this.ReturnButton.onclick = this.ReturnButtonPress;

	this.Container.appendChild(this.RBdiv);
	
}

TextBrowser.prototype.UploadButtonPress = function(evt) {
	console.log(evt.target.files);
	this.Files = evt.target.files; // FileList object
    	// files is a FileList of File objects. List some properties.

    	for (var i = 0, f; f = this.Files[i]; i++) {
     		this.Output.push(['<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
          	f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(), '</li>']);
    	}
}

TextBrowser.prototype.create = function(obj, func){
    var f = function(){
        var target = arguments.callee.target;
        var func = arguments.callee.func;
        return func.apply(target, arguments);
    };
    
    f.target = obj;
    f.func = func;
    return f;
}

TextBrowser.prototype.DownloadButtonPress = function(evt) {

	if(this.Table) {
		var SelectedRow = this.Table.ReturnSelectedRow();
		if(SelectedRow) {
		
			for(var i=0; i< SelectedRow.cells.length; i++) {
				if(SelectedRow.cells[i].id == "Source") {
					var Src = SelectedRow.cells[i].innerHTML;
					window.open(Src,'Download');
				}

			}
		}

	}
	
	
}

TextBrowser.prototype.SearchButtonPress = function(evt) {

	this.TextBrowserMaker(this.SearchBar.value);
	
}


TextBrowser.prototype.AppendButtons = function() {
	this.Container.appendChild(this.UBdiv);
	this.Container.appendChild(this.DBdiv);
	this.Container.appendChild(this.Fdiv);
	this.Container.appendChild(this.Sdiv);
	this.Container.appendChild(this.SBdiv);
}

TextBrowser.prototype.ReturnButtonPress = function() {
	MainWindow.removeChild(TextBrowserDiv.Container);
	MainWindow.appendChild(MainMenuDiv.Load());
}

TextBrowser.prototype.TextBrowserMaker = function(string_SearchParamater) {

	if(this.Table) { 
		if(this.Table.Table) {
			var parent = this.Table.Table.parentElement;
			if(parent) { parent.removeChild(this.Table.ReturnTable()); }
			this.Table = null;
		}
	}

	this.Table = new Table("TextTable");
	 
	this.Table.ColumnHeaders(FileList.List[0]);



	if(string_SearchParamater) {
		//create pattern from input
		var patt = RegExp(string_SearchParamater, "ig"); 

		/*Test each value in all cells in the table with the pattern
			-If successful -> AddRow
			-Else fuck off
		*/
		var AddRow = [];
		
		for(var i=0; i<FileList.List.length; i++) {
			
			for(var key in FileList.List[i]) {
				if(patt.test(FileList.List[i][key])) {
					AddRow[i] = FileList.List[i];
				}
			}		
		}

		for(var i = 0; i<AddRow.length; i++) {
			if(AddRow[i]) { this.Table.AddRow(AddRow[i]) };
		}

		this.Table.Table.rows[0].style.backgroundColor = 'black';
		this.Table.Table.rows[0].style.color = 'white';
		this.Table.Table.rows[0].style.fontWeight = "bold";
	 
		for(var i = 0; i<this.Table.Table.rows[0].cells.length; i++) {
			this.Table.Table.rows[0].cells[i].style.width = "200px";
		} 

		this.Table.AddStreamButton();
	 
		this.BrowserWindow.appendChild(this.Table.ReturnTable());
	}
	else {
	 
		for(var i=0; i<FileList.List.length; i++) {
			var obj = FileList.List[i];
			this.Table.AddRow(obj);
	 
		}
	 
		this.Table.Table.rows[0].style.backgroundColor = 'black';
		this.Table.Table.rows[0].style.color = 'white';
		this.Table.Table.rows[0].style.fontWeight = "bold";
	 
		for(var i = 0; i<this.Table.Table.rows[0].cells.length; i++) {
			this.Table.Table.rows[0].cells[i].style.width = "200px";
		} 

		this.Table.AddStreamButton();
	 
		this.BrowserWindow.appendChild(this.Table.ReturnTable());
 	}

 	var Table1Sorter = new TSorter;
	Table1Sorter.init(this.Table.Table);
}

