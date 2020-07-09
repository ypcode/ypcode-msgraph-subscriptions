import { Subscription } from "@microsoft/microsoft-graph-types";

export interface IEnsureSubscriptionQueueMessage extends Subscription {
    subscriptionId: string;
    subscriptionData?: Subscription;
}