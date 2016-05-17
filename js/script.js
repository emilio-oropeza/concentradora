$(document).ready(function(){
	$("#portada").height(screenHeight());
	$(window).resize(function(){
		$("#portada").height(screenHeight());
	});
	$("article").concentradora();

	$("#nombres-estados > div").each(function(){
		$(this).hover(inEstados, outEstados);
		$(this).focus(inEstados);
		$(this).blur(outEstados);
	});
	$(".mapa-estados").each(function(){
		$(this).hover(inEstados, outEstados);
		$(this).focus(inEstados);
		$(this).blur(outEstados);
	});
});

function inEstados(){
	var estado = $(this).attr('class').split(" ")[1];
	var estado_class = "."+estado;
	$(estado_class).each(function(){
		if(this.tagName == 'polygon'){
			$(this).attr('class', 'mapa-estados '+estado+' active');
		}else{
			$(this).addClass("active");
		}
	});
	//$(estado).addClass("active");
}
function outEstados(){
	var estado = $(this).attr('class').split(" ")[1];
	var estado_class = "."+estado;
	$(estado_class).each(function(){
		if(this.tagName == 'polygon'){
			$(this).attr('class', 'mapa-estados '+estado);
		}else{
			$(this).removeClass("active");
		}
	});
	
}

function barsDisapear(){
	$("#nav-bar-stats").remove();
	$("#mobile-horizontal-menu").remove();
	//$("#top-bar-wrapper").remove();
	//$("#mobilemenu").remove();
}
function screenHeight(){
	var height = $(window).height();
	return height - 60;
}















