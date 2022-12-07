class InfoElectri{

   

    constructor(initFecha, endFecha, lan, categoria, widget){                                                              
        
       
        
        this.iniFecha = "start_date=" + initFecha + "T00:00";
        this.finFecha = "end_date=" + endFecha + "T23:59";
        this.penin = "geo_limit=" + "peninsular"; 
        this.category = categoria;
        this.widget = widget;
        this.lang = lan;
        this.q = "" + this.iniFecha + "&" + this.finFecha;
        this.truncday = "&time_trunc=day";
        this.url = "https://apidatos.ree.es/" + this.lang + "/datos/" + this.category + "/" + this.widget + "?" + this.q + this.truncday + "&" + this.penin;
        this.datos = null;
        
    }


    cargarDatos(nombreArchivo, peticion){

        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(datos){

               peticion.download(nombreArchivo, JSON.stringify(datos,null,2));
                },

            error:function(){
                alert("Error al descargar los datos, puede ser a causa de que no hay datos de ese apartado por ahora o por causa de las fechas.Inténtalo de nuevo.");
               return;
                
                }
          
        });

    }


    

}


class Peticion{


    constructor(){
        this.Balance = ["balance-electrico"];

        this.Demanda = ["evolucion"
        ,"ire-general-movil","ire-industria","ire-industria-movil",
        "ire-servicios","ire-servicios-movil"];


        this.Gen = ["estructura-generacion","evolucion-renovable-no-renovable","estructura-renovables",
        "estructura-generacion-emisiones-asociadas","evolucion-estructura-generacion-emisiones-asociadas","no-renovables-detalle-emisiones-CO2",
        "maxima-renovable", "potencia-instalada", "maxima-renovable-historico", "maxima-sin-emisiones-historico"];
    
        this.Inter = ["francia-frontera", "andorra-frontera", "lineas-francia", "lineas-andorra","francia-frontera-programado" , 
        "andorra-frontera-programado", "enlace-baleares", "frontera-fisicos","todas-fronteras-fisicos", "frontera-programados", "todas-fronteras-programados"];
            

        this.Transporte =["indice-disponibilidad", "indice-indisponibilidad", "kilometros-lineas", "numero-cortes",
        "indice-disponibilidad-total","energia-no-suministrada-ens"];
      
        this.Mercados = ["componentes-precio", "energia-gestionada-servicios-ajuste",
        "energia-restricciones","precios-restricciones","banda-regulacion-secundaria",
        "energia-precios-regulacion-secundaria","energia-precios-regulacion-terciaria","energia-precios-gestion-desvios",
        "coste-servicios-ajuste","volumen-energia-servicios-ajuste-variacion","precios-mercados-tiempo-real", "energia-precios-ponderados-gestion-desvios"];
    }

    pedirElectricista(initFecha, endFecha, lan, categoria, widget){

        return new InfoElectri(initFecha, endFecha, lan, categoria, widget);


    }

    comprobarCategoria(){

        

        let selec = false;
       
        let i = 1;
        for(i = 1; i <= 6; i++){
            if($('#categoria' + i).is(":checked")){
                selec = true;

                
                return $('#categoria' + i).val();
            }
        }
        

        if(selec == false){
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


            this.writeWidgets(this.Balance);



        }else if(categoria == 'demanda'){

            this.writeWidgets(this.Demanda);



        }else if(categoria == 'generacion'){

            this.writeWidgets(this.Gen);

        }else if(categoria == 'intercambios'){

            this.writeWidgets(this.Inter);

        }else if(categoria == 'transporte'){

            this.writeWidgets(this.Transporte);

        }else {
            this.writeWidgets(this.Mercados);
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
    if (event.key === 'u') {
        requestCreator.forKeyBoardCheckbuttons('categoria1');
        
        requestCreator.checkearCheckbox('categoria1');
    }
    if (event.key === 'd') {
        requestCreator.forKeyBoardCheckbuttons('categoria2');
        requestCreator.checkearCheckbox('categoria2');
    }
    if (event.key === 't') {
        requestCreator.forKeyBoardCheckbuttons('categoria3');
        requestCreator.checkearCheckbox('categoria3');
      }
    if (event.key === 'c') {
        requestCreator.forKeyBoardCheckbuttons('categoria4');
        requestCreator.checkearCheckbox('categoria4');
    }
    if (event.key === 'i') {
        requestCreator.forKeyBoardCheckbuttons('categoria5');
        requestCreator.checkearCheckbox('categoria5');
    }
    if (event.key === 's') {
        requestCreator.forKeyBoardCheckbuttons('categoria6');
        requestCreator.checkearCheckbox('categoria6');
    }
  });


var requestCreator = new Peticion();