const ventanaChequeo = document.getElementById('chequeo')
const ventanaCapturando = document.getElementById('capturando')
const ventanaVista = document.getElementById('vista')
const ventanaSubiendo = document.getElementById('subiendo')
const ventanaExito = document.getElementById('exito')
const ventanaMisgifs = document.getElementById('misGuifos')

const openCam = document.getElementById('openCam')
const cancelBtn = document.getElementById('cancel')
const capturarBtn = document.getElementById('btnCapturar')
const listoBtn = document.getElementById('btnListo')
const repetirBtn = document.getElementById('btnRepetir')
const subirBtn = document.getElementById('btnSubir')
const copiarBtn = document.getElementById('btnCopiar')
const descargarBtn = document.getElementById('btnDescargar')

const htmlVideo = document.querySelector("video")
const videoGrabando = document.getElementById('grabando')
const myGif = document.getElementById("myGif")
const contenedorMisgifs = document.getElementById('cont-misgifs')
let imglogo = document.getElementById('logo')

let gifsLS = []
let camStream
let recorder
let blob
let urlGifnuevo
let nuevoUrl

openCam.addEventListener('click', startCam)
cancelBtn.addEventListener("click", stopCam)
capturarBtn.addEventListener('click', recordVideo)
listoBtn.addEventListener('click', stopRecording)
repetirBtn.addEventListener('click', startCam)
subirBtn.addEventListener('click', postGif)
copiarBtn.addEventListener('click', copiarLink)
descargarBtn.addEventListener('click', descargarGif)


window.onload = function(){

    if (localStorage.tema == 'night') {
        aplicarTema()
    }

    if (localStorage.getItem('GifList')) {
        
        let misGifArr = JSON.parse(localStorage.getItem('GifList'));
        i = 0
        for (let gifUrl of misGifArr) {

            let migif = document.createElement("div")
            migif.setAttribute("class", "gif")
            migif.style.backgroundImage = "url(" + gifUrl + ")";
            contenedorMisgifs.appendChild(migif)
            i++
        }
        let rowsCount = Math.ceil(i / 4)
        contenedorMisgifs.style.gridTemplateRows = "repeat(" + rowsCount + ", calc(-72px + 25vw))"

        
    } else {
        console.log("no hay gif guardados en esta sesion");
    }
}

function aplicarTema() {

    if(localStorage.tema == 'day'){
        imglogo.src = "assets/gifOF_logo.png"
        document.getElementById('linkCSS').href = 'styles/day-theme.css'
    }else{
        imglogo.src = 'assets/gifOF_logo_dark.png'
        document.getElementById('linkCSS').href = 'styles/night-theme.css'
    }

}

/*************** ENCENDER CAMARA ***************************************************************************/
function startCam(){
    document.getElementById('esconder').hidden = true
    ventanaVista.hidden = true
    ventanaMisgifs.hidden = true
    ventanaChequeo.hidden = false
    ventanaSubiendo.hidden = true
    navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: "user",
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 }
            }
        })
        .then(function(stream){
            camStream = stream;
            htmlVideo.srcObject = camStream;
            htmlVideo.play();
            videoGrabando.srcObject = camStream;
            videoGrabando.play();
        })
}

/*************** APAGAR CAMARA ****************************************************************************/
function stopCam() {
    cameraStream.getTracks().forEach(track => track.stop())
}

/****************** GRABAR ********************************************************************************/
function recordVideo(){
    ventanaCapturando.hidden = false
    ventanaChequeo.hidden = true
    recorder = createGifRecorder(camStream)
    recorder.startRecording()
}

function stopRecording() {
    recorder.stopRecording(showRecordedGif)
}

function showRecordedGif() {
    ventanaCapturando.hidden = true
    ventanaVista.hidden = false
    blob = recorder.getBlob()
    urlGifnuevo = URL.createObjectURL(blob)
    myGif.src = urlGifnuevo
    
    recorder.destroy();
    recorder = null;
}

/******************** SUBIR Y GUARDAR GIF ***************************************************************/
function postGif() {
    ventanaVista.hidden = true
    ventanaSubiendo.hidden = false
    const url = 'https://upload.giphy.com/v1/gifs?api_key=mmQI4GOcW9OJNQWBcB5OrzKrrjDOXBUW';

    var data = new FormData();
    data.append('file', blob, 'myGif.gif');

    fetch(url, {
    method: 'POST',
    body: data
    }).then(response => {
        return response.json();
    }).then(responseBody => {
        ventanaSubiendo.hidden = true
        ventanaExito.hidden = false
        ventanaChequeo.hidden = true
        
        guardarLS(responseBody.data.id)
        document.getElementById('nuevoGif').src = urlGifnuevo
    })
}

function guardarLS(id){
    //traigo el gif conpleto con este id
    fetch('https://api.giphy.com/v1/gifs/' + id + '?&api_key=mmQI4GOcW9OJNQWBcB5OrzKrrjDOXBUW')
        .then(response => {
            return response.json();
        })
        .then(dataGif => {

            nuevoUrl = dataGif.data.images.downsized.url
            //me fijo si hay algo guardado
            if (localStorage.getItem('GifList')) {
                
                gifsLS = JSON.parse(localStorage.getItem('GifList'));
                
                gifsLS.push(nuevoUrl);
                
                localStorage.setItem('GifList', JSON.stringify(gifsLS));
                console.log('guardado en ls')
            } else {
                gifsLS.push(nuevoUrl);
                localStorage.setItem('GifList', JSON.stringify(gifsLS));
                console.log('guardado en ls')
            }
        });
}

function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif')
}

function copiarLink(){
    navigator.clipboard.writeText(nuevoUrl).then(rta => {
        alert("Link de tu gif copiado!")
    })
}

function createGifRecorder(stream) {
    return RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        //timeSlice: 1000,
    });
}