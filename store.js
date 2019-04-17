const store = new Vuex.Store({
    state: {
        status: 'Ready to run'
    },
    mutations: {
        updateStatus(statusMSG) {
            state.status = statusMSG;
        }
    }
})