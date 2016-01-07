// Inject top nav and login modal partials 


var app = app || {};

app.validateUser = function(user, pass){

	if(user === "peter" && pass === "mcrae"){
		return true;
	}

	return false;
};

app.getUserRole = function(user){
	return true;
};

app.login = function(user, pass){

	if(this.validateUser(user, pass)){
		
		//get the users role 
		sessionStorage.userRole = this.getUserRole(user);

		//go to the post authentication page
		window.location = "./admin.html"

	} else {
		//handle error
		alert("Username and password to not match");
	}

}; 

app.logout = function(){
	//clear all saved data from the session
	sessionStorage.clear();
	window.location = "./index.html";
};

app.preLoadImages = function(images){
	for(var i=0,l=images.length;i<l;i++){
		(new Image()).src=images[i];
	}
}

$(function(){
	
	//load the top navigation
	$.get('./partials/topnav.html', function(template){
		var userData = {loggedIn:false, admin:false};
		var template = Handlebars.compile(template);
    	$('header').html(template(userData));
	});

	//handle login / out clicks
	$(document).on('click', "#login" , function(){
		console.log('login click');
		event.preventDefault();
		//fire the modal 
		$.get('./partials/loginModal.html', function(template){
			$("#loginModal").html(template);
			$("#myModal").modal();
		});

	});

	$(document).on('click', "#logout" , function(){
		app.logout();
		console.log('logout click');
	});

	//handle login form submit
	$(document).on('submit', "#loginForm" , function(event){
		//app.validate();
		event.preventDefault();
		var data = $("#loginForm :input").serializeArray();
		var user = data[0].value, 
			pass = data[1].value; 
		app.login(user, pass);
		
		
	});



});





