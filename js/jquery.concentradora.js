(function($){
	$.fn.concentradora = function(options){
		return this.each(function() {
			var element = $(this);						
			if (element.data('concentradora')) return;
			var myplugin = new Concentradora(this, options);
			element.data('concentradora', myplugin);
			element.data('concentradora').methods.init();			
		});
	};
	
	var Concentradora = function(target, options ){
		var componentObj = {
			methods:{
				init:function(){
					componentObj.methods.getPartidos();
					componentObj.methods.getJugadores();
					$("#partidos-desgloce > div").each(function(num, val){
						var i = $(this).find("i");
						$(this).hover(function(){
							componentObj.methods.showPartidos(i, val);
						});
						$(this).focus(function(){
							componentObj.methods.showPartidos(i, val);
						});
					});
				},
				getPartidos: function(){
					$.getJSON(urlIndepth+"json/partidos.json", componentObj.methods.partidos);
				},
				partidos: function(data){
					var total = data.partidos.length;
					var partidosOficiales = 0;
					var partidosAmistosos = 0;
					var oficialesGanados = 0;
					var oficialesEmpatados = 0;
					var oficialesPerdidos = 0;
					var amistososGanados = 0;
					var amistososEmpatados = 0;
					var amistososPerdidos = 0;
					$.each(data.partidos, function(i, val){
						var id = "";				
						if(val.oficial){
							partidosOficiales++;
							if(val.scoreLocal == val.scoreVisitante){
								oficialesEmpatados++;
								componentObj.methods.llenado_partidos("#oficial-empatado", val);
							}else if(val.scoreLocal > val.scoreVisitante){
								if(val.mexicoIsLocal){
									componentObj.methods.llenado_partidos("#oficial-ganado", val);
									oficialesGanados++
								}else{
									componentObj.methods.llenado_partidos("#oficial-perdido", val);
									oficialesPerdidos++
								}
							}else{
								if(!val.mexicoIsLocal){
									componentObj.methods.llenado_partidos("#oficial-ganado", val);
									oficialesGanados++
								}else{
									componentObj.methods.llenado_partidos("#oficial-perdido", val);
									oficialesPerdidos++
								}
							}
						}else{
							partidosAmistosos++;
							if(val.scoreLocal == val.scoreVisitante){
								amistososEmpatados++;
								componentObj.methods.llenado_partidos("#amistoso-empatado", val);
							}else if(val.scoreLocal > val.scoreVisitante){
								if(val.mexicoIsLocal){
									componentObj.methods.llenado_partidos("#amistoso-ganado", val);
									amistososGanados++
								}else{
									componentObj.methods.llenado_partidos("#amistoso-perdido", val);
									amistososPerdidos++
								}
							}else{
								if(!val.mexicoIsLocal){
									componentObj.methods.llenado_partidos("#amistoso-ganado", val);
									amistososGanados++
								}else{
									componentObj.methods.llenado_partidos("#amistoso-perdido", val);
									amistososPerdidos++
								}
							}
						}
					});
					var data_oficiales = [oficialesGanados, oficialesEmpatados, oficialesPerdidos];
					var data_amistosos = [amistososGanados, amistososEmpatados, amistososPerdidos];
					$("#partidos-desgloce > div").each(function(i, v){
						var total = 0;
						if(i < 3){
							total = data_oficiales[i];
						}else{
							total = data_amistosos[i-3];
						}
						$(this).find(".circulo span").text(total);
					});					
					componentObj.methods.insertarGrafico("canvas-oficiales", data_oficiales);
					componentObj.methods.insertarGrafico("canvas-amistosos", data_amistosos);
					$("#partidos-total").text(total);
					$($(".abs_center").get(0)).find("span").text(partidosOficiales);
					$($(".abs_center").get(1)).find("span").text(partidosAmistosos);
				},
				insertarGrafico: function(id, data){
					var ctx = document.getElementById(id).getContext("2d");
					var config = {
					    type: 'doughnut',
					    data: {
					        datasets: 
					        [{
						        data: data,
					            backgroundColor: ["#384370","#3e4243","#ca223f"],
					        }],
					            labels: ["Ganados","Empatados","Perdidos"]
					        },
					    options: {
					        responsive: true,
					        cutoutPercentage: 80,
					        legend:{
					        	display: false
					        }
					    }
					};
					var chart = new Chart(ctx, config);
				},
				llenado_partidos: function(id, array){
					var local = (array.mexicoIsLocal)?"mexico-local":"mexico-visitante";
					var marcador = array.scoreLocal + " - " + array.scoreVisitante;
					var rival = array.rival;
					rival = rival.replace(" ", "");
					rival = componentObj.methods.acentos(rival);
					rival = rival.toLowerCase();
					var li = '<img class="banderitas img-circle" src="images/partidos/banderas/'+rival+'.png">';
					li += '<div class="nombre-equipos">'+array.rival+'</div>';
					li += '<div class="partido-marcador"><span class="mexico-pointer '+local+'"></span>'+marcador+'</div>';
					componentObj.methods.insertarLi(id, li);
				},
				showPartidos: function(i, val){
					if( $(val).height() == "198"){
						componentObj.methods.autoHeightAnimate($(val), 500);
						$(i).removeClass("fa-angle-up");
						$(i).addClass("fa-angle-down");
					}else{
						$(val).stop().animate({ height: 198 }, 500);
						$(i).removeClass("fa-angle-down");
						$(i).addClass("fa-angle-up");
					}
				},
				getJugadores: function(){
					$.getJSON(urlIndepth+"json/jugadores.json", componentObj.methods.jugadores);
				},
				jugadores: function(data){
					$.each(data.jugadores, function(i, val){
						var club = "#"+val.club.toLowerCase();
						club = componentObj.methods.acentos(club);
						club = club.replace(" ", "_");
						if($(club).length > 0){
							componentObj.methods.insertarLi(club, val.nombre);
						}
					});
					data.jugadores.sort(componentObj.methods.ordenPorMinutos);
					componentObj.methods.insertInco(data.jugadores);
					data.jugadores.sort(componentObj.methods.ordenPorGoles);
					componentObj.methods.insertGol(data.jugadores);
				},
				insertInco: function(jugadores){
					$('.jugadores-incondicionales').each(function(i, el){
						var jugador = jugadores[i];
						var img_nombre = jugador.nombre.split(" ").join("_");
						img_nombre = componentObj.methods.acentos(img_nombre);
						var img = '<img class="img-responsive img-center" src="images/fotos/'+img_nombre.toLowerCase()+'.png">';
						$(img).prependTo($(this).find(".fotos-elemento-grafica"));
						$('<span class="minutos-incondicionales">'+jugador.minutos+' <span>min</span></span>').appendTo($(this).find(".fotos-elemento-grafica"));
						componentObj.methods.lineHeight($(this).find(".linea-elemento-grafica"), jugador.minutos);
						$(window).resize(function(){
							componentObj.methods.lineHeight($(this).find(".linea-elemento-grafica"), jugador.minutos);
						});
						$(this).find(".nombre-elemento-grafica").text(jugador.nombre);
					});
				},
				insertGol:function(jugadores){
					$(".goleadores-jugadores").each(function(i, el){
						var jugador = jugadores[i];
						var img_nombre = jugador.nombre.split(" ").join("_");
						img_nombre = componentObj.methods.acentos(img_nombre);
						img_nombre = img_nombre.toLowerCase();
						var img = '<img class="img-responsive img-center" src="images/fotos/'+img_nombre+'.png">';
						if( i < 11 ){
							if(i == 0){
								componentObj.methods.goleador_activo(img_nombre, jugador);
							}
							$(img).appendTo($(this));
						}
						$(this).click(function(){
							componentObj.methods.goleador_activo(img_nombre, jugador);
						});
					});
				},
				goleador_activo: function(img_nombre, jugador){
					var img_url = urlIndepth + "images/fotos/"+img_nombre+"_cara.png";
					$("#goaledor-head").attr("src", img_url);
					$("#flecha-cabeza").find("span").text(jugador.goles.cabeza);
					$("#flecha-pie-der").find("span").text(jugador.goles.der);
					$("#flecha-pie-izq").find("span").text(jugador.goles.izq);
					$("#nombre-goleador").text(jugador.nombre);
					$("#goles-goleador").text(jugador.goles.totales);
				},
				lineHeight: function(el, height){
					var max_height = 325;
					if($(window).width() > 991){
						max_height = 425;
					}else if($(window).width() > 1999){
						max_height = 512;
					}
					var finalHeight =  (max_height * height) / 1500;
					$(el).height(finalHeight);
				},
				autoHeightAnimate: function(element, time){
  					var curHeight = (element).height(); 
     				autoHeight = element.css('height', 'auto').height(); 
    	  			element.height(curHeight); 
    	  			element.stop().animate({ height: autoHeight }, parseInt(time));
				},
				insertarLi: function(id, li){
					var container = $(id).find("ul");
					var li = $("<li>"+li+"</li>").appendTo(container);
				},
				acentos: function(string){
					string = string.replace("á", "a");
					string = string.replace("é", "e");
					string = string.replace("í", "i");
					string = string.replace("ó", "o");
					string = string.replace("ú", "u");
					string = string.replace("Á", "A");
					string = string.replace("É", "E");
					string = string.replace("Í", "I");
					string = string.replace("Ó", "O");
					string = string.replace("Ú", "U");
					string = string.replace("ñ", "n");
					string = string.replace("Ñ", "N");
					return string;
				},
				ordenPorMinutos: function(jugador1, jugador2){
					return jugador2.minutos - jugador1.minutos;
				},
				ordenPorGoles: function(jugador1, jugador2){
					return jugador2.goles.totales - jugador1.goles.totales;
				}
			}
		};
		return componentObj;
	};	
})(jQuery);