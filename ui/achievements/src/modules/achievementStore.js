//Update to the achievements made on 06/07/2023


const achievementStore = {
    state: () => ({
        achievements: [
            {name:'custom-ui', verbose:'Customise the UI', completed: false, hidden: true},

            {name:'speedRaw-step-input', verbose:'Step input whilst in open loop mode', completed: false, hidden: false},

            {name:'step-inputs', verbose:'Run a step input in each mode', completed: false, hidden: true, fractional: [
                {name:'voltage-step', completed: false},
                {name:'position-step', completed: false},
                {name:'speed-step', completed: false},

            ], required: 3, n: 0}, 

            {name:'ramp-inputs', verbose:'Run a ramp input in each mode', completed: false, hidden: true, fractional: [
                {name:'voltage-ramp', completed: false},
                {name:'position-ramp', completed: false},
                {name:'speed-ramp', completed: false},

            ], required: 3, n: 0}, 

            {name:'p-controller', verbose:'Used a non-unity proportional controller in position, step mode', completed: false, hidden: false},

            {name:'all-controllers', verbose:'Run four controller types in position mode', completed: false, hidden: true, fractional: [
                {name:'p-controller', completed: false},
                {name:'pi-controller', completed: false},
                {name:'pd-controller', completed: false},
                {name:'pid-controller', completed: false},

            ], required: 4, n: 0}, 

            {name:'download-data', verbose:'Downloaded a dataset with n > 100 data points', completed: false, hidden: false},

            {name:'plot-functions', verbose:'Plot 3 different functions', completed: false, hidden: true, fractional: [
                {name:'plot-linear', completed: false},
                {name:'plot-1st-step', completed: false},
                {name:'plot-2nd-step', completed: false},
                {name:'plot-trig', completed: false},
                {name:'plot-exp', completed: false},
                {name:'plot-quadratic', completed: false},
                {name:'plot-ramp', completed: false},

            ], required: 3, n: 0}, 
            
            {name:'open-all', verbose:'Opened all the components', completed: false, hidden: true, fractional: [
                {name:'graph', completed: false},
                {name:'snapshot', completed: false},
                {name:'table', completed: false},
                {name:'stopwatch', completed: false},
                {name:'diagrams', completed: false},

            ], required: 5, n: 0}, 

            {name:'multiple-runs', verbose:'Run a step or ramp 10 times', completed: false, hidden: true, required: 10, n: 0}, 
            
            {name:'hardware-error', verbose:'Caused the hardware to go out of limits!', completed: false, hidden: true},

            {name:'data-max', verbose:'Record the max number of data points', completed: false, hidden: true},

            {name:'reverse-step', verbose:'Set a negative voltage or speed step', completed: false, hidden: true},

            {name:'update-layout', verbose:'Change the UI layout', completed: false, hidden: true},

            {name:'data-select', verbose:'Jump to table data point from graph', completed: false, hidden: true},

            {name:'draw-gradient', verbose:'Measure the gradient on the graph', completed: false, hidden: true},

            {name:'download-image', verbose:'Download an image from the UI', completed: false, hidden: true},

            

        ],
        new_achievement_update: false,
        new_achievement_count: 0,

       }),
       mutations:{
        LOAD_ACHIEVEMENTS(state, achievements_to_load){
            let updated_achievements = [];
            state.achievements.forEach(achievement => {
                let update_achievement = achievements_to_load.find(ach => ach.name == achievement.name);
                if(update_achievement != undefined){
                    updated_achievements.push(update_achievement);
                } else{
                    updated_achievements.push(achievement);
                }
            })

            state.achievements = updated_achievements;
        },
         SET_ACHIEVEMENT_COMPLETED(state, name){
            state.achievements.forEach(item => {
                if(item.name == name){
                    item.completed = true;
                }
            });
         },
         //payload -> achievement = {name: name, fractional: fractional}
         SET_FRACTIONAL_ACHIEVEMENT_COMPLETED(state, achievement){
            state.achievements.forEach(item => {
                if(item.name == achievement.name){
                    if('fractional' in item){
                        item.fractional.forEach(frac => {
                            if(frac.name == achievement.fractional && !frac.completed){
                                frac.completed = true;
                                item.n++;
    
                                if(item.n >= item.required){
                                    item.completed = true;
                                }
                            }
                        })
                    }
                }
            });
         },
         ADD_MULTIPLE_ACHIEVEMENT(state, name){
            state.achievements.forEach(item => {
                if(item.name == name){
                    if('n' in item){
                        if(item.n >= item.required - 1){
                            item.n++;
                            item.completed = true;
                        } else {
                            item.n++;
                        }
                    }
                }
            });
         },
         SET_ACHIEVEMENT_UPDATE(state, set){
             if(set){
                state.new_achievement_count += 1;
             } else{
                state.new_achievement_count = 0;
             }
             state.new_achievement_update = set;
             
         },
         CLEAR_COMPLETED_ACHIEVEMENTS(state){
             state.achievements.forEach(achievement => {
                 achievement.completed = false;
             })
         }
         

       },
       actions:{
        loadAchievements(context, achievements){
            context.commit('LOAD_ACHIEVEMENTS', achievements);
        },
        setAchievementCompleted(context, name){
             if(context.getters.getAchievementsUncompleted.includes(name)){
                context.commit('SET_ACHIEVEMENT_COMPLETED', name);
                context.commit('SET_ACHIEVEMENT_UPDATE', true);
                
                context.dispatch('logAchievements', context.state.achievements, {root: true});        //log the achievements everytime an achievement is completed
             }
         },
         setFractionalAchievementCompleted(context, achievement){
            if(context.getters.getAchievementsUncompleted.includes(achievement.name)){
                let n_previous = context.getters.getAchievementByName(achievement.name).n
                context.commit('SET_FRACTIONAL_ACHIEVEMENT_COMPLETED', achievement);
                let n_current = context.getters.getAchievementByName(achievement.name).n
                let required = context.getters.getAchievementByName(achievement.name).required
                if(n_current > n_previous && n_current <= required){
                    context.commit('SET_ACHIEVEMENT_UPDATE', true);
                }

            }
         },
         addMultipleAchievement(context, name){
            if(context.getters.getAchievementsUncompleted.includes(name)){
                context.commit('ADD_MULTIPLE_ACHIEVEMENT', name);
                context.commit('SET_ACHIEVEMENT_UPDATE', true);     //although perhaps not completed, should show some kind of update to progress.
            }
         },
         setAchievementUpdate(context, set){
             context.commit('SET_ACHIEVEMENT_UPDATE', set);
         },
         checkPIDControllerConditions(context){
            
           if(context.rootState.data.p != 1 && context.rootState.data.i == 0 && context.rootState.data.d == 0){
               context.dispatch('setAchievementCompleted', 'p-controller');
               context.dispatch('setFractionalAchievementCompleted', {name:'all-controllers', fractional:'p-controller'});
           } 
           else if(context.rootState.data.p > 0 && context.rootState.data.i > 0 && context.rootState.data.d == 0){
               context.dispatch('setFractionalAchievementCompleted', {name:'all-controllers', fractional:'pi-controller'});
           } 
           else if(context.rootState.data.p > 0 && context.rootState.data.i == 0 && context.rootState.data.d > 0){
                context.dispatch('setFractionalAchievementCompleted', {name:'all-controllers', fractional:'pd-controller'});
            } 
           else if(context.rootState.data.p > 0 && context.rootState.data.i > 0 && context.rootState.data.d > 0){
               context.dispatch('setFractionalAchievementCompleted', {name:'all-controllers', fractional:'pid-controller'});
           } 
        },
        clearCompletedAchievements(context){
            context.commit('CLEAR_COMPLETED_ACHIEVEMENTS');
        }


       },
       getters:{
         getAchievements(state){
            return state.achievements;
         },
         getAchievementsCompleted(state){
             let completed = [];
            state.achievements.forEach(item => {
                if(item.completed){
                    completed.push(item.name);
                }
            });
            return completed;
         },
         getAchievementsUncompleted(state){
            let uncompleted = [];
            state.achievements.forEach(item => {
                if(!item.completed){
                    uncompleted.push(item.name);
                }
            });
            return uncompleted;
         },
         getAchievementUpdated(state){
             return state.new_achievement_update;
         },
         getNewAchievementCount(state){
             return state.new_achievement_count;
         },
         getAchievementByName: (state) => (name) => {
            return state.achievements.find(achievement => achievement.name == name);
         },
         
          
         
       },  
  
  }

  export default achievementStore;
