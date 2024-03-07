const form = document.querySelector(".loginForm");
const loginPassword = document.getElementById('password');
const loginEmail = document.getElementById('email');
const errorPassword = document.getElementById('errorPassword');
const errorEmail = document.getElementById('errorEmail');



form.addEventListener('submit', (event) => {
    event.preventDefault();
    formLogin();
});

/*Cette fonction effectue le fetch (la requête)*/
async function fetchLogin(type, options) {
    const url = 'http://localhost:5678/api/users/' + type;
    try {
        const reponse = await fetch(url, options);
        const data = await reponse.json();

        return data;

    }
    catch (error) {
        return addError('request');
    }
}
/*Initialise le fetch du login*/
async function loginForm(user) {
    const type = 'login';
    const content = user;

    const options = {
        method: 'POST',
        headers: {

            'Content-Type': 'application/json'

        },
        body: JSON.stringify(content)
    };

    return fetchLogin(type, options);
}

/* Afficher les messages d'erreurs Email - PassWord */
function addError(errorType) {
    var type = errorType;
    errorEmail.innerText = '';
    errorPassword.innerText = '';
    var errorText = '';
    switch (type) {
        case 'invalid_data':
            errorText = document.createTextNode('Email ou password incorrect.');
            errorEmail.appendChild(errorText);
            break;
        case 'invalid_email':
            errorText = document.createTextNode('Email incorrecte veuillez réessayer.');
            errorEmail.appendChild(errorText);
            break;
        case 'invalid_password':
            errorText = document.createTextNode('Mot de passe incorrect. réessayez ou cliquez sur mot de passe oublié pour le réinitialiser.');
            errorPassword.appendChild(errorText);
            break;
        case 'request':
            errorText = document.createTextNode('Erreur lors de la requête veuillez réessayer ultérieurement.');
            errorEmail.appendChild(errorText);
            break;
        case 'user_not_found':
            errorText = document.createTextNode('Aucun utilisateur existe.');
            errorEmail.appendChild(errorText);
        default:
            break;
    }
}


async function formLogin() {
    const email = loginEmail.value;
    const password = loginPassword.value;
    /* Si l'email ou le password est différent alors on va envoyer un message d'erreur*/
    if (!email || !password) return addError('invalid_data');
    /*Si le password est inférieur a 6 alors il retourne un message d'erreur "invalid_password"*/
    if (password.length < 6) return addError('invalid_password');
    /**
     * Si l'email est différent alors on va envoyer un message d'erreur.
     * Grace à checkEmail va verifier que c'est bien un Email avec un @ et .com.
    */
    const validEmail = checkEmail(email);

    if (!validEmail) {
        return addError('invalid_email');
    }

    const user = { email, password };

    try {
        const req = await loginForm(user);
        if (req.token) {
            sessionStorage.setItem('token', req.token);
            window.location.href = "index.html";
        }

        if (req.message) return addError('user_not_found');
    } catch (error) {

    }
}

function checkEmail(email) {
    var regexMail = /^[^\s@]+@[a-z]+\.[a-z]{2,}$/;
    if (!regexMail.test(email)) {
        return false;
    }
    return regexMail.test(email);
}