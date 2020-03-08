import { AzureFunction, Context } from "@azure/functions";
import { IBusinessTaskArgs } from "../entities/IBusinessTaskArgs";
import { GraphHttpClient } from "@pnp/graph-commonjs/graphhttpclient";
import { configure } from "../helpers/configure";

const queueTrigger: AzureFunction = async function (context: Context, taskArgs: IBusinessTaskArgs): Promise<void> {
  // The calendar event is post process by our custom logic
  context.log(`Received arguments: ${JSON.stringify(taskArgs)}`);
  configure(context);

  try {
    // TODO Here implement custom logic
    // e.g. Update the updated event's title
    const resourceAbsoluteUrl = `https://graph.microsoft.com/v1.0/${taskArgs.eventResourceUri}`;
    const client = new GraphHttpClient();
    const eventResponse = await client.get(resourceAbsoluteUrl);
    const event: { subject: string; } = await eventResponse.json();

    // If event is not already processed
    // Since we are updating the notified updated event, we have to check the custom task is not already done
    // Otherwise, a notification will be resent and cause an "infinite" loop
    if (event.subject.indexOf("[UPDATED]") != 0) {
      const eventUpdate = {
        subject: `[UPDATED] ${event.subject}`
      }

      const patchResponse = await client.patch(resourceAbsoluteUrl, {
        body: JSON.stringify(eventUpdate)
      });

      if (patchResponse.ok) {
        console.log("Event has been updated.");
      } else {
        console.log("Event could not be updated");
      }
    }
  }
  catch (error) {
    context.log.error("An error occured while processing custom business task", error);
  }

};

export default queueTrigger;
