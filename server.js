const express = require('express');
const app = express();

const stripe = require('stripe')(
  'sk_test_51JaTznCGqe3RvXVDn9Hj9XKJFptPF97YIdCUipNFQFkilIpPiHXb9QDkao19oEHQatkY8HAWo6WZm0F6GrPpe8Mv00hhq1gz9W'
);

app.use(express.static('public'));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { donacion } = req.body;

  const cantidad = parseInt(donacion * 100);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cantidad,
      currency: 'mxn',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
