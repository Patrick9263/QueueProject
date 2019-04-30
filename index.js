let app = new Vue({
  el: "#app",
  data: {
    output: "Output text..."
  },

  methods: {
    toggle: function(theID, status) {
      let x = document.getElementById(theID);
      if (status === "on") {
        x.style.display = "inline-block";
      } else {
        x.style.display = "none";
      }
    },

    setupResults: function() {
      let q = document.getElementById("queueType").value;
      if (q == "M/M/1") {
        this.toggle("n", "off");
      } else if (q == "M/M/n") {
        this.toggle("n", "on");
      } else if (q == "M/M/n/m") {
        this.toggle("n", "on");
      } else if (q == "M/G/1") {
        this.toggle("n", "off");
      }
    },

    setResult: function(elementID, text) {
      // document.getElementById(elementID).innerHTML = "= " + text;
      document
        .getElementById(elementID)
        .insertAdjacentHTML("beforeend", " = " + text);
    },

    calculate: function() {
      // Grab the parameters from the text fields
      document.getElementById("paramError").innerHTML = "";
      var lambda = document.getElementById("lambda").value;
      var mu = document.getElementById("mu").value;
      var rho = document.getElementById("rho").value;
      var n = document.getElementById("n").value;

      let q = document.getElementById("queueType").value;
      if (q == "M/M/1") {
      } else if (q == "M/M/n") {
      } else if (q == "M/M/n/m") {
      } else if (q == "M/G/1") {
      }

      // If we have rho, we don't need anything else...
      if (rho) {
        var P0 = 1 - rho;
        var Es = 1 / rho;
        var RT = Es / P0;
        var Lq = Math.pow(rho, 2) / P0;
        var L = rho / P0;
        var WT = (Es * rho) / P0;

        this.setResult("P_0", P0.toFixed(4));
        this.setResult("L", Es.toFixed(4));
        this.setResult("RT", Lq.toFixed(4));
        this.setResult("L_q", RT.toFixed(4));
        this.setResult("WT", WT.toFixed(4));
      }

      // If not, we need BOTH lambda and mu
      else if (lambda && mu) {
        var rho = lambda / mu;
        var P0 = 1 - rho;
        var Es = 1 / rho;
        var RT = Es / P0;
        var Lq = Math.pow(rho, 2) / P0;
        var L = rho / P0;
        var WT = (Es * rho) / P0;

        this.setResult("P_0", P0.toFixed(4));
        this.setResult("L", Es.toFixed(4));
        this.setResult("RT", Lq.toFixed(4));
        this.setResult("L_q", RT.toFixed(4));
        this.setResult("WT", WT.toFixed(4));
      }

      // Otherwise yell at the user
      else {
        document.getElementById("paramError").innerHTML =
          "<b>Must supply rho, or both lambda AND mu</b>";
      }
    }
  }
});
