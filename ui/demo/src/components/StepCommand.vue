//vue3 update

<template>
        
        <div class="row d-flex justify-content-center m-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
            <div class='col-auto'>
                <div v-if='mode == "speedRaw"'>
                    <button class='btn btn-primary btn-lg m-2' id="run1VStep" @click="runDemoVoltageStep(1)">1V step</button>
                    <button class='btn btn-primary btn-lg m-2' id="run2VStep" @click="runDemoVoltageStep(2)">2V step</button>
                    <button class='btn btn-primary btn-lg m-2' id="run6VStep" @click="runDemoVoltageStep(6)">6V step</button>
                </div>
            

                <div class='input-group' v-else-if='mode == "speedPid"'>
                    <div class="col-12">
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep30Normal" @click="runDemoPIDStep(30,0.01,0,0)">30rad/s <br>P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep30P" @click="runDemoPIDStep(30,0.03,0,0)">30rad/s <br>Large P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep30D" @click="runDemoPIDStep(30,0.01,0,0.01)">30rad/s <br> PD</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep30Fast" @click="runDemoPIDStep(30,0.02,0.004,0.01)">30rad/s <br> PID</button>
                    </div>
                    
                    <div class="col-12">
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep80Normal" @click="runDemoPIDStep(80,0.01,0,0)">80rad/s <br>P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep80P" @click="runDemoPIDStep(80,0.03,0,0)">80rad/s <br>Large P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep80D" @click="runDemoPIDStep(80,0.01,0,0.01)">80rad/s <br> PD</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoSpeedStep80Fast" @click="runDemoPIDStep(80,0.02,0.004,0.01)">80rad/s <br> PID</button>
                    </div>
                </div>

                <div v-else-if='mode == "positionPid"'>
                    <div class="col-12">
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep3RadNormal" @click="runDemoPIDStep(3,1,0,0)">3 rad <br>P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep3RadP" @click="runDemoPIDStep(3,3,0,0)">3 rad <br>Large P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep3RadD" @click="runDemoPIDStep(3,1,0,1)">3 rad <br> PD</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep3RadFast" @click="runDemoPIDStep(3,2,0.4,1)">3 rad <br> PID</button>
                    </div>
                    
                    <div class="col-12">
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep6RadNormal" @click="runDemoPIDStep(6,1,0,0)">6 rad <br> P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep6RadP" @click="runDemoPIDStep(6,3,0,0)">6 rad <br> Large P</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep6RadD" @click="runDemoPIDStep(6,1,0,1)">6 rad <br> PD</button>
                        <button class='btn btn-primary btn-lg m-2' id="runDemoPositionStep6RadFast" @click="runDemoPIDStep(6,2,0.4,1)">6 rad <br> PID</button>
                    </div>
                    
                </div>

            </div>
        </div>
       
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {

  name: 'StepCommand',
  props:{
      mode: String,
  },
  emits:['showinputtype'],
  data () {
    return {
        step_size: 0.00,            
        max_position_step: 6, 
        max_speed_step: 100,
        max_voltage_step: 6,
        //isStepRunning: false,     //updated to use vuex instead
    }
  },
  created(){
      let version = this.$store.getters.getRemoteLabVersion;
        if( version == 'variable_governor'){
            this.max_position_step = Math.PI;             //variable governor can spin full circle
        } else if(version == 'robot_arm'){
            this.max_position_step = 3*Math.PI/10;          //robot arm is soft limited to 300 encoder steps from 0.
        }
	},
    computed:{
        ...mapGetters([
            'getIsStepRunning'
        ])
    },
  methods: {
      ...mapActions([
          'setDraggable',
          'updateColourIndex',
          'setIsStepRunning',
          'setPidParameters'
      ]),
      runDemoVoltageStep(step){
        this.step_size = step;
        this.runStep();
        let _this = this;
        setTimeout(() => {
            _this.stopStep();
        }, 2000);
      },
      runDemoPIDStep(step, kp, ki, kd){
            let params = {kp: parseFloat(kp), ki: parseFloat(ki), kd: parseFloat(kd)};
			this.setPidParameters(params);
            this.step_size = step;

            let _this = this;
            setTimeout(() => {
                _this.runStep();
            }, 200);

            setTimeout(() => {
                _this.stopStep();
            }, 2000);
      },
     runStep(){
         if(this.$store.getters.getIsDataRecorderOn){
                 this.$store.dispatch('setIsRecording', true);
             }

         this.$emit('showinputtype', false);
         
        //  let step = {
        //      step_time: this.time_to_step,
        //      step_start: 0,
        //      step_size: this.step_size
        //  }
        //  this.$store.dispatch('setStep', step);
         
        this.sendCommand();

        this.updateColourIndex();
             
     },
     sendCommand(){
         if(this.mode == 'speedRaw'){
             
             //this.isStepRunning = true; 
             this.setIsStepRunning(true);
             let signal = parseFloat(this.step_size);
             this.$store.dispatch('setVoltage', signal);

         } else if(this.mode == 'positionPid'){

             //this.isStepRunning = true;                      //NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             this.setIsStepRunning(true);
             let new_ang_rad = this.$store.getters.getCurrentAngle + parseFloat(this.step_size);
             this.$store.dispatch('setPosition', new_ang_rad);

         } else if(this.mode == 'speedPid'){

             //this.isStepRunning = true; 
             this.setIsStepRunning(true);
             let rad_s = this.$store.getters.getCurrentAngularVelocity + parseFloat(this.step_size);           //needs to be in rad/s
             this.$store.dispatch('setSpeed', rad_s);

         }

         
         this.$store.dispatch('addMultipleAchievement','multiple-runs');
         
     },
     stopStep(){
            //this is an internal mode in the firmware and does not need to be reflected in the UI.
            //this.isStepRunning = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			this.setIsStepRunning(false);
            
            this.$emit('showinputtype', true);

            if(this.$store.getters.getIsRecording){
                 this.$store.dispatch('setIsRecording', false);
             }

            if(this.mode == 'positionPid'){
                this.$store.dispatch('wait');
            } else if(this.mode == 'speedRaw'){
                this.$store.dispatch('setVoltage', 0);
            } else {
                this.$store.dispatch('wait');
            }
             
		},
     
  }
}
</script>

<style scoped>
input{
    min-width: 20%;
    max-width: 50%;
}
.error{
    /* border:thick solid red */
    border: auto;
}

.error:focus{
    /* border:thick solid red */
    border: auto;
}

#run       {background-color:  rgb(74, 223, 37);}
#run:hover {background-color: #0b7e0f} 
#wait       {background-color:  rgb(255, 30, 0);}
#wait:hover {background-color: #520303} 


</style>