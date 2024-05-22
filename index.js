const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser')
const AdminRoutes = require('./Routes/AdminRoutes')
const VendedorRutas = require('./Routes/VendedoresRouter')
const datosRouter = require('./Routes/DatosRouter')
const cors = require('cors')
const {db} = require('./Model/db_model')
const {swaggerJSDOCs} = require('./swagger') 


const app = express();
app.use(session({
    secret: 'Asjudama_Dulceria',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PUT','DELETE'],
};
app.use(cors());

app.use("/",datosRouter);
app.use("/admin", AdminRoutes);
app.use("/vendedor", VendedorRutas);

app.get("/", (req, res)=>{
    res.send("Bienvenido a mi API conectandome a MYSQL...");
});

const puerto =process.env.port || 4000;

app.listen(puerto,()=>{
    console.log(`Escuchando en el puerto ${puerto}`);
    swaggerJSDOCs(app, 4000);
})