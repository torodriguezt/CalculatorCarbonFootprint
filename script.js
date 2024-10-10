const form = document.getElementById('carbonForm');
const resultadoDiv = document.getElementById('resultado');
const energiaGroup = document.getElementById('energiaGroup');
const comparteGroup = document.getElementById('comparteGroup');
const pasajerosGroup = document.getElementById('pasajerosGroup');
const publicoGroup = document.getElementById('publicoGroup');

// Mostrar u ocultar campos según el transporte seleccionado
document.getElementById('transporte').addEventListener('change', function() {
    const transporte = this.value;

    // Si es Carro particular o Moto particular, mostrar opciones de energía y compartir
    if (transporte === 'Carro particular' || transporte === 'Moto particular') {
        energiaGroup.style.display = 'block';
        comparteGroup.style.display = 'block';
        publicoGroup.style.display = 'none';
        pasajerosGroup.style.display = 'none'; // Ocultar número de pasajeros hasta saber si comparte
    } 
    // Si es Transporte público, ocultar las opciones de energía y compartir
    else if (transporte === 'Transporte público') {
        energiaGroup.style.display = 'none';
        comparteGroup.style.display = 'none';
        pasajerosGroup.style.display = 'none';
        publicoGroup.style.display = 'block'; // Mostrar transporte público
    } 
    // En cualquier otro caso, ocultar todo
    else {
        energiaGroup.style.display = 'none';
        comparteGroup.style.display = 'none';
        pasajerosGroup.style.display = 'none';
        publicoGroup.style.display = 'none';
    }
});

// Mostrar el campo de número de pasajeros solo si el usuario comparte vehículo
document.getElementById('comparte').addEventListener('change', function() {
    const comparte = this.value;

    if (comparte === 'Sí') {
        pasajerosGroup.style.display = 'block'; // Mostrar campo de pasajeros si comparte vehículo
    } else {
        pasajerosGroup.style.display = 'none'; // Ocultar si no comparte
    }
});

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const dias = document.getElementById('dias').value;
    const transporte = document.getElementById('transporte').value;
    const km = parseFloat(document.getElementById('km').value) || 0;
    let resultado = 0;

    // Datos y valores
    const transporte_publico_valores = {
        'Metro': 0.02545,
        'Metroplús': 0.12552,
        'Metrocable': 0.0255,
        'Tranvía': 0.0264,
        'Buses': 0.0284,
        'Taxis': 0.1617
    };

    const energia_valores_moto = {
        'Gasolina corriente': 0.1386,
        'Gasolina extra': 0.1386,
        'Electricidad': 0.0272
    };

    const dias_trad = {
        "Un día": 1,
        "Dos días": 2,
        "Tres días": 3,
        "Cuatro días": 4,
        "Cinco días": 5,
        "Seis días": 6,
        "Siete días": 7,
    };

    if (transporte === "Carro particular") {
        const tipo_energia = document.getElementById('combustible').value;
        const comparte = document.getElementById('comparte').value;
        const pasajeros = parseInt(document.getElementById('pasajeros').value) || 1;
        const energia = obtenerEnergiaValoresCarro(tipo_energia);

        if (comparte === "Sí") {
            resultado = (energia * km * dias_trad[dias] * 4) / pasajeros;
        } else {
            resultado = energia * km * dias_trad[dias] * 4;
        }
    } else if (transporte === "Moto particular") {
        const tipo_moto = document.getElementById('combustible').value;
        const comparte = document.getElementById('comparte').value;
        const pasajeros = parseInt(document.getElementById('pasajeros').value) || 1;

        if (comparte === "Sí") {
            resultado = (energia_valores_moto[tipo_moto] * km * dias_trad[dias] * 4) / pasajeros;
        } else {
            resultado = energia_valores_moto[tipo_moto] * km * dias_trad[dias] * 4;
        }
    } else if (transporte === "Transporte público") {
        const checkboxes = document.querySelectorAll('input[name="publico"]:checked');
        const publicoOptions = Array.from(checkboxes).map(checkbox => checkbox.value);
        resultado = km * publicoOptions.reduce((acc, curr) => acc + (transporte_publico_valores[curr] || 0), 0) * dias_trad[dias] * 4;
    }

    // Formato del resultado
    resultadoDiv.innerHTML = `Tu huella de carbono estimada es: <span class="resultado-numero">${resultado.toFixed(2)}</span> kg de CO2 mensualmente`;
});

function obtenerEnergiaValoresCarro(tipo_energia) {
    const energia_valores = {
        'Gasolina corriente': 0.1617,
        'Gasolina extra': 0.1617,
        'Diesel': 0.1608,
        'Eléctrico': 0.0000651,
        'Gas': 0.034,
        'Híbrida': function(km) { return (km / 2 * 0.1617) + (km / 2 * 0.034); }
    };
    return energia_valores[tipo_energia];
}
