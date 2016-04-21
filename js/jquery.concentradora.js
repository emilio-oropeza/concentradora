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
						if(val.oficial){
							partidosOficiales++;
							if(val.scoreLocal == val.scoreVisitante){
								oficialesEmpatados++;
							}else if(val.scoreLocal > val.scoreVisitante){
								(val.mexicoIsLocal)?(oficialesGanados++):(oficialesPerdidos++);
							}else{
								(!val.mexicoIsLocal)?(oficialesGanados++):(oficialesPerdidos++);
							}
						}else{
							partidosAmistosos++;
							if(val.scoreLocal == val.scoreVisitante){
								amistososEmpatados++;
							}else if(val.scoreLocal > val.scoreVisitante){
								(val.mexicoIsLocal)?(amistososGanados++):(amistososPerdidos++);
							}else{
								(!val.mexicoIsLocal)?(amistososGanados++):(amistososPerdidos++);
							}
						}
					});
					var data_oficiales = [oficialesGanados, oficialesEmpatados, oficialesPerdidos];
					var data_amistosos = [amistososGanados, amistososEmpatados, amistososPerdidos];
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
				autoHeightAnimate: function(element, time){
  					var curHeight = (element).height(); 
     				autoHeight = element.css('height', 'auto').height(); 
    	  			element.height(curHeight); 
    	  			element.stop().animate({ height: autoHeight }, parseInt(time));
				}
			}
		};
		return componentObj;
	};	
})(jQuery);