//funcion para arrancar la APP
function iniciarApp() {

    //variables
    //variable que representa al input categorias
    const selectCategorias = document.querySelector('#categorias');
    //agregar un lsitener a selectCategorias para cuando hagan un change
    selectCategorias.addEventListener('change', seleccionarCategoria);

    //variable donde se renderizaran los resultados
    const resultado = document.querySelector('#resultado');
    //variable para modal
    //se pasa como primer parametro el id del modal que esta en el HTML
    //y como segundo parametro el objeto con las configuraciones del modal
    //en esta caso estara vacio
    const modal = new bootstrap.Modal('#modal', {}); 

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
        //fetch
        fetch( url )
            .then( respuesta => respuesta.json() )
                //mandamos a llamr una funcion para mostrar la receta en el modal
                .then( resultado => mostrarRecetaModal( resultado.meals[0] ) )
    }

    //funcion para mostrar una receta en el modal
    //como parametro le pasamos una receta
    function mostrarRecetaModal( receta ) {
        //destructuring
        const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

        //añadir contenido al modal
        //variable que representa el pedaso de html en el index.html para el titulo del modal
        const modalTitle = document.querySelector('.modal .modal-title');
        //textcontent
        modalTitle.textContent = strMeal;

        //cuerpo del modal
        const modalBody = document.querySelector('.modal .modal-body');
        //para usar innerhtml debes de tener mucha seguridad de donde viene los datos
        modalBody.innerHTML = `
            <img class="img-fluid" src="${ strMealThumb }" alt="receta ${ strMeal }" > 
            <h3 class="my-3">Instrucciones</h3>
            <p>${ strInstructions }</p>
            <h3 class="my-3">Ingredientes y Cantidades</h3>
        `;

        //UL para crear un ORDER LIST
        const listGroup = document.createElement('UL');
        //agregar estilos a UL
        listGroup.classList.add('list-group');

        //mostrar cantidades e ingredientes
        //CON UN FOR() HAREMOS LA PARTE PARA AGREGAR LOS INGREDIENTES
        for( let i = 1; i <= 20; i++ ) {
            //condicion
            //este codigo nos ira imprimiendo cada uno de los ingredientes ---> receta[`strIngredient${i}`] 
            //console.log( receta[`strIngredient${i}`] );
            if ( receta[`strIngredient${i}`] ) {
                //al estar mapeados( emparejados ) existe relacion tanto del ingrediente como de la cnatidad
                //si hay ingredientes
                //es decir si hay 7 ingredientes de 20 solo imprimira los 7 ingredientes y no los demas vacios
                const ingrediente = receta[`strIngredient${i}`];
                //cantidades de los ingredientes
                const cantidad = receta[`strMeasure${i}`];
                
                //construir html
                const ingredienteLi = document.createElement('LI');
                //estilos
                ingredienteLi.classList.add('list-group-item');
                //textcontent
                ingredienteLi.textContent = `${ ingrediente } - ${ cantidad }`;

                //agregamos a listGroup cada ingredienteLi
                listGroup.appendChild( ingredienteLi );
            }
        }

        //renderizamos los ingredientes
        //agregamos a modalBody el listGroup
        modalBody.appendChild( listGroup );


        //muestra el modal
        //el metodo .show() es del propio modal de boostrap
        modal.show();
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