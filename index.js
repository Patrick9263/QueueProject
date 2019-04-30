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

    initalizeResults: function() {
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

    clearResults: function() {
        document.getElementById("paramError").innerHTML = "";
        var elements = document.getElementById("resultsContainer").childNodes;
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = elements[i].id;
        }
    },

    setResults: function(results) {
      this.clearResults();
      var elements = document.getElementById("resultsContainer").childNodes;
      for (var i = 0; i <= Math.floor(elements.length / 2); i++) {
         document.getElementById(elements[i*2].id).insertAdjacentHTML("beforeend", " = " + results[i].toFixed(4));
      }
    },

    calculate: function(lambda, mu, rho, n, m) {
      
        // If we have rho, we don't need anything else...
        if (rho) {
          var P0 = 1 - rho;
          var Es = 1 / rho;
          var RT = Es / P0;
          var Lq = Math.pow(rho, 2) / P0;
          var L = rho / P0;
          var WT = (Es * rho) / P0;

          var results = [P0, L, Es, Lq, RT, WT];
          this.setResults(results);
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

          var results = [P0, L, Es, Lq, RT, WT];
          this.setResults(results);
        }

        // Otherwise yell at the user
        else {
          document.getElementById("paramError").innerHTML =
            "<b>Must supply rho, or both lambda AND mu</b>";
        }
    },

    getResults: function() {

      // Grab the parameters from the text fields...
      var lambda = document.getElementById("lambda").value;
      var mu = document.getElementById("mu").value;
      var rho = document.getElementById("rho").value;
      var n = document.getElementById("n").value;
      var m = document.getElementById("m").value;

      // Determine which functions to used based on the queue type...
      let q = document.getElementById("queueType").value;
      if (q == "M/M/1") {
          this.calculate(lambda, mu, rho);
      } else if (q == "M/M/n") {
          this.calculate(lambda, mu, rho, n);
      } else if (q == "M/M/n/m") {
          this.calculate(lambda, mu, rho, n, m);
      } else if (q == "M/G/1") {
          this.calculate(lambda, mu, rho);
      }

    }
  }
});
