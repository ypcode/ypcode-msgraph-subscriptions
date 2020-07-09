import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { configure } from "../helpers/configure";
import { setupInitial } from "../helpers/subscription-setup";

const httpTriggerSubscriptionSetup: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    configure(context);
    context.log("Initial Subscription setup...");
    await setupInitial(context.log);
};

export default httpTriggerSubscriptionSetup;
