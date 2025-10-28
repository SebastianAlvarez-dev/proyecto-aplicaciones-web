/*AUTH_IIFE*/
(function(){
  try {
    var K_USER='becasULEAM_user';
    var file=(location.pathname.split('/').pop()||'index.html');
    var PUBLIC_PAGES=['login.html','recuperar.html','registro.html'];
    var logged=!!localStorage.getItem(K_USER);
    if(!PUBLIC_PAGES.includes(file) && !logged){
      window.location.replace('login.html');
      return;
    }
    if(file==='login.html' && logged){
      window.location.replace('index.html');
      return;
    }
  } catch(e){ /* noop */ }
})();
// Forzar inicio de sesión antes de acceder a cualquier página
document.addEventListener('DOMContentLoaded', function forceLogin(){
  const file = location.pathname.split('/').pop() || 'index.html';
  if (!isLogged() && file !== 'login.html' && file !== 'recuperar.html' && file !== 'registro.html') {
    location.href = 'login.html';
  }
});

function qs(s,ctx=document){return ctx.querySelector(s)};
function qsa(s,ctx=document){return [...ctx.querySelectorAll(s)]};
function setActiveNav(){ const file = location.pathname.split('/').pop() || 'index.html'; qsa('nav a').forEach(a=>{ if(a.getAttribute('href')===file) a.classList.add('active') }) }
document.addEventListener('DOMContentLoaded', setActiveNav);
const K_SOLICITUDES='becasULEAM_solicitudes_v1', K_PERFIL='perfilEstudiante', K_FOTO='fotoPerfil', K_USER='becasULEAM_user';
const PUBLIC_PAGES=['login.html','recuperar.html','registro.html'];
function isLogged(){ return Boolean(localStorage.getItem(K_USER)); }
function guard(){ const file = location.pathname.split('/').pop() || 'index.html'; if(!PUBLIC_PAGES.includes(file) && !isLogged()){ location.href='login.html'; } }
document.addEventListener('DOMContentLoaded', guard);
function validarCedulaEC(ced){ return /^[0-9]{10}$/.test(ced) }
function onTipoBecaChange(value){
  const blocks={'socioeconomica':qs('#block-socioeconomica'),'discapacidad':qs('#block-discapacidad'),'deportiva':qs('#block-deportiva'),'academica':qs('#block-academica')};
  Object.values(blocks).forEach(b=>b&&b.classList.remove('visible')); if(blocks[value]) blocks[value].classList.add('visible');
}
document.addEventListener('DOMContentLoaded',()=>{
  const tipo=qs('#tipoBeca'); if(tipo){ tipo.addEventListener('change',e=>onTipoBecaChange(e.target.value)); if(tipo.value) onTipoBecaChange(tipo.value); }
  const form=qs('#formRegistro'); if(form){ form.addEventListener('submit',e=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(form).entries());
    const req=['nombre','cedula','facultad','carrera','tipoBeca']; const faltan=req.filter(k=>!data[k]||String(data[k]).trim()==='');
    if(faltan.length){ alert('Completa: '+faltan.join(', ')); return } if(!validarCedulaEC(data.cedula)){ alert('Cédula inválida'); return }
    if(data.tipoBeca==='socioeconomica'){ if(!(data.ingresoMensual&&data.integrantes&&data.situacionLaboral)){ alert('Completa campos socioeconómicos.'); return } }
    if(data.tipoBeca==='discapacidad'){ if(!(data.tipoDiscapacidad&&data.porcentajeDiscapacidad)){ alert('Completa campos de discapacidad.'); return } }
    if(data.tipoBeca==='deportiva'){ if(!(data.disciplina&&data.nivelCompetencia)){ alert('Completa campos deportivos.'); return } }
    if(data.tipoBeca==='academica'){ if(!(data.promedio&&Number(data.promedio)>=0)){ alert('Indica promedio.'); return } }
    const arr=JSON.parse(localStorage.getItem(K_SOLICITUDES)||'[]'); arr.push({id:'S'+Date.now(),fecha:new Date().toISOString(),estado:'En revisión',observaciones:'',...data});
    localStorage.setItem(K_SOLICITUDES, JSON.stringify(arr)); alert('Solicitud enviada.'); location.href='ver-solicitudes.html';
  })}
  const tbody=qs('#tbodyVerSolicitudes'); if(tbody){ const select=qs('#filtroEstado'); const list=JSON.parse(localStorage.getItem(K_SOLICITUDES)||'[]');
    function render(){ const est=select.value; const data=est==='todas'?list:list.filter(s=>s.estado===est);
      tbody.innerHTML=data.length?data.map(s=>`<tr><td>${s.id}</td><td>${new Date(s.fecha).toLocaleDateString()}</td><td>${s.tipoBeca}</td><td>${s.estado}</td><td>${s.observaciones||'-'}</td></tr>`).join(''):'<tr><td colspan="5">No hay solicitudes.</td></tr>'; }
    select.addEventListener('change',render); render();
  }
  const foto=qs('#fotoPerfil'); if(foto){ const saved=localStorage.getItem(K_FOTO); if(saved) foto.src=saved; const input=qs('#inputFoto'); input&&input.addEventListener('change',e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ foto.src=ev.target.result; localStorage.setItem(K_FOTO, ev.target.result); }; r.readAsDataURL(f); }); }
});
function guardarPerfil(){ const obj={ contacto:Object.fromEntries(new FormData(qs('#formPerfil')).entries()), academico:Object.fromEntries(new FormData(qs('#formAcademico')).entries()) }; localStorage.setItem(K_PERFIL, JSON.stringify(obj)); alert('Perfil actualizado.'); }; localStorage.setItem(K_PERFIL, JSON.stringify(obj)); alert('Perfil actualizado.'); }
function loginSubmit(e){ 
  e.preventDefault(); 
  const correo=qs('#loginCorreo').value.trim(); 
  const pass=qs('#loginClave').value.trim(); 
  const msgEl = document.getElementById('loginMsg') || (()=>{ const d=document.createElement('div'); d.id='loginMsg'; d.style='margin:10px 0;padding:10px;border-radius:8px'; const form=qs('form'); form && form.parentNode.insertBefore(d, form); return d; })();
  function showMsg(ok, text){ msgEl.textContent=text; msgEl.style.background=ok?'#e6fbe6':'#ffeaea'; msgEl.style.border=ok?'1px solid #8cc98c':'1px solid #e0a0a0'; msgEl.style.color=ok?'#205c20':'#7a2020'; }
  // validate basic format
  if(!/^[^@]+@[^@]+\.[^@]+$/.test(correo)){ showMsg(false,'❌ Correo no válido'); return } 
  if(pass.length<4){ showMsg(false,'❌ Contraseña mínima 4 caracteres'); return }
  // strict credentials
  const OK_CORREO='e1758359374@live.uleam.edu.ec';
  const OK_PASS='sebas16';
  if(correo===OK_CORREO && pass===OK_PASS){
    localStorage.setItem(K_USER, JSON.stringify({ nombre:'Sebastián Álvarez', correo:correo })); 
    showMsg(true,'✅ Inicio de sesión correcto. Redirigiendo...');
    setTimeout(()=>{ location.href='index.html'; }, 300);
  } else {
    showMsg(false,'❌ Correo o contraseña incorrectos. Intenta nuevamente.');
  }
} if(pass.length<4){ alert('Contraseña mínima 4 caracteres'); return } localStorage.setItem(K_USER, JSON.stringify({correo})); alert('Bienvenido: '+correo); location.href='perfil.html'; }
function logout(){ localStorage.removeItem(K_USER); alert('Sesión cerrada'); location.href='index.html'; }
function recuperarSubmit(e){ e.preventDefault(); const correo=qs('#recCorreo').value.trim(); if(!/^[^@]+@[^@]+\.[^@]+$/.test(correo)){ alert('Correo no válido'); return } alert('Enlace de recuperación enviado a '+correo+' (simulado).'); location.href='login.html'; }

// redirect from login to home if already logged
document.addEventListener('DOMContentLoaded', function redirectIfLogged(){
  const file = location.pathname.split('/').pop() || 'index.html';
  if (file === 'login.html' && isLogged()) { location.href = 'index.html'; }
});


// Redirección obligatoria a login al cargar index.html si no hay sesión
document.addEventListener('DOMContentLoaded', function redirectFromIndex(){
  const file = location.pathname.split('/').pop() || 'index.html';
  if (file === 'index.html' && !isLogged()) {
    location.href = 'login.html';
  }
});

// Dependencia entre facultad y carreras (versión final conectada correctamente)
document.addEventListener("DOMContentLoaded", () => {
  const facultad = document.getElementById("facultad");
  const carrera = document.getElementById("carrera");
  if (!facultad || !carrera) return;

  const carrerasPorFacultad = {
    "Ciencias de la Vida y Tecnologías": [
      "Ingeniería de Software",
      "Biología",
      "Tecnologías de la Información"
    ],
    "Ciencias de la Salud": [
      "Enfermería",
      "Medicina",
      "Psicología",
      "Fisioterapia"
    ],
    "Ciencias Sociales y Derecho": [
      "Derecho",
      "Criminalística"
    ]
  };

  facultad.addEventListener("change", e => {
    const seleccion = e.target.value;
    carrera.innerHTML = '<option value="">Seleccione...</option>';
    if (carrerasPorFacultad[seleccion]) {
      carrerasPorFacultad[seleccion].forEach(nombre => {
        const option = document.createElement("option");
        option.value = nombre;
        option.textContent = nombre;
        carrera.appendChild(option);
      });
    }
  });
});

function applyLockOverlay(){
  if (document.getElementById('lock-overlay')) return;
  document.body.classList.add('locked');
  const d=document.createElement('div'); d.id='lock-overlay';
  d.innerHTML = '<div class="lock-card"><h2>Acceso restringido</h2><p>Por favor, inicia sesión para continuar.</p><div class="lock-actions"><a class="btn green" href="login.html">Ir al Login</a><a class="btn secondary" href="registro.html">Crear cuenta</a></div></div>';
  document.body.appendChild(d);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const file = location.pathname.split('/').pop() || 'index.html';
  // Force auth on any protected page
  if (!PUBLIC_PAGES.includes(file) && !isLogged()){
    // show lock overlay quickly for UX, then redirect
    try{ applyLockOverlay(); }catch(_){}
    location.href='login.html';
    return;
  }
  // If already logged and on login, send home
  if (file==='login.html' && isLogged()){
    location.href='index.html';
  }
});

document.addEventListener('DOMContentLoaded', function renderBienvenida(){
  var el=document.getElementById('bienvenidaNombre');
  if(!el) return;
  try{
    var user=JSON.parse(localStorage.getItem(K_USER)||'{}');
    var nombre=user.nombre||user.correo||'Estudiante';
    el.textContent = nombre;
  }catch(e){}
});

document.addEventListener('DOMContentLoaded', () => {
  // Populate header username
  const nameSpan = document.getElementById('userNameHeader');
  try {
    const user = JSON.parse(localStorage.getItem(K_USER)||'{}');
    if (nameSpan && user && (user.nombre||user.correo)) {
      nameSpan.textContent = (user.nombre||user.correo) + ' ▼';
    }
  } catch(e){}

  // Bind logout
  const logout = document.getElementById('logoutBtn');
  if (logout) {
    logout.addEventListener('click', () => {
      localStorage.removeItem(K_USER);
      location.href = 'login.html?logout=true';
    });
  }

  // Show logout success on login page
  const file = location.pathname.split('/').pop() || 'index.html';
  if (file === 'login.html' && location.search.includes('logout=true')){
    const msg = document.createElement('div');
    msg.textContent = '✅ Sesión finalizada correctamente.';
    msg.style = 'background:#e6fbe6;border:1px solid #8cc98c;padding:8px;margin-bottom:10px;border-radius:6px;text-align:center;color:#206020;';
    const form = document.querySelector('form');
    if (form) form.parentNode.insertBefore(msg, form);
  }
});
