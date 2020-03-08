import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { INotificationsPayload } from "../entities/INotification";

import { SUBSCRIPTIONS_QUEUE_NAME, BUSINESS_TASKS_QUEUE_NAME } from "../helpers/configure";
import { addMessageToQueue } from "../helpers/azure-queue-helper";
import { IBusinessTaskArgs } from "../entities/IBusinessTaskArgs";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    // Validate the subscription creation
    if (req.query.validationToken) {
        context.log('Validating new subscription...');
        context.log('Validation token:');
        context.log(req.query.validationToken);
        context.res = {
            headers: {
                'Content-Type': 'text/plain'
            },
            body: req.query.validationToken
        };
    }
    else {
        context.log('Received new notification from Microsoft Graph...');
        context.log('Notifications: ');
        const payload = req.body as INotificationsPayload;
        payload.value.forEach(async (n, i) => {
            context.log(` Notification #${i} `);
            context.log(`----------------------------------------------------------`);
            context.log(`Subscription Id    : ${n.subscriptionId}`);
            context.log(`Expiration         : ${n.subscriptionExpirationDateTime}`);
            context.log(`Change Type        : ${n.changeType}`);
            context.log(`Client State       : ${n.clientState}`);
            context.log(`Resource           : ${n.resource}`);
            const resourceData = n.resourceData && JSON.stringify(n.resourceData);
            context.log(`Resource Data      : ${resourceData}`);
            context.log(`----------------------------------------------------------`);

            // ====================================================================================
            // HERE we delegate the business logic work to a dedicated queue triggered function
            // We pass any needed parameter that might come from the notification
            // ====================================================================================
            try {
                const taskArgs: IBusinessTaskArgs = {
                    eventResourceUri: n.resource
                };
                await addMessageToQueue(BUSINESS_TASKS_QUEUE_NAME, JSON.stringify(taskArgs));
            }
            catch (err) {
                context.log.error(err);
            }

            // ====================================================================================

            // ====================================================================================
            // HERE Ensure the subscription lifetime will be extended
            // ====================================================================================
            // we push the subscription id to the subscriptions queue
            // The EnsureSubscription queue-triggered function 
            // will in turn update the expiration of the subscription if needed
            try {
                await addMessageToQueue(SUBSCRIPTIONS_QUEUE_NAME, n.subscriptionId);
            }
            catch (err) {
                context.log.error(err);
            }
        });

        context.res = { body: "" };
    }
};

export default httpTrigger;
