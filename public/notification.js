const gcm = require('node-gcm');

const sendAndroidNotification = (deviceIds, payload) => {

    let apiKey = 'AAAAdwzaFSg:APA91bEoSwFKg9jKsRLzUut6ATyrVy7xcrAHZzeT504yZEaqYSdR3xLI4qNxs9DaYXRHcPKa2AEH4kJNLxpXAhJvNVzltqTTiHg6QphJYFLdi7bbI-9DrDqryxQWetANvnItlAc1IdDf'

    let message = new gcm.Message({
        notification: {
            title: payload.title,
            body: payload
        }
    });

    let sender = new gcm.Sender(apiKey);

    sender.send(message, {
        registrationTokens: deviceIds
    }, function (err, response) {
        if (err) {
            console.error("Err>>>>>>>>>>>>>>>>", err);
        } else {
            console.log("response>>>>>>>>>>>>>>>", response);
        }
    });
}


module.exports = { sendAndroidNotification } 