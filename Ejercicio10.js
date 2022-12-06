class Electricidad{

   

    constructor(initFecha, endFecha, lan, categoria, widget){                                                              
        
       
        this.truncday = "&time_trunc=day";
        this.startDate = "start_date=" + initFecha + "T00:00";
        this.endDate = "end_date=" + endFecha + "T23:59";
        this.ccaa = "geo_limit=" + "peninsular"; 
        this.category = categoria;
        this.widget = widget;
        this.lang = lan;
        this.query = "" + this.startDate + "&" + this.endDate;
        this.url = "https://apidatos.ree.es/" + this.lang + "/datos/" + this.category + "/" + this.widget + "?" + this.query + this.truncday + "&" + this.ccaa;
        this.datos = null;
        
    }


    cargarDatos(filename, request){

       

        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(datos){

               request.download(filename, JSON.stringify(datos,null,2));
                },

            error:function(){
                alert("Oh oh, algo no ha ido como se esperaba, quizás no haya datos en la plataforma,Repase los datos introducidos o pruebe a cambiar la seleccion de truncado por día.");
               return;
                
                }
          
        });

    }


    currDate(){
       let n =  new Date();
        let y = n.getFullYear();
        let m = n.getMonth();
        let d = n.getDate() - 1;

        return "" + y + "-" + m + "-" + d;
    }


    

}


class RequestCreator{


    constructor(){
        this.widgetsBalance = ["balance-electrico"];

        this.widgetsDemanda = ["evolucion"
        ,"ire-general-movil","ire-industria","ire-industria-movil",
        "ire-servicios","ire-servicios-movil"];


        this.widgetsGeneracion = ["estructura-generacion","evolucion-renovable-no-renovable","estructura-renovables",
        "estructura-generacion-emisiones-asociadas","evolucion-estructura-generacion-emisiones-asociadas","no-renovables-detalle-emisiones-CO2",
        "maxima-renovable", "potencia-instalada", "maxima-renovable-historico", "maxima-sin-emisiones-historico"];
    
        this.widgetsIntercambios = ["francia-frontera", "portugal-frontera", "marruecos-frontera",
        "andorra-frontera", "lineas-francia", "lineas-portugal", "lineas-marruecos","lineas-andorra","francia-frontera-programado" ,
        "portugal-frontera-programado", "marruecos-frontera-programado", "andorra-frontera-programado", "enlace-baleares",
        "frontera-fisicos","todas-fronteras-fisicos", "frontera-programados", "todas-fronteras-programados"];
            

        this.widgetsTrasnporte =["energia-no-suministrada-ens", "indice-indisponibilidad", "tiempo-interrupcion-medio-tim", "kilometros-lineas",
    "indice-disponibilidad", "numero-cortes","ens-tim","indice-disponibilidad-total"];
      
        this.widgetsMercados = ["componentes-precio-energia-cierre-desglose", "componentes-precio", "energia-gestionada-servicios-ajuste",
        "energia-restricciones","precios-restricciones","reserva-potencia-adicional","banda-regulacion-secundaria",
        "energia-precios-regulacion-secundaria","energia-precios-regulacion-terciaria","energia-precios-gestion-desvios",
        "coste-servicios-ajuste","volumen-energia-servicios-ajuste-variacion","precios-mercados-tiempo-real",
        "energia-precios-ponderados-gestion-desvios-before","energia-precios-ponderados-gestion-desvios","energia-precios-ponderados-gestion-desvios-after"];
    }

    pedirElectricista(initFecha, endFecha, lan, categoria, widget){

        return new Electricidad(initFecha, endFecha, lan, categoria, widget);


    }

    comprobarCategoria(){

        

        let haySeleccionada = false;
       
        let i = 1;
        for(i = 1; i <= 6; i++){
            if($('#categoria' + i).is(":checked")){
                haySeleccionada = true;

                
                return $('#categoria' + i).val();
            }
        }
        

        if(haySeleccionada == false){
            alert("Seleccione una categoría");
            return;
        }


    }

    
    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }



    writeWidgets(array){

        let str = "";

            let i = 0;
            for(i = 0; i < array.length; i++){

                str += "<option value=\"" + array[i] + "\">" + array[i] + "</option>";

            }
            $("#nombreArchivo:first").before("<select name=\"select\">" + str + "</select>");


    }

    loadWidgets(categoria){

        $("select").remove();

        if(categoria == 'balance'){


            this.writeWidgets(this.widgetsBalance);



        }else if(categoria == 'demanda'){

            this.writeWidgets(this.widgetsDemanda);



        }else if(categoria == 'generacion'){

            this.writeWidgets(this.widgetsGeneracion);

        }else if(categoria == 'intercambios'){

            this.writeWidgets(this.widgetsIntercambios);

        }else if(categoria == 'transporte'){

            this.writeWidgets(this.widgetsTrasnporte);

        }else { //Mercados
            this.writeWidgets(this.widgetsMercados);
        }

    }

    comprobarFecha(){
        if($("#selecFechaInit").val() > $("#selecFechaFin").val()){
            alert("Las fecha de inicio es posterior a la fecha de fin.");
            return;
        }
    }



    iniciarRequest(){

        this.comprobarFecha();

       let categoriaStr =  this.comprobarCategoria();

       if(categoriaStr==''){
            return;
       }
        
        
       var checkbox = document.querySelector('input[type=checkbox][name=\"truncarDia\"]');

       
        let electricista = this.pedirElectricista($("#selecFechaInit").val() , $("#selecFechaFin").val(), "es", categoriaStr, $("select option:selected").val());

        electricista.cargarDatos($('input[type=text]').val(),this);
      
      

        
       
       

       
        
    }

    checkearCheckbox(categoria){

        
       
        $('input:checkbox').not($("#"+categoria)).prop('checked', false);
        

        let cat = $("#"+categoria).val();
        this.loadWidgets(cat);

    }


    forKeyBoardCheckbuttons(id){

        
       var checkbox = $("#"+id);

       if(checkbox.checked){
        $("#"+id).prop('checked', false);
       }else{
        $("#"+id).prop('checked', true);
       }

    }

}


document.addEventListener('keydown', function (event) {
    if (event.key === 'b') {
        requestCreator.forKeyBoardCheckbuttons('categoria1');
        
        requestCreator.checkearCheckbox('categoria1');
    }
    if (event.key === 'd') {
        requestCreator.forKeyBoardCheckbuttons('categoria2');
        requestCreator.checkearCheckbox('categoria2');
    }
    if (event.key === 'g') {
        requestCreator.forKeyBoardCheckbuttons('categoria3');
        requestCreator.checkearCheckbox('categoria3');
      }
    if (event.key === 'i') {
        requestCreator.forKeyBoardCheckbuttons('categoria4');
        requestCreator.checkearCheckbox('categoria4');
    }
    if (event.key === 't') {
        requestCreator.forKeyBoardCheckbuttons('categoria5');
        requestCreator.checkearCheckbox('categoria5');
    }
    if (event.key === 'm') {
        requestCreator.forKeyBoardCheckbuttons('categoria6');
        requestCreator.checkearCheckbox('categoria6');
    }
    if (event.key === 'r') {
        requestCreator.forKeyBoardCheckbuttons('porDia');
    }
  });


var requestCreator = new RequestCreator();