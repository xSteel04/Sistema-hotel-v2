<template>
  <v-container>
    <v-row justify="center">
      <!-- stepper ejemplo -->

      <v-stepper v-model="e6" vertical id="margen">
        <!-- Stepper de informacion de habitacion -->
        <v-stepper-step :complete="e6 > 1" step="1">
          Información de habitación
          <small>Detalles específicos</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card color="white" width="90%" class="mb-12">
            <v-container>
              <v-row justify="center">
                <v-col md="12">
                  <center>
                    <h1>Información de habitación</h1>
                  </center>
                </v-col>
                <v-col md="5" style="margin-left: 160px; color: green">
                  <h4>
                    Precio de habitación:
                    <strong>{{ habitacion[0].precioHab }}$</strong>
                  </h4>
                </v-col>
                <v-col md="5" style="color: green">
                  <h4>
                    Nombre de habitación:
                    <strong>{{ habitacion[0].nombreHab }}</strong>
                  </h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-btn color="primary" @click="e6 = 2"> Continue </v-btn>
        </v-stepper-content>

        <!-- stepper de informacion de reserva -->
        <v-stepper-step :complete="e6 > 2" step="2">
          Detalles de reserva
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-container>
            <v-row justify="center">
              <v-card class="mb-12" width="90%" outlined id="margen">
                <center>
                  <h1 style="margin-top: 40px">Detalle de reserva</h1>
                </center>
                <v-form v-model="valid" ref="form" lazy-validation>
                  <v-container>
                    <v-row no-gutters justify="center" id="margen">
                      <v-col md="5" style="margin-right: 30px">
                        <label>Fecha de entrada</label>
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field style="margin-right: 15px" v-model="fechaEntrada" :rules="Rules" required
                              prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="fechaEntrada" no-title scrollable
                            :min="new Date().toISOString().substr(0, 10)">
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">
                              Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="$refs.menu.save(date)">
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>

                      <v-col md="5">
                        <label>Fecha de salida</label>
                        <v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :return-value.sync="date"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field style="margin-right: 15px" v-model="fechaSalida" :rules="Rules" required
                              prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="fechaSalida" no-title scrollable
                            :min="new Date().toISOString().substr(0, 10)">
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">
                              Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="$refs.menu.save(date)">
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>

                      <v-col md="5">
                        <v-text-field style="margin-right: 15px" v-model="cantPersonas" :rules="Rules" type="number"
                          label="Numero de acompañantes" required></v-text-field>
                      </v-col>

                      <v-col md="5" style="margin-right: 390px; margin-top: 30px">
                        <v-btn class="mr-4" color="success" :disabled="!valid"
                          @click="reservarServicio(null) && cacturarfecha(fechaSalida,fechaEntrada)">
                          Agregar Fechas
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card>
            </v-row>
          </v-container>

          <v-btn color="primary" :disabled="conficionalReserva == true" @click="e6 = 3"> Continue </v-btn>
          <v-btn text @click="e6 = 1"> Regresar </v-btn>
        </v-stepper-content>

        <!-- stepper de informacion de Sercicios -->
        <v-stepper-step :complete="e6 > 3" step="3">
          Seleccione alguno de los paquetes
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-container>
            <v-row justify="center">
              <v-col sm="3" md="3"  v-if="item.estado == 0 " v-for="(item, i) in servicios" :key="i">
                <v-card v-if="item.estado == 0 " class="mx-auto" max-width="344" id="top">
                  <v-img :src="item.img" height="200px"></v-img>

                  <v-card-title>
                    {{ item.servicio }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ item.precio }} $, el servicio
                  </v-card-subtitle>

                  <v-card-actions>
                    <v-btn color="orange lighten-2" text @click="(terminada = true) &&reservarServicio(item.idservicio)&& cacturarfecha()">
                      Agregar paquete
                    </v-btn>

                    <v-spacer></v-spacer>

                    <v-btn icon @click="show = true">
                      <v-icon>{{
                          show ? "mdi-chevron-up" : "mdi-chevron-down"
                      }}</v-icon>
                    </v-btn>
                  </v-card-actions>

                  <v-expand-transition>
                    <div v-show="show">
                      <v-divider></v-divider>

                      <v-card-text>
                        {{ item.descripcion }}
                      </v-card-text>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-btn color="primary" @click="Terminar2(),e6 = 4"> Continuar </v-btn>
           <v-btn color="primary" @click="Terminar1()"> Terminar </v-btn>
          <v-btn text @click="e6 = 2"> Regresar </v-btn>
        </v-stepper-content>

        <v-stepper-step step="4"> Pago </v-stepper-step>
        <v-stepper-content step="4">
          <v-card class="mx-auto" max-width="700" outlined id="margen">
            <center>
              <h3 id="margen">Método de pago</h3>
            </center>
            <v-form v-model="valid">
              <v-container>
                <v-row no-gutters justify="center" id="margen">
                  <v-col md="12">
                    <label>Número de tarjeta</label>
                    <v-text-field v-model="pagar.numeroTarjeta" maxlength="16" :rules="Rules" required></v-text-field>
                  </v-col>

                  <v-col md="5" style="margin-right: 30px">
                    <label>Fecha de vencimiento</label>                  
                    <v-menu ref="menu" v-model="menu4" :close-on-content-click="false" :return-value.sync="date"
                      transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field style="margin-right: 15px" v-model="pagar.fechaVence" :rules="Rules" required
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="pagar.fechaVence" no-title scrollable
                        :min="new Date().toISOString().substr(0, 10)">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(date)">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="5" style="margin-right: 30px">
                    <label>CVC</label>
                    <v-text-field v-model="pagar.cvc" :rules="Rules" maxlength="3" required></v-text-field>
                  </v-col>
                  <v-col md="12">
                    <label>Nombre de la tarjeta</label>
                    <v-text-field v-model="pagar.nombreTarjeta" :rules="Rules" required></v-text-field>
                  </v-col>

                  <v-col md="12">
                    <label>costo</label>
                     <label>{{costo}}</label>
                   
                  </v-col>
                    <v-col md="12">
                    <label>pagar 50%</label>
                     <label>{{pago}}</label>
                   
                  </v-col>
                  <v-col md="3" style="margin-right: 390px">



                    <!-- Dialog de reserve-->

                    <div class="text-center">
                      <v-dialog v-model="dialog" width="600">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mr-4" :disabled="!valid" color="success" v-bind="attrs" v-on="on">
                            Pagar
                          </v-btn>
                        </template>

                        <v-card>
                          <v-card-title class="text-h5 blue-grey darken-2">
                            Condiciones para realizar la reservación 
                          </v-card-title>

                          <v-card-text style="margin-top: 15px; text-align: justify;">
                            <strong>Importante:</strong> No entrar en la cobertura de cancelaciones debido
                            a alerta de viaje del gobierno, temor a viajar o cambios de ideas. Es posible que
                            el seguro de viaje incluya covertura por enfermedad diagnosticada de COVID-19, el
                            covid se considera un evento previsibles, por lo que no aplican otras coberturas
                            seleccionadas.
                          </v-card-text>

                          <v-card-text>
                            <ul>
                              <li>
                                Las cancelaciones, los cambios efectuados despues de las 6pm y las personas
                                que no se presenten al checkin estan sujetos a un monto de retención equivalente al
                                50% del monto total a pagar.
                              </li>
                              <li>
                                El personal de recepción estara esperando su llegada.
                              </li>
                            </ul>
                          </v-card-text>

                          <v-card-text>
                            Al hacer click en el botón de abajo acepta que revise nuestras políticas, términos y condiciones,
                            las alertas de viajes del gobierno y las normas regulares del turismo aceptando dichas 
                            normas y restricciones.
                            <v-checkbox style="margin-top: 20px" v-model="checkbox1"
                              label="Acepto las condiciones de uso"></v-checkbox>
                          </v-card-text>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text :disabled="!checkbox1" @click="Pagar(), dialog = false">
                              Reservar
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
          <v-btn text @click="e6 = 3"> Regresar </v-btn>
        </v-stepper-content>
      </v-stepper>


    </v-row>
  </v-container>
</template>
<script src="http://momentjs.com/downloads/moment.min.js"></script>
<script>
import axios from "axios";
export default {
  data: () => ({
    terminada:false,
    conficionalReserva: true,
    conficionalServicios: true,
    valid: false,
    menu: false,
    modal: false,
    menu2: false,
    menu2: false,
    menu4: false,
    dialog: false,
    checkbox1: false,
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    show: false,
    // precio: 200,
    servicios: [],
    habitacion: [],
    fechaEntrada: "",
    fechaSalida: "",
    cantPersonas: 0,
    e6: 1,

    pagar: {
      nombreTarjeta: "",
      numeroTarjeta: "",
      fechaVence: "",
      cvc: 0,
      tipoTarjeta: "Visa",
      idusuarios: 0,
      cacturarservicio:0,
      idreserva:0,
      costo: 0,
      pago: 0,
      motivo:"reserva",
      fecha: new Date().toISOString().substr(0, 10),
    },

    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    serv: null,
    time_difference: 0,
    Rules: [(v) => !!v || "El campo es requerido"],
    dias:[],
    costo:[],
    pago:[],
  }),
  created() {
    this.servicioHabitacion();
    this.habitaciones();
  },
  methods: {


    CambioEstado: async function (id) {
     
      let estado = { estado: "Reservadas" };

      console.log("Yo soy cambio de estado: ", id + " " + estado.estado);
      if (this.EstadoSeleccionado == "") {
        alert("Selecciona un estado puto")
        return 0
      }
      await axios.put("http://localhost:3000/habitaciones/cambiarEstado/" + id, estado).then((resp) => {
        if (resp.status == 204) {
          this.obtenerHabitaciones();
        }
      });
    },
    Pagar: async function () {
      let usuario = parseInt(window.sessionStorage.getItem("seleccionado"));
         this.pagar.idreserva = this.dias.idreserva,
         this.pagar.costo = this.costo,
         this.pagar.pago = this.pago,
          this.pagar.saldo =  this.pagar.costo - this.pagar.pago,
         this.pagar.estado = 0
         this.pagar.idusuarios = usuario;
       if (this.pagar.saldo==0) {
           this.pagar.estado = 1
         }
         
      console.log(this.pagar);
      await axios
        .post("http://localhost:3000/metodoPago/create", this.pagar)
        .then((resp) => {
          if (resp.status == 201) {
            alert("El pago y la reserva se han hecho exitosamente.");
            this.reservarServicio();
            this.correo2();
            location.replace("/visualizar");
          } else if (resp.status == 201) {
            alert('Complete los campos pendientes porfavor');
          }
        });
      console.log(this.servicios);
    },

    habitaciones() {
      let usuario = window.sessionStorage.getItem("seleccionado");
      console.log(usuario);
      let obtener = window.sessionStorage.getItem("Habitacion");
      this.habitacion.push(JSON.parse(obtener));
      console.log(this.habitacion);
    },
    

    servicioHabitacion: async function () {
      console.log("Hola");
      await axios.get("http://localhost:3000/servicios").then((resp) => {
        if (resp.status == 200) {
          this.servicios = resp.data;
        }
      });
      console.log(this.servicios);
    },

    reservarServicio: async function (idServ) {
      let usuario = window.sessionStorage.getItem("seleccionado");
      let send = {
        fechaEntrada: this.fechaEntrada,
        fechaSalida: this.fechaSalida,
        cantPersonas: this.cantPersonas,
        estado: 1,
        idservicio: idServ,
        idhabitacion: this.habitacion[0].idHab,
        idusuario: usuario,
        idcategoriaHab: this.habitacion[0].idcategoriaHab,
       
      };
      console.log("reserva",send)
      this.terminar = send
      console.log("reserva",this.terminar)
      
      if (this.fechaEntrada == "") {
        alert("Complete La Fecha de Entrada");
        this.conficionalReserva = true;
      }
      if (this.fechaSalida == "") {
        alert("Complete La Fecha de Salida");
        this.conficionalReserva = true;
      }

      
      if (this.habitacion[0].idcategoriaHab == 1) {
        if (((this.cantPersonas) >= (10))) {
          alert("Capacidad maxima de la habitacion es de 9 personas");
          this.conficionalReserva = this.conficionalReserva = true;    
        } else if (((this.cantPersonas) <= (-1))) {
          alert("No se permiten números negativos");
           this.conficionalReserva = this.conficionalReserva = true;    
        } else{
           this.conficionalReserva =  this.conficionalReserva=false;
        }   
      }
      // 1
        if (this.habitacion[0].idcategoriaHab == 2) {
        if (((this.cantPersonas) >= (7))) {
          alert("Capacidad maxima de la habitacion es de 6 personas");
          this.conficionalReserva = this.conficionalReserva = true;    
        } else if (((this.cantPersonas) <= (-1))) {
          alert("No se permiten números negativos");
           this.conficionalReserva = this.conficionalReserva = true;    
        } else{
           this.conficionalReserva =  this.conficionalReserva=false;
        }   
      }
      // 2
       if (this.habitacion[0].idcategoriaHab == 3) {
        if (((this.cantPersonas) >= (4))) {
          alert("Capacidad maxima de la habitacion es de 3 personas");
          this.conficionalReserva = this.conficionalReserva = true;    
        } else if (((this.cantPersonas) <= (-1))) {
          alert("No se permiten números negativos");
           this.conficionalReserva = this.conficionalReserva = true;    
        } else{
           this.conficionalReserva =  this.conficionalReserva=false;
        }   
      }
     if (this.pagar.nombreTarjeta == "") {
        alert("Dato de reserva añadidio correctamente.");
        let enviar = JSON.stringify(send);
        window.sessionStorage.setItem("send", enviar);
        return 0;
      }
    
     

    },
    
    
    Terminar1: async function () {
    //    let enviarDatosFinales = JSON.parse(enviardatos);
    //   console.log("Reserva: ", enviarDatosFinales);
     console.log(this.terminar);
      await axios
        .post("http://localhost:3000/reserva/create", this.terminar)
        .then((resp) => {
           if (resp.status == 201) {
            console.log("datos", resp)
            this.dias = resp.data;
            console.log("funciona", this.dias)
            this.costo = this.habitacion[0].precioHab * this.dias.dias  
            this.pago=this.costo /2
            alert("Reserva por "+this.dias.dias+" dias de la habitacion "+ this.habitacion[0].nombreHab +" con un costo de "+this.costo+"C$ solicitada correctamente.");
            this.correo();
            //location.replace("/visualizar");
          }
          if (resp.status == 200) {
            console.log("creaste")
            this.respuesta = "Sesión abierta";
            this.CambioEstado(this.habitacion[0].idHab);
             console.log("reserva",this.resp)
            alert("Reserva creada correctamente.");
             location.replace("/visualizar");
          }
          
          
        })
        .catch((error) => {
          this.respuesta = error.message;
          console.log(this.respuesta);
          alert(this.respuesta);
        });
    },
    /////
       ///aprobar reserva
       correo: async function () {
        let Aidi2 =  window.sessionStorage.getItem("seleccionado");
       await axios.get("http://localhost:3000/usuario/list2/"+Aidi2).then((resp) => {
        if (resp.status == 200) {
          this.email = resp.data;
          console.log("email", this.email);
          console.log("email", this.email[0].email);
        }
      });
          let correo = {email:  this.email[0].email , htmlBody: "Reserva por "+this.dias.dias+" dias de la habitacion "+ this.habitacion[0].nombreHab +" con un costo de "+this.costo+"C$ solicitada correctamente."}
           await axios.post("http://localhost:3000/email",correo).then((resp) => {
          alert("solicitud enviada")
          location.replace("/visualizar");
         });

          },
      ///
      correo2: async function () {
        let Aidi2 =  window.sessionStorage.getItem("seleccionado");
       await axios.get("http://localhost:3000/usuario/list2/"+Aidi2).then((resp) => {
        if (resp.status == 200) {
          this.email = resp.data;
          console.log("email", this.email);
          console.log("email", this.email[0].email);
        }
      });
          let correo = {email:  this.email[0].email , htmlBody: "Reserva por "+this.dias.dias+" dias de la habitacion "+ this.habitacion[0].nombreHab +" con un costo de "+this.costo+"C$ se realizo un pago de "+ this.pago+"C$ con tarjeta"}
           await axios.post("http://localhost:3000/email",correo).then((resp) => {
          alert("se aprobo el usuario")
         });

          },
      ///
    ////
    Terminar2: async function () {
    //    let enviarDatosFinales = JSON.parse(enviardatos);
    //   console.log("Reserva: ", enviarDatosFinales);
    this.terminar.estado = 3;
     console.log(this.terminar);
      await axios
        .post("http://localhost:3000/reserva/create", this.terminar)
        .then((resp) => {
           if (resp.status == 201) {
            console.log("datos", resp)
            this.dias = resp.data;
            console.log("funciona", this.dias)
            this.costo = this.habitacion[0].precioHab * this.dias.dias  
            this.pago=this.costo /2
            alert("Reserva por "+this.dias.dias+" dias de la habitacion "+ this.habitacion[0].nombreHab +" con un costo de "+this.costo+"C$ solicitada correctamente.");
            // location.replace("/");
          }
          if (resp.status == 200) {
            console.log("creaste")
            this.respuesta = "Sesión abierta";
            this.CambioEstado(this.habitacion[0].idHab);
             console.log("reserva",this.resp)
            alert("Reserva creada correctamente.");
            // location.replace("/");
          }
          
          
        })
        .catch((error) => {
          this.respuesta = error.message;
          console.log(this.respuesta);
          alert(this.respuesta);
        });
    },
  },
  setup() { },
};
</script>

<style scoped>
#margen {
  margin-top: 40px;
}
</style>
