import * as azure from "azure-storage";

let _queueService = null;
const getQueueService = () => {
    if (!_queueService) {
        _queueService = azure.createQueueService();
    }
    return _queueService;
}

export const addMessageToQueue = async (queue: string, message: string): Promise<void> => {

    return new Promise((resolve, reject) => {
        const queueService = getQueueService();
        queueService.createQueueIfNotExists(queue, (error, results, response) => {
            if (!error) {
                const base64EncodedMessage = new Buffer(message).toString("base64");
                queueService.createMessage(queue, base64EncodedMessage, (err, msgResult, msgResp) => {
                    if (err) {
                        reject("Could not send message to queue");
                    }

                    resolve();
                })
            } else {
                reject("Queue could not be created.");
            }
        });
    });
}

