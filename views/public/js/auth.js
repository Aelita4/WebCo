async function metamaskAuth() {
    if (window.ethereum) {
        const { ethereum } = window;
        const metamaskButtons = document.querySelectorAll('.metamask-button');

        metamaskButtons.forEach(button => {
            button.removeAttribute("onclick");
            button.innerHTML = "connecting...";
        });

        try {
            const address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];

            const response = await fetch(`/auth/metamask/verify/${address}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if(data.userFound) window.location.href = '/game';
            else window.location.href = `/metamaskRegister?address=${address}`;
        } catch (err) {
            console.log(err);
            window.location.reload();
        }
    } else {
        alert('Metamask not installed');
    }
}

function toggle() {
    const login = document.querySelector('#login');
    const register = document.querySelector('#register');
    const loginButton = document.querySelector('.login-switcher-button#switcher-login');
    const registerButton = document.querySelector('.login-switcher-button#switcher-register');

    login.classList.toggle('hidden');
    register.classList.toggle('hidden');
    loginButton.classList.toggle('switcher-active');
    registerButton.classList.toggle('switcher-active');


    if(loginButton.hasAttribute("onclick")) {
        loginButton.removeAttribute("onclick");
        registerButton.setAttribute("onclick", "toggle()");
    } else {
        registerButton.removeAttribute("onclick");
        loginButton.setAttribute("onclick", "toggle()");
    }
}