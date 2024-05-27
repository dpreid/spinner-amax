//vue3 update

<template>
        
    <div class="d-flex justify-content-center mt-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
        <!-- <div >
            <input class='col-10' type="range" step='0.5' :max='max_position_step.toFixed(2)' :min='-max_position_step.toFixed(2)' v-model="step_size" @input="runStep">
        </div> -->
        <div class="col-6" >
            <img id="vinyl" src="/images/vinyl.png" @mousedown="setActive" @mouseup="setInactive" @mouseleave="setInactive" @mousemove="setAngle">
        </div>
    </div>
       
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {

  name: 'DJCommand',
  props:{
     
  },
  emits:['addToSmoothie'],
  data () {
    return {
        step_size: 0.00,            
        max_position_step: 6, 
        max_speed_step: 100,
        max_voltage_step: 6,
        disk_active: false,
        image_centre: {x:0, y:0},
        previous_vector: {x:0, y:0},
        rotation_angle: 0,
        previous_angle: 0,
        smoothie_canvas: null
    }
  },
  created(){
      
	},
    mounted(){
        
    },
    computed:{
    ...mapGetters([
        'getIsStepRunning'
        ])
    },
  methods: {
      ...mapActions([
          'setDraggable',
          'setIsStepRunning'
      ]),
      setActive(event){
        event.preventDefault();
        this.disk_active = true;
        let image = document.getElementById("vinyl");
        this.image_centre = {x: image.x + image.width/2, y: image.y + image.height/2};
        this.previous_vector = {x: event.clientX - this.image_centre.x, y: event.clientY - this.image_centre.y};
      },
      setInactive(){
        this.disk_active = false;
        this.previous_angle = this.previous_angle + this.rotation_angle;
      },
      setAngle(event) {
        event.preventDefault();
        if(this.disk_active){
            let image = document.getElementById("vinyl");
            let current_vector = {x: event.clientX - this.image_centre.x, y: event.clientY - this.image_centre.y};
            //let dot_product = this.dotProduct(current_vector, this.initial_vector)
            let mag_A = this.magnitude(current_vector)
            //let mag_B = this.magnitude(this.initial_vector)
            //let mag = mag_A*mag_B
            let diff = {x: current_vector.x - this.previous_vector.x, y: current_vector.y - this.previous_vector.y}
            let mag_diff = Math.sqrt(diff.x*diff.x + diff.y*diff.y);
           
            this.rotation_angle = mag_diff/mag_A;

            //get rotation direction

            let angle_current = this.dotProduct(current_vector, {x:0,y:-1}) / (this.magnitude(current_vector))
            let angle_previous = this.dotProduct(this.previous_vector, {x:0,y:-1}) / (this.magnitude(this.previous_vector))
            let rotation_direction = 1
            if(event.clientX - this.image_centre.x > 0){
                if(angle_current > angle_previous){
                    rotation_direction = -1
                } else{
                    rotation_direction = 1
                }
            } else{
                if(angle_current < angle_previous){
                    rotation_direction = -1
                } else{
                    rotation_direction = 1
                }
            }

            let new_angle = this.previous_angle + this.rotation_angle*rotation_direction;
            
            image.style.transform = "rotate("+ (new_angle) +"rad)"
            this.$emit('addToSmoothie', new_angle)
            this.step_size = new_angle;
            this.runStep();

            this.previous_vector = current_vector
            this.previous_angle = new_angle
            
        }
            
        },
        magnitude(A){
            return Math.sqrt(A.x*A.x + A.y*A.y)
        },
        dotProduct(A, B){
            return A.x*B.x + A.y*B.y
        },
     runStep(){
         if(this.$store.getters.getIsDataRecorderOn){
                 this.$store.dispatch('setIsRecording', true);
             }

         
        //  let step = {
        //      step_time: this.time_to_step,
        //      step_start: 0,
        //      step_size: this.step_size
        //  }
        //  this.$store.dispatch('setStep', step);
         
        this.sendCommand();
             
     },
     sendCommand(){
        this.setIsStepRunning(true);
        let new_ang_rad = parseFloat(this.step_size);
        this.$store.dispatch('setPosition', new_ang_rad);
     },
     stopStep(){
            //this is an internal mode in the firmware and does not need to be reflected in the UI.
            //this.isStepRunning = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			this.setIsStepRunning(false);
        

            if(this.$store.getters.getIsRecording){
                 this.$store.dispatch('setIsRecording', false);
             }

             this.$store.dispatch('wait');
             
		},
     
  }
}
</script>

<style scoped>

#vinyl{
    width: 100%;
}
.error{
    /* border:thick solid red */
    border: auto;
}

.error:focus{
    /* border:thick solid red */
    border: auto;
}


</style>