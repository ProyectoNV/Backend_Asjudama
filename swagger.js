const swaggerJSDOC = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path")

const options = {
    definition: {
        openapi: "3.0.0",
        info: { 
            title:"Conexion con a MySQL Y API", 
            version: "1.0.0",
            description: "Documentación de los endpoints realizados y descripción de rutas",
            contact: {
                name: "API Support",
                url: "",
                email: "proyectsena2023@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:4000",
                description: "Documentacion de la API"
            },
        ],
    },
    apis: [`${path.join(__dirname, "./Routes/*.js")}`]
};

const swagerSpec = swaggerJSDOC(options);
const swaggerJSDOCs = (app, port)=>{
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagerSpec));
    app.get('/api-docs.json', (req, res) =>{
        res.setHeader('Content-Type', 'application/json');
        res.send(swagerSpec);
    });
    console.log(
        `Version No 1 d la documentacion estara disponible en http://localhost:${port}/api-docs`
    );
}

module.exports={
    swaggerJSDOCs
}
