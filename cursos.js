// Configurações Globais

const API_URL = 'http://localhost:5120/api'; 
const TOKEN_KEY = 'app_auth_token';

const messageBox = document.getElementById('message-box');
function mostrarMensagem(texto, type='error')
{
if(!messageBox)return;
messageBox.textContent = texto;
messageBox.className = type ==='error' ? 'msg-error' : 'msg-sucess';
messageBox.style.display = 'block';
setTimeout(() => {messageBox.style.display = 'none';}, 4000);
}

// Decodificar o Payload do JWT

function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.reaplace(/-/g, '+').reaplace(/_/g,'/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c){
            return '%' + ('00' + c.charCodeAt(0).toString(16).slice(-2));
        }).join(''));

        return JSON.parse(jsonPayload);

    } catch (error) {
        console.error("Erro ao decodificar JWT:", e);
        return null;
    }
}

// Cadastro de Cursos

const cursoForm = document.getElementById("cursos-form");
const token = localStorage.getItem(TOKEN_KEY);
let userRole = null;

if (token){
    const payload = parseJWT(token);
    if (payload){
        userRole = payload.role;
    } 
}

const rolesArray = userRole ? (Array.isArray(userRole) ? userRole : [userRole]): [];

// Bloqueio da Interface

if(!token){
    mostrarMensagem("Usuário não autorizado", error);
    cursoForm.style.display = "none";
    setTimeout(() => {
        console.log("Esperando um tempinho...")
    }, 5000);
    window.location.href = "login.html";
} else if (!rolesArray.includes("Admin") && !rolesArray.includes("Professor")){
    alert("Acesso negado. Não tem permissão para visualizar esta página.");
    window.location.href = "login.html";
}

const tituloCurso = document.getElementById("title");
const descricaoCurso = document.getElementById("descricao");
const cargaCurso = document.getElementById("cargahoraria");
const submitCurso = document.getElementById("submit-btn");

cursoForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const titulo = tituloCurso.value;
    const descricao = descricaoCurso.value;
    const cargaHoraria = cargaCurso.value;

    try {
        submitCurso.disabled = true;
        submitCurso.textContent = "Aguarde..."

        const resposta = await fetch(`${API_URL}/cursos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({titulo, descricao, cargaHoraria}),
        });

        let dados = {};
        if(resposta.status !== 204){
            dados = await resposta.json();
        }
        // Paramos aqui!


    } catch (error) {
        
    }
})