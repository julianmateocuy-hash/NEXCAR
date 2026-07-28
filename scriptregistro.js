/* ==================================
   SECCIONES
================================== */

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const forgotSection = document.getElementById("forgotSection");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const showForgot = document.getElementById("showForgot");
const backToLoginFromForgot = document.getElementById("backToLoginFromForgot");

const isAuthPage = !!(loginSection || registerSection || forgotSection || showRegister || showLogin || showForgot || backToLoginFromForgot);

function goTo(section){

    if(!section) return;

    [loginSection, registerSection, forgotSection].forEach(sec => {
        if(sec) sec.style.display = "none";
    });

    section.style.display = "block";

    if(section === loginSection && typeof loginRole !== "undefined"){
        document.body.dataset.role = loginRole;
    }

    if(section === registerSection && typeof registerRole !== "undefined"){
        document.body.dataset.role = registerRole;
    }

}

if (isAuthPage) {
    if (showRegister) showRegister.addEventListener("click", () => goTo(registerSection));
    if (showLogin) showLogin.addEventListener("click", () => goTo(loginSection));
    if (showForgot) showForgot.addEventListener("click", () => {
        resetForgotForm();
        goTo(forgotSection);
    });
    if (backToLoginFromForgot) backToLoginFromForgot.addEventListener("click", () => {
        resetForgotForm();
        goTo(loginSection);
    });
}


/* ==================================
   SELECTOR DE ROL - LOGIN
================================== */

const loginRoleToggle = document.getElementById("loginRoleToggle");
let loginRole = "comprador";
setActiveTheme(loginRole);

function setActiveTheme(role){

    document.body.dataset.role = role;

}

if (loginRoleToggle && isAuthPage) {
    loginRoleToggle.addEventListener("click", (e) => {

        const btn = e.target.closest(".role-btn");

        if(!btn) return;

        loginRoleToggle
            .querySelectorAll(".role-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        loginRole = btn.dataset.role;

        setActiveTheme(loginRole);

    });
}


/* ==================================
   SELECTOR DE ROL - REGISTRO
================================== */

const registerRoleToggle = document.getElementById("registerRoleToggle");
const registerNameLabel = document.getElementById("registerNameLabel");
const registerSubtitle = document.getElementById("registerSubtitle");
const registerDocument = document.getElementById("registerDocument");
const registerAddress = document.getElementById("registerAddress");

const wizardSteps = Array.from(document.querySelectorAll("#registerForm .wizard-step"));
const wizardBarFill = document.getElementById("wizardBarFill");
const wizardStepLabel = document.getElementById("wizardStepLabel");
const registerBackBtn = document.getElementById("registerBackBtn");

let registerRole = "comprador";
let currentStep = 0;

function stepsForRole(role){

    return wizardSteps.filter(step => {

        const roles = step.dataset.roles;

        if(!roles) return true;

        return roles.split(",").includes(role);

    });

}

function renderWizard(){

    const steps = stepsForRole(registerRole);

    wizardSteps.forEach(step => step.style.display = "none");

    steps.forEach((step, i) => {

        step.style.display = i === currentStep ? "block" : "none";

    });

    const total = steps.length;
    const stepNumber = currentStep + 1;

    wizardBarFill.style.width = Math.round((stepNumber / total) * 100) + "%";
    wizardStepLabel.textContent = `Paso ${stepNumber} de ${total}`;

    registerBackBtn.disabled = currentStep === 0;

    registerSubmitBtn.textContent =
        currentStep === total - 1 ? "CREAR CUENTA" : "SIGUIENTE";

}

function applyRegisterRole(role){

    registerRole = role;
    currentStep = 0;

    if(role === "vendedor"){

        registerNameLabel.textContent = "Nombre del Concesionario / Vendedor";
        registerSubtitle.textContent = "Regístrate como vendedor";

    } else {

        registerNameLabel.textContent = "Nombre Completo";
        registerSubtitle.textContent = "Regístrate como comprador";

    }

    setActiveTheme(role);
    renderWizard();

}

if (registerRoleToggle && isAuthPage) {
    registerRoleToggle.addEventListener("click", (e) => {

        const btn = e.target.closest(".role-btn");

        if(!btn) return;

        registerRoleToggle
            .querySelectorAll(".role-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        applyRegisterRole(btn.dataset.role);

    });
}

function currentStepField(){

    const steps = stepsForRole(registerRole);

    return steps[currentStep] ? steps[currentStep].dataset.field : null;

}

function validateStep(field){

    if(field === "name"){

        if(!document.getElementById("registerName").value.trim())
            return "Ingresa el nombre.";

    }

    if(field === "document"){

        if(!registerDocument.value.trim())
            return "Ingresa el NIT o la cédula.";

    }

    if(field === "address"){

        if(!registerAddress.value.trim())
            return "Ingresa la dirección del concesionario.";

    }

    if(field === "email"){

        const email = document.getElementById("registerEmail").value.trim();

        if(!email || !email.includes("@"))
            return "Ingresa un correo válido.";

        if(getUser(email))
            return "Ya existe una cuenta con ese correo.";

    }

    if(field === "phone"){

        if(!document.getElementById("registerPhone").value.trim())
            return "Ingresa el teléfono.";

    }

    if(field === "password"){

        if(registerPassword.value.length < 4)
            return "La contraseña debe tener al menos 4 caracteres.";

    }

    if(field === "confirm"){

        const password = registerPassword.value;
        const confirm = document.getElementById("confirmPassword").value;

        if(password !== confirm)
            return "Las contraseñas no coinciden.";

    }

    return null;

}

if (registerBackBtn) {
    registerBackBtn.addEventListener("click", () => {

        if(registerMessage) registerMessage.style.display = "none";

        if(currentStep > 0){

            currentStep--;
            renderWizard();

        }

    });
}


/* ==================================
   INDICADOR CONTRASEÑA
================================== */

const registerPassword = document.getElementById("registerPassword");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

if (registerPassword && strengthFill && strengthText) {
    registerPassword.addEventListener("input", () => {

        const password = registerPassword.value;

        let strength = 0;

        if(password.length >= 6) strength++;
        if(/[A-Z]/.test(password)) strength++;
        if(/[0-9]/.test(password)) strength++;
        if(/[^A-Za-z0-9]/.test(password)) strength++;

        switch(strength){

            case 1:
                strengthFill.style.width = "25%";
                strengthFill.style.background = "#ff4444";
                strengthText.textContent = "Seguridad: Débil";
            break;

            case 2:
                strengthFill.style.width = "50%";
                strengthFill.style.background = "#ff9900";
                strengthText.textContent = "Seguridad: Media";
            break;

            case 3:
                strengthFill.style.width = "75%";
                strengthFill.style.background = "#ffd500";
                strengthText.textContent = "Seguridad: Buena";
            break;

            case 4:
                strengthFill.style.width = "100%";
                strengthFill.style.background = "#00d65a";
                strengthText.textContent = "Seguridad: Fuerte";
            break;

            default:
                strengthFill.style.width = "0%";
                strengthText.textContent = "Seguridad";

        }

    });
}


/* ==================================
   HELPERS DE ALMACENAMIENTO
================================== */

const USER_PREFIX = "nexcar_user_";

function getUser(email){

    const raw = localStorage.getItem(USER_PREFIX + email.trim().toLowerCase());

    return raw ? JSON.parse(raw) : null;

}

function saveUser(user){

    localStorage.setItem(
        USER_PREFIX + user.email.trim().toLowerCase(),
        JSON.stringify(user)
    );

}

function showMessage(el, text, ok){

    if (!el) return;

    el.style.display = "block";
    el.style.color = ok ? "#00d65a" : "#ff4444";
    el.textContent = text;

}


/* ==================================
   REGISTRO
================================== */

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const registerSubmitBtn = document.getElementById("registerSubmitBtn");

if (registerForm) {
    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        if(registerMessage) registerMessage.style.display = "none";

        const steps = stepsForRole(registerRole);
        const field = currentStepField();

        const error = validateStep(field);

        if(error){

            showMessage(registerMessage, error, false);
            return;

        }

        if(currentStep < steps.length - 1){

            currentStep++;
            renderWizard();
            return;

        }

        if(registerSubmitBtn) registerSubmitBtn.disabled = true;

        const user = {
            name: document.getElementById("registerName")?.value.trim() || "",
            email: document.getElementById("registerEmail")?.value.trim() || "",
            phone: document.getElementById("registerPhone")?.value.trim() || "",
            password: registerPassword?.value || "",
            role: registerRole,
            document: registerRole === "vendedor" ? registerDocument?.value.trim() : null,
            address: registerRole === "vendedor" ? registerAddress?.value.trim() : null
        };

        saveUser(user);

        showMessage(registerMessage, "Cuenta creada correctamente.", true);

        if(registerSubmitBtn) registerSubmitBtn.disabled = false;

        setTimeout(() => {

            registerForm.reset();

            if(registerRoleToggle){
                registerRoleToggle.querySelectorAll(".role-btn").forEach(b => {
                    b.classList.toggle("active", b.dataset.role === "comprador");
                });
            }

            applyRegisterRole("comprador");

            if(strengthFill) strengthFill.style.width = "0%";
            if(strengthText) strengthText.textContent = "Seguridad";

            if(loginRoleToggle){
                loginRoleToggle.querySelectorAll(".role-btn").forEach(b => {
                    b.classList.toggle("active", b.dataset.role === user.role);
                });
            }

            loginRole = user.role;
            setActiveTheme(user.role);

            goTo(loginSection);

        }, 1200);

    });
}


/* ==================================
   LOGIN
================================== */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        if(loginSubmitBtn) loginSubmitBtn.disabled = true;

        const email = document.getElementById("loginEmail")?.value.trim() || "";
        const password = document.getElementById("loginPassword")?.value || "";

        if(!email || !password){

            showMessage(loginMessage, "Ingresa tu correo y contraseña.", false);
            if(loginSubmitBtn) loginSubmitBtn.disabled = false;
            return;

        }

        const user = getUser(email);

        if(!user){

            showMessage(loginMessage, "Usuario no encontrado.", false);
            if(loginSubmitBtn) loginSubmitBtn.disabled = false;
            return;

        }

        if(user.password !== password){

            showMessage(loginMessage, "Contraseña incorrecta.", false);
            if(loginSubmitBtn) loginSubmitBtn.disabled = false;
            return;

        }

        if(user.role !== loginRole){

            const rolLabel = user.role === "vendedor" ? "vendedor" : "comprador";

            showMessage(
                loginMessage,
                `Esta cuenta está registrada como ${rolLabel}. Cambia el tipo de cuenta arriba.`,
                false
            );

            if(loginSubmitBtn) loginSubmitBtn.disabled = false;
            return;

        }

        showMessage(loginMessage, `Bienvenido ${user.name}`, true);
        localStorage.setItem("nexcar_current_user", email.toLowerCase());

        setTimeout(() => {
            window.location.href = "indexcatalogo.html";
        }, 800);

        if(loginSubmitBtn) loginSubmitBtn.disabled = false;

    });
}


/* ==================================
   RECUPERAR CONTRASEÑA
================================== */

const forgotForm = document.getElementById("forgotForm");
const forgotMessage = document.getElementById("forgotMessage");
const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
const forgotEmail = document.getElementById("forgotEmail");
const forgotEmailGroup = document.getElementById("forgotEmailGroup");
const forgotResetFields = document.getElementById("forgotResetFields");
const forgotNewPassword = document.getElementById("forgotNewPassword");
const forgotConfirmPassword = document.getElementById("forgotConfirmPassword");
const forgotSubtitle = document.getElementById("forgotSubtitle");

let forgotStage = "find";
let forgotTargetEmail = null;

function resetForgotForm(){

    forgotStage = "find";
    forgotTargetEmail = null;

    forgotForm.reset();

    forgotEmailGroup.hidden = false;
    forgotResetFields.hidden = true;

    forgotSubtitle.textContent = "Ingresa tu correo para continuar";
    forgotSubmitBtn.textContent = "BUSCAR CUENTA";

    forgotMessage.style.display = "none";

}

if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {

        e.preventDefault();

        if(forgotSubmitBtn) forgotSubmitBtn.disabled = true;

        if(forgotStage === "find"){

            const email = forgotEmail.value.trim();
            const user = getUser(email);

            if(!user){

                showMessage(forgotMessage, "No existe una cuenta con ese correo.", false);
                if(forgotSubmitBtn) forgotSubmitBtn.disabled = false;
                return;

            }

            forgotTargetEmail = email;
            forgotStage = "reset";

            forgotEmailGroup.hidden = true;
            forgotResetFields.hidden = false;

            forgotSubtitle.textContent = `Crea una nueva contraseña para ${user.name}`;
            forgotSubmitBtn.textContent = "GUARDAR NUEVA CONTRASEÑA";

            forgotMessage.style.display = "none";

            if(forgotSubmitBtn) forgotSubmitBtn.disabled = false;

            return;

        }

        // forgotStage === "reset"

        const newPassword = forgotNewPassword.value;
        const confirmNewPassword = forgotConfirmPassword.value;

        if(!newPassword || newPassword.length < 4){

            showMessage(forgotMessage, "La contraseña debe tener al menos 4 caracteres.", false);
            if(forgotSubmitBtn) forgotSubmitBtn.disabled = false;
            return;

        }

        if(newPassword !== confirmNewPassword){

            showMessage(forgotMessage, "Las contraseñas no coinciden.", false);
            if(forgotSubmitBtn) forgotSubmitBtn.disabled = false;
            return;

        }

        const user = getUser(forgotTargetEmail);
        user.password = newPassword;
        saveUser(user);

        showMessage(forgotMessage, "Contraseña actualizada. Ya puedes iniciar sesión.", true);

        if(forgotSubmitBtn) forgotSubmitBtn.disabled = false;

        setTimeout(() => {

            resetForgotForm();
            goTo(loginSection);

        }, 1400);

    });
}

function animateCounter(id, target){
    const element = document.getElementById(id);
    if(!element) return;

    let count = 0;
    const increment = target / 100;

    const timer = setInterval(() => {

        count += increment;

        if(count >= target){
            count = target;
            clearInterval(timer);
        }

        element.textContent = Math.floor(count) + "+";

    }, 20);
}

animateCounter("carsCount", 1200);
animateCounter("citiesCount", 50);
animateCounter("clientsCount", 9800);


/* ==================================
   ESTADO INICIAL DEL ASISTENTE
================================== */

if (isAuthPage) {
    renderWizard();
}

// ==========================
// AUTO-FIX 'Volver' LINKS + BACK BUTTON FOR DETAIL PAGES
// ==========================

document.addEventListener('DOMContentLoaded', () => {

    // Repoint any "Volver" link that currently goes to index.html -> indexcarros.html
    document.querySelectorAll('a').forEach(a => {
        try {
            const txt = (a.textContent || '').trim().toLowerCase();
            const href = a.getAttribute('href');

            if (txt.includes('volver') && (href === 'formulario (2).html' || href === './formulario (2).html')) {
                a.setAttribute('href', 'mainmenu.html');
            }
        } catch (e) { /* ignore */ }
    });

    // If this looks like a vehicle detail page, inject a back button at the top
    if (document.querySelector('.galeria-vehiculo') || document.querySelector('.detalle-principal')) {

        if (!document.querySelector('.btn-volver-injected')) {

            const btn = document.createElement('a');
            btn.href = 'mainmenu.html';
            btn.className = 'btn btn-premium-blue mb-4 btn-volver-injected';
            btn.innerHTML = '<i class="fa-solid fa-arrow-left me-2"></i> Volver';

            document.body.insertAdjacentElement('afterbegin', btn);

        }

    }

})