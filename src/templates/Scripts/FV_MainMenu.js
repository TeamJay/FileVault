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

MainMenu.prototype.CreateButtons = function() {
	this.VideoButton = document.createElement('button');
	this.VBdiv = document.createElement('div');
	this.VideoButton.setAttribute('type','button');
	this.VBdiv.setAttribute('id', "sup");
	this.VideoButton.innerHTML = "Video";
	this.VideoButton.setAttribute("position", "absolute");
	this.VBdiv.setAttribute("position", "relative");
	this.VideoButton.style.width = "300px";
	this.VideoButton.style.height = "100px";
	this.VideoButton.style.fontSize = "60px";
	this.VBdiv.style.margin = "40px 0px 0px 41%";
	this.VBdiv.appendChild(this.VideoButton);
//	    slidingElement.addEventListener('touchstart', this.create(this, this.placement), false)
  //  slidingElement.addEventListener('touchmove', this.create(this, this.movement), false)
  	//this.VideoButton.onclick = this.create(this, this.TestButtonPress);
  	this.VideoButton.onclick = this.VideoButtonPress;
	
	
	this.AudioButton = document.createElement('button');
	this.ABdiv = document.createElement('div');
	this.AudioButton.setAttribute('type','button');
	this.AudioButton.innerHTML = "Audio";
	this.AudioButton.style.width = "300px";
	this.AudioButton.style.height = "100px";
	this.ABdiv.style.margin = "40px 0px 0px 41%";
	this.AudioButton.style.fontSize = "60px";
	this.AudioButton.setAttribute("position", "absolute");
	this.ABdiv.appendChild(this.AudioButton);
	this.AudioButton.onclick = this.AudioButtonPress;	
		
	this.TextButton = document.createElement('button');
	this.TBdiv = document.createElement('div');
	this.TextButton.setAttribute('type','button');
	this.TextButton.innerHTML = "Text";
	this.TextButton.style.width = "300px";
	this.TextButton.style.height = "100px";
	this.TBdiv.style.margin = "40px 0px 0px 41%";	
	this.TextButton.setAttribute("position", "absolute");
	this.TextButton.style.fontSize = "60px";
	this.TBdiv.appendChild(this.TextButton);
	this.TextButton.onclick = this.TextButtonPress;
	
	this.ImageButton = document.createElement('button');
	this.IBdiv = document.createElement('div');
	this.ImageButton.setAttribute('type','button');
	this.ImageButton.innerHTML = "Images";
	this.ImageButton.style.width = "300px";
	this.ImageButton.style.height = "100px";
	this.IBdiv.style.margin = "40px 0px 0px 41%";
	this.ImageButton.setAttribute("position", "absolute");
	this.ImageButton.style.fontSize = "60px";
	this.IBdiv.appendChild(this.ImageButton);
	this.ImageButton.onclick = this.ImageButtonPress;
		
	this.OtherButton = document.createElement('button');
	this.OBdiv = document.createElement('div');
	this.OtherButton.setAttribute('type','button');
	this.OtherButton.innerHTML = "Other";
	this.OtherButton.style.width = "300px";
	this.OtherButton.style.height = "100px";
	this.OBdiv.style.margin = "40px 20px 0px 41%";
	this.OtherButton.style.fontSize = "60px";
	this.OtherButton.setAttribute("position", "absolute");
	this.OBdiv.appendChild(this.OtherButton);
	this.OtherButton.onclick = this.OtherButtonPress;
	
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
		VideoBrowserDiv = new VideoBrowser();
	}
	VideoBrowserDiv.Load();
}

MainMenu.prototype.AudioButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!AudioBrowserDiv) {
		AudioBrowserDiv = new AudioBrowser();
	}

	AudioBrowserDiv.Load();
}

MainMenu.prototype.ImageButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!ImageBrowserDiv) {
		ImageBrowserDiv = new ImageBrowser();
	}
	ImageBrowserDiv.Load();
}

MainMenu.prototype.TextButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!TextBrowserDiv) {
		TextBrowserDiv = new TextBrowser();
	}
	TextBrowserDiv.Load();
}

MainMenu.prototype.OtherButtonPress = function() {
	//Unappend existing stuff
	MainWindow.removeChild(MainMenuDiv.Container);

	//Create the video menu...
	if(!OtherBrowserDiv) {
		OtherBrowserDiv = new OtherBrowser();
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

