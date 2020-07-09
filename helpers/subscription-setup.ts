import { Logger } from "@azure/functions";
import { createSubscription } from "./subscriptions-helper";
import { getExpirationDateTimeISOString } from "./date-helper";
import { ENSURED_SUBSCRIPTIONS_TABLE_NAME, ENSURED_SUBSCRIPTIONS_PARTITION_KEY, SETUP_NOTIFICATION_BASE_URL } from "./configure";
import { getTableItems, addOrUpdateTableItem } from "./azure-table-helper";
import { IEnsuredSubscriptionTableEntity } from "../entities/IEnsuredSubscriptionTableEntity";

export const setupInitial = async function (log: Logger) {
    const initialConfig: IEnsuredSubscriptionTableEntity[] = [
        {
            PartitionKey: ENSURED_SUBSCRIPTIONS_PARTITION_KEY,
            RowKey: "YPLEvents",
            subscriptionId: null,
            resource: "users/efda010b-19a4-4303-bf7b-70bd6e62e7d2/events",
            changeType: "updated",
            initialExpirationInDays: 3,
            expirationDateTime: null,
            clientState: '{"id":"YPLEvents", "uniqueToken":"QWERTZ"}',
            notificationRelativeUrl: "api/Webhook"
        },
        {
            PartitionKey: ENSURED_SUBSCRIPTIONS_PARTITION_KEY,
            RowKey: "Dev1Events",
            subscriptionId: null,
            resource: "users/3ada9ecc-451d-42b1-8ce9-8d747c6afe5e/events",
            changeType: "updated",
            initialExpirationInDays: 3,
            expirationDateTime: null,
            clientState: '{"id":"YPLEvents", "uniqueToken":"QWERTZ"}',
            notificationRelativeUrl: "api/Webhook"
        },
        {
            PartitionKey: ENSURED_SUBSCRIPTIONS_PARTITION_KEY,
            RowKey: "Dev2Events",
            subscriptionId: null,
            resource: "users/68630499-7ccd-4a4c-86a7-fd47cd545083/events",
            changeType: "updated",
            initialExpirationInDays: 3,
            expirationDateTime: null,
            clientState: '{"id":"YPLEvents", "uniqueToken":"QWERTZ"}',
            notificationRelativeUrl: "api/Webhook"
        }
    ];

    for (let index = 0; index < initialConfig.length; index++) {
        const s = initialConfig[index];

        log(`Creating subscription ${s.RowKey}...`);
        const created = await createSubscription({
            resource: s.resource,
            changeType: s.changeType,
            notificationUrl: `${SETUP_NOTIFICATION_BASE_URL}/${s.notificationRelativeUrl}`,
            clientState: s.clientState,
            expirationDateTime: getExpirationDateTimeISOString(s.initialExpirationInDays || 3)
        }, log);

        s.subscriptionId = created.id;
        s.expirationDateTime = created.expirationDateTime;
        addOrUpdateTableItem(ENSURED_SUBSCRIPTIONS_TABLE_NAME, s);

        log(`A new subscription has been created with id ${created.id}`);
    }
}

export const setupNewSubscriptionFromTable = async function (log: Logger) {

    const subscriptions = await getTableItems<IEnsuredSubscriptionTableEntity>(ENSURED_SUBSCRIPTIONS_TABLE_NAME);
    for (let index = 0; index < subscriptions.length; index++) {
        const s = subscriptions[index];
        log(`Creating subscription ${s.RowKey}...`);
        const created = await createSubscription({
            resource: s.resource,
            changeType: s.changeType,
            notificationUrl: `${SETUP_NOTIFICATION_BASE_URL}/${s.notificationRelativeUrl}`,
            clientState: s.clientState,
            expirationDateTime: getExpirationDateTimeISOString(s.initialExpirationInDays || 3)
        }, log);

        s.subscriptionId = created.id;
        addOrUpdateTableItem(ENSURED_SUBSCRIPTIONS_TABLE_NAME, s);

        log(`A new subscription has been created with id ${created.id}`);
    }
}