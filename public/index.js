window.app  = new Vue({
    el: '#app',
    data: {
      logged: false,
      user: "",
      passwd: "",
      token: "",
      recomendacionNotificacion: null,
      hasRecomendacion: false,
      devices: [],
      devicesSelect: [],
      types: ["Uso", "Compra", "Tarifa", "Alerta"],
      states: ["Activo", "Pausado", "Desconectado"],
      locations: ["Cocina", "Comedor", "Baño", "Dormitorio"],
      deviceTypes: ["Electrodomestico", "Dispositivo electrónico", "Calefacción", "Refrigeración", "Iluminación"],
      errors: [],
      stateDevice: "Cualquiera",
      typeDevice: "Cualquiera",
      locationDevice: "Cualquiera",
      deviceSelectedMeasure: null,
      valueMeasure: null,
      deviceSelectedRecomendation: null,
      valueRecomendation: null,
      typeSelectedRecomendation: null,
      deviceSelectedPanelMonitorizacion: null,
      sDate: null,
      eDate: null,
      sHour: "00:00",
      eHour: "00:00",
      sValue: null,
      eValue: null,
      tipoRecomendacionPanel: "Cualquiera",
      textoRecomendacionPanel: null,
      sDateRecomendacion: null,
      eDateRecomendacion: null,
      deviceSelectedPanelRecomendaciones: "all",
      recomendations: [],
      measures: [],
      dataChart: [],
      labelsChart: [],
      recomendation: [{type:"", description:"", id:"", date:""}],
    },

    created(){
      var self = this
      var ES = new EventSource('/notification')

      ES.addEventListener('newRecomendation', function(event){
        var data = JSON.parse(JSON.parse(event.data));
        self.hasRecomendacion = true;
        self.recomendacionNotificacion = data;
      }, false)
    },

    mounted(){
      this.eDate = this.getNextDate();
      this.sDate = this.getActualDate();
    },

    methods:{
      cerrarRecomendacion() {
        this.recomendacionNotificacion = null;
        this.hasRecomendacion = false;
      },

      getActualDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month.toString().length != 2) {
          month = "0" + month;
        }
        var day = date.getDate();
        if (day.toString().length != 2) {
          day = "0" + day;
        }
        return year + "-" + month + "-" + day;
      },

      getNextDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month.toString().length != 2) {
          month = "0" + month;
        }
        date.setDate(date.getDate() + 1);
        var day = date.getDate();
        if (day.toString().length != 2) {
          day = "0" + day;
        }
        return year + "-" + month + "-" + day;
      },

      cambiaSDate() {
        var date = new Date(this.sDate);
        date.setDate(date.getDate() + 1);
        var aux = new Date(date);
        this.eDate = this.metodoAuxiliarDates(aux);
      },

      cambiaEDate() {
        var date = new Date(this.eDate);
        date.setDate(date.getDate() - 1);
        var aux = new Date(date);
        this.sDate = this.metodoAuxiliarDates(aux);
      },

      metodoAuxiliarDates(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month.toString().length != 2) {
          month = "0" + month;
        }
        var day = date.getDate();
        if (day.toString().length != 2) {
          day = "0" + day;
        }
        return year + "-" + month + "-" + day;
      },

      cambiaSHour() {
        this.eHour = this.sHour;
      },

      cambiaEHour() {
        this.sHour = this.eHour;
      },

      login() {
        var self = this
        var url = '/login'
        var cuerpo = {"email": self.user, "accessCode": self.passwd}
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(cuerpo),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(function(r){
              return r.json()
          }).then(function(j){
            if (j.result != "KO") {
              self.token = j.result.token;
              self.logged = true;
              self.listDevices();
              self.user = ""
            }
            self.passwd = ""
          });
      },

      listDevices() {
        var self = this
        this.devices = [];
        this.devicesSelect = [];
        var url = '/devices'
        fetch(url, {
          headers:{
            'authorization': "Bearer " + this.token
          }
        })
          .then(function(r){
              return r.json()
        }).then(function(j){
          self.devices.push(...j.result)
          self.devicesSelect.push(...j.result)
        });
      },

      deleteDevice(id) {
        var url = "/device/" + id;
        fetch(url, {
          method: 'DELETE',
          headers:{
            'authorization': "Bearer " + this.token
          }
        }).then(function(r){
              return r.json()
          }).then(function(j){
              console.log(j.result);
              this.listDevices();
          });
      },

      deleteRecomendacion(id) {
        var url = "/device/" + this.deviceSelectedPanelRecomendaciones + "/recommendation/" + id;
        fetch(url, {
          method: 'DELETE',
          headers:{
            'authorization': "Bearer " +  this.token
          }
        }).then(function(r){
              return r.json()
          }).then(function(j){
              console.log(j.result);
          });
        this.filtrarRecomendaciones();
      },

      enviarMedida(e) {
        if (this.deviceSelectedMeasure && this.valueMeasure) {
          var fechaMeasure = Date.now();
          var cuerpo = {observationDate: fechaMeasure, measuredValue: this.valueMeasure};
          var url = '/device/' + this.deviceSelectedMeasure + '/measure';
          fetch(url, {
            method: 'POST',
            body: JSON.stringify(cuerpo),
            headers:{
              'Content-Type': 'application/json',
              'authorization': "Bearer " +  this.token
            }
          }).then(function(r){
                return r.json()
            }).then(function(j){
                console.log(j.result);
            });
          this.deviceSelectedMeasure = null;
          this.valueMeasure = null;
          alert("Se ha añadido con éxito");
        }
      },

      enviarRecomendacion(e) {
        if (this.deviceSelectedRecomendation && this.valueRecomendation && this.typeSelectedRecomendation) {
          var fechaRecomendation = Date.now();
          var cuerpo = {dateCreated: fechaRecomendation, description: this.valueRecomendation, category: this.typeSelectedRecomendation};
          var url = '/device/' + this.deviceSelectedRecomendation + '/recommendation';
          fetch(url, {
            method: 'POST',
            body: JSON.stringify(cuerpo),
            headers:{
                'Content-Type': 'application/json',
                'authorization': "Bearer " + this.token
              }
          }).then(function(r){
                return r.json()
            }).then(function(j){
                console.log(j.result);
            });
          this.deviceSelectedRecomendation = null;
          this.valueRecomendation = null;
          this.typeSelectedRecomendation = null;
        }
      }, 
      filtrarMedidas(e) {
        var self = this
        self.measures = [];

        if (this.deviceSelectedPanelMonitorizacion) {
          if ((this.sValue && this.eValue) || (this.sDate && this.eDate && this.sHour && this.eHour)) {
            var url = '/device/' + this.deviceSelectedPanelMonitorizacion + '/measures?';
            if ((this.sDate && this.eDate && this.sHour && this.eHour)) {
              var sFecha = this.sDate + "~" + this.sHour;
              var eFecha = this.eDate + "~" + this.eHour;
              url += 'sDate=' + sFecha + '&eDate=' + eFecha
            }

            if (this.sValue && this.eValue) {
              url += '&sValue=' + this.sValue + '&eValue=' + this.eValue
            }

            fetch(url, {
              headers:{
                'authorization': "Bearer " + this.token
              }
            }).then(function(r){
                  return r.json()
              }).then(function(j){
                  self.measures.push(...j.result);
                  this.dataChart = [];
                  this.labelsChart =  [];

                  self.measures.sort(function (a, b) {
                    if (a.observationDate > b.observationDate) {
                      return 1;
                    }
                    if (a.observationDate < b.observationDate) {
                      return -1;
                    }
                    return 0;
                  });

                  for (let measure of self.measures) {
                    this.dataChart.push(measure.measuredValue)
                    var str = new Date(measure.observationDate).getHours() + ":" + new Date(measure.observationDate).getMinutes();
                    this.labelsChart.push(str)
                  }
                  var ctx = document.getElementById("myChart").getContext('2d');
                  new Chart(ctx, {
                      type: 'line',
                      data: {
                          labels: this.labelsChart,
                          datasets: [{
                              label: "Medidas",
                              data: this.dataChart,
                          }]
                      },
                  });
              });
          }
        }
      },

      filtrarRecomendaciones(e) {
        var self = this
        self.recomendations = [];

        var url = '/device/' + this.deviceSelectedPanelRecomendaciones + '/recommendations?';
        if (this.sDateRecomendacion && this.eDateRecomendacion) {
          url += 'sDate=' + this.sDateRecomendacion + '&eDate=' + this.eDateRecomendacion
        }
        if (this.tipoRecomendacionPanel != "Cualquiera") {
          url += '&category=' + this.tipoRecomendacionPanel
        }
        if (this.textoRecomendacionPanel) {
          url += '&description=' + this.textoRecomendacionPanel
        }

        fetch(url, {
          headers:{
            'authorization': "Bearer " + this.token
          }
        })
          .then(function(r){
              return r.json()
          }).then(function(j){
            for (var recom of j.result) {
              //PER A QUE FUNCIONE AL NO EXISTIR LA URL
              //url = recom.replace("http://our_own_schema.org", "")
              url = recom
              fetch(url, {
                headers:{
                  'authorization': "Bearer " + self.token
                }
              })
                .then(function(r){
                    return r.json()
                }).then(function(j){
                  self.recomendations.push(j.result)
                });
            }
          });
      },
      filtrarDevices(e) {
        var self = this
        this.devices = [];
        if (this.stateDevice != "Cualquiera" || this.locationDevice != "Cualquiera" || this.typeDevice != "Cualquiera") {
          var url = '/device/search?';
          if (this.stateDevice != "Cualquiera") {
            url += 'itemCondition=' + this.stateDevice
          }
          if (this.locationDevice != "Cualquiera") {
            url += '&location=' + this.locationDevice
          }
          if (this.typeDevice != "Cualquiera") {
            url += '&category=' + this.typeDevice
          }

          fetch(url, {
            headers:{
              'authorization': "Bearer " + this.token
            }
          })
            .then(function(r){
                return r.json()
            }).then(function(j){
                self.devices.push(...j.result);
            });
        } else {
          this.listDevices();
        }
      },

      resetFiltro(e) {
        this.stateDevice = "Cualquiera";
        this.typeDevice = "Cualquiera";
        this.locationDevice = "Cualquiera";
        this.listDevices();
      }
    }
});

//Filtros para la vista
Vue.filter('dateRecomendation', function (value) {
  var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var mes = months[month];
  return day + " de " + mes + " de " + year;
});

Vue.filter('dateMedida', function (value) {
  var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hora = date.getHours();
  var min = date.getMinutes();
  var mes = months[month];
  return hora + ":" + min + " de " + day + " de " + mes + " de " + year;
});