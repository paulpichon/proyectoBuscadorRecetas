//funcion para arrancar la APP
function iniciarApp() {

    //llamar la funcion para obtener categorias
    obtenerCategorias();

    //funcion para obtener categorias
    function obtenerCategorias() {
        //url del endpoint
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        //fetch
        fetch( url )
            .then( respuesta => respuesta.json() )
                .then( resultado => console.log( resultado ));
    }

}

//listener
document.addEventListener('DOMContentLoaded', iniciarApp);