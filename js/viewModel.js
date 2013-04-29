viewModel = {
    recipes: ko.observableArray(jQuery.jStorage.get("Recipes")),
    removeRecipe: function(){
        console.log(this);
        viewModel.recipes.remove(this);
        syncRecipes(viewModel.recipes());
    },
    addRecipe: function(){
    
        var name = jQuery("#recipeNameToAdd").val();
        var time = jQuery("#recipeTimeToAdd").val();
        
        var recipeIsPresent = viewModel.recipes().filter(function(i){
           
            return i.name == name
            });
        
        if(recipeIsPresent.length == 0 && name.length >= 3 ){
             console.log("Recipe name is present: ", recipeIsPresent.length)
            viewModel.recipes.push({
                name:name,
                time:time
            });
            syncRecipes(viewModel.recipes());
            jQuery("#addRecipeWidget").slideUp();
            jQuery("#recipeNameToAdd").val("") ;
            jQuery("#recipeTimeToAdd").val("") ;
            jQuery("#recipeNameToAdd").next('#validation').slideUp();
        } else {
            if(name.length <= 3){
                jQuery("#recipeNameToAdd").next('#validation').slideDown().find("span").text("Nome ricetta minimo 3 caratteri!");
            } else {
                jQuery("#recipeNameToAdd").next('#validation').slideDown().find("span").text("Nome ricetta già esistente!");
            }
            
        }
        
        
    },
    modifyRecipe: function(){
        //console.log(this);
        var name = jQuery("#recipeNameToAdd").val(this.name);
        var time = jQuery("#recipeTimeToAdd").val(this.time);
        console.log(this.time,'Time')
        console.log("Time to mod",secondsToTime(this.time,true))
        
        var parsedTime = secondsToTime(this.time,true);
        
        jQuery("#scrollerAddRecipe").val(time);
        jQuery("#scrollerAddRecipe").scroller('setValue', [parsedTime.m, parsedTime.s], true);
        
        jQuery("#recipeButtonAdd").fadeOut();
        jQuery("#recipeButtonModify").fadeIn();
        viewModel.currentEditing = this;
        jQuery("#addRecipeWidget").slideDown();
    },
    saveModify: function(){
        console.log("qui modifico",this.currentEditing);
        viewModel.recipes.remove(this.currentEditing);                
        var name = jQuery("#recipeNameToAdd") ;
        var time = jQuery("#recipeTimeToAdd") ;
        viewModel.recipes.push({
            name:name.val(),
            time:time.val()
        });
        syncRecipes(viewModel.recipes());
        jQuery("#recipeButtonAdd").fadeIn();
        jQuery("#recipeButtonModify").fadeOut(function(){
            name.val("");
            time.val("")
        });
        jQuery("#addRecipeWidget").slideUp();
    },
    addRecipeBtn: function(){
        jQuery("#addRecipeWidget").slideToggle();
    },
    setFornello: function(){
        console.log("SET FORNELLO ",this);
        var idFornello = window.currentRecipeEditing;
        var reference = window[idFornello];
        reference.setRicetta(this.name,this.time);
        reference.startTimer();
        jQuery("a#"+idFornello+".currentRecipe").text(this.name);
        viewModel.backToMain();
                   
        console.log('reference',reference)
    //window[idFornello.setRicetta(this.name,this.time)];
    //  window[idFornello.startTimer()];
    //  this.backToMain();
    },
    backToMain: function(){
        //console.log('torna alla gui fornelli');
        jQuery("#recipesPanel, #addRecipeWidget, ").fadeOut(function(){
            jQuery("#timersGui").fadeIn();
            countActiveTimers();
        });
    }
};
ko.applyBindings(viewModel);