async function metamaskAuth() {
    if (window.ethereum) {
        const { ethereum } = window;
        const metamask = document.querySelector('.metamask-button');

        metamask.removeAttribute("onclick");
        metamask.innerHTML = "connecting...";

        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (err) {
            alert(err.message);
        } finally {
            window.location.reload();
        }

        

        const address = (await ethereum.request({ method: 'eth_accounts' }))[0];

        const getSignature = await fetch(`/webcolony/getSignature/${address}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json());

        let signature = getSignature.signature;
        let nonce = 0;

        console.log(getSignature)
        
        if(signature === null) {
            const getNonce = await fetch('/webcolony/nonce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            }).then(res => res.json());
    
            nonce = getNonce.nonce;
    
            const message = `I am signing my one-time nonce: ${nonce}`;
            signature = await ethereum.request({
                method: 'personal_sign',
                params: [message, address], 
            });
        }       

        const date = new Date();

        await fetch('/webcolony/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isMetamask: true, address, nonce, signature, date })
        });

        window.location.reload();
    } else {
        alert('Metamask not installed');
    }
}

function toggle() {
    const login = document.querySelector('#login');
    const register = document.querySelector('#register');

    login.classList.toggle('hidden');
    register.classList.toggle('hidden');

    const loginButton = document.querySelector('.login-switcher-button #switcher-login');
    const registerButton = document.querySelector('.login-switcher-button #switcher-register');

    if(loginButton.hasAttribute("onclick")) {
        loginButton.removeAttribute("onclick");
        registerButton.setAttribute("onclick", "toggle()");
    } else {
        registerButton.removeAttribute("onclick");
        loginButton.setAttribute("onclick", "toggle()");
    }
}