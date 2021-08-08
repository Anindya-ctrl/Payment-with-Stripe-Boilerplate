const express = require('express');
const app = express();
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_KEY);
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5500',
}));

// DUMMY DATABASE
const storeItems = {
    1: { name: 'A', price: 3000 },
    2: { name: 'B', price: 5000 },
};

app.post('/payment', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: req.body.items.map(({ id, quantity }) => {
                const { name: itemName, price: itemPrice } = storeItems[id];

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: itemName,
                        },
                        unit_amount: itemPrice,
                    },
                    quantity,
                };
            }),
            success_url: `${ process.env.CLIENT_URL }/success.html`,
            cancel_url: `${ process.env.CLIENT_URL }/cancel.html`,
        });
        return res.json({
            redirectURL: session.url,
        });
    } catch(err) {
        return res.status(500).json({
            error: err.message || 'An unknown error occurred :('
        });
    }
});

app.listen(PORT, () => console.log(`Listening on port: ${ PORT }`));
