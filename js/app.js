//funcion para arrancar la APP
function iniciarApp() {

    //variables
    //variable que representa al input categorias
    const selectCategorias = document.querySelector('#categorias');
    //agregar un lsitener a selectCategorias para cuando hagan un change
    selectCategorias.addEventListener('change', seleccionarCategoria);

    //variable donde se renderizaran los resultados
    const resultado = document.querySelector('#resultado');

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
        //fetch a la url
        fetch( url )
            .then( respuesta => respuesta.json() )
            //accedemos a meals
            //llamamos a la funcion mostrarRecetas
            .then( datos => mostrarRecetas( datos.meals ) );
    }
    //funcion para mostrar recetas en base a la categoria seleccionada
    function mostrarRecetas( recetas = []) {
        //limpiar el html anterior
        //y como argumento le decimos que sea en resultado
        limpiaHTML( resultado );

        //heading 
        const heading = document.createElement('H2');
        //estilos
        heading.classList.add('text-center', 'text-black', 'my-5');
        //textcontent
        //condicional ternario
        heading.textContent = recetas.length ? 'Resultados:' : 'No Hay Resultados';
        //renderizar
        resultado.appendChild( heading );

        //iterar en los resultados
        recetas.forEach( receta => {
            //destructuring
            const { idMeal, strMeal, strMealThumb } = receta;
            //construir el html
            const recetaContenedor = document.createElement('DIV');
            //estilos
            recetaContenedor.classList.add('col-md-4');
            //card
            const recetaCard = document.createElement('DIV');
            //estilos
            recetaCard.classList.add('card', 'mb-4');
            //imagen
            const recetaImagen = document.createElement('IMG');
            //estilos
            recetaImagen.classList.add('card-img-top');
            //alt a la imagen
            recetaImagen.alt = `Imagen de la receta ${ strMeal }`;
            //source de la imagen
            recetaImagen.src = strMealThumb;

            //body del card
            const recetaCardBody = document.createElement('DIV');
            //estilos
            recetaCardBody.classList.add('card-body');

            //heading
            const recetaHeading = document.createElement('H3');
            //estilos
            recetaHeading.classList.add('card-title', 'mb-3');
            //textcontent
            recetaHeading.textContent = strMeal;

            //button de enlace
            const recetaButton = document.createElement('BUTTON');
            //estilos
            recetaButton.classList.add('btn', 'btn-danger', 'w-100');
            //textcontent
            recetaButton.textContent = 'Ver Receta';
            //añadir un atributo con dataSet mas bsTarget de bootstrap = data-bs-target
            //recetaButton.dataset.bsTarget = '#modal';
            //llama un o unas funcion dentro de un archivo de javasctipt en este caso = data-bs-toggle="modal"
            //recetaButton.dataset.bsToggle = 'modal';

            //al no estar renderizado aun en el html usamos onclick
            recetaButton.onclick = function() {
                //llamamos funcion para seleccionar receta
                seleccionarReceta( idMeal );
            }

            //inyectar en el html
            //heading
            recetaCardBody.appendChild( recetaHeading );
            //button
            recetaCardBody.appendChild( recetaButton );
            
            //receta card
            //imagen
            recetaCard.appendChild( recetaImagen );
            //cardbody
            recetaCard.appendChild( recetaCardBody );

            //card completo
            recetaContenedor.appendChild( recetaCard );

            //renderizar
            resultado.appendChild( recetaContenedor );
        });
    }
    //funcion para seleccionar receta
    //id de la receta selecionada
    function seleccionarReceta( id ) {
        //url + id de la receta seleccionada
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${ id }`;
        console.log( url );
    }

    //funcion para limpiar el html
    //le pasamos como argumento un selector que es el resultado para indidcarle lo que queremos que limpie
    function limpiaHTML( selector) {
        while ( selector.firstChild ) {
            selector.removeChild( selector.firstChild );
        }
    }

}

//listener
document.addEventListener('DOMContentLoaded', iniciarApp);