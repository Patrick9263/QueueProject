const { spawn } = require("child_process");
const { shell } = require("electron");

let app = new Vue({
  el: "#app",
  data: {
    output:"Output text..."
  },

  methods: {
    calculate: function() {
        console.log("Calcluating results...");
    }
  }
});