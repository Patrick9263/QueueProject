
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
      ProPow: "",
      EpS: "",
      RT1: "",
      RT21: "",
      RT22: "",
      error: ""
  },

  methods: {

    toggle: function(theID, status) {
      let x = document.getElementById(theID);
      if (status === "on") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    },

    toggleOn: function(theIDs) {
      for (var i = 0; i < theIDs.length; i++) {
        this.toggle(theIDs[i], "on");
      }
    },

    toggleOff: function(theIDs) {
      for (var i = 0; i < theIDs.length; i++) {
        this.toggle(theIDs[i], "off");
      }
    },

    initalizeIO: function() {
      allParams = ["lambda", "mu", "rho", "n", "m", "cv"];
      allOutputs = ["P_0", "P_n", "L", "RT", "WT", "L_q", "L_s"];
      multiQParams = ["Q1L", "Q1Mu", "Q21Prob", "Q21Mu", "Q22Prob", "Q22Mu"];
      multiQOutput = ["ProPow", "RT1", "RT21", "RT22"];
      Object.freeze(allParams);
      Object.freeze(allOutputs);
      Object.freeze(multiQParams);
      Object.freeze(multiQOutput);

      let q = document.getElementById("queueType").value;
      this.toggleOn([...allParams, ...allOutputs]);
      this.toggleOff([...multiQParams, ...multiQOutput]);
      if (q == "M/M/1") {
        this.toggleOff(["n", "m", "cv", "P_n"]);
      } else if (q == "M/M/n") {
        this.toggleOn(["P_n"]);
        this.toggleOff(["m", "cv"]);
      } else if (q == "M/M/n/m") {
        this.toggleOn(["P_n"]);
        this.toggleOff(["rho", "cv"]);
      } else if (q == "M/G/1") {
        this.toggleOff(["rho", "n", "m", "P_n"]);
      }
      else if (q == "Multi M/M/1") {
        this.toggleOn([...multiQParams, ...multiQOutput]);
        this.toggleOff([...allParams, ...allOutputs]);
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
                app.error = "Must supply n, m, lambda AND mu";
                return -1;
            }
        } else if ( (q == "M/G/1")) {
            if (isNull(cv) || (isNull(lambda) || isNull(mu))) {
                app.error ="Must supply sigma, lambda, and mu";
                return -1;
            }
        } else if (q == "Multi M/M/1") {
          if ( isNull(lambda) ||
                   isNull(mu) ||
                   isNull(rho)||
                   isNull(n)  ||
                   isNull(m)  ||
                   isNull(cv)
             )
          {
            app.error = "Must provide all parameters!";
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

        else if (lambda && mu && n && m) {
          let rho = lambda / mu;
          let u = lambda / (n*mu);
          let totalOne = 0;
          for (var k = 0; k < n; k++) {
            Math.pow(u, n) / fact(n);
          }
          let totalTwo = 0;
          for (var i = 0; i < m; i++) {
            totalTwo += Math.pow(rho, i);
          }
          totalTwo *= Math.pow(u,n) / fact(n);
          app.P0 = (1/(totalOne + totalTwo)).toFixed(4);
          app.Pn = ( (Math.pow(u,n)/fact(n)) * app.P0 ).toFixed(4);

          let tempL = 0;
          for (var j = 0; j < m; j++) {
              if (j <= n) {
                tempL += j * ((Math.pow(u,j)/fact(j)) * app.P0);
              } else {
                tempL += ((Math.pow(u,n)/fact(n)) * app.P0) * Math.pow(rho, j-n);
              }
          }
          app.L = tempL.toFixed(4);
          let lEq = lambda * (1-((Math.pow(u,n)/fact(n)) * app.P0) * Math.pow(rho, m-n));
          app.RT = (app.L / lEq).toFixed(4);
          app.WT = (app.RT - (1 / mu)).toFixed(4);
          app.Lq = (lEq * app.WT).toFixed(4);
          app.Ls = (app.L - app.Lq).toFixed(4);
        }
    },

    calcMG1: function(q, lambda, mu, rho, n, m, cv) {
        if (this.checkParameters(q, lambda, mu, rho, n, m, cv) == -1) {
          return -1;
        }

        else if (lambda && mu && cv) {
            let rho = lambda / mu;
            let sig = Math.pow(cv, 2) * Math.pow(mu, 2);
            app.Lq = (((Math.pow(lambda, 2) * Math.pow(sig, 2)) + Math.pow(rho, 2)) / (2 * (1-rho))).toFixed(4);
            app.WT = (app.Lq / lambda);
            app.RT = (app.WT + (1 / mu)).toFixed(4);
            app.L = (lambda * app.RT).toFixed(4);
            app.P0 = (1-rho).toFixed(4);
            app.Ls = (app.L - app.Lq).toFixed(4);
        }
    },

    calcMulti: function(q, Q1L, Q1Mu, Q21Prob, Q21Mu, Q22Prob, Q22Mu) {
      if (this.checkParameters(q, Q1L, Q1Mu, Q21Prob, Q21Mu, Q22Prob, Q22Mu) == -1) {
          return -1;
      }

      if (Q1L, Q1Mu, Q21Prob, Q21Mu, Q22Prob, Q22Mu) {
        let Q21L = Q1L * Q21Prob;
        let Q22L = Q1L * Q22Prob;
        let Q1E = 1 / Q1Mu;
        let Q21E = 1 / Q21Mu;
        let Q22E = 1 / Q22Mu;
        let rho21 = Q21L * Q21E * Math.pow(10, -6);
        let rho22 = Q22L * Q22E * Math.pow(10, -6);

        app.RT21 = (Q21E / (1-rho21)).toFixed(4);
        app.RT22 = (Q22E / (1-rho22)).toFixed(4);
        app.RT1 = (((Q21L * app.RT21) + (Q22L * app.RT22)) / Q1L).toFixed(4);
        app.ProPow = (1 - rho21 - rho22).toFixed(4);
        app.EpS = (Q1E / app.ProPow).toFixed(4);
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

      var Q1L = document.getElementById("Q1L").value;
      var Q1Mu = document.getElementById("Q1Mu").value;
      var Q21Prob = document.getElementById("Q21Prob").value;
      var Q21Mu = document.getElementById("Q21Mu").value;
      var Q22Prob = document.getElementById("Q22Prob").value;
      var Q22Mu = document.getElementById("Q22Mu").value;

      // Make sure rho is a valid number...
      if ( (parseFloat(rho) <= 0) || (parseFloat(rho) > 1) ) {
          app.error = "Rho must be (0,1)";
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
      } else if (q == "Multi M/M/1") {
        Q21Prob = parseFloat(Q21Prob);
        Q22Prob = parseFloat(Q22Prob);
        this.calcMulti(q, Q1L, Q1Mu, Q21Prob, Q21Mu, Q22Prob, Q22Mu);
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
