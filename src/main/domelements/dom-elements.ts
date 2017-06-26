export class DomElements {

    static categoryListElement: HTMLElement = <HTMLElement>document.querySelector('#category-list');
    static categoryListModalElement: HTMLElement = <HTMLElement> document.querySelector("#todo-category");
    static todoListElement: HTMLElement = <HTMLElement>document.querySelector('.todo-list');
    static finishedTodoListElement = <HTMLElement>document.querySelector('.finished-todo-list');
    static saveCategoryBtn = document.querySelector('#save-category-btn');
    static inputField: HTMLInputElement = <HTMLInputElement>document.querySelector("#category-name");
    static deleteCategoryBtn = document.querySelector("#delete-category-btn");
    static deleteCategoryNameInput: HTMLInputElement = <HTMLInputElement>document.querySelector("#delete-category-name");
    static modalShowBtn: HTMLElement = <HTMLElement>document.querySelector('#addTodoModal');
    static modalTitle: HTMLElement = <HTMLElement>document.querySelector('#addNewTodoModalLabel');

    static newTodoTitle: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-title");
    static newTodoCategory: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-category");
    static newTodoLinkName: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-link-name");
    static newTodoUrl: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-url");
    static newTodoDescription: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-desc");
    static newTodoTime: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-time");

    static getInputFields(): HTMLInputElement[] {
        return [DomElements.newTodoTitle, DomElements.newTodoCategory, DomElements.newTodoLinkName, DomElements.newTodoUrl, DomElements.newTodoDescription, DomElements.newTodoTime];
    }
}