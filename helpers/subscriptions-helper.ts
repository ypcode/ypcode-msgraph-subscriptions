import { Logger } from "@azure/functions"
import { graph } from "@pnp/graph-commonjs";
import { Subscription } from "@microsoft/microsoft-graph-types";


const isValidForCreate = (subscription: Subscription) => {
    return !!(subscription.changeType && subscription.notificationUrl && subscription.resource && subscription.expirationDateTime);
}

const isValidForUpdate = (subscription: Subscription) => {
    return !!(subscription.id && subscription.expirationDateTime);
}

export const getSubscription = async function (subscriptionId: string, log: Logger): Promise<Subscription> {
    try {
        const subscription = await graph.subscriptions.getById(subscriptionId).get();
        return subscription;
    } catch (error) {
        log.warn(`An error occured while trying to get subscription with Id ${subscriptionId}`, error);
        return null;
    }
}

export const createSubscription = async function (subscription: Subscription, log: Logger): Promise<Subscription> {
    if (isValidForCreate(subscription)) {
        log("Creating new subscription...");
        const { changeType, notificationUrl, resource, expirationDateTime } = subscription;
        const result = await graph.subscriptions.add(changeType, notificationUrl, resource, expirationDateTime, subscription);
        log(`New subscription to ${changeType} of ${resource} has been created.`);
        return result.data;
    }
    else {
        log.error("Received request is not valid to create a subscription...");
    }
}

export const updateSubscription = async function (subscription: Subscription, log: Logger): Promise<void> {
    if (isValidForUpdate(subscription)) {
        log(`Updating subscription ${subscription.id}...`);
        await graph.subscriptions.getById(subscription.id).update(subscription);
        log(`Subscription ${subscription.id} has been updated.`);
    } else {
        log.error("Received request is not valid to update the subscription...");
    }
};