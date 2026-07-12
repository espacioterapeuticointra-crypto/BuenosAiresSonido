const productos = [

{categoria:"BAFLES",nombre:'Par de bafles 12"',precio:30000},
{categoria:"BAFLES",nombre:'Par de bafles 15"',precio:30000},
{categoria:"BAFLES",nombre:'Bafle potenciado 12" (Monitor)',precio:30000},

{categoria:"POTENCIAS",nombre:'Potencia Para Parlantes de 12"',precio:25000},
{categoria:"POTENCIAS",nombre:'Potencia Para Parlantes de 15"',precio:25000},
{categoria:"POTENCIAS",nombre:'Potencia Para los 4 Parlantes ',precio:50000},

{categoria:"MICRÓFONOS",nombre:"Micrófono de mano con cable",precio:5000},
{categoria:"MICRÓFONOS",nombre:"Micrófono de instrumento con cable",precio:5000},

{categoria:"PROCESADORES",nombre:"Virtualizer 2000 (Behringer)",precio:10000},
{categoria:"PROCESADORES",nombre:"EQ 15x2 (Moon)",precio:10000},
{categoria:"PROCESADORES",nombre:"Caja Directa DI20",precio:4000},

{categoria:"CONSOLAS",nombre:"Consola Digital 8 CH",precio:40000},
{categoria:"CONSOLAS",nombre:"Consola Analógica 16 CH",precio:60000},

{categoria:"ACCESORIOS",nombre:"Pie de micrófono",precio:4000},

{categoria:"GRABACIÓN DEL SHOW",nombre:"Main L y R",precio:30000},
{categoria:"GRABACIÓN DEL SHOW",nombre:"Multitrack",precio:50000},

{categoria:"CONCEPTOS FIJOS",nombre:"Operador de sonido",precio:50000,fijo:true},
{categoria:"CONCEPTOS FIJOS",nombre:"Traslado",precio:50000,fijo:true}

];

const lista = document.getElementById("lista");
const carrito = document.getElementById("carrito");
const total = document.getElementById("total");

let items = [

{
    categoria:"CONCEPTOS FIJOS",
    nombre:"Operador de sonido",
    precio:50000,
    cantidad:1,
    fijo:true
},
{
    categoria:"CONCEPTOS FIJOS",
    nombre:"Traslado",
    precio:50000,
    cantidad:1,
    fijo:true
}

];

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
    texto+=`Solicitud de Presupuesto%0A%0A`;

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

 

    window.open("https://wa.me/?text="+texto,"_blank");

}

render();

function limpiarTodo(){

    // Vaciar formulario
    document.querySelectorAll("input").forEach(input=>{
        input.value="";
    });

    document.querySelector("textarea").value="";

    // Reiniciar cantidades
    items=[];

    render();

}