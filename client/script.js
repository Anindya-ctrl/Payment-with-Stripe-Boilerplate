const payButton = document.getElementById('pay-button');
payButton.addEventListener('click', event => {
    return fetch('http://localhost:3000/payment', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            items: [
                { id: 1, quantity: 2 },
                { id: 2, quantity: 3 },
            ],
        }),
    }).then(res => {
        if(res.ok) return res.json();
        return res.json().then(json => Promise.reject(json));
    }).then(({ redirectURL }) => {
        window.location = redirectURL;
    }).catch(err => console.error(err));
});
