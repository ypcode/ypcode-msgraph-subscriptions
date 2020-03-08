import { Logger } from "@azure/functions";
import { createSubscription } from "./subscriptions-helper";
import { getExpirationDateTimeISOString } from "./date-helper";
import { SETUP_RESOURCE, SETUP_CHANGE_TYPE, SETUP_NOTIFICATION_URL } from "./configure";

export const setupNewSubscription = async function(log: Logger) {
    log("Let's create a new subscription...");
    const created = await createSubscription({
        resource: SETUP_RESOURCE,
        changeType: SETUP_CHANGE_TYPE,
        notificationUrl: SETUP_NOTIFICATION_URL,
        expirationDateTime: getExpirationDateTimeISOString(3)
    }, log);

    log(`A new subscription has been created with id ${created.id}`);
    log("Please update the configuration accordingly...");
}