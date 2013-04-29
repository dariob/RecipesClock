/* 
 * GasClock
 */

function gasClock(){
    
    // Get arguments to set options passed
    var that = this, 
    args = Array.prototype.slice.call(arguments);
    this.options = args[0];    
    // propertys
    this.containerID = this.options.containerID,
    this.timerID = this.options.timerID,
    this.domID = this.options.domID,
    this.onTimerStarted = this.options.onTimerStarted,
    this.onTimerEnded = this.options.onTimerEnded,
    this.onTimerStep = this.options.onTimerStep,
    this.onTimerHalfStep = this.options.onTimerHalfStep,
    this.onTimerClick = this.options.onTimerClick,
    this.onTimerCloseRequest = this.options.onTimerCloseRequest,
    this.onTimerRecipeRequest = this.options.onTimerRecipeRequest,
    this.onHalfTime = this.options.onHalfTime,
    this.onQuarterTime = this.options.onQuarterTime,
    this.currentRecipe,
    this.totalSeconds ;
	this.stepSecond    ;
	this.stepCounter    ;
    
    //console.log(this);
    
    // Methods
    this.setTempo = function(minutes,seconds){
        that.totalSeconds = (minutes * 60)+(seconds+1);
    };
    
    this.getTempoRimanente = function(){
        return that.totalSeconds;
    };
    
    this.setRicetta = function(recipeName,seconds){
        that.totalSeconds = seconds,
        that.currentRecipe = recipeName;
    };
    
    
    this.startAnimation = function(){
       
        // Start animations
        jQuery("#"+that.timerID+".flamesBkg").sprite({
            fps:12, 
            no_of_frames: 19,
            on_last_frame:function(obj){
                // Start loop animation
                console.log(obj);
                obj.css({
                    background:"url(img.ip3/accesoLoop.png)"
                });
                obj.sprite({ 
                    fps:10, 
                    no_of_frames: 26
                });
            }
        });
    };
    
    this.stopAnimation = function(){
        jQuery("#"+that.timerID+".flamesBkg")
        .css({
            background:"url(img.ip3/accensione.png)"
        });
        
        jQuery("#"+that.timerID+".flamesBkg").destroy();
    };
    
    this.startTimer = function(){
        that.stopAnimation(); // flames
        that.startAnimation(); // flames
        that.stepCounter=0;
        // calculate fps factor for spegnimento fiamme
        //fpsFactor = (that.totalSeconds * 12) / 4 ;
		if(that.totalSeconds>52)
			fpsFactor = (that.totalSeconds/52) ;
		else
			fpsFactor = (1);
			
		that.stepSecond = Math.round(fpsFactor);
		jQuery("#"+that.timerID+"_hiderFlame").goToFrame(0);
		/*
        alert('my Factor: '+ fpsFactor);
        jQuery("#"+that.timerID+"_hiderFlame").sprite({
            fps: Math.floor(fpsFactor), 
            no_of_frames: 53,
            on_last_frame:function(obj){
                // Start loop animation
                console.log(obj,"end last frame");
                
            }
        }); 
        */
        // if setTempo is true || setRicetta is true
        that.onTimerStarted();
        halfTime    = Math.floor(that.totalSeconds * 0.50);
        quarterTime  = Math.floor(that.totalSeconds * 0.45);
        that.counter = setInterval(function(){
            that.totalSeconds -= 1;
			//goToFrame
			if(that.totalSeconds%that.stepSecond == 0 ) {
				 that.stepCounter +=1;
				 jQuery("#"+that.timerID+"_hiderFlame").goToFrame(that.stepCounter);
				 jQuery("#"+that.timerID+"_hiderFlame").spStart();
			}
			
            that.onTimerStep(that.totalSeconds);
                    
            if(that.totalSeconds === halfTime){
                that.onHalfTime(that.totalSeconds);
            } 
            if (that.totalSeconds === quarterTime){
                that.onQuarterTime(that.totalSeconds);
            }
                    
            if(that.totalSeconds <= 0){
                // Time is end
                clearInterval(that.counter);
				jQuery("#"+that.timerID+"_hiderFlame").goToFrame(52);
				jQuery("#"+that.timerID+"_hiderFlame").spStart();
                that.onTimerEnded();               
            }
            that.onTimerHalfStep(that.totalSeconds);
            //            console.log(that.totalSeconds);
            that.updateTimerDisplay(that.totalSeconds);
        }, 1000);
    };
    
    this.stopTimer = function(){
        clearInterval(that.counter);
       
    };
    
    this.destroyTimer = function(){
        // Stop timer if is running and hide dom element
        that.stopTimer();
        jQuery("#"+that.timerID).remove();
        countActiveTimers();
       
    };
    
    this.setLayoutSteps = function(steps){};
    
    this.setCloseButtonVisibility = function(){};
    
    this.updateTimerDisplay = function(secs){
        var tempoRimanente = that.secondsToTime(secs);
        jQuery("#"+that.timerID+"_timerDisplay").html(
            '<div class="counterNumbers">'+
            '<span class="hoursRemain hide">'+that.padTime(tempoRimanente.h)+':</span>'+
            '<span class="minutesRemain">'+that.padTime(tempoRimanente.m)+':</span>'+
            '<span class="secondsRemain">'+that.padTime(tempoRimanente.s)+'</span>'+
            '</div>'
            );
    };
    
    // Utils
    this.secondsToTime = function(secs) {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }
    
    this.countActiveTimers = function(){
        var totalTimers = jQuery("#timersGui > div").length;
        if(totalTimers < 4){
            jQuery("#addTimer_btn").fadeIn();
        } else {
            jQuery("#addTimer_btn").fadeOut();
        }
    }
	
    
    // /utils
    this.padTime = function(time) {
		var str = time+"";
		if(str.length==0) return str;
		if(str.length>=2) return str;
		else {
			return "0"+str;	
		}
		
	}
     
     
    // Initialize DOM
           
    //     TODO: bind phone gap device ready
    jQuery(document).ready(function(){
         
        var domContainer = jQuery("<div>")
        .attr({
            id: that.timerID, 
            "class":'fornelloContainer'
        });
        
        // adding a div for flames background
        domContainer.append("<div id='"+that.timerID+"' class='flamesBkg'>");
   
        // adding the close/destroy button for this timer
        domContainer.append("<div id='"+that.timerID+"' class='closeButton'><a href='#' id='"+that.timerID+"_closeButton' class='close'>rimuovi fornello</a></div>");
        
        // Handle click close buttom
        jQuery("#"+that.timerID+"_closeButton").live('click',function(e){
            console.log("click X")
            e.preventDefault();
            that.destroyTimer();

        });
   
   
        var recipeSelect = jQuery("<div id='recipeSelect'>");
        domContainer.append(recipeSelect);
        
        // Build select input to choose recipe
        // simulating the recipes object. This will be on localStorage
        var recipes = [
        {
            name:"--", 
            time: 0
        },
		{
            name:"1 Minuto", 
            time: 60
        },
		{
            name:"Sugo", 
            time: 200
        },

        {
            name:"Pasta", 
            time: 300
        },

        {
            name:"Caffè", 
            time: 100
        },
        {
            name:"Arrosto", 
            time: 500
        },
        {
            name:"Spigola in padella", 
            time: 900
        },
        ];
        
        // Build select dom element
        inputSelect = jQuery("<select class='recipeSelect_input'>").attr("id",that.timerID);
        var selectOptions = [];
        jQuery.each(recipes,function(i,v){
            selectOptions.push('<option data-recipe-name="'+v.name+'" value="'+i+'">'+v.name+'</option>');
        });
        inputSelect.append(selectOptions);
        recipeSelect.html(inputSelect);
        
        // Handle select events
        recipeSelect.change(function(e){
            that.stopTimer();
            var recipe = recipes[e.target.value];
            console.log(recipe);
            that.setRicetta(recipe.name, recipe.time);
            that.startTimer();
        });
        
        var displayTime = jQuery("<div id='"+that.timerID+"_timerDisplay' class='topCounter'>");
        domContainer.append(displayTime);
   
        // Helper for hide flames on countdown
        
		var hiderFlame = jQuery("<div id='"+that.timerID+"_hiderFlame' class='hiderFlame'>");
        domContainer.append(hiderFlame);
        
   
   
        // And finally append all this shit to DOM
        jQuery("#"+that.containerID).append(domContainer);
        jQuery("#timersGui").append(domContainer);
        
      
       
        
        // Here setup animations
        
        jQuery("#"+that.timerID+".flamesBkg").sprite({
            fps:0, 
            no_of_frames: 19,
            on_last_frame:function(obj){
                // Start loop animation
                //console.log(obj);
                obj.animate({
                    background:"url(img/fornello/accesoLoop.png)"
                });
                obj.sprite({ 
                    fps:12, 
                    no_of_frames: 26
                });
            }
        });
        
        
        
        jQuery("#"+that.timerID+"_hiderFlame").sprite({
            fps:0, 
            no_of_frames: 52,
			on_playframe:function(obj) {
				obj.spStop();
			},
            on_last_frame:function(obj){
                // Start loop animation
				obj.spStop();
                console.log(obj,"end last frame");
                
            }
			
        });
        console.log('img inited');
        
        
        
    });
     
	
}




 

timer1 = new gasClock({
    containerID:"timersGui",
    timerID: "fornello1",
    onTimerStarted: function(){
        console.warn("timer iniziato")
    },
    onTimerEnded: function(){
        console.warn("tempo finito")
    },
    onTimerHalfStep: function(t){
        console.log("timer half step ->",t)
    },
    onHalfTime: function(t){
        console.warn("half time to end ->",t)
    },
    onQuarterTime:function(t){
        console.warn("quarter time to end ->",t)
    },
    onTimerStep: function(t){
        console.log("attualmente siamo a ",t)
    }
});
