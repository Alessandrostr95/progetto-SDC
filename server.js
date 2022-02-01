require("dotenv").config();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.HOST}:${process.env.PORT}`));
global.web3 = web3;
const Contracts = require('./src/models/contract');

const express = require('express');
const app = express();
app.use(express.json());

/**
 * @app Query allo smart contract.
 * Dato un `greenpass`, un'attività `activity` ( @see /api/v1/certification/enum/activities )
 * e una regione `region` ( @see /api/v1/certification/enum/regions ),
 * ritorna una risposta positiva se il possessore del greenpass è autorizzato
 * a svolgere l'attività in questione in quella regione secondo le norme vigenti.
 */
app.post('/api/v1/certification/canDo', async (req, res) => {
    try {
        const certification = req.body;
        const greenpass = certification.greenpass;
        const activity = certification.activity;
        const region = certification.region;

        const contract = await Contracts.GreenPassCertification.deployed();
        const canDo = await contract.canDo(
            greenpass,
            Contracts.Activity.enums.Activities[activity],
            Contracts.Region.enums.Regions[region]
            );
        
        res.status(200).json({
            status: true,
            data: {greenpass, activity, region, canDo}
            });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Query allo smart contract per ottenere la lista di tutte le attività.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano le attività.
 */
app.get('/api/v1/certification/enum/activities', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Activity.enums.Activities)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}); 

/**
 * @app Query allo smart contract per ottenere la lista di tutte le regioni.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano le regioni.
 */
app.get('/api/v1/certification/enum/regions', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Region.enums.Regions)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Query allo smart contract per ottenere la lista di tutti i colori delle regioni.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano i colori.
 */
app.get('/api/v1/certification/enum/colors', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Region.enums.Colors)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

/**
 * @app Query allo smart contract per ottenere la lista di tutte le tipologie di greenpass.
 * Ritorna una risposta positiva con un array di stringhe che rappresentano le tipologie.
 */
app.get('/api/v1/certification/enum/certification_types', async (_, res) => {
    try {
        res.status(200).json({
            status: true,
            data: Object.keys(Contracts.Certification.enums.CertificationType)
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.post('/api/v1/certification/emit', async (req, res) => {
    try {
        const certification = req.body;
        const greenpass = certification.greenpass;
        const certificationType = certification.certificationType;
        const privateKey = certification.privateKey;

        const pubKey = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contract = await Contracts.GreenPassCertification.deployed();
        const transaction = await contract.emitCertificate(certificationType, greenpass, {from: pubKey});
        res.status(200).json({
            status: true, 
            data: {transaction, greenpass, certificationType, privateKey, pubKey}
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.listen(process.env.LISTEN_PORT, () => { console.log(`Hi! I'm listening on port ${process.env.LISTEN_PORT}`) });