
let app = new Vue({
  el: "#app",
  data: {
      P0: "",
      Pn: "",
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
      this.toggle("P_n", "off");
      this.toggle("rho", "on");
      if (q == "M/M/1") {
        this.toggle("n", "off");
        this.toggle("m", "off");
        this.toggle("cv", "off");
      } else if (q == "M/M/n") {
        this.toggle("P_n", "on");
        this.toggle("n", "on");
        this.toggle("m", "off");
        this.toggle("cv", "off");
      } else if (q == "M/M/n/m") {
        this.toggle("P_n", "on");
        this.toggle("n", "on");
        this.toggle("m", "on");
        this.toggle("cv", "off");
      } else if (q == "M/G/1") {
        this.toggle("rho", "off");
        this.toggle("n", "off");
        this.toggle("m", "off");
        this.toggle("cv", "on");
      }
    },

    checkParameters: function(q, lambda, mu, rho, n, m, cv) {
        if (q == "M/M/1") {
            if ( isNull(rho) && (isNull(lambda) || isNull(mu)) ) {
                app.error ="Must supply rho, or both lambda AND mu";
                return -1;
            }
        }
        else if (q == "M/M/n") {
            if ( isNull(n) ||
                (isNull(rho) && (isNull(lambda) || isNull(mu)))){
                app.error ="Must supply n and either rho or BOTH lambda AND mu";
                return -1;
            }
        } else if ( (q == "M/M/n/m")) {
            if ( isNull(n) ||
                 isNull(m) ||
                ( isNull(rho) && (isNull(lambda) || isNull(mu)))) {
                app.error ="Must supply n,m and either rho or BOTH lambda AND mu";
                return -1;
            }
        } else if ( (q == "M/G/1")) {
            if (isNull(cv) || (isNull(lambda) || isNull(mu))) {
                app.error ="Must supply sigma, lambda, and mu";
                return -1;
            }
        }

        return 0;
    },

    calcMM1: function(q, lambda, mu, rho, n, m, cv) {
      if (this.checkParameters(q, lambda, mu, rho, n, m, cv) == -1) {
          return -1;
      }

      // If we have rho, we don't need anything else...
      else if (rho) {
        let Es = (1 / rho).toFixed(4);
        app.P0 = (1 - rho).toFixed(4);
        app.RT = (Es / (1-rho)).toFixed(4);
        app.Lq = (Math.pow(rho, 2) / (1-rho)).toFixed(4);
        app.L = (rho / (1-rho)).toFixed(4);
        app.WT = ((Es * rho) / (1-rho)).toFixed(4);
        app.Ls = app.L - app.Lq;
      }

      // If not, we need BOTH lambda and mu
      else if (lambda && mu) {
        let rho = lambda / mu;
        let Es = 1 / rho;
        app.P0 = (1 - rho).toFixed(4);
        app.RT = (Es / app.P0).toFixed(4);
        app.Lq = (Math.pow(rho, 2) / app.P0).toFixed(4);
        app.L = (rho / app.P0).toFixed(4);
        app.WT = ((Es * rho) / app.P0).toFixed(4);
        app.Ls = app.L - app.Lq;
      }
    },

    calcMMn: function(q, lambda, mu, rho, n, m, cv) {
        if (this.checkParameters(q, lambda, mu, rho, n, m, cv) == -1) {
          return -1;
        }

        else if (rho && n) {
            let total = 0;
            for (var k = 0; k < n; k++) {
                total += (Math.pow(rho,k) / fact(k));
            }
            let u = rho * n;
            let termTwo = (Math.pow(u,n) / fact(n)) * (1/(1-rho));
            app.P0 = (Math.pow(total + termTwo,-1)).toFixed(4);
            app.Pn = ((Math.pow(u,n) / fact(n)) * app.P0).toFixed(4);
            let lambda = u * app.P0;
            let mu = app.P0;
            app.WT = (lambda * (rho / (Math.pow(1-rho, 2))) * app.Pn).toFixed(4);
            let temp = parseFloat(app.WT) + (u/lambda);
            app.RT = temp.toFixed(4);
            app.L = ((lambda * app.WT) + u).toFixed(4);
            app.Lq = (app.L - u).toFixed(4);
            app.Ls = u.toFixed(4);
        }

        else if (lambda && mu && n) {
          let rho = lambda / (mu * n);
          let total = 0;
          for (var k = 0; k < n; k++) {
              total += (Math.pow(rho,k) / fact(k));
          }
          let u = rho * n;
          let termTwo = (Math.pow(u,n) / fact(n)) * (1/(1-rho));
          app.P0 = (Math.pow(total + termTwo,-1)).toFixed(4);
          app.Pn = ((Math.pow(u,n) / fact(n)) * app.P0).toFixed(4);
          app.WT = (lambda * (rho / (Math.pow(1-rho, 2))) * app.Pn).toFixed(4);
          let temp = parseFloat(app.WT) + (u/lambda);
          app.RT = temp.toFixed(4);
          app.L = ((lambda * app.WT) + u).toFixed(4);
          app.Lq = (app.L - u).toFixed(4);
          app.Ls = u.toFixed(4);
        }
    },

    calcMMnm: function(q, lambda, mu, rho, n, m, cv) {
        if (this.checkParameters(q, lambda, mu, rho, n, m, cv) == -1) {
          return -1;
        }
    },

    calcMG1: function(q, lambda, mu, rho, n, m, cv) {
        if (this.checkParameters(q, lambda, mu, rho, n, m, cv) == -1) {
          return -1;
        }

        else if (lambda && mu && cv) {
            let rho = lambda / mu;
            let sig = Math.pow(cv, 2) * Math.pow(mu, 2);
            app.Lq = ((Math.pow(lambda, 2) * Math.pow(sig, 2)) + Math.pow(rho, 2)) / (2 * (1-rho)).toFixed(4);
            app.WT = app.Lq / lambda;
            app.RT = app.WT + (1 / mu);
            app.L = lambda * app.RT;
            app.P0 = 1-rho;
            app.Ls = app.L - app.Lq;
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
      var cv = document.getElementById("cv").value;

      // Make sure rho is a valid number...
      if ( (parseFloat(rho) <= 0) || (parseFloat(rho) > 1) ) {
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
          this.calcMG1(q, lambda, mu, rho, 0, 0, cv);
      }
    }
  }

});


function isNull(parameter) {
    if (parameter.length == 0) {
        return true;
    }
    else {
        return false;
    }
}

function fact(n) {
    if (n < 0) {
        console.log("factorial input was negative!");
        return -1;
    }
    let result = 1;
    for (let i = 0; i < n; i++) {
        result *= (n-i);
    }
    return result;
}
