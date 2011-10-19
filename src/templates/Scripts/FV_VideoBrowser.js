
/*
jQuery.download = function(url, data, method){
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};
*/

function VideoBrowser(type) {
	this.type = type;
	this.MainWindow = MainWindow;
	this.Container = document.createElement("div");
	this.UploadForm = document.createElement("form");
	this.UploadButton = document.createElement("input");
	this.DeleteButton = document.createElement("button");
	this.SubmitForm = document.createElement("input");
	this.DownloadButton = document.createElement("button");
	this.SearchButton = document.createElement("button");
	this.FilterBy = document.createElement("select");
	this.DownloadForm = document.createElement("form");
	//Filter list is document.createElement(option) then innerHTML for text...
	this.SearchBar = document.createElement("input");

	this.BrowserWindow = document.createElement("div");

	this.ReturnButton = document.createElement("button");

	this.Table = null;
	this.ReturnedData = null;
	this.Output = [];
	this.Files = null
	
	this.DownloadInterval = null;
	this.DownloadListName = [];
	this.DownloadListSource = [];
	this.DeleteList = null;

	var closure = this;

	this.GenerateLayout();
	//update browser

	$.ajax({
		url: "/content",
		cache: false,
		data: {content : this.type},
		success: function(html){
			$("#BrowserWindow").html(html);	
			closure.ReturnedData = objectList;	
			closure.VideoBrowserMaker();			
		}
	});
	
	//this.intervalInt = setInterval(this.VideoBrowserMaker, 500);
}

VideoBrowser.prototype.PollServer = function() {
	var closure = this;
	$.ajax({
		url: "/content",
		cache: false,
		data: {content : this.type},
		success: function(html){
			$("#BrowserWindow").html(html);	
			closure.ReturnedData = objectList;	
			closure.VideoBrowserMaker();			
		}
	});
}

VideoBrowser.prototype.Load = function () {
	this.MainWindow.appendChild(this.Container);
}

VideoBrowser.prototype.GenerateLayout = function() {

	//Top Level Buttons

	//upload
	this.UBdiv = document.createElement('div');
	this.UBdiv.style.position = "relative";
	this.UBdiv.style.margin = "0px 0px 0px 300px";
	this.UBdiv.style.float = "left";
	this.UBdiv.style.cssFloat = "left";
	
	this.UploadForm.setAttribute('enctype', 'multipart/form-data');
	this.UploadForm.method = 'post';
	this.UploadForm.action = '/upload';
	
	this.UploadButton.type = 'file';
	this.UploadButton.id = 'files';
	this.UploadButton.name = 'files[]';
	this.UploadButton.multiple = true;
	this.UploadButton.style.width = "300px";
	this.UploadButton.style.fontSize = "15px";	
	this.UploadButton.style.margin = "10px 0px 0px 0px";
	
	this.SubmitForm.type = 'submit';
	this.SubmitForm.value = "Upload"
	this.SubmitForm.style.fontSize = "15px";
	
	this.UBdiv.appendChild(this.UploadForm);
	this.UploadForm.appendChild(this.UploadButton);
	this.UploadForm.appendChild(this.SubmitForm);
	
	this.DBdiv = document.createElement('div');
	this.DBdiv.style.position = "relative";
	this.DownloadButton.setAttribute('type','button');
	this.DownloadButton.innerHTML = "Download";
	this.DownloadButton.style.width = "80px";
	this.DownloadButton.style.height = "30px";
	this.DownloadButton.style.fontSize = "15px";
	this.DBdiv.style.margin = "10px 0px 0px 10px";
	this.DBdiv.appendChild(this.DownloadButton);
	this.DBdiv.style.float = "left";
	this.DBdiv.style.cssFloat = "left";
  	this.DownloadButton.onclick = this.create(this,this.DownloadButtonPress);
  	
	//delete button
	this.DeBdiv = document.createElement('div');
	this.DeBdiv.style.position = "relative";
	this.DeleteButton.setAttribute('type','button');
	this.DeleteButton.innerHTML = "Delete";
	this.DeleteButton.style.width = "80px";
	this.DeleteButton.style.height = "30px";
	this.DeleteButton.style.fontSize = "15px";
	this.DeBdiv.style.margin = "10px 0px 0px 10px";
	this.DeBdiv.appendChild(this.DeleteButton);
	this.DeBdiv.style.float = "left";
	this.DeBdiv.style.cssFloat = "left";
  	this.DeleteButton.onclick = this.create(this,this.DeleteButtonPress);	
	
  	//filter
	this.Fdiv = document.createElement('div');
	this.Fdiv.style.position = "relative";
	this.Fdiv.innerHTML = "Filter Search By:";
	this.FilterBy.style.width = "200px";
	this.FilterBy.style.fontSize = "15px";
	this.Fdiv.style.color = "white";
	this.Fdiv.style.fontSize = "15px";
	this.Fdiv.style.margin = "10px 0px 0px 30px";
	this.FilterBy.style.margin = "0px 0px 0px 5px";
	this.Fdiv.appendChild(this.FilterBy);
	this.Fdiv.style.float = "left";
	this.Fdiv.style.cssFloat = "left";

	var OptionsArray = ["All","Name", "Source", "Type"];

	for(var i=0; i<OptionsArray.length; i++) {
		var Option = document.createElement("option");
		Option.innerHTML = OptionsArray[i];
		this.FilterBy.appendChild(Option);
	}
	

	//search input
	this.Sdiv = document.createElement('div');
	this.Sdiv.style.position = "relative";
	this.Sdiv.innerHTML = "";
	this.SearchBar.style.width = "200px";
	this.Sdiv.style.color = "white";
	this.SearchBar.style.fontSize = "15px";
	this.Sdiv.style.fontSize = "15px";
	this.SearchBar.style.margin = "0px 0px 0px 5px";
	this.Sdiv.style.margin = "10px 0px 0px 0px";
	this.Sdiv.appendChild(this.SearchBar);
	this.Sdiv.style.float = "left";
	this.Sdiv.style.cssFloat = "left";

	//search button
	this.SBdiv = document.createElement('div');
	this.SBdiv.style.position = "relative";
	this.SearchButton.setAttribute('type','button');
	this.SearchButton.innerHTML = "Search";
	this.SearchButton.style.width = "60px";
	this.SearchButton.style.fontSize = "15px";
	this.SBdiv.style.margin = "10px 0px 0px 5px";
	this.SBdiv.appendChild(this.SearchButton);
	this.SBdiv.style.float = "left";
	this.SBdiv.style.cssFloat = "left";
  	this.SearchButton.onclick = this.create(this,this.SearchButtonPress);

  	this.AppendButtons();

	//The Library Browser Window(content window)
  	this.BrowserWindow.id = "BrowserWindow";
	this.BrowserWindow.style.backgroundColor = "rgba(218,218,218,1)";
	this.BrowserWindow.style.mozBorderRadius = "15px";
	this.BrowserWindow.style.borderRadius = "15px";
	this.BrowserWindow.style.position = "absolute";
	this.BrowserWindow.style.width = "1100px";
	this.BrowserWindow.style.height = "700px";
	this.BrowserWindow.style.margin = "45px 0px 0px 300px";
	this.BrowserWindow.style.overflow = "auto";

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
	this.ReturnButton.onclick = this.create(this,this.ReturnButtonPress);

	this.Container.appendChild(this.RBdiv);	
}

//---events---

VideoBrowser.prototype.UploadButtonPress = function(evt) {
	alert(evt.target.files);
	this.Files = evt.target.files; // FileList    	
}

VideoBrowser.prototype.DownloadButtonPress = function(evt) {

	if(this.Table) {
		this.DownloadListName = [];
		this.DownloadListSource = [];
	
		var SelectedRows = this.Table.ReturnSelectedRows();
		if(SelectedRows.length != 0) {

			for(var j=0; j< SelectedRows.length; j++) {
			
				for(var i=0; i< SelectedRows[j].cells.length; i++) {
					if(SelectedRows[j].cells[i].id == "Name") {

						this.DownloadListName.push(SelectedRows[j].cells[i].innerHTML);

					}
					if(SelectedRows[j].cells[i].id == "Source") {

						this.DownloadListSource.push(SelectedRows[j].cells[i].innerHTML);
					}
				}
			}
			var closure = this;
			console.log(this.DownloadListName);
			this.Download();			
		}
	}	
}

VideoBrowser.prototype.DeleteButtonPress = function(evt) {
	
	if(this.Table) {

		this.DeleteList = [];
	
		var SelectedRows = this.Table.ReturnSelectedRows();
		if(SelectedRows.length != 0) {

			for(var j=0; j< SelectedRows.length; j++) {
			
				for(var i=0; i< SelectedRows[j].cells.length; i++) {
					if(SelectedRows[j].cells[i].id == "Name") {

					this.DeleteList.push(SelectedRows[j].cells[i].innerHTML);

					}
				}
			}
			var closure = this;
			
			this.Delete();			
		}
	}	
}

VideoBrowser.prototype.SearchButtonPress = function(evt) {
	this.VideoBrowserMaker(this.SearchBar.value);
}

VideoBrowser.prototype.Download = function() {

	var closure = this;

	var downloadForm = document.createElement("FORM");
	downloadForm.method = "post";
	downloadForm.action = "/download";

	var downloadButton = document.createElement("input");
	downloadButton.type = "hidden";
	downloadButton.name = "NAME";
	console.log(closure.DownloadListName[0]);
	downloadButton.value = closure.DownloadListName[0];

	var downloadButtonB = document.createElement("input");
	downloadButtonB.type = "submit";
	downloadButtonB.value = "Download";
	
	downloadForm.appendChild(downloadButton);
	downloadForm.appendChild(downloadButtonB);

	//document.body.appendChild(downloadForm);
	downloadButtonB.click();

/*if(this.DownloadListName.length == 1) {
		$.download('/download', { name : "NAME", value : closure.DownloadListName[0] });
	}
	else {
		for(var i =0; i<this.DownloadListSource.length; i++) {
			var iframe = document.createElement("iframe");
			iframe.name = "temp";
			iframe.src=this.DownloadListSource[i];
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}
	}
*/
	
	//http://localhost:8080/download?name=NAME&value=13+Lee.wma
/*	$.ajax({
		  url: "/download",
		  type: 'POST',
		  data: { name : "NAME", value: closure.DownloadList[i]},
		  success: function(data, status){
			console.log(data);
		  }
		});
	}	
*/	
	//setTimeout(this.RemoveIframes, 500);
}

VideoBrowser.prototype.RemoveIframes = function() {

	var toremove = document.getElementsByName('temp');
	for(var i =0; i< toremove; i++) {
		document.body.removeChild(toremove[i]);
	}
}

VideoBrowser.prototype.Delete = function() {

	var closure = this;

	for(var i =0; i<this.DeleteList.length; i++) {

		$.ajax({
		  url: "/delete",
		  type: 'POST',
		  data: {name : "NAME", value: closure.DeleteList[i]},
		  success: function(data, status){
		    closure.PollServer();
		  }
		});
	}	
}

//helper add buttons
VideoBrowser.prototype.AppendButtons = function() {
	this.Container.appendChild(this.UBdiv);
	this.Container.appendChild(this.DBdiv);
	this.Container.appendChild(this.DeBdiv);
	this.Container.appendChild(this.Fdiv);
	this.Container.appendChild(this.Sdiv);
	this.Container.appendChild(this.SBdiv);
}

//swap to main menu
VideoBrowser.prototype.ReturnButtonPress = function() {
	console.log(this);
	if(this.type == "video") { MainWindow.removeChild(VideoBrowserDiv.Container); }
	if(this.type == "text") { MainWindow.removeChild(TextBrowserDiv.Container); }
	if(this.type == "audio") { MainWindow.removeChild(AudioBrowserDiv.Container); }
	if(this.type == "image") { MainWindow.removeChild(ImageBrowserDiv.Container); }
	if(this.type == "other") { MainWindow.removeChild(OtherBrowserDiv.Container); }

	MainWindow.appendChild(MainMenuDiv.Load());
}

VideoBrowser.prototype.create = function(obj, func){
    var f = function(){
        var target = arguments.callee.target;
        var func = arguments.callee.func;
        return func.apply(target, arguments);
    };    
    f.target = obj;
    f.func = func;
    return f;
}

//content browser list
VideoBrowser.prototype.VideoBrowserMaker = function(string_SearchParamater) {

if(this.ReturnedData) {
	clearInterval(this.intervalInt);
	if(this.Table) { 
		if(this.Table.Table) {
			var parent = this.Table.Table.parentNode;
			if(parent) { parent.removeChild(this.Table.ReturnTable()); }
			this.Table = null;
		}
	}

	this.Table = new Table("VideoTable", this);
	this.Table.Table.style.width = "100%";
	 
	this.Table.ColumnHeaders(this.ReturnedData.List[0]);

	if(string_SearchParamater) {
		//create pattern from input
		var patt = RegExp(string_SearchParamater, "i"); 

		//Test each value in all cells in the table with the pattern
		//	-If successful -> AddRow
		//	-Else cut off
		
		var AddRow = [];
		
		for(var i=0; i<this.ReturnedData.List.length; i++) {
			
			for(var key in this.ReturnedData.List[i]) {
				
				//Check key against the selected option...
				if(this.FilterBy.value == "All") {
					if(patt.test(this.ReturnedData.List[i][key])) {
						AddRow[i] = this.ReturnedData.List[i];
					}
				}

				else {

					if(key == this.FilterBy.value) {
						if(patt.test(this.ReturnedData.List[i][key])) {
							console.log(this.ReturnedData.List[i]);
							AddRow[i] = this.ReturnedData.List[i];
						}
					}

				}
			}		
		}

		for(var i = 0; i<AddRow.length; i++) {
			if(AddRow[i]) { this.Table.AddRow(AddRow[i]) };
		}

		this.Table.Table.rows[0].style.backgroundColor = 'black';
		this.Table.Table.rows[0].style.color = 'white';
		this.Table.Table.rows[0].style.fontWeight = "bold";

 		for(var i=1; i<this.Table.Table.rows.length; i++) {
			this.Table.Table.rows[i].style.backgroundColor = "lightslategray";
		}

		this.Table.AddCheckBox();
		this.Table.RenameFileButton();	
		this.Table.AddStreamButton();
		
		
		this.BrowserWindow.appendChild(this.Table.ReturnTable());
	}
	else {

		for(var i=0; i<this.ReturnedData.List.length; i++) {
			var obj = this.ReturnedData.List[i];
			this.Table.AddRow(obj);	 
		}
	 
		this.Table.Table.rows[0].style.backgroundColor = 'black';
		this.Table.Table.rows[0].style.color = 'white';
		this.Table.Table.rows[0].style.fontWeight = "bold";

		for(var i=1; i<this.Table.Table.rows.length; i++) {
			this.Table.Table.rows[i].style.backgroundColor = "lightslategray";
		}
	 

		if(this.ReturnedData.List.length > 0) {

		this.Table.AddCheckBox();
		this.Table.RenameFileButton();	
		this.Table.AddStreamButton();
					

		}
	 
		this.BrowserWindow.appendChild(this.Table.ReturnTable());		
 	}

 	var Table1Sorter = new TSorter;
	Table1Sorter.init(this.Table.Table);
	}
}

