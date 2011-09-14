function ModalStream(src) {
	this.MainWindow = MainWindow;

	this.Src = "";

	for(var i=0; i<src.cells.length; i++) {
		if(src.cells[i].id == "Source") { this.Src = src.cells[i].innerHTML; }
	}

	console.log(this.Src);
	
	this.Container = document.createElement("div");
	this.Container.style.height = document.height + "px";
	this.Container.style.width =  document.width + "px";
	this.Container.style.backgroundColor = "grey";
	this.Container.style.opacity = "1";
	this.MainWindow.style.opacity = "0.25";
	
	this.Modal = document.createElement("div");

	document.body.appendChild(this.Container);

	this.CreateModal();
}

ModalStream.prototype.CloseModal = function() {
	this.MainWindow.style.opacity = "1";
	document.body.removeChild(this.Container);
	
}

ModalStream.prototype.CloseButton = function() {

	//Img = new Image(); 
	//Img.src = "Images/close.png";
	var Button = document.createElement("div");
	Button.id = "close";
	Button.style.float = "right";
	Button.style.cssFloat = "right";
	Button.style.width = "48px";
	Button.style.height = "18px";
	Button.style.backgroundImage = "url("+ "Images/close.png" +")";
	Button.style.cursor = 'pointer';
	Button.onclick = this.create(this,this.CloseModal);
	return Button;
}

ModalStream.prototype.CreateModal = function() {

	//Modal Window

	this.Modal.style.mozBorderRadius = "15px";
	this.Modal.style.borderRadius = "15px";
	this.Modal.style.zIndex = "10000000";
	this.Modal.style.borderStyle = "solid";
	this.Modal.style.borderWidth = "5px";
	this.Modal.style.height = "500px";
	this.Modal.style.width = "500px";
	this.Modal.style.position = "Absolute"
	this.Modal.style.backgroundColor = "white";

	this.Modal.style.top =  "50%";
	this.Modal.style.left =  "50%";
	this.Modal.style.marginTop = -500/2 + "px";
	this.Modal.style.marginLeft = -500/2 + "px";

	var Player = document.createElement("a");
	Player.className = "media {width:500, height:400}";
	Player.href = this.Src;
       this.Modal.appendChild(this.CloseButton());
        this.Modal.appendChild(Player); 
	
	this.Container.appendChild(this.Modal);	
	
	$(function() {
		console.log("here");
		$('a.media').media( { width: 500, height: 400 } );
	});
}

ModalStream.prototype.create = function(obj, func){
    var f = function(){
        var target = arguments.callee.target;
        var func = arguments.callee.func;
        return func.apply(target, arguments);
    };
    
    f.target = obj;
    f.func = func;
    return f;
}


