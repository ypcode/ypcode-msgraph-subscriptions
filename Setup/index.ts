import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { configure } from "../helpers/configure";
import { setupNewSubscription } from "../helpers/subscription-setup";

const httpTriggerSubscriptionSetup: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    configure(context);
    context.log("Subscription setup...");
    await setupNewSubscription(context.log);
};

export default httpTriggerSubscriptionSetup;
