export class DataStorage {
    private static instance: DataStorage;
    private data: Record<string, string> = {};
    private constructor() {}
    public static getInstance(): DataStorage {
        if (!DataStorage.instance) {
            DataStorage.instance = new DataStorage();
        }
        return DataStorage.instance;
    }
    public setItem(key: string, value: string) {
        this.data[key] = value;
    }
    public getItem(key: string): string | null {
        return this.data[key] || null; 
    }
}

export const dataStorage = DataStorage.getInstance();
