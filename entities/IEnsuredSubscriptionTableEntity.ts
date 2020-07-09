export interface IEnsuredSubscriptionTableEntity {
    PartitionKey: string;
    RowKey: string;
    subscriptionId: string;
    resource: string;
    changeType: string;
    clientState: string;
    initialExpirationInDays: number;
    expirationDateTime: string;
    notificationRelativeUrl: string;
}