import { graph } from "@pnp/graph-commonjs";
import { AdalFetchClient } from "@pnp/nodejs-commonjs";
import { Context } from "@azure/functions";

export const SUBSCRIPTIONS_QUEUE_NAME = "subscriptions-to-ensure";
export const BUSINESS_TASKS_QUEUE_NAME = "business-tasks";

const TENANT = process.env.TENANT;
const AAD_APP_ID = process.env.AAD_APP_ID;
// TODO That should rather be fetched from Azure Keyvault instead
const AAD_APP_SECRET = process.env.AAD_APP_SECRET;

export const WEBSITE_HOSTNAME = process.env.OVERRIDDEN_WEBSITE_HOSTNAME || process.env.WEBSITE_HOSTNAME;
// Probably a good idea to store these in app settings or in any easily updatable location
export const SETUP_CHANGE_TYPE = "updated";
export const SETUP_NOTIFICATION_URL = `${WEBSITE_HOSTNAME}/api/Webhook`;
export const SETUP_RESOURCE = process.env.SUBSCRIBED_RESOURCE_URI;
// NOTE Cannot subscribe with app permissions to groups events
// export const SETUP_RESOURCE = "groups/a619f4ce-xxxxxx-xxxx-f5df845c5e96/calendar/events";
export const SETUP_EXPIRATION_DELAY_IN_DAYS = 3;

export function configure(functionContext: Context) {

    functionContext.log(`Using function app base url: '${WEBSITE_HOSTNAME}'`);
    functionContext.log(`Using tenant               : '${TENANT}'`);
    functionContext.log(`Using ADD App Id           : '${AAD_APP_ID}'`);

    graph.setup({
        graph: {
            fetchClientFactory: () => {
                return new AdalFetchClient(TENANT, AAD_APP_ID, AAD_APP_SECRET);
            },
        },
    });
}