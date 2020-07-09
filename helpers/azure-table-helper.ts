import * as azure from "azure-storage";

let _tableService: azure.TableService = null;
const getTableService = () => {
    if (!_tableService) {
        _tableService = azure.createTableService();
    }
    return _tableService;
}

export const getTableItems = async <TItem>(tableName: string): Promise<TItem[]> => {

    return new Promise((resolve, reject) => {
        const tableService = getTableService();

        tableService.doesTableExist(tableName, (error, results, response) => {
            if (!error) {

                const query = new azure.TableQuery();
                tableService.queryEntities(tableName, query, null, (errQuery, queryResult, queryResponse) => {
                    resolve(queryResult.entries as TItem[]);
                });
            } else {
                reject("Table doesn't exist.");
            }
        });
    });
}

export const getTableItem = async <TItem>(tableName: string, partitionKey: string, rowKey: string): Promise<TItem> => {

    return new Promise((resolve, reject) => {
        const tableService = getTableService();

        tableService.doesTableExist(tableName, (error, results, response) => {
            if (!error) {
                tableService.retrieveEntity(tableName, partitionKey, rowKey, null, (errRetrieve, retrieveResult, retrieveResponse) => {
                    if (!errRetrieve) {
                        resolve(retrieveResult as TItem);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                reject("Table doesn't exist.");
            }
        });
    });
}

const getAzureTableEntity = <TItem>(item: TItem): any => {
    let entity = {};
    const propKeys = Object.keys(item);
    if (propKeys.indexOf("PartitionKey") < 0) {
        throw new Error("PartitionKey is missing");
    }

    if (propKeys.indexOf("RowKey") < 0) {
        throw new Error("RowKey is missing");
    }

    Object.keys(item).forEach(k => {
        entity[k] = { "_": item[k] };
    });

    // TODO Should be improved for specific data types (Date, ...)
    return entity;
};

export const addOrUpdateTableItem = async <TItem>(tableName: string, item: TItem): Promise<any> => {

    return new Promise((resolve, reject) => {
        const tableService = getTableService();

        tableService.createTableIfNotExists(tableName, (error, results, response) => {
            if (!error) {
                tableService.insertOrMergeEntity(tableName, getAzureTableEntity(item), (errInsert, resultInsert, responseInsert) => {
                    if (!errInsert) {
                        resolve();
                    } else {
                        reject("Item cannot be inserted");
                    }
                });
            } else {
                reject("Table can't be created.");
            }
        });
    });
};
