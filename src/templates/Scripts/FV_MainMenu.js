function MainMenu() {
	this.Container = document.createElement("div");
	this.VideoButton = null;
	this.AudioButton = null;
	this.ImageButton = null;
	this.TextButton = null;
	this.OtherButton = null;

	this.CreateButtons();
}

MainMenu.prototype.Load = function () {
	return this.Container;
}

MainMenu.prototype.MouseOverChange = function (e) {
	
	var text = e.target;
	text.style.color = "white";
	text.style.fontSize = "100px";
}

MainMenu.prototype.MouseOutChange = function (e) {

	var text = e.target;
	text.style.color = "#616D7E";
	text.style.fontSize = "70px";
}

MainMenu.prototype.CreateButtons = function() {

	this.VideoButton = document.createElement('div');
	this.VideoButton.innerHTML = "Movies";
	this.VideoButton.style.fontSize = "70px";
	this.VideoButton.style.color = "#616D7E";
	this.VideoButton.style.textAlign = "center";
	this.VideoButton.setAttribute("position", "absolute");
	this.VideoButton.onclick = this.VideoButtonPress;
	this.VideoButton.onmouseover = this.create(this, this.MouseOverChange);
	this.VideoButton.onmouseout = this.create(this, this.MouseOutChange);
	this.VideoButton.style.cursor = 'pointer';
	
	this.VBdiv = document.createElement('div');
	this.VBdiv.style.margin = "20px 0px 30px 0px";
	this.VBdiv.appendChild(this.VideoButton);

  	
	this.AudioButton = document.createElement('div');
	this.AudioButton.innerHTML = "Music";
	this.AudioButton.style.fontSize = "70px";
	this.AudioButton.style.color = "#616D7E";
	this.AudioButton.style.textAlign = "center";
	this.AudioButton.setAttribute("position", "absolute");
	this.AudioButton.onclick = this.AudioButtonPress;
	this.AudioButton.onmouseover = this.create(this, this.MouseOverChange);
	this.AudioButton.onmouseout = this.create(this, this.MouseOutChange);
	this.AudioButton.style.cursor = 'pointer';
	
	this.ABdiv = document.createElement('div');
	this.ABdiv.style.margin = "20px 0px 30px 0px";
	this.ABdiv.appendChild(this.AudioButton);
  	
	this.TextButton = document.createElement('div');
	this.TextButton.innerHTML = "Documents";
	this.TextButton.style.fontSize = "70px";
	this.TextButton.style.color = "#616D7E";
	this.TextButton.style.textAlign = "center";
	this.TextButton.setAttribute("position", "absolute");
	this.TextButton.onclick = this.TextButtonPress;
	this.TextButton.onmouseover = this.create(this, this.MouseOverChange);
	this.TextButton.onmouseout = this.create(this, this.MouseOutChange);
	this.TextButton.style.cursor = 'pointer';
			
	this.TBdiv = document.createElement('div');	
	this.TBdiv.style.margin = "20px 0px 30px 0px";
	this.TBdiv.appendChild(this.TextButton);

	this.ImageButton = document.createElement('div');
	this.ImageButton.innerHTML = "Photos";
	this.ImageButton.style.fontSize = "70px";
	this.ImageButton.style.color = "#616D7E";
	this.ImageButton.style.textAlign = "center";
	this.ImageButton.setAttribute("position", "absolute");
	this.ImageButton.onclick = this.ImageButtonPress;
	this.ImageButton.onmouseover = this.create(this, this.MouseOverChange);
	this.ImageButton.onmouseout = this.create(this, this.MouseOutChange);
	this.ImageButton.style.cursor = 'pointer';
	
	this.IBdiv = document.createElement('div');
	this.IBdiv.style.margin = "20px 0px 30px 0px";
	this.IBdiv.appendChild(this.ImageButton);

	this.OtherButton = document.createElement('div');
	this.OtherButton.innerHTML = "Miscellaneous";
	this.OtherButton.style.fontSize = "70px";
	this.OtherButton.style.color = "#616D7E";
	this.OtherButton.style.textAlign = "center";
	this.OtherButton.setAttribute("position", "absolute");
	this.OtherButton.onclick = this.OtherButtonPress;
	this.OtherButton.onmouseover = this.create(this, this.MouseOverChange);
	this.OtherButton.onmouseout = this.create(this, this.MouseOutChange);
	this.OtherButton.style.cursor = 'pointer';
	
	this.OBdiv = document.createElement('div');
	this.OBdiv.style.margin = "20px 0px 30px 0px";
	this.OBdiv.appendChild(this.OtherButton);
	
	this.Container.appendChild(this.VBdiv);
	this.Container.appendChild(this.ABdiv);
	this.Container.appendChild(this.TBdiv);
	this.Container.appendChild(this.IBdiv);
	this.Container.appendChild(this.OBdiv);
};

MainMenu.prototype.TestButtonPress = function() {
	console.log(this);
}

MainMenu.prototype.VideoButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!VideoBrowserDiv) {
		VideoBrowserDiv = new VideoBrowser("video");
	}
	VideoBrowserDiv.Load();
}

MainMenu.prototype.AudioButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!AudioBrowserDiv) {
		AudioBrowserDiv = new VideoBrowser("audio");
	}
	AudioBrowserDiv.Load();
}

MainMenu.prototype.ImageButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!ImageBrowserDiv) {
		ImageBrowserDiv = new VideoBrowser("image");
	}
	ImageBrowserDiv.Load();
}

MainMenu.prototype.TextButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!TextBrowserDiv) {
		TextBrowserDiv = new VideoBrowser("text");
	}
	TextBrowserDiv.Load();
}

MainMenu.prototype.OtherButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!OtherBrowserDiv) {
		OtherBrowserDiv = new VideoBrowser("other");
	}
	OtherBrowserDiv.Load();
}

MainMenu.prototype.create = function(obj, func){
    var f = function(){
        var target = arguments.callee.target;
        var func = arguments.callee.func;
        return func.apply(target, arguments);
    };
    
    f.target = obj;
    f.func = func;
    return f;
}

