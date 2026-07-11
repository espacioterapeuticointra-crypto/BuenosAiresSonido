const productos = [

{categoria:"BAFLES",nombre:'Par de bafles 12"',precio:30000},
{categoria:"BAFLES",nombre:'Par de bafles 15"',precio:30000},
{categoria:"BAFLES",nombre:'Bafle potenciado 12" (Monitor)',precio:30000},

{categoria:"POTENCIAS",nombre:'Para Parlantes de 12"',precio:25000},
{categoria:"POTENCIAS",nombre:'Para Parlantes de 15"',precio:25000},
{categoria:"POTENCIAS",nombre:'Para los 4 Parlantes ',precio:50000},

{categoria:"MICRÓFONOS",nombre:"Micrófono de mano con cable",precio:5000},
{categoria:"MICRÓFONOS",nombre:"Micrófono de instrumento con cable",precio:5000},

{categoria:"PROCESADORES",nombre:"Virtualizer 2000 (Behringer)",precio:10000},
{categoria:"PROCESADORES",nombre:"EQ 15x2 (Moon)",precio:10000},
{categoria:"PROCESADORES",nombre:"Caja Directa DI20",precio:4000},

{categoria:"CONSOLAS",nombre:"Consola Digital 8 CH",precio:40000},
{categoria:"CONSOLAS",nombre:"Consola Analógica 16 CH",precio:60000},

{categoria:"ACCESORIOS",nombre:"Pie de micrófono",precio:4000},

{categoria:"GRABACIÓN DEL SHOW",nombre:"Main L y R",precio:30000},
{categoria:"GRABACIÓN DEL SHOW",nombre:"Multitrack",precio:50000}

];

const lista = document.getElementById("lista");
const carrito = document.getElementById("carrito");
const total = document.getElementById("total");

let items = [];

function render() {

lista.innerHTML = "";

let categoriaActual = "";

productos.forEach((producto, indice) => {

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

    const item = items.find(i => i.nombre === producto.nombre);
    const cantidad = item ? item.cantidad : 0;

    lista.innerHTML += `
        <div class="producto">

            <div>

                <strong>${producto.nombre}</strong><br>

                $${producto.precio.toLocaleString("es-AR")}

            </div>

<div class="controles">

    <button class="btn-cantidad" onclick="restar(${indice})">−</button>

    <span class="cantidad">${cantidad}</span>

    <button class="btn-cantidad" onclick="sumar(${indice})">+</button>

</div>

        </div>
    `;

});

    carrito.innerHTML="";

    let suma=0;

    items.forEach(item=>{

        const subtotal=item.precio*item.cantidad;

        suma+=subtotal;

        carrito.innerHTML+=`

        <tr>

            <td>${item.nombre}</td>

            <td>${item.cantidad}</td>

            <td>$${subtotal.toLocaleString("es-AR")}</td>

        </tr>

        `;

    });

    total.textContent=suma.toLocaleString("es-AR");

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

function restar(indice){

    const producto=productos[indice];

    const item=items.find(i=>i.nombre===producto.nombre);

    if(!item)return;

    item.cantidad--;

    if(item.cantidad<=0){

        items=items.filter(i=>i.nombre!==producto.nombre);

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
    texto+=`Presupuesto%0A%0A`;

    if(nombre) texto+=`*Cliente:* ${nombre}%0A`;
    if(telefono) texto+=`*Teléfono:* ${telefono}%0A`;
    if(lugar) texto+=`*Lugar:* ${lugar}%0A`;
    if(fecha) texto+=`*Fecha:* ${fecha}%0A`;

    texto+=`%0A------------------------%0A`;

    let suma=0;

    items.forEach(item=>{

        const subtotal=item.precio*item.cantidad;

        suma+=subtotal;

        texto+=`${item.nombre} x${item.cantidad} - $${subtotal.toLocaleString("es-AR")}%0A`;

    });

    texto+=`------------------------%0A`;
    texto+=`*TOTAL:* $${suma.toLocaleString("es-AR")}%0A%0A`;

    if(observaciones){

        texto+=`*Observaciones:*%0A${observaciones}%0A%0A`;

    }

    texto+=`Gracias por elegir Buenos Aires Sonido.`;

    window.open("https://wa.me/?text="+texto,"_blank");

}

render();
function generarWhatsApp(){

    const inputs = document.querySelectorAll("input");
    const textarea = document.querySelector("textarea");

    const nombre = inputs[0].value;
    const telefono = inputs[1].value;
    const lugar = inputs[2].value;
    const fecha = inputs[3].value;
    const observaciones = textarea.value;

    let totalGeneral = 0;

    let mensaje = "🎵 *BUENOS AIRES SONIDO*%0A";
    mensaje += "*PRESUPUESTO*%0A%0A";

    if(nombre) mensaje += "👤 *Cliente:* " + nombre + "%0A";
    if(telefono) mensaje += "📞 *Teléfono:* " + telefono + "%0A";
    if(lugar) mensaje += "📍 *Lugar:* " + lugar + "%0A";

    if(fecha){

        const f = fecha.split("-");

        mensaje += "📅 *Fecha:* " + f[2] + "/" + f[1] + "/" + f[0] + "%0A";

    }

    mensaje += "%0A";

    let categoriaActual = "";

    items.forEach(item=>{

        if(item.categoria !== categoriaActual){

            categoriaActual = item.categoria;

           mensaje += "%0A*" + categoriaActual + "*%0A";

        }

        const subtotal = item.precio * item.cantidad;

        totalGeneral += subtotal;

        mensaje += "• " +
        item.nombre +
        "  x" +
        item.cantidad +
        "   $" +
        subtotal.toLocaleString("es-AR") +
        "%0A";

    });

   mensaje += "%0A";
mensaje += "💰 *TOTAL: $" +
totalGeneral.toLocaleString("es-AR") +
"*%0A";

    if(observaciones){

        mensaje += "%0A📝 *Observaciones*%0A";
        mensaje += observaciones + "%0A";

    }

    mensaje += "%0AGracias por elegir *Buenos Aires Sonido* 🎵";

    window.open(
        "https://wa.me/?text=" + mensaje,
        "_blank"
    );

}