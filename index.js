
let app = new Vue({
  el: "#app",
  data: {
    output:"Output text..."
  },

  methods: {

    setResult: function(elementID, text) {
      document.getElementById(elementID).innerHTML = "= " + text;
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

        this.setResult("Lresult", (1 / rho));
        this.setResult("LqResult", Lq);
        this.setResult("RTresult", RT);
        this.setResult("WTresult", WT);
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

        this.setResult("Lresult", (1 / rho));
        this.setResult("LqResult", Lq);
        this.setResult("RTresult", RT);
        this.setResult("WTresult", WT);
      }

      // Otherwise yell at the user
      else {
        document.getElementById("paramError").innerHTML = 
          "<b>Must supply rho, or both lambda AND mu</b>";
      }
    }

  }

});