
let app = new Vue({
  el: "#app",
  data: {
      P0: "",
      L: "",
      RT: "",
      WT: "",
      Lq: "",
      Ls: "",
      error: ""
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

    initalizeIO: function() {
      let q = document.getElementById("queueType").value;
      if (q == "M/M/1") {
        this.toggle("n", "off");
        this.toggle("m", "off");
      } else if (q == "M/M/n") {
        this.toggle("n", "on");
        this.toggle("m", "off");
      } else if (q == "M/M/n/m") {
        this.toggle("n", "on");
        this.toggle("m", "on");
      } else if (q == "M/G/1") {
        this.toggle("n", "off");
        this.toggle("m", "off");
      }
    },

    isNull: function(parameter) {
        if (parameter.length == 0) {
            return true;
        }
        else {
            return false;
        }
    },

    checkParameters: function(q, lambda, mu, rho, n, m) {
        if (q == "M/M/1") {
            if ( this.isNull(rho) && (this.isNull(lambda) || this.isNull(mu)) ) {
                app.error ="Must supply rho, or both lambda AND mu";
                return -1;
            }
        }
        else if (q == "M/M/n") {
            if ( this.isNull(n) ||
                (this.isNull(rho) && (this.isNull(lambda) || this.isNull(mu)))){
                app.error ="Must supply n and either rho or BOTH lambda AND mu";
                return -1;
            }
        } else if ( (q == "M/M/n/m")) {
            if ( this.isNull(n) ||
                 this.isNull(m) ||
                ( this.isNull(rho) && (this.isNull(lambda) || this.isNull(mu)))) {
                app.error ="Must supply n,m and either rho or BOTH lambda AND mu";
                return -1;
            }
        } else if ( (q == "M/G/1") || this.isNull(rho) ) {
            if (this.isNull(lambda) || this.isNull(mu)) {
                app.error ="Must supply rho, or both lambda AND mu";
                return -1;
            }
        }

        return 0;
    },

    calcMM1: function(q, lambda, mu, rho, n, m) {
      if (this.checkParameters(q, lambda, mu, rho, n, m) == -1) {
          return -1;
      }
      // If we have rho, we don't need anything else...
      else if (rho) {
        let Es = (1 / rho).toFixed(4);
        app.P0 = (1 - rho).toFixed(4);
        app.RT = (Es / (1-rho)).toFixed(4);
        app.Lq = (Math.pow(rho, 2) / (1-rho)).toFixed(4);
        app.L= (rho / (1-rho)).toFixed(4);
        app.WT = ((Es * rho) / (1-rho)).toFixed(4);
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
      }
    },

    calcMMn: function(q, lambda, mu, rho, n, m) {
        if (this.checkParameters(q, lambda, mu, rho, n, m) == -1) {
          return -1;
        }

        else if (rho && n) {
            var P0 = 0;
            for (var i = 0; i < n; i++) {
                P0 += Math.pow(rho, -1);
            }
          // var Pn =
        }

        else if (lambda && mu && n) {

        }
    },

    calcMMnm: function(q, lambda, mu, rho, n, m) {
        if (this.checkParameters(q, lambda, mu, rho, n, m) == -1) {
          return -1;
        }
    },

    calcMG1: function(q, lambda, mu, rho, n, m) {
        if (this.checkParameters(q, lambda, mu, rho, n, m) == -1) {
          return -1;
        }

        else if (rho) {

        }

        else if (lambda && mu) {

        }
    },

    getResults: function() {

      // Grab the parameters from the text fields...
      app.error = "";
      var lambda = document.getElementById("lambda").value;
      var mu = document.getElementById("mu").value;
      var rho = document.getElementById("rho").value;
      var n = document.getElementById("n").value;
      var m = document.getElementById("m").value;

      if ( (parseFloat(rho) <= 0) || (parseFloat(rho) >= 1) ) {
          app.error ="Rho must be (0,1)";
          return -2;
      }

      // Determine which functions to used based on the queue type...
      let q = document.getElementById("queueType").value;
      if (q == "M/M/1") {
          this.calcMM1(q, lambda, mu, rho);
      } else if (q == "M/M/n") {
          this.calcMMn(q, lambda, mu, rho, n);
      } else if (q == "M/M/n/m") {
          this.calcMMnm(q, lambda, mu, rho, n, m);
      } else if (q == "M/G/1") {
          this.calculate(q, lambda, mu, rho);
      }

    }
  }

});

// factorial: function(n) {
//     var result = 1;
//     for (var i = 0; i < n; i++) {
//         result *= n;
//     }
//     return result;
// }
