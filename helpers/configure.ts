import { graph } from "@pnp/graph-commonjs";
// import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { AdalFetchClient } from "@pnp/nodejs-commonjs";
import { Context } from "@azure/functions";

export const SUBSCRIPTIONS_QUEUE_NAME =  process.env.SUBSCRIPTIONS_QUEUE_NAME || "subscriptions-to-ensure";
export const BUSINESS_TASKS_QUEUE_NAME =  process.env.BUSINESS_TASKS_QUEUE_NAME || "business-tasks";
export const ENSURED_SUBSCRIPTIONS_TABLE_NAME =  process.env.ENSURED_SUBSCRIPTIONS_TABLE_NAME || "EnsuredSubscriptions";
export const ENSURED_SUBSCRIPTIONS_PARTITION_KEY =  process.env.ENSURED_SUBSCRIPTIONS_PARTITION_KEY || "EnsuredSubscriptions";

const TENANT = process.env.TENANT;
const AAD_APP_ID = process.env.AAD_APP_ID;
// TODO That should rather be fetched from Azure Keyvault instead
const AAD_APP_SECRET = process.env.AAD_APP_SECRET;

export const WEBSITE_HOSTNAME = process.env.OVERRIDDEN_WEBSITE_HOSTNAME || process.env.WEBSITE_HOSTNAME;
export const SETUP_NOTIFICATION_BASE_URL = `${WEBSITE_HOSTNAME}`;
export const SETUP_EXPIRATION_DELAY_IN_DAYS = 3;

const DEFAULT_EXPIRATION_CHECK_SAFETY_WINDOW = 86400000; // 1 day
export const EXPIRATION_CHECK_SAFETY_WINDOW = (process.env.EXPIRATION_CHECK_SAFETY_WINDOW && parseInt(process.env.EXPIRATION_CHECK_SAFETY_WINDOW)) || DEFAULT_EXPIRATION_CHECK_SAFETY_WINDOW;

export function configure(functionContext: Context) {

    functionContext.log(`Using function app base url        : '${WEBSITE_HOSTNAME}'`);
    functionContext.log(`Using tenant                       : '${TENANT}'`);
    functionContext.log(`Using ADD App Id                   : '${AAD_APP_ID}'`);
    functionContext.log(`Using Queue for subscriptions      : '${SUBSCRIPTIONS_QUEUE_NAME}'`);
    functionContext.log(`Using Queue for tasks              : '${BUSINESS_TASKS_QUEUE_NAME}'`);
    functionContext.log(`Using Table for subscriptions      : '${ENSURED_SUBSCRIPTIONS_TABLE_NAME}'`);
    functionContext.log(`Using Table partition key          : '${ENSURED_SUBSCRIPTIONS_PARTITION_KEY}'`);

    graph.setup({
        graph: {
            fetchClientFactory: () => {
                return new AdalFetchClient(TENANT, AAD_APP_ID, AAD_APP_SECRET);
            },
        },
    });
}