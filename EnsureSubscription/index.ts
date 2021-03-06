import { AzureFunction, Context } from "@azure/functions"
import { isNearlyExpired, getExpirationDateTimeISOString } from "../helpers/date-helper";
import { updateSubscription, getSubscription } from "../helpers/subscriptions-helper";
import { setupNewSubscription } from "../helpers/subscription-setup";
import { configure, SETUP_EXPIRATION_DELAY_IN_DAYS } from "../helpers/configure";

const queueTriggeredEnsureSubscription: AzureFunction = async function (context: Context, subscriptionId: string): Promise<void> {
    context.log(`Ensuring subscription ${subscriptionId}...`);
    configure(context);

    const foundSubscription = await getSubscription(subscriptionId, context.log);
    if (foundSubscription) {
        context.log("A subscription has been found !");
        context.log(`Resource    : ${foundSubscription.resource}`);
        context.log(`Change type : ${foundSubscription.changeType}`);
        context.log(`Expires on  : ${foundSubscription.expirationDateTime}`);

        // At this point, if we realize the subscription is expiring soon, we update it with a new maximum delay starting right now !
        if (isNearlyExpired(foundSubscription.expirationDateTime)) {
            const expirationDateTime = getExpirationDateTimeISOString(SETUP_EXPIRATION_DELAY_IN_DAYS);
            context.log(`Will update the expiration to ${expirationDateTime}`);
            await updateSubscription({
                id: foundSubscription.id,
                expirationDateTime
            },
                context.log);
            context.log("Subscription updated.");
        } else {
            context.log("The subscription will not expire soon...");
        }
    } else {
        context.log(`No subscription has been found with id ${subscriptionId}...`);
        // If subscription is not found, it might have been deleted in the meantime for some reason
        // In order to keep the whole system stable, we recreate a new subscription here
        await setupNewSubscription(context.log);
    }
};

export default queueTriggeredEnsureSubscription;
