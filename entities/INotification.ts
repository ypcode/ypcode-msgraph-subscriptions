export interface INotificationResourceData {
    id: string;
    "@odata.type": string;
    "@odata.id": string;
    "@odata.etag": string;
}

export interface INotification {
    subscriptionId: string;
    subscriptionExpirationDateTime: string;
    tenantId: string;
    changeType: string;
    clientState: string;
    resource: string;
    resourceData: INotificationResourceData;
}

export interface INotificationsPayload {
    value: INotification[];
}