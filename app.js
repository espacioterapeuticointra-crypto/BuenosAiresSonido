
// ===========================
// CONCEPTOS FIJOS
// ===========================
const conceptosFijos = [

    {
        nombre: "Operador de Sonido por Hora",
        precio: 20000,
        cantidad: 2,
        minimo: 2
    },

    {
        nombre: "Traslado zona Norte/Oeste",
        precio: 60000,
        cantidad: 1
    }

];

const productos = [

{categoria:"BAFLES",nombre:'Par de bafles 12"',precio:30000},
{categoria:"BAFLES",nombre:'Par de bafles 15"',precio:30000},
{categoria:"BAFLES",nombre:'Bafle potenciado 12" (Monitor)',precio:30000},

{categoria:"POTENCIAS",nombre:'Potencia Para bafles de 12"',precio:25000},
{categoria:"POTENCIAS",nombre:'Potencia Para bafles de 15"',precio:25000},
{categoria:"POTENCIAS",nombre:'Potencia Para los 4 bafles',precio:50000},

{categoria:"MICRÓFONOS",nombre:"Micrófono de mano con cable",precio:5000},
{categoria:"MICRÓFONOS",nombre:"Micrófono de instrumento con cable",precio:5000},

{categoria:"ACCESORIOS",nombre:"Pie de micrófono",precio:4000},
{categoria:"PROCESADORES",nombre:"Virtualizer 2000 (Behringer)",precio:10000, oculto:true},
{categoria:"PROCESADORES",nombre:"EQ 15x2 (Moon)",precio:10000, oculto:true},
{categoria:"PROCESADORES",nombre:"Caja Directa DI20",precio:4000},

{categoria:"CONSOLAS",nombre:"Consola Digital 8 CH",precio:40000},
{categoria:"CONSOLAS",nombre:"Consola Analógica 16 CH",precio:60000},

{categoria:"GRABACIÓN",nombre:"Grabación Multitrack",precio:50000, oculto:true},

...conceptosFijos.map(c => ({
    categoria: "CONCEPTOS FIJOS",
    nombre: c.nombre,
    precio: c.precio,
    fijo: true
}))
];

const lista = document.getElementById("lista");
const carrito = document.getElementById("carrito");
const total = document.getElementById("total");

// ===========================
// COMBOS INTELIGENTES
// ===========================

const combos = {

    "50-solista": [
        { nombre:'Par de bafles 12"', cantidad:1 },
        { nombre:'Potencia Para bafles de 12"', cantidad:1 },
        { nombre:'Consola Digital 8 CH', cantidad:1 },
        { nombre:'Micrófono de mano con cable', cantidad:1 },
        { nombre:'Pie de micrófono', cantidad:1 }
    ],

    "50-duo": [
        { nombre:'Par de bafles 12"', cantidad:1 },
        { nombre:'Potencia Para bafles de 12"', cantidad:1 },
        { nombre:'Consola Digital 8 CH', cantidad:1 },
        { nombre:'Micrófono de mano con cable', cantidad:2 },
        { nombre:'Pie de micrófono', cantidad:2 }
    ],

    "50-trio": [
        { nombre:'Par de bafles 12"', cantidad:1 },
        { nombre:'Potencia Para bafles de 12"', cantidad:1 },
        { nombre:'Consola Digital 8 CH', cantidad:1 },
        { nombre:'Micrófono de mano con cable', cantidad:3 },
        { nombre:'Pie de micrófono', cantidad:3 }
    ],

    "100-solista": [
        { nombre:'Par de bafles 12"', cantidad:1 },
        { nombre:'Par de bafles 15"', cantidad:1 },
        { nombre:'Potencia Para los 4 bafles', cantidad:1 },
        { nombre:'Consola Digital 8 CH', cantidad:1 },
        { nombre:'Micrófono de mano con cable', cantidad:1 },
        { nombre:'Pie de micrófono', cantidad:1 }
    ],

    "100-duo": [
        { nombre:'Par de bafles 12"', cantidad:1 },
        { nombre:'Par de bafles 15"', cantidad:1 },
        { nombre:'Potencia Para los 4 bafles', cantidad:1 },
        { nombre:'Consola Digital 8 CH', cantidad:1 },
        { nombre:'Micrófono de mano con cable', cantidad:2 },
        { nombre:'Pie de micrófono', cantidad:2 }
    ],

    "100-trio": [
        { nombre:'Par de bafles 12"', cantidad:1 },
        { nombre:'Par de bafles 15"', cantidad:1 },
        { nombre:'Potencia Para los 4 bafles', cantidad:1 },
        { nombre:'Consola Digital 8 CH', cantidad:1 },
        { nombre:'Micrófono de mano con cable', cantidad:3 },
        { nombre:'Pie de micrófono', cantidad:3 }
    ]

};

let mostrarEquipamiento = false;
let productosConfirmados = [];
let cantidadesPendientes = {};

let items = conceptosFijos.map(c => ({
    categoria: "CONCEPTOS FIJOS",
    nombre: c.nombre,
    precio: c.precio,
    cantidad: c.cantidad,
    minimo: c.minimo || 1,
    fijo: true
}));




function render() {

lista.innerHTML = "";

let categoriaActual = "";

productos.forEach((producto, indice) => {
// No mostrar conceptos fijos
if (producto.fijo) {
    return;
}

// No mostrar productos manejados por interruptores
if (producto.oculto) {
    return;
}

// No mostrar productos que ya están en el presupuesto
const yaEsta = items.some(item => item.nombre === producto.nombre);

if (yaEsta) {
    return;
}

// No mostrar productos ya confirmados
if (productosConfirmados.includes(producto.nombre)) {
    return;
}

    if(producto.categoria !== categoriaActual){

        categoriaActual = producto.categoria;

        lista.innerHTML += `
            <h3 style="
                margin-top:25px;
                margin-bottom:10px;
                color:#66b3ff;
                border-bottom:1px solid #444;
                padding-bottom:5px;
            ">
                ${categoriaActual}
            </h3>
        `;

    }

   const cantidad = cantidadesPendientes[producto.nombre] || 0;

    lista.innerHTML += `
        <div class="producto">

            <div>

                <strong>${producto.nombre}</strong><br>

                $${producto.precio.toLocaleString("es-AR")}

            </div>

<div class="controles">
<button class="btn-cantidad" onclick="restarPendiente(${indice})">−</button>

<span class="cantidad">${cantidad}</span>

<button class="btn-cantidad" onclick="sumarPendiente(${indice})">+</button>

    <button class="btn-agregar" onclick="agregarAlPresupuesto(${indice})">
         Agregar
    </button>

</div>

        </div>
    `;

});

    carrito.innerHTML = "";

let suma = 0;

// ===========================
// PRODUCTOS DEL COMBO + FIJOS
// ===========================

const normales = items.filter(item =>
    !item.manual
);

normales.forEach(item => {

    const subtotal = item.precio * item.cantidad;

    suma += subtotal;

let controles = "";

if(item.nombre === "Operador de Sonido por Hora"){

    controles = `
        <div class="controles-resumen">

           <button class="btn-mini" onclick="restarOperador()">−</button>

            <span class="cantidad-mini">${item.cantidad}</span>

           <button class="btn-mini" onclick="sumarOperador()">+</button>

        </div>
    `;

}else if(!item.fijo){

    const indiceProducto = productos.findIndex(
        p => p.nombre === item.nombre
    );

    controles = `
        <div class="controles-resumen">

            <button class="btn-mini" onclick="restar(${indiceProducto})">−</button>

            <span class="cantidad-mini">${item.cantidad}</span>

            <button class="btn-mini" onclick="sumar(${indiceProducto})">+</button>

        </div>
    `;

}

    carrito.innerHTML += `

    <tr>

        <td>${item.nombre}</td>

        <td>${controles}</td>

        <td>$${subtotal.toLocaleString("es-AR")}</td>

    </tr>

    `;

});

// ===========================
// AGREGADOS MANUALMENTE
// ===========================

console.log("ITEMS:", items);
console.log("MANUALES:", items.filter(item => item.manual));

const manuales = items.filter(item =>
    item.manual
);

if(manuales.length){

    carrito.innerHTML += `

        <tr>

            <td colspan="3"
                style="
                    padding-top:18px;
                    padding-bottom:8px;
                    color:#66b3ff;
                    font-weight:bold;
                    text-align:center;
                    border-top:1px solid #444;
                ">

                AGREGADO MANUALMENTE

            </td>

        </tr>

    `;

    manuales.forEach(item => {

        const subtotal = item.precio * item.cantidad;

        suma += subtotal;

        const indiceProducto = productos.findIndex(
            p => p.nombre === item.nombre
        );

        const controles = `
            <div class="controles-resumen">

                <button class="btn-mini" onclick="restar(${indiceProducto})">−</button>

                <span class="cantidad-mini">${item.cantidad}</span>

                <button class="btn-mini" onclick="sumar(${indiceProducto})">+</button>

            </div>
        `;

        carrito.innerHTML += `

        <tr>

            <td>${item.nombre}</td>

            <td>${controles}</td>

            <td>$${subtotal.toLocaleString("es-AR")}</td>

        </tr>

        `;

    });

}

total.textContent = suma.toLocaleString("es-AR");
}
function sumar(indice){

    const producto=productos[indice];

    const item=items.find(i=>i.nombre===producto.nombre);

    if(item){

        item.cantidad++;

    }else{

        items.push({

            ...producto,

            cantidad:1

        });

    }

    render();

}


// ===========================
// OPERADOR DE SONIDO
// ===========================

function sumarOperador(){

    const operador = items.find(
        i => i.nombre === "Operador de Sonido por Hora"
    );

    if(!operador) return;

    operador.cantidad++;

    render();

}

function restarOperador(){

    const operador = items.find(
        i => i.nombre === "Operador de Sonido por Hora"
    );

    if(!operador) return;

    if(operador.cantidad > operador.minimo){

        operador.cantidad--;

    }

    render();

}


function restar(indice){

    const producto = productos[indice];

    const item = items.find(i => i.nombre === producto.nombre);

    
    }



    render();



function sumarPendiente(indice){

    const producto = productos[indice];

    if(!cantidadesPendientes[producto.nombre]){
        cantidadesPendientes[producto.nombre] = 0;
    }

    cantidadesPendientes[producto.nombre]++;

    render();

}

function restarPendiente(indice){

    const producto = productos[indice];

    if(!cantidadesPendientes[producto.nombre]){
        cantidadesPendientes[producto.nombre] = 0;
    }

    if(cantidadesPendientes[producto.nombre] > 0){
        cantidadesPendientes[producto.nombre]--;
    }

    render();

}

function generarWhatsApp(){

    const datos=document.querySelectorAll("input, textarea");

    const nombre=datos[0].value;
    const telefono=datos[1].value;
    const lugar=datos[2].value;
    const fecha=datos[3].value;
    const observaciones=datos[4].value;

    let texto=`*BUENOS AIRES SONIDO*%0A`;
    texto+=`Solicitud de Presupuesto%0A%0A`;

    if(nombre) texto+=`*Cliente:* ${nombre}%0A`;
    if(telefono) texto+=`*Teléfono:* ${telefono}%0A`;
    if(lugar) texto+=`*Lugar:* ${lugar}%0A`;
    if(fecha) texto+=`*Fecha:* ${fecha}%0A`;

    texto+=`%0A------------------------%0A`;

    const nombresWhats = {

    "Par de bafles 12\"":"Bafles 12\"",
    "Par de bafles 15\"":"Bafles 15\"",

    "Bafle potenciado 12\" (Monitor)":"Monitor 12\"",

    "Potencia Para bafles de 12\"":"Pot. 12\"",
    "Potencia Para bafles de 15\"":"Pot. 15\"",
    "Potencia Para los 4 bafles":"Pot. 4 Bafles",

    "Consola Digital 8 CH":"Consola 8 CH",

    "Micrófono de mano con cable":"Mic. Mano",
    "Micrófono de instrumento con cable":"Mic. Inst.",

    "Pie de micrófono":"Pie Mic.",

    "Caja Directa DI20":"DI20",

    "Grabación Multitrack":"G. Multi",

    "Operador de Sonido por Hora":"Operador",

    "Traslado zona Norte/Oeste":"Traslado"

};

    let suma=0;
let tituloManualMostrado = false;

    items.forEach(item=>{

if(item.manual && !tituloManualMostrado){

    texto += `%0A------------------------%0A`;
    texto += `*AGREGADO MANUALMENTE*%0A`;

    tituloManualMostrado = true;

}

        const subtotal=item.precio*item.cantidad;

        suma+=subtotal;

const nombre = nombresWhats[item.nombre] || item.nombre;

const cantidad = item.cantidad.toString();

const precio = "$" + subtotal.toLocaleString("es-AR");

// 22 caracteres para el nombre
// 3 para la cantidad
// precio al final

texto += `${nombre} ${cantidad} $${subtotal.toLocaleString("es-AR")}%0A`;

    });

// ===========================
// EQUIPAMIENTO INCLUIDO
// ===========================

let incluidos = "";

if(document.getElementById("chkVirtualizer").checked){
    incluidos += `✅ Procesador V.2000%0A`;
}

if(document.getElementById("chkEQ").checked){
    incluidos += `✅ EQ 15x2 (Moon)%0A`;
}
if(incluidos !== ""){
    texto += `%0A*Equipamiento incluido:*%0A`;
    texto += incluidos;
}
    texto+=`------------------------%0A`;
    texto+=`*TOTAL:* $${suma.toLocaleString("es-AR")}%0A%0A`;

    if(observaciones){

        texto+=`*Observaciones:*%0A${observaciones}%0A%0A`;

    }
 

window.open(
    "https://wa.me/5491154730988?text=" + encodeURIComponent(decodeURIComponent(texto)),
    "_blank"
);

}

render();

function limpiarTodo(){

items = conceptosFijos.map(c => ({
    categoria: "CONCEPTOS FIJOS",
    nombre: c.nombre,
    precio: c.precio,
    cantidad: c.cantidad,
    minimo: c.minimo || 1,
    fijo: true
}));

    // Apagar el interruptor de Multitrack
    document.getElementById("chkMultitrack").checked = false;

    document.getElementById("tituloCombo").textContent = "";

document.querySelectorAll(".combo-btn").forEach(btn => {
    btn.classList.remove("activo");
});

mostrarEquipamiento = false;

document.getElementById("seccionProductos").style.display = "none";

const btnEquipamiento = document.getElementById("btnEquipamiento");

btnEquipamiento.textContent = "Mostrar equipamiento";


productosConfirmados = [];
cantidadesPendientes = {};

    render();



    
    setTimeout(() => {

        document.querySelector(".combos").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

document.getElementById("resumen").style.display = "none";

}



// ===========================
// MULTITRACK
// ===========================

function toggleMultitrack(){

    const check = document.getElementById("chkMultitrack");

    if(check.checked){

       const producto = productos.find(p => p.nombre === "Grabación Multitrack");

        if(producto){

            items.push({

                ...producto,

                cantidad:1

            });

        }

    }else{

        items = items.filter(i => i.nombre !== "Multitrack");

    }

    render();

}
// ===========================
// CARGAR COMBO
// ===========================
function cargarCombo(nombreCombo, boton){

    // Poner todos los botones nuevamente en azul
    document.querySelectorAll(".combo-btn").forEach(btn=>{
        btn.classList.remove("activo");
    });

    // Pintar de verde el botón seleccionado
    boton.classList.add("activo");

    // Mantener únicamente los conceptos fijos
    items = items.filter(item => item.fijo);

    // Buscar el combo seleccionado
    const combo = combos[nombreCombo];

    const nombresBonitos = {

        "50-solista":"50 Personas (Solista)",
        "50-duo":"50 Personas (Duos)",
        "50-trio":"50 Personas (Trios)",
        "100-solista":"100 Personas (Solista)",
        "100-duo":"100 Personas (Duos)",
        "100-trio":"100 Personas (Trios)"

    };

    document.getElementById("tituloCombo").textContent =
        nombresBonitos[nombreCombo];

    if(!combo) return;

    combo.forEach(productoCombo => {

        const producto = productos.find(p => p.nombre === productoCombo.nombre);

    if(producto){

    items.push({

        ...producto,

        cantidad: productoCombo.cantidad,

        manual: false

    });

}

    });

    document.getElementById("resumen").style.display = "block";
  
    render();

const btnEquipamiento = document.getElementById("btnEquipamiento");
btnEquipamiento.disabled = false;
btnEquipamiento.textContent = "Mostrar equipamiento";

setTimeout(() => {

    document.querySelector(".resumen").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}, 100);

}
function agregarAlPresupuesto(indice){

    const producto = productos[indice];

    const cantidad = cantidadesPendientes[producto.nombre] || 0;

    if(cantidad <= 0){
        mostrarMensaje("⚠️ Primero elegí una cantidad","amarillo");
        return;
    }

   items.push({
    ...producto,
    cantidad,
    manual: true
});

    productosConfirmados.push(producto.nombre);

    delete cantidadesPendientes[producto.nombre];

    render();

}

// ===========================
// MOSTRAR / OCULTAR EQUIPAMIENTO
// ===========================
function toggleEquipamiento(){
    mostrarEquipamiento = !mostrarEquipamiento;

    const boton = document.getElementById("btnEquipamiento");
    const seccion = document.getElementById("seccionProductos");

if(mostrarEquipamiento){

    boton.textContent = "Ocultar equipamiento";
    seccion.style.display = "block";

    setTimeout(() => {

        seccion.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}else{

    boton.textContent = "Mostrar equipamiento";
    seccion.style.display = "none";

}

}

// ===========================
// MENSAJES TOAST
// ===========================
function mostrarMensaje(texto, color = "verde") {

    const toast = document.getElementById("mensajeToast");

    toast.textContent = texto;

    toast.className = "toast " + color + " mostrar";

    setTimeout(() => {

        toast.className = "toast";

    }, 2000);

}