//funcion para arrancar la APP
function iniciarApp() {

    //variables
    //variable que representa al input categorias
    const selectCategorias = document.querySelector('#categorias');
    //agregar un lsitener a selectCategorias para cuando hagan un change
    selectCategorias.addEventListener('change', seleccionarCategoria);

    //llamar la funcion para obtener categorias
    obtenerCategorias();

    //funcion para obtener categorias
    function obtenerCategorias() {
        //url del endpoint
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        //fetch
        fetch( url )
            .then( respuesta => respuesta.json() )
                //llamamos la funcion para poder mostrar las categorias
                .then( resultado => mostrarCategorias( resultado.categories ));
    }

    //funcion para mostrar las categorias en el input
    //definimos categorias desde el parametro como un array vacio
    function mostrarCategorias( categorias = [] ) {
        //iterar sobre las categorias
        categorias.forEach( categoria => {
            //destructuring
            const { strCategory } = categoria;
            //construir el html
            //cuando se usa createelement se recomienda poner la etiqueta en mayusculas
            const option = document.createElement('OPTION');
            //se pone el value strCategory
            option.value = strCategory;
            //textcontent
            option.textContent = strCategory;
            //renderizar
            selectCategorias.appendChild( option );
        });
    }
    //funcion para detectar cuando seleccionen categoria
    function seleccionarCategoria( e ) {
        //valor del select
        const categoria = e.target.value;
        //url
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${ categoria }`;
        console.log( url );
    }

}

//listener
document.addEventListener('DOMContentLoaded', iniciarApp);