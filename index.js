
let app = new Vue({
  el: "#app",
  data: {
    output:"Output text..."
  },

  methods: {

    setResult: function(elementID, text) {
      // document.getElementById(elementID).innerHTML = "= " + text;
      document.getElementById(elementID).insertAdjacentHTML('beforeend', " = " + text);
    },

    calculate: function() {

      // Grab the parameters from the text fields
      document.getElementById("paramError").innerHTML = "";
      var lambda = document.getElementById("lambda").value;
      var mu = document.getElementById("mu").value;
      var rho = document.getElementById("rho").value;

      // If we have rho, we don't need anything else...
      if (rho) {
        var P0 = 1 - rho;
        var Es = 1 / rho;
        var RT = Es / P0;
        var Lq = Math.pow(rho, 2) / P0;
        var L = rho / P0;
        var WT = (Es * rho) / P0;

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