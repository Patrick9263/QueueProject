const { spawn } = require("child_process");
const { shell } = require("electron");

let app = new Vue({
  el: "#app",
  data: {
    output:"Output text...",
    clickCount: 0
  },

  methods: {
    admin: function(batchFunction) {

      let bat = spawn("cmd.exe", arguments);

      bat.stdout.on("data", data => {
        this.output += data.toString();
      });

      bat.stderr.on("data", data => {
        this.output += data.toString();
      });

      bat.on("exit", code => {
        console.log(`Child exited with code ${code}`);
      });
      this.$refs.output.scrollTop += 400;
    },

    clearConsole: function() {
      this.output = "";
    }
  }
});