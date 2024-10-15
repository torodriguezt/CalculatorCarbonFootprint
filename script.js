const form = document.getElementById('carbonForm');
const resultadoDiv = document.getElementById('resultado');
const energiaGroup = document.getElementById('energiaGroup');
const comparteGroup = document.getElementById('comparteGroup');
const pasajerosGroup = document.getElementById('pasajerosGroup');
const publicoGroup = document.getElementById('publicoGroup');

const combustibleSelect = document.getElementById('combustible');
const comparteSelect = document.getElementById('comparte');
const pasajerosInput = document.getElementById('pasajeros');

// Opciones para diferentes tipos de transporte
const opcionesCombustibleMoto = ['Gasolina corriente', 'Gasolina extra', 'Eléctrico'];
const opcionesCombustibleCarro = ['Gasolina corriente', 'Gasolina extra', 'Diesel', 'Eléctrico', 'Gas', 'Híbrida'];

// Mostrar u ocultar campos según el transporte seleccionado
document.getElementById('transporte').addEventListener('change', function() {
    const transporte = this.value;

    // Reiniciar campos
    combustibleSelect.value = '';
    comparteSelect.value = '';
    pasajerosInput.value = '';

    // Remover required por defecto
    combustibleSelect.required = false;
    comparteSelect.required = false;
    pasajerosInput.required = false;

    // Si es Carro particular o Moto particular, mostrar opciones de energía y compartir
    if (transporte === 'Carro particular' || transporte === 'Moto particular') {
        energiaGroup.style.display = 'block';
        comparteGroup.style.display = 'block';
        publicoGroup.style.display = 'none';
        pasajerosGroup.style.display = 'none'; // Ocultar número de pasajeros hasta saber si comparte

        // Añadir required a combustible y comparte
        combustibleSelect.required = true;
        comparteSelect.required = true;

        // Actualizar las opciones de combustible según el tipo de transporte
        actualizarOpcionesCombustible(transporte);
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
        pasajerosInput.required = true; // Añadir required a pasajeros
    } else {
        pasajerosGroup.style.display = 'none'; // Ocultar si no comparte
        pasajerosInput.required = false; // Remover required de pasajeros
        pasajerosInput.value = ''; // Limpiar el valor
    }
});

// Actualiza las opciones del combustible según el tipo de transporte
function actualizarOpcionesCombustible(transporte) {
    let opciones = [];

    if (transporte === 'Moto particular') {
        opciones = opcionesCombustibleMoto;
    } else if (transporte === 'Carro particular') {
        opciones = opcionesCombustibleCarro;
    }

    // Limpiar las opciones actuales
    combustibleSelect.innerHTML = '<option value="" disabled selected>Selecciona un valor</option>';

    // Agregar las opciones adecuadas
    opciones.forEach(opcion => {
        const newOption = document.createElement('option');
        newOption.value = opcion;
        newOption.textContent = opcion;
        combustibleSelect.appendChild(newOption);
    });
}

// Limitar el número de selecciones en transporte público a 3
const maxPublicoSelections = 3;
const publicoCheckboxes = document.querySelectorAll('input[name="publico"]');

publicoCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const checkedCheckboxes = document.querySelectorAll('input[name="publico"]:checked');
        if (checkedCheckboxes.length > maxPublicoSelections) {
            this.checked = false;
            alert(`Puedes seleccionar hasta ${maxPublicoSelections} tipos de transporte público.`);
        }
    });
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
        'Eléctrico': 0.0272
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
        const tipo_energia = combustibleSelect.value;
        const comparte = comparteSelect.value;
        const pasajeros = parseInt(pasajerosInput.value) || 1;
        const energia = obtenerEnergiaValoresCarro(tipo_energia, km);

        if (comparte === "Sí" && pasajeros > 1) {
            resultado = (energia * km * dias_trad[dias] * 4) / pasajeros;
        } else {
            resultado = energia * km * dias_trad[dias] * 4;
        }
    } else if (transporte === "Moto particular") {
        const tipo_moto = combustibleSelect.value;
        const comparte = comparteSelect.value;
        const pasajeros = parseInt(pasajerosInput.value) || 1;
        const energia = energia_valores_moto[tipo_moto];

        if (comparte === "Sí" && pasajeros > 1) {
            resultado = (energia * km * dias_trad[dias] * 4) / pasajeros;
        } else {
            resultado = energia * km * dias_trad[dias] * 4;
        }
    } else if (transporte === "Transporte público") {
        const checkboxes = document.querySelectorAll('input[name="publico"]:checked');
        let publicoOptions = Array.from(checkboxes).map(checkbox => checkbox.value);

        if (publicoOptions.length === 0) {
            alert("Selecciona al menos un tipo de transporte público.");
            return;
        }

        if (publicoOptions.length > maxPublicoSelections) {
            alert(`Puedes seleccionar hasta ${maxPublicoSelections} tipos de transporte público.`);
            return;
        }

        publicoOptions = publicoOptions.sort();
        const setOptions = new Set(publicoOptions);
        const diasFactor = dias_trad[dias] * 4;

        if (publicoOptions.length === 1) {
            const tipoTransporte = publicoOptions[0];
            const valorEmision = transporte_publico_valores[tipoTransporte];
            resultado = km * valorEmision * diasFactor;
        } else if (publicoOptions.length === 2) {
            if (setEquals(setOptions, new Set(['Buses', 'Metro']))) {
                const kmReducido = km - 2.7 * 2;
                const valorBuses = transporte_publico_valores['Buses'];
                const valorMetro = transporte_publico_valores['Metro'];
                resultado = ((kmReducido * valorMetro) + (2.7 * 2 * valorBuses)) * diasFactor;
            } else {
                // Para otras combinaciones no definidas, sumamos las emisiones
                resultado = 0;
                publicoOptions.forEach(tipoTransporte => {
                    const valorEmision = transporte_publico_valores[tipoTransporte];
                    resultado += km * valorEmision;
                });
                resultado *= diasFactor;
            }
        } else if (publicoOptions.length === 3) {
            if (setEquals(setOptions, new Set(['Metro', 'Metrocable', 'Buses']))) {
                resultado = (2.7 * 2 * transporte_publico_valores["Buses"] + ((km - 2.7 * 2) / 2) * (transporte_publico_valores["Metro"] + transporte_publico_valores["Metrocable"])) * diasFactor;
            } else if (setEquals(setOptions, new Set(['Metro', 'Buses', 'Taxis']))) {
                resultado = (2.7 * 2 * transporte_publico_valores["Buses"] + ((km - 2.7 * 2) / 2) * (transporte_publico_valores["Metro"] + transporte_publico_valores["Taxis"])) * diasFactor;
            } else if (setEquals(setOptions, new Set(['Metro', 'Tranvía', 'Buses']))) {
                resultado = (2.7 * 2 * transporte_publico_valores['Buses'] + ((km - 2.7 * 2) / 2) * (transporte_publico_valores["Metro"] + transporte_publico_valores["Tranvía"])) * diasFactor;
            } else {
                // Para otras combinaciones no definidas, sumamos las emisiones
                resultado = 0;
                publicoOptions.forEach(tipoTransporte => {
                    const valorEmision = transporte_publico_valores[tipoTransporte];
                    resultado += km * valorEmision;
                });
                resultado *= diasFactor;
            }
        } else {
            // Este caso no debería ocurrir debido al límite establecido, pero se incluye por seguridad
            alert(`Puedes seleccionar hasta ${maxPublicoSelections} tipos de transporte público.`);
            return;
        }
    } else if (transporte === "Bicicleta" || transporte === "Bicicleta eléctrica" || transporte === "Patineta eléctrica") {
        resultado = 0;
    }

    // Formato del resultado
    resultadoDiv.innerHTML = `Tu huella de carbono estimada es: <span class="resultado-numero">${resultado.toFixed(2)}</span> kg de CO₂ mensualmente`;
});

function obtenerEnergiaValoresCarro(tipo_energia, km) {
    const energia_valores = {
        'Gasolina corriente': 0.1617,
        'Gasolina extra': 0.1617,
        'Diesel': 0.1608,
        'Eléctrico': 0.0000651,
        'Gas': 0.034,
        'Híbrida': function(km) { return ((km / 2) * 0.1617) + ((km / 2) * 0.034); }
    };
    if (typeof energia_valores[tipo_energia] === 'function') {
        return energia_valores[tipo_energia](km);
    } else {
        return energia_valores[tipo_energia];
    }
}

// Función para comparar dos conjuntos
function setEquals(setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let a of setA) if (!setB.has(a)) return false;
    return true;
}
