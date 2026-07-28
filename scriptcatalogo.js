document.addEventListener("DOMContentLoaded", () => {

    verifyLoginSession();

    initSmoothScroll();
    initCardsNavigation();
    initParkingForm();
    initAppointmentButton();
    initBrandFilter();

});

function getLoggedUser() {
    const email = localStorage.getItem("nexcar_current_user");

    if (!email) return null;

    const raw = localStorage.getItem(
        `nexcar_user_${email.trim().toLowerCase()}`
    );

    try {
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function verifyLoginSession() {
    const user = getLoggedUser();

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const profileLink = document.querySelector(
        ".navbar .user-icon img"
    );

    if (profileLink) {
        profileLink.alt = `Usuario: ${user.name}`;
        profileLink.title = `Bienvenido ${user.name}`;
    }
}

/* ==========================
   SMOOTH SCROLL
========================== */

function initSmoothScroll() {

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", e => {

                const target = document.querySelector(
                    link.getAttribute("href")
                );

                if (!target) return;

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            });

        });

}

/* ==========================
   CARDS CLICKABLE
========================== */

function initCardsNavigation() {

    document
        .querySelectorAll("#mantenimientos .card-premium")
        .forEach(card => {

            card.style.cursor = "pointer";

            card.addEventListener("click", e => {

                if (e.target.closest(".btn")) return;

                window.location.href = "detalles.html";

            });

        });

}

/* ==========================
   FORMULARIO PARKING
========================== */

function initParkingForm() {

    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", e => {

        e.preventDefault();

        const nombre = form.querySelector(
            'input[type="text"]'
        ).value;

        const placaInput = form.querySelector(
            'input[placeholder*="-"]'
        );

        const placa = placaInput
            ? placaInput.value.toUpperCase()
            : "";

        showNotification(
            "Reserva Confirmada",
            `${nombre}, tu reserva para el vehículo ${placa} fue registrada correctamente.`
        );

        form.reset();

    });

}

/* ==========================
   BOTÓN AGENDAR
========================== */

function initAppointmentButton() {

    const btn = document.querySelector(
        ".btn-premium-red"
    );

    if (
        !btn ||
        !location.pathname.includes("detalles")
    ) return;

    btn.addEventListener("click", () => {

        showNotification(
            "Solicitud Recibida",
            "Un asesor se comunicará contigo para confirmar tu cita."
        );

    });

}

/* ==========================
   NOTIFICACIONES
========================== */

function showNotification(title, message) {

    document
        .getElementById("premium-alert")
        ?.remove();

    const notification = document.createElement("div");

    notification.id = "premium-alert";

    notification.className = "premium-alert";

    notification.innerHTML = `
        <h5>
            <i class="fa-solid fa-circle-check"></i>
            ${title}
        </h5>

        <p>${message}</p>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.classList.add("hide");

        setTimeout(() => {

            notification.remove();

        }, 400);

    }, 5000);

}


// ==========================================
// CONFIGURACIÓN DEL MAPA
// ==========================================

let map = null;
let userMarker = null;

function initializeMap() {
    if (typeof L === "undefined" || !document.getElementById("map")) return null;

    const instance = L.map("map").setView([4.7110, -74.0721], 13);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap Contributors"
        }
    ).addTo(instance);

    return instance;
}

map = initializeMap();

// ==========================================
// OBTENER UBICACIÓN
// ==========================================

function setupGeolocation() {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            map.setView([lat, lng], 15);

            userMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup("<strong>Tu ubicación</strong>");

            cargarUbicaciones(lat, lng);

        },

        error => {

            console.error(error);

            const locationsList = document.getElementById("locationsList");
            if (locationsList) {
                locationsList.innerHTML =
                `
                    <div class="location-card">
                        No fue posible obtener tu ubicación.
                    </div>
                `;
            }

        }

    );
}

setupGeolocation();

// ==========================================
// DATOS DE PRUEBA
// ==========================================

function cargarUbicaciones(lat, lng){

    const ubicaciones = [

        {
            nombre: "TU NEXT-CAR Principal",
            tipo: "Taller Automotriz",
            direccion: "Centro de Servicio",
            lat: lat + 0.003,
            lng: lng + 0.004
        },

        {
            nombre: "Parking VIP",
            tipo: "Parking Premium",
            direccion: "Zona Preferencial",
            lat: lat - 0.002,
            lng: lng + 0.003
        },

        {
            nombre: "Parking EV",
            tipo: "Carga para Vehículos Eléctricos",
            direccion: "Estación EV",
            lat: lat + 0.004,
            lng: lng - 0.002
        },

        {
            nombre: "Parking Cubierto",
            tipo: "Parking Seguro",
            direccion: "Zona Cubierta",
            lat: lat - 0.003,
            lng: lng - 0.004
        },

        {
            nombre: "Parking 24 Horas",
            tipo: "Acceso Permanente",
            direccion: "Servicio 24/7",
            lat: lat + 0.002,
            lng: lng - 0.005
        }

    ];

    renderizarUbicaciones(ubicaciones);

}

// ==========================================
// RENDERIZAR UBICACIONES
// ==========================================

function renderizarUbicaciones(ubicaciones){

    const contenedor =
        document.getElementById("locationsList");

    contenedor.innerHTML = "";

    ubicaciones.forEach(lugar => {

        L.marker([lugar.lat, lugar.lng])
            .addTo(map)
            .bindPopup(
                `
                <strong>${lugar.nombre}</strong>
                <br>
                ${lugar.tipo}
                <br>
                ${lugar.direccion}
                `
            );

        contenedor.innerHTML +=

        `
        <div class="location-card">

            <h5>${lugar.nombre}</h5>

            <p>
                ${lugar.tipo}
                <br>
                <small>${lugar.direccion}</small>
            </p>

            <button
                class="btn btn-primary-custom btn-sm"
                onclick="verUbicacion(${lugar.lat}, ${lugar.lng})"
            >
                Ver en mapa
            </button>

        </div>
        `;

    });

}

// ==========================================
// CENTRAR MAPA
// ==========================================

function verUbicacion(lat, lng){

    map.setView([lat, lng], 18);

}

// ==========================================
// BUSCADOR
// ==========================================

const buscador =
document.querySelector('.form-control-premium');

if(buscador){

    buscador.addEventListener('keyup', function(){

        const texto =
        this.value.toLowerCase();

        const tarjetas =
        document.querySelectorAll('.location-card');

        tarjetas.forEach(card => {

            const contenido =
            card.textContent.toLowerCase();

            card.style.display =
            contenido.includes(texto)
            ? 'block'
            : 'none';

        });

    });

}

/* ==========================
   FILTRADO POR MARCA
========================== */

function initBrandFilter(){

    const brandButtons = document.querySelectorAll('.logos-marcas .logo-card');
    const cards = document.querySelectorAll('.card-auto');

    if(!brandButtons.length || !cards.length) return;

    const brands = ['bmw','audi','mercedes','toyota','chevrolet','ford','kia','hyundai','mazda','renault'];

    function getCardBrand(card){
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();

        for(const b of brands){
            if(title.includes(b)) return b;
        }

        // fallback: try first word
        const first = title.split(' ')[0];
        return first || '';
    }

    function showAll(){
        cards.forEach(c => c.style.display = 'block');
        brandButtons.forEach(b => b.classList.remove('active'));
    }

    brandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const brand = (btn.querySelector('span')?.textContent || '').toLowerCase().trim();

            // toggle
            const isActive = btn.classList.contains('active');

            if(isActive){
                showAll();
                return;
            }

            // set active
            brandButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // filter
            cards.forEach(card => {
                const cardBrand = getCardBrand(card);
                card.style.display = (cardBrand && cardBrand.includes(brand)) ? 'block' : 'none';
            });

            // smooth scroll to list
            const cont = document.querySelector('.contenedor-autos');
            if(cont) cont.scrollIntoView({behavior:'smooth'});

        });
    });

}
