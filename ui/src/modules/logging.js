//Store for the logging background data.

/**Logging data:

    clicks -> list of all clicks on UI, target div, screen position, div position, time
    session_time -> start and end of session time as a Date object

**/

const loggingStore = {
    state: () => ({
        logSocket: null,
        uuid: '',
        isLoggingOn: true,                  //set for difference UI versions
        logging_consent_given: false,
        hardware: 'spinner',
        course: 'engdes1',
        
        session_time: {
            start: Date.now(),      //will be updated
            end: Date.now(),
            previous: Date.now(),
            total: 0
        },

       }),
       mutations:{
            SET_LOG_SOCKET(state, socket){
                state.logSocket = socket;
            },
            SET_LOGGING_CONSENT(state, consent){
                state.logging_consent_given = consent;
            },
            SET_UUID(state, uuid){
                state.uuid = uuid;
            },
            SET_TOTAL_TIME(state, total){
                state.session_time.total = total;
            },
            LOG(state, payload){
                //only log to server if user has given consent.
                //Still may require logging internally for achievements etc.
                if(state.logging_consent_given && state.logSocket != null){
                    state.logSocket.send(JSON.stringify({
                        user: state.uuid,
                        t: Date.now(),          
                        exp: state.hardware,   
                        course: state.course,    
                        type: "log", 
                        payload: payload
                    }));
                }
                
            },
            LOG_ANALYTICS(state, payload){
                //only log to server if user has given consent.
                //Still may require logging internally for achievements etc.
                if(state.logging_consent_given && state.logSocket != null){
                    state.logSocket.send(JSON.stringify({
                        user: state.uuid,
                        t: Date.now(),          
                        exp: state.hardware,   
                        course: state.course,    
                        type: "analytics", 
                        payload: payload
                    }));
                }
                
            },
            LOG_START(state, time){
                state.session_time.start = time;
            },
            LOG_END(state, time){
                state.session_time.end = time;
            },
            UPDATE_SESSION_TIME(state, now){
                let current_total = state.session_time.total;
                let delta = now - state.session_time.previous;
                state.session_time.total = current_total + delta;

                state.session_time.previous = now;
            },
            CLEAR_LOGGED_TIME(state){
                state.session_time.start = Date.now();
                state.session_time.end = 0;
                state.session_time.total = 0;
            },
            SET_HARDWARE(state, hardware){
                state.hardware = hardware;
            },
            SET_COURSE(state, course){
                state.course = course;
            }
         

       },
       actions:{
            setLogSocket(context, socket){
                context.commit('SET_LOG_SOCKET', socket);
            },
            setLoggingConsent(context, consent){
                context.commit('SET_LOGGING_CONSENT', consent);
            },
            setUUID(context, uuid){
                context.commit('SET_UUID', uuid);
            },
            setHardware(context, hardware){
                context.commit('SET_HARDWARE', hardware)
            },
            setCourse(context, course){
                context.commit('SET_COURSE', course)
            },
            setTotalTime(context, total){
                context.commit('SET_TOTAL_TIME', total);
            },
            logClick(context, payload){
                context.commit('LOG', payload);

                //session time should only increase if still connected to the hardware
                if(!context.getters.getSessionExpired){
                    context.commit('UPDATE_SESSION_TIME', Date.now());
                }
                
            },
            logStart(context, payload){
                context.commit('LOG_START', payload.data);
                context.commit('LOG', payload);
            },
            logEnd(context, payload){
                context.commit('LOG_END', payload.data);
                context.commit('UPDATE_SESSION_TIME', payload.data);
                context.commit('LOG', payload);
            },
            logComponent(context, payload){
                context.commit('LOG', payload);
            },
            logParameters(context, payload){
                context.commit('LOG_ANALYTICS', payload);
            },
            logAchievements(context, achievements){
                context.commit('LOG', {log:'achievements', data: achievements});
            },
            clearLoggedTime(context){
                context.commit('CLEAR_LOGGED_TIME');
            }


       },
       getters:{
           getLogSocket(state){
                return state.logSocket;
           },
           getLogConsent(state){
            return state.logging_consent_given;
            },
            getLogUUID(state){
                return state.uuid;
            },
            getHardware(state){
                return state.hardware;
            },
            getCourse(state){
                return state.course;
            },
            getLogTotalTime(state){
                return state.session_time.total;
            },
            getLogStart(state){
                return state.session_time.start;
            },
            getLogEnd(state){
                return state.session_time.end;
            },
            getIsLoggingOn(state){
                return state.isLoggingOn;
            }
            
          
         
       },  
  
  }

  export default loggingStore;
