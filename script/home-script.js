const seccionBuscador = document.getElementById('buscador')
const seccionTendencias = document.getElementById('tendencias')
const seccionSugerencias = document.getElementById('sugerencias')
const seccionMisguifos = document.getElementById('misGuifos')
const seccionBusqueda = document.getElementById('s-busqueda')
const buscarBtn = document.getElementById('btnBuscar')
const misguifosBtn = document.getElementById('btnMisgifos')

let inputBusqueda = document.getElementById('busqueda')
let btnHome = document.getElementById('home')
let btnDay = document.getElementById('sd')
let btnNight = document.getElementById('sn')
let gifs = document.getElementsByClassName('gif')
let pieTitulo = document.getElementsByClassName('pie')
let pieRtdo = document.getElementsByClassName('pie-rtdo')
let imglogo = document.getElementById('logo')
let flecha = document.createElement("img")
let arraySuge = []
let i = 0

buscarBtn.addEventListener('click', buscador)
inputBusqueda.addEventListener('input', habilitaBoton)
btnHome.addEventListener('click', volveraHome)
misguifosBtn.addEventListener('click', cargarMisguifos)

window.onload = function(){
    if (localStorage.tema == 'night') {
        aplicarTema()
    }
    this.getTendencias()
}

function volveraHome(){
    btnHome.removeChild(document.getElementById('arrow'))
    seccionMisguifos.hidden = true
    seccionBusqueda.hidden = true
    seccionBuscador.hidden = false
    seccionSugerencias.hidden = false
    seccionTendencias.hidden = false
    inputBusqueda.value = ""
    limpiarContenedor('cont-misgifs')
}

function limpiarContenedor(nombreCont){
    var contenedor = document.getElementById(nombreCont)
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

function agregaFlecha(){
    flecha.setAttribute('src', '../assets/arrow.svg')
    flecha.setAttribute('class', 'arrow')
    flecha.setAttribute('id', 'arrow')
    btnHome.insertBefore(flecha, imglogo)
}
function generarGifos(imagen, titulo, contenedor){
    let guifo = document.createElement("div")
    guifo.setAttribute("class", "p-relative")
    guifo.style.backgroundImage = "url(" + imagen + ")";
    guifo.innerHTML =
            '<p class="pie-rtdo">#' + titulo + '</p>'

    document.getElementById(contenedor).appendChild(guifo)
}
function getTendencias() {
    
    const found = fetch('https://api.giphy.com/v1/gifs/trending?&api_key=mmQI4GOcW9OJNQWBcB5OrzKrrjDOXBUW&limit=16')
    .then(response => {
        return response.json();
    })
    .then(info => {
        for(i = 0; i < 16; i++ ){ 
            arraySuge.push({ url: info.data[i].images.downsized.url, titulo: info.data[i].title })
            if(i<4){
                mostrarSugerencias()
            }else{
                generarGifos(info.data[i].images.downsized_large.url, info.data[i].title, 'con-tendencias')
            }
            
        }
        console.log(info)
        return info
    })
    .catch(error => {
        console.log(error);
        return error;
    });
    return found;
}
function mostrarSugerencias(){
    let contenedorSugerencias = document.getElementById('cont-suge')

    let ventanaSug = document.createElement("div");
    ventanaSug.setAttribute("class", "sugerido");
    ventanaSug.style.backgroundImage = "url(" + arraySuge[i].url + ")";
    ventanaSug.innerHTML =

        '<nav class = "" >' +
        '<p> #' + arraySuge[i].titulo + '  </p>' +
        '<img class="eliminar-sug" src = "../assets/button_close.svg" alt = "cruz" ></nav>' +
        '<button class = "btnVermas" onclick="buscar(\'' + arraySuge[i].titulo + '\')"> Ver mas... </button>';
    contenedorSugerencias.appendChild(ventanaSug);
}


//****************************** BUESQUEDA ***********************************************************************/

function habilitaBoton(){
    if(localStorage.tema == 'night'){
        if(inputBusqueda.value.trim()){
            buscarBtn.disabled = false
            document.getElementById('lupita').src = '../assets/lupa_light.svg'
        }else{
            buscarBtn.disabled = true
            document.getElementById('lupita').src = '../assets/CombinedShape.svg'
        }
    }else{

        if(inputBusqueda.value.trim()){
            buscarBtn.disabled = false
            document.getElementById('lupita').src = '../assets/lupa.svg'
        }else{
            buscarBtn.disabled = true
            document.getElementById('lupita').src = '../assets/lupa_inactive.svg'
        }
    }
}

function buscarHistorial(queBusco){
    getSearchResults(queBusco)
    inputBusqueda.value = queBusco
}

function buscador(){  // busqueda usando el buscador
    if(inputBusqueda.value != ""){

        getSearchResults(inputBusqueda.value)
        let btnHistorial = document.createElement("button")
        btnHistorial.setAttribute("class", "btnHistorial")
        btnHistorial.setAttribute("value", inputBusqueda.value)
        btnHistorial.setAttribute("onclick", 'buscarHistorial(this.value)')
        btnHistorial.innerText = '#' + inputBusqueda.value
        document.getElementById('tope').after(btnHistorial)
    }else{
        buscarBtn.disabled = true
    }
}

function getSearchResults(cadena) {
    seccionSugerencias.hidden = true
    seccionTendencias.hidden = true
    seccionBusqueda.hidden = false
    limpiarContenedor('cont-rtdo')
    agregaFlecha()
    const found = fetch('https://api.giphy.com/v1/gifs/search?q=' + cadena + '&api_key=mmQI4GOcW9OJNQWBcB5OrzKrrjDOXBUW')
            .then((response) => {
                return response.json()
            }).then(function (info) {
                    for(i = 0; i < 12; i++ ){ 
                        generarGifos(info.data[i].images.downsized_large.url, info.data[i].title, 'cont-rtdo')
                    }
                    return info
                })
            .catch((error) => {
                return error
                })
    return found
}

function buscar(sugerencia){ // busca segun el titulo de la sugerencia
    getSearchResults(sugerencia)
    inputBusqueda.value = sugerencia
}



/*********************** MIS GUIFOS ******************************************************************************/
let contenedorMisgifs = document.getElementById('cont-misgifs')

function cargarMisguifos(){
    
    if(seccionMisguifos.hidden){
        //con este if no me vuelve a cargar otra galeria y flecha repetida
        
        if (localStorage.getItem('GifList')) {
            seccionMisguifos.hidden = false
            seccionBuscador.hidden = true
            seccionSugerencias.hidden = true
            seccionTendencias.hidden = true
            seccionBusqueda.hidden = true
    
            agregaFlecha()
            let misGifArr = JSON.parse(localStorage.getItem('GifList'))
            i = 0
            for (let gifUrl of misGifArr) {  //por cada gif guardado creo un div
                let migif = document.createElement("div")
                migif.setAttribute("class", "gif")
                migif.style.backgroundImage = "url(" + gifUrl + ")"
                contenedorMisgifs.appendChild(migif)
                i++
            }
            let rowsCount = Math.ceil(i / 4)
            contenedorMisgifs.style.gridTemplateRows = "repeat(" + rowsCount + ", calc(-72px + 25vw))"

        } else {
            alert('No tenes gifs guardados')
        }
    }    
}

/**************************** CAMBIO DE TEMA *********************************************************************************************/
btnDay.addEventListener('click', () =>{
    localStorage.tema = 'day'
    aplicarTema(document.getElementById('sd').value)
})
btnNight.addEventListener('click', () =>{
    localStorage.tema = 'night'
    aplicarTema(document.getElementById('sn').value)
})

function aplicarTema() {

    if(localStorage.tema == 'day'){
        imglogo.src = "assets/gifOF_logo.png"
        habilitaBoton() // sin esta funcion no cambiaria la lupa al cambiar de tema
        document.getElementById('linkCSS').href = 'styles/day-theme.css'
    }else{
        imglogo.src = 'assets/gifOF_logo_dark.png'
        habilitaBoton()
        document.getElementById('linkCSS').href = 'styles/night-theme.css'
    }

}