const express = require("express");
require("dotenv").config();
const app = express();
var cors = require("cors");

app.use(cors());
const stripe = require("stripe")(process.env.PRIVATE);

app.use(express.static("public"));
app.use(express.json());

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const dateObj = new Date();
const month = monthNames[dateObj.getMonth()];
const day = String(dateObj.getDate()).padStart(2, "0");
const year = dateObj.getFullYear();
const output = day + " de " + month + " de " + year;

app.get("/despierta-heroku", async (req, res) => {
  return res.status(200).json({ msg: output });
});

app.post("/create-payment-intent", async (req, res) => {
  const { donacion } = req.body;
  const cantidad = parseInt(donacion * 100);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cantidad,
      currency: "mxn",
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

app.listen(process.env.PORT, () =>
  console.log("Node server listening on port " + process.env.PORT)
);
