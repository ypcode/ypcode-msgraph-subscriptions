import { AzureFunction, Context } from "@azure/functions"
import { getTableItems } from "../helpers/azure-table-helper";
import { addMessageToQueue} from "../helpers/azure-queue-helper";
import { ENSURED_SUBSCRIPTIONS_TABLE_NAME, EXPIRATION_CHECK_SAFETY_WINDOW, SUBSCRIPTIONS_QUEUE_NAME } from "../helpers/configure";
import { isNearlyExpired } from "../helpers/date-helper";
import { IEnsuredSubscriptionTableEntity } from "../entities/IEnsuredSubscriptionTableEntity";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {

    // Get all the extended subscriptions from Azure Table
    const ensuredSubscriptions = await getTableItems<IEnsuredSubscriptionTableEntity>(ENSURED_SUBSCRIPTIONS_TABLE_NAME);

    // Check the ones nearly expired
    const subscriptionsToExtend = ensuredSubscriptions.filter(s => isNearlyExpired(s.expirationDateTime, EXPIRATION_CHECK_SAFETY_WINDOW));

    // Foreach nearly expired, extend it
    subscriptionsToExtend.forEach(s => {
        // Add the subscription id to the queue for the EnsureSubscription to be triggered
        addMessageToQueue(SUBSCRIPTIONS_QUEUE_NAME, s.subscriptionId);
    });
};

export default timerTrigger;
