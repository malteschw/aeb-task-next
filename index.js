/**
 * Setup
 */

const express = require('express')
const app = express()
const port = 5000;
const bodyParser = require('body-parser')
/**
 * Body Parser für JSON
 */
app.use(bodyParser.json());

/**
 * wenn man sich genau an die Liste hält, ist der Pfad zu boxNumber falsch (boxData.boxNumber)
 * als auch soldTo.SoldToCode (soldToCode - klein geschrieben).
 */
const mandatoryFields = [
    "msgId",
    "sender",
    "boxNumber",
    "senderInfo.plant",
    "senderInfo.shippingPoint",
    "soldTo.SoldToCode",
    "shipTo.shipToCode",
    "intermediate.intermediateCode"
]


/**
 * JSON Validator
 */
function inputValidator(input) {
    let missingFields = [];
    const objectToCheck = input["boxPackingRequest"]["messageHeader"]

    mandatoryFields.forEach((field) => {
        let currentValue;
        let lastKey = field;

        // falls es mehrere Keys gibt
        if (field.includes('.')) {
            let split = field.split('.')
            let temp = objectToCheck;
            let keyList = [];


            /**
             * Keys werden bis zum Ende durchgegangen
             * Letzter Key wird immer gespeichert
             */
            split.forEach((currentSplit) => {
                currentValue = temp[currentSplit]
                keyList.push(currentSplit);
                temp = objectToCheck[currentSplit]
            })

            /**
             * Pfad zum letzten Key, falls gesplittet wurde
             */
            lastKey = keyList.join(".")

        } else {
            currentValue = objectToCheck[field]
        }

        /**
         * Falls value null oder kein String ist, kann nicht validiert werden
         * -> fehlendes Feld wird der Liste hinzugefügt
         */
        if (currentValue === null || typeof currentValue !== 'string') {
            missingFields.push(lastKey);
        }

    })

    /**
     * Länge bestimmt ob validiert werden kann
     * 0 === alles passt, alles drüber gibt fehlende Werte (keys) zurück
     */
    return missingFields;

}


/**
 * POST JSON Postman
 */
app.post('/json', (req, res) => {
    const data = req.body;
    let missingFields = inputValidator(data);

    if (missingFields.length === 0) {
        res.status(200).send("ok")
    } else {

        const errorBody = {
            status: "error",
            missingFields: missingFields
        }

        res.status(400).send(errorBody)
    }

});



app.get('/', (req, res) => {
    res.send('JSON Validator - /json für POST')
})

/**
 * start Server
 */
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

