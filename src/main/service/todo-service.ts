import { Todo } from '../domain/todo-interface';
import { StorageService } from './storage-service';
import { Templates } from '../templates/templates';
import { DomElements } from '../domelements/dom-elements';
import { UtilityService } from './utility-service';
import { Observable } from 'rxjs/Observable';

export class TodoService {

    static todoList: Todo[] = [];
    static finishedTodoList: Todo[] = [];

    constructor() {
        this.onInit();
    }

    private onInit() {
        UtilityService.attachShowMoreTodoBtnHandler();
        UtilityService.attachShowMoreFinishedTodoBtnHandler();
        TodoService.loadTodoList();
        TodoService.loadFinishedTodoList();
        this.refreshTodoList();
    }

    private static loadTodoList(): void {
        TodoService.todoList = <Todo[]> StorageService.loadFromLocalStorage('todoList');
        if (TodoService.todoList == null) {
            TodoService.todoList = [];
        }
    }

    private static loadFinishedTodoList(): void {
        TodoService.finishedTodoList = <Todo[]> StorageService.loadFromLocalStorage('finishedTodoList');
        if (TodoService.finishedTodoList == null) {
            TodoService.finishedTodoList = [];
        }
    }

    refreshTodoList(): void {
        DomElements.getInputFields().forEach(input => input.value = '');
        let templateFragments: string[] = [];
        TodoService.todoList.forEach(todoItem => templateFragments.push(Templates.getTodoTemplate(todoItem)));
        DomElements.todoListElement.innerHTML = templateFragments.join('');
        templateFragments = [];
        TodoService.finishedTodoList.forEach(finishedTodoItem => templateFragments.push(Templates.getTodoTemplate(finishedTodoItem)));
        DomElements.finishedTodoListElement.innerHTML = templateFragments.join('');
        this.initCreateTodoHandler();
        this.initFinishTodoHandler();
        this.initDeleteTodoHandler();
        this.attachSearchListener();
        this.initModalCancelBtn();
        UtilityService.attachShowVideoBtnHandler();
    }

    private initCreateTodoHandler(): void {
        const saveTodoBtn = document.querySelector('#save-todo-btn');
        let source = Observable.fromEvent(saveTodoBtn, 'click');
        source.subscribe(() => this.onAddNewTodo());
    }

    private onAddNewTodo(): void {
        TodoService.loadTodoListsFromLocalStorage();
        let inputFields: HTMLInputElement[] = DomElements.getInputFields();
        if (TodoService.isInputValid(inputFields)) {
            this.putToLocalStorage(inputFields);
            UtilityService.displayAlert('alert-success', 'Todo successfully created!');
        } else {
            UtilityService.displayAlert('alert-danger', 'There was something wrong with the inputs, todo not saved!');
        }
        this.refreshTodoList();
    }

    private static isInputValid(inputFields: HTMLInputElement[]): boolean {
        let isValid = false;
        inputFields.forEach(input => {
            if (input.value != '') {
                if (input.name == 'time') {
                    let regexp = new RegExp(/\d{2}:\d{2}/g);
                    isValid = regexp.test(input.value);
                }
            }
        });
        return isValid;
    }

    private putToLocalStorage(inputFields: HTMLInputElement[]) {
        const newTodoObj: Todo = this.createTodoObjectFromInput(inputFields);
        TodoService.todoList.unshift(newTodoObj);
        StorageService.deleteFromLocalStorage('todoList');
        StorageService.saveInLocalStorage('todoList', TodoService.todoList);
    }

    private createTodoObjectFromInput(inputFields: HTMLInputElement[]): Todo {
        let todoObj = {
            id: this.getNewTodoId(),
            finished: false,
        };
        inputFields.forEach(input => TodoService.fillTodoValuesWithInputValues(input, todoObj));
        return <Todo>todoObj;
    }

    private getNewTodoId(): number {
        let largestIdInTodoList = 0;
        TodoService.todoList.forEach(todo => {
            largestIdInTodoList = todo.id > largestIdInTodoList ? todo.id : largestIdInTodoList;
        });
        TodoService.finishedTodoList.forEach(todo => largestIdInTodoList = todo.id > largestIdInTodoList ? todo.id : largestIdInTodoList);
        return ++largestIdInTodoList;
    }

    private static fillTodoValuesWithInputValues(input, todoObj: { id: number; finished: boolean; }) {
        const youtubeEmbedRegexp = new RegExp(/https:\/\/www.youtube.com\/embed\/.{11}\?rel=0/g);
        if (input.name == 'url' && !youtubeEmbedRegexp.test(input.value)) {
            const embedLinkPrefix: string = 'https://www.youtube.com/embed/';
            const embedLinkPostFix: string = '?rel=0';
            let linkCode = input.value.split('=')[1];
            todoObj[input.name] = `${embedLinkPrefix}${linkCode}${embedLinkPostFix}`
        } else {
            todoObj[input.name] = input.value;
        }
    }

    private initFinishTodoHandler(): void {
        TodoService.todoList.forEach(todo => this.subscribeFinishTodoEvent(todo));
        TodoService.finishedTodoList.forEach(todo => this.subscribeFinishTodoEvent(todo));
    }

    private subscribeFinishTodoEvent(todo) {
        const todoCheckBox: HTMLInputElement = <HTMLInputElement>document.querySelector(`#checkbox-${todo.id}`);
        let source = Observable.fromEvent(todoCheckBox, 'change');
        source.subscribe(() => this.onFinishEventChange(todoCheckBox));
    }

    private onFinishEventChange(todoCheckBox: HTMLInputElement): void {
        const todoToMoveId: number = +todoCheckBox.id.split('-')[1];
        TodoService.loadTodoListsFromLocalStorage();
        let todoToMove: Todo = this.findInTodoListById(todoToMoveId);
        if (todoToMove == undefined) {
            todoToMove = this.findInFinishedTodoListById(todoToMoveId);
        }
        if (todoToMove != null && todoCheckBox.checked) {
            TodoService.todoList.splice(TodoService.todoList.indexOf(todoToMove), 1);
            todoToMove.finished = true;
            TodoService.finishedTodoList.unshift(todoToMove);
            UtilityService.displayAlert('alert-success', 'Well Done!!! You finished a todo. Todo moved to finished todos!');
        } else if (!todoCheckBox.checked) {
            TodoService.finishedTodoList.splice(TodoService.todoList.indexOf(todoToMove), 1);
            todoToMove.finished = false;
            TodoService.todoList.unshift(todoToMove);
            UtilityService.displayAlert('alert-warning', 'Oops !!! Looks like you remove a todo from finished todos. Todo moved to todo list!');
        }
        StorageService.deleteFromLocalStorage('todoList');
        StorageService.deleteFromLocalStorage('finishedTodoList');
        StorageService.saveInLocalStorage('todoList', TodoService.todoList);
        StorageService.saveInLocalStorage('finishedTodoList', TodoService.finishedTodoList);
        this.refreshTodoList();
    }

    private initDeleteTodoHandler(): void {
        TodoService.todoList.forEach(todo => this.subscribeDeleteTodoEvent(todo));
        TodoService.finishedTodoList.forEach(todo => this.subscribeDeleteTodoEvent(todo));
    }

    private subscribeDeleteTodoEvent(todo) {
        const deleteTodoBtn: HTMLElement = <HTMLElement>document.querySelector(`#delete-${todo.id}`);
        let source = Observable.fromEvent(deleteTodoBtn, 'click');
        source.subscribe(() => this.onDeleteTodo(deleteTodoBtn));
    }

    private onDeleteTodo(deleteTodoBtn: Element): void {
        const todoToDeleteId: number = +deleteTodoBtn.id.split('-')[1];
        let todoToDelete: Todo = this.findInTodoListById(todoToDeleteId);
        if (todoToDelete != null && todoToDelete != undefined) {
            TodoService.todoList.splice(TodoService.todoList.indexOf(todoToDelete), 1);
            StorageService.deleteFromLocalStorage('todoList');
            StorageService.saveInLocalStorage('todoList', TodoService.todoList);
        } else {
            TodoService.finishedTodoList.splice(TodoService.finishedTodoList.indexOf(todoToDelete), 1);
            StorageService.deleteFromLocalStorage('finishedTodoList');
            StorageService.saveInLocalStorage('finishedTodoList', TodoService.finishedTodoList);
        }
        this.refreshTodoList();
        UtilityService.displayAlert('alert-success', 'Todo successfully deleted!');
    }

    private attachSearchListener(): void {
        const searchInputElement: HTMLInputElement = <HTMLInputElement>document.querySelector('#search');
        let source = Observable.fromEvent(searchInputElement, 'keyup').map((i: any) => i.currentTarget.value).debounceTime(500);
        source.subscribe(keyword => this.filterTodosWithKeyWord(keyword));
    }

    private filterTodosWithKeyWord(keyword: string) {
        keyword = keyword.toLowerCase();
        TodoService.loadTodoListsFromLocalStorage();
        TodoService.todoList = UtilityService.filterListWithKeyword(keyword, TodoService.todoList);
        TodoService.finishedTodoList = UtilityService.filterListWithKeyword(keyword, TodoService.finishedTodoList);
        this.refreshTodoList();
    }

    private initModalCancelBtn(): void {
        const cancelBtn: HTMLElement = <HTMLElement>document.querySelector('#modal-cancel-btn');
        let source = Observable.fromEvent(cancelBtn, 'click');
        source.subscribe(() => TodoService.onCancelBtn());
    }

    private static onCancelBtn(): void {
        const inputFields: HTMLInputElement[] = DomElements.getInputFields();
        inputFields.forEach(input => input.value = '');
    }

    private findInTodoListById(id: number): Todo {
        return TodoService.todoList.find(todo => todo.id == id);
    }

    private findInFinishedTodoListById(id: number): Todo {
        return TodoService.finishedTodoList.find(todo => todo.id == id);
    }

    static loadTodoListsFromLocalStorage() {
        TodoService.loadTodoList();
        TodoService.loadFinishedTodoList();
    }
}
