import { describe, expect, test, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import Achievements from '../../src/components/Achievements.vue';

import achievementStore from '../../src/modules/achievementStore.js'
import loggingStore from '../../src/modules/logging.js';


const createVuexStore = () => 

    createStore({
        modules:{
            achievements: achievementStore,
            logging: loggingStore,
        }
    });


describe('Achievements.vue tests', () => {



    test('Renders', () => {

        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
  
      expect(wrapper.find('#achievements-button').exists()).toBe(true);
    
    })

    test('Achievement renders notification after customise UI', async () => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });

        expect(wrapper.find('#achievement-notification').exists()).toBe(false);

        await store.dispatch('setAchievementCompleted', 'custom-ui');

        expect(wrapper.find('#achievement-notification').exists()).toBe(true);
        //expect(store.getters.getAchievementsCompleted == 'custom-ui').toBe(true);
        expect(store.getters.getAchievementsCompleted).toContainEqual('custom-ui');
        //console.log(store.getters.getAchievementsCompleted);
    })

    test('Customise UI achievement gets checkbox ticked', async () => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });


        await store.dispatch('setAchievementCompleted', 'custom-ui');

        const checkbox = wrapper.find('#custom-ui');
        expect(checkbox.element.checked).toBe(true);
        //console.log(store.getters.getAchievementsCompleted);
    })

    test('Hardware investigator badge - only 1 achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        await store.dispatch('setAchievementCompleted', 'step-inputs');
        
        expect(wrapper.vm.hardwareInvestigatorComplete).toBe(false)

    })

    test('Hardware investigator badge - all achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        await store.dispatch('setAchievementCompleted', 'speedRaw-step-input');
        await store.dispatch('setAchievementCompleted', 'step-inputs');
        await store.dispatch('setAchievementCompleted', 'ramp-inputs');
        await store.dispatch('setAchievementCompleted', 'multiple-runs');
        await store.dispatch('setAchievementCompleted', 'p-controller');
        await store.dispatch('setAchievementCompleted', 'all-controllers');
        await store.dispatch('setAchievementCompleted', 'hardware-error');
        await store.dispatch('setAchievementCompleted', 'reverse-step');
        
        expect(wrapper.vm.hardwareInvestigatorComplete).toBe(true)

    })

    test('Hardware investigator badge - only 3 achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        
        await store.dispatch('setAchievementCompleted', 'speedRaw-step-input');
        await store.dispatch('setAchievementCompleted', 'step-inputs');
        await store.dispatch('setAchievementCompleted', 'multiple-runs');

        expect(wrapper.vm.hardwareInvestigatorComplete).toBe(false)

    })

    test('Data analyst badge - only 1 achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        
        await store.dispatch('setAchievementCompleted', 'download-data');

        expect(wrapper.vm.dataAnalystComplete).toBe(false)

    })

    test('Data analyst badge - all achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        
        await store.dispatch('setAchievementCompleted', 'download-data');
        await store.dispatch('setAchievementCompleted', 'plot-functions');
        await store.dispatch('setAchievementCompleted', 'data-max');
        await store.dispatch('setAchievementCompleted', 'data-select');
        await store.dispatch('setAchievementCompleted', 'draw-gradient');

        expect(wrapper.vm.dataAnalystComplete).toBe(true)

    })

    test('UI explorer badge - only 1 achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        
        await store.dispatch('setAchievementCompleted', 'open-all');

        expect(wrapper.vm.uiExplorerComplete).toBe(false)

    })

    test('UI explorer badge - all achieved', async() => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
        
        await store.dispatch('setAchievementCompleted', 'open-all');
        await store.dispatch('setAchievementCompleted', 'update-layout');
        await store.dispatch('setAchievementCompleted', 'download-image');
        await store.dispatch('setAchievementCompleted', 'custom-ui');

        expect(wrapper.vm.uiExplorerComplete).toBe(true)

    })



})