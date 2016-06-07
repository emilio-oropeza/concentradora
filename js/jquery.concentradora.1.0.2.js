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
					componentObj.methods.getGoles();
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
					componentObj.methods.partidos(partidos);
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
					componentObj.methods.partidosPlayeras(data.playeras);
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
					var li = '<img class="banderitas img-circle" src="'+urlIndepth+'images/partidos/banderas/'+rival+'.png">';
					li += '<div class="nombre-equipos">'+array.rival+'</div>';
					li += '<div class="partido-marcador"><span class="mexico-pointer '+local+'"></span>'+marcador+'</div>';
					componentObj.methods.insertarLi(id, li);
				},
				partidosPlayeras: function(partidos){
					$("#uniformes-playeras > div").each(function(i,el){
						var ganados = $(el).find(".playeras-indi > div > .circulo-azul > span");
						var perdidos = $(el).find(".playeras-indi > div > .circulo-rojo > span");
						var empatados = $(el).find(".playeras-indi > div > .circulo-gris > span");
						var total = $(el).find(".playeras-total > p").get(1);
						$(ganados).text(partidos[i].ganados);
						$(perdidos).text(partidos[i].perdidos);
						$(empatados).text(partidos[i].empatados);
						$(total).text(partidos[i].total);
					});
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
					componentObj.methods.jugadores(jugadores);
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
						var linea = $(this).find(".linea-elemento-grafica");
						var jugador = jugadores[i];
						var img_nombre = jugador.nombre.split(" ").join("_");
						img_nombre = componentObj.methods.acentos(img_nombre);
						var img = '<img class="img-responsive img-center" src="'+urlIndepth+'images/fotos/'+img_nombre.toLowerCase()+'.png">';
						$(img).prependTo($(this).find(".fotos-elemento-grafica"));
						$('<span class="minutos-incondicionales">'+jugador.minutos+' <span>min</span></span>').appendTo($(this).find(".fotos-elemento-grafica"));
						componentObj.methods.lineHeight(linea, jugador.minutos, 1500);
						$(window).resize(function(){
							componentObj.methods.lineHeight(linea, jugador.minutos, 1500);
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
						var img = '<img class="img-responsive img-center" src="'+urlIndepth+'images/fotos/'+img_nombre+'.png">';
						if( i < 11 ){
							if(i == 0){
								componentObj.methods.goleador_activo(img_nombre, jugador);
							}
							$(img).appendTo($(this));
						}else{
							var der = 0;
							var izq = 0;
							var cabeza = 0;
							var totales = 0;
							$(jugadores).each(function(i, player){
								der += player.goles.der; 
								izq += player.goles.izq; 
								cabeza += player.goles.cabeza; 
								totales += player.goles.totales; 
							});
							var jug = {
								"nombre": "Total",
								"goles":{
									"der": der,
									"izq": izq,
									"cabeza": cabeza,
									"totales": totales
								}
							};
							img_nombre = jug.nombre;
							jugador = jug;
						}
						
						$(this).hover(function(){
							componentObj.methods.goleador_activo(img_nombre, jugador);
						});
						$(this).focus(function(){
							componentObj.methods.goleador_activo(img_nombre, jugador);
						});
					});
				},
				goleador_activo: function(img_nombre, jugador){
					var img_url = urlIndepth + "images/fotos/"+img_nombre+"_cara.png";
					$("#goaledor-head").attr("src", img_url);
					$("#goaledor-head").error(function(){
						img_url = urlIndepth + "images/fotos/Total_cara.png";
						$("#goaledor-head").attr("src", img_url);
					});
					$("#flecha-cabeza").find("span").text(jugador.goles.cabeza);
					$("#flecha-pie-der").find("span").text(jugador.goles.izq);
					$("#flecha-pie-izq").find("span").text(jugador.goles.der);
					$("#nombre-goleador").text(jugador.nombre);
					$("#goles-goleador").text(jugador.goles.totales);
				},
				getGoles: function(){
					componentObj.methods.goles(goles);
				},
				goles: function(data){
					componentObj.methods.golesPorTiempos(data.tiempos);
					data.equipos.sort(componentObj.methods.ordenPorGoles2);
					componentObj.methods.golesPorEquipos(data.equipos);	
					componentObj.methods.golesPorZonas(data.zonas);
					componentObj.methods.golesPorPenales(data.penales);			
				},
				golesPorTiempos: function(goles){
					$(".graficas-content").each(function(i, el){
						var tiempo = goles[i];
						var graph = $(this).find("div");
						$(graph).find(".zona1").text(tiempo.t15);
						$(graph).find(".zona2").text(tiempo.t30);
						$(graph).find(".zona3").text(tiempo.t45);
						$(graph).find(".zona4").text(tiempo.t60);
						$(graph).find(".zona5").text(tiempo.t75);
						$(graph).find(".zona6").text(tiempo.t90);
					});
				},
				golesPorZonas: function(goles){
					$("#cancha").find("#cancha-1").text(goles.cancha1);
					$("#cancha").find("#cancha-2").text(goles.cancha2);
					$("#cancha").find("#cancha-3").text(goles.cancha3);
					$("#cancha").find("#cancha-4").text(goles.cancha4);
					$("#cancha").find("#cancha-5").text(goles.cancha5);
					$("#cancha").find("#cancha-6").text(goles.cancha6);
					$("#cancha").find("#cancha-7").text(goles.cancha7);
				},
				golesPorPenales: function(goles){
					$(".penales-stats").each(function(i, el){
						var anotados = $(this).find(".circulo > span").get(0);
						var recibidos = $(this).find(".circulo > span").get(1);
						$(anotados).text(goles[i].anotados);
						$(recibidos).text(goles[i].recibidos);
					});
				},
				golesPorEquipos: function(equipos){
					$('.equipo-goleador').each(function(i, el){
						var equipo = equipos[i];
						if(equipo != undefined){
							var linea = $(this).find(".linea-elemento-grafica");
							var img_nombre = equipo.nombre.split(" ").join("_");
							img_nombre = componentObj.methods.acentos(img_nombre);
							var img = '<img class="img-responsive img-center" src="'+urlIndepth+'images/fotos/'+img_nombre.toLowerCase()+'.png">';
							$(img).prependTo($(this).find(".fotos-elemento-grafica"));
							$('<span class="minutos-incondicionales">'+equipo.goles+' <span>goles</span></span>').appendTo($(this).find(".fotos-elemento-grafica"));
							componentObj.methods.lineHeight(linea, equipo.goles, 15);
							$(window).resize(function(){
								componentObj.methods.lineHeight(linea, equipo.goles, 15);
							});
							$(this).find(".nombre-elemento-grafica").text(equipo.nombre);
						}
					});
				},
				lineHeight: function(el, height, max_graf){
					var max_height = 0;
					if($(window).width() > 768 && $(window).width() <= 991){	
						max_height = 325;
					}else if($(window).width() > 991 && $(window).width() <= 1999){
						max_height = 425;
					}else if($(window).width() > 1999){
						max_height = 512;
					}
					var finalHeight =  (max_height * height) / max_graf;
					$(el).css({"height":finalHeight+"px"});
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
					string = string.replace("ü", "u");
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
				},
				ordenPorGoles2: function(equipo1, equipo2){
					return equipo2.goles - equipo1.goles;
				}
			}
		};
		return componentObj;
	};	
})(jQuery);