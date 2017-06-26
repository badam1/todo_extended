export class StorageService {

    static saveInLocalStorage(key: string, value: any): void {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    static loadFromLocalStorage(key: string): any {
        return JSON.parse(window.localStorage.getItem(key));
    }

    static deleteFromLocalStorage(key: string): void {
        window.localStorage.removeItem(key);
    }
}
