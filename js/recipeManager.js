/* 
 * Dario: tolto da index.html
 */


  // Recipes manager
            Recipes = jQuery.jStorage.get("Recipes");
        
            if(Recipes != null){
                Recipes.sort(function(a,b){
                    if(a.name<b.name) return -1;
                    if(a.name>b.name) return 1;
                    return 0;
                });
            }
        
            if(Recipes == null || Recipes.length == 0){
                Recipes = jQuery.jStorage.set("Recipes", [
                   
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
                    }

                ]);
            }
        
       
        
            function syncRecipes(data){
                data.sort(function(a,b){
                    if(a.name<b.name) return -1;
                    if(a.name>b.name) return 1;
                    return 0;
                });
                jQuery.jStorage.set("Recipes",data);
            }