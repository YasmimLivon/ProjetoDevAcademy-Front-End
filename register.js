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

// Login
const loginform = document.getElementById("login-form");
if(loginform){
    const loginEmail = document.getElementById('login-email');
    const loginSenha = document.getElementById('login-password');
    const loginBtn = document.getElementById("login-btn");

    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const fetchDataBtn = document.getElementById('fetch-data-btn');
    const apiDataBox = document.getElementById('api-data');
    const logoutBtn = document.getElementById('logout-btn');

    function initIndex(){
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        } else{
        dashboardSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        }
    }

    loginform.addEventListener('submit', async(event) =>{
        event.preventDefault();
        const email = loginEmail.value;
        const senha = loginSenha.value;

        try{
            loginBtn.disabled = true;
            loginBtn.textContent = 'Aguarde...';

            const response = await fetch(`${API_URL}/Auth/login`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({email, senha})
            });
        const dados = await response.json();
        if(!response.ok) throw new Error(dados.mensagem || 'Credenciais inválidas');
        if(dados.token){
            localStorage.setItem(TOKEN_KEY, dados.token);
            // sessionStorage.setItem('userEmail', email); */
            initIndex();
        }

        } catch (error){
        mostrarMensagem(error, 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar';
        }

    });
    function logout(){
        // Deleta as informações do Token que foram guardadas loclamente
        localStorage.removeItem(TOKEN_KEY);
        // Chama a função para mostrar/esconder login
        initIndex();
        // Esconde a sessão com dados da api
        apiDataBox.style.display = 'none';
    }
        // Escuta do botão de logout
        logoutBtn.addEventListener('click', logout);
        initIndex();
} 

// Registro
const registroform = document.getElementById("register-form");
if(registroform){
    // Puxa as informações do login
    if(localStorage.getItem(TOKEN_KEY)){
        window.location.href = 'login.html'
    }
    const nomeRegistro = document.getElementById("name");
    const emailRegistro = document.getElementById("login-email");
    const senhaRegistro = document.getElementById("login-password");
    const submitRegistro = document.getElementById("submit-btn");
    const formRegistro = document.getElementById("register-form");
    const perfil = document.getElementById("role");
    const confirmarSenhaRegistro = documen.getElementById("confirmar-senha");

    formRegistro.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nome = nomeRegistro.value;
        const email = emailRegistro.value;
        const senha = senhaRegistro.value;
        const confirmSenha = confirmarSenhaRegistro.value;
        const role = perfil.value;

        if(senha !== confirmSenha){
            return mostrarMensagem('As senhas não coincidem', 'erro');
        }
        try{
            submitRegistro.disabled = true;
            registroform.textContent = 'Aguarde...';

            const resposta = await fetch (`${API_URL}/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nome, email, senha, role})
            });

            const dados = await resposta.json();
            if(!resposta.ok) throw new Error(dados.mensagem || 'Erro ao criar conta.' );
            alert('Conta criado com sucesso! Faça seu login.');
            window.location.href = 'login.html';

        } catch(error){
            mostrarMensagem(error, 'error');
        } finally {
            submitRegistro.disabled = false;
            submitRegistro.textContent = 'Registrar';
        }
    })
}