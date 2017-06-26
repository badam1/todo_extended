import { Todo } from './todo';
import { Category } from './category';
import { Utils } from './util';
import { Observable } from 'rxjs/Observable';
/**
 * Created by bodansky-apertus on 2017.06.22..
 */

export class TodoX {

    private todoList: Todo[];
    private finishedTodoList: Todo[];
    private categoryList: Category[];
    private categoryListElement: HTMLElement;
    private categoryListModalElement: HTMLElement;
    private todoListElement: HTMLElement;
    private finishedTodoListElement: HTMLElement;

    private static editTodo: boolean = false;

    constructor() {
        this.todoList = [];
        this.categoryList = [];
        this.categoryListElement = <HTMLElement>document.querySelector('#category-list');
        this.categoryListModalElement = <HTMLElement> document.querySelector("#todo-category");
        this.todoListElement = <HTMLElement>document.querySelector('.todo-list');
        this.finishedTodoListElement = <HTMLElement>document.querySelector('.finished-todo-list');
        this.onInit();
    }

    private onInit(): void {
        this.loadTodoList();
        this.loadFinishedTodoList();
        this.loadCategoryList();
        this.refreshTodoList();
        this.refreshCategories();
        Utils.attachBrandLogoColorChangeHandler();
        Utils.attachSearchBtnChangeHandler();
    }

    private loadTodoList(): void {
        this.todoList = <Todo[]> Utils.loadFromLocalStorage('todoList');
        if (this.todoList == null) {
            this.todoList = [];
        }
    }

    private loadFinishedTodoList(): void {
        this.finishedTodoList = <Todo[]> Utils.loadFromLocalStorage('finishedTodoList');
        if (this.finishedTodoList == null) {
            this.finishedTodoList = [];
        }
    }

    private loadCategoryList(): void {
        this.categoryList = <Category[]> Utils.loadFromLocalStorage('categoryList');
        if (this.categoryList == null) {
            this.categoryList = [];
        }
    }

    private refreshTodoList(): void {
        let templateFragments: string[] = [];
        this.todoList.forEach(todoItem => templateFragments.push(TodoX.getTodoTemplate(todoItem)));
        this.todoListElement.innerHTML = templateFragments.join('');
        templateFragments = [];
        this.finishedTodoList.forEach(finishedTodoItem => templateFragments.push(TodoX.getTodoTemplate(finishedTodoItem)));
        this.finishedTodoListElement.innerHTML = templateFragments.join('');
        this.initDeleteTodoHandler();
        this.initFinishTodoHandler();
        this.initCreateTodoHandler();
        this.initEditTodoHandler();
        this.attachSearchListener();
        this.initModalCancelBtn();
        Utils.attachShowVideoBtnHandler();
        Utils.attachShowMoreTodoBtnHandler();
        Utils.attachShowMoreFinishedTodoBtnHandler();
        TodoX.editTodo = false;
    }

    private static getTodoTemplate(todoItem): string {
        return `<div class="container">
                        <div class="card w-100 ${todoItem.cssClasses.cardBackground}">
                            <div class="card-block ${todoItem.cssClasses.cardBackground}">
                                <h3 class="card-title">${todoItem.title}</h3>
                                <h6 class="card-header">${todoItem.category.name}</h6>
                                <br/>
                                <p class="card-text">${todoItem.description}</p>
                                <p class="card-text">Link: <a target="_blank" href="${todoItem.url}">${todoItem.linkName}</a></p>
                                <br/>
                                <button data-id="${todoItem.id}" class="btn btn-primary show-video-btn">Show video</button>
                                <br/><br/>
                                <div id="video-embed-${todoItem.id}" class="display-none embed-responsive embed-responsive-4by3">
                                 <iframe width="420" height="315" class="embed-responsive-item" src="${todoItem.url}" allowfullscreen="allowfullscreen"></iframe>
                                    </div>
                                <br/>
                                <div class="checkbox">
                                    <input hidden="hidden" id="checkbox-${todoItem.id}" type="checkbox" ${todoItem.finished ? 'checked=checked' : ''}>
                                    <label for="checkbox-${todoItem.id}">&nbsp;&nbsp;Finished?</label>
                                </div>
                                <p class="card-text bottom-right-corner">${todoItem.time}</p>
                                <i id="delete-${todoItem.id}" class="fa fa-trash top-right-corner"></i>
                                <i id="edit-${todoItem.id}" class="fa fa-edit todo-edit"></i>
                            </div>
                        </div>
                    </div>`;
    }

    private refreshCategories(): void {
        let templateFragments: string[] = [];
        this.categoryList.forEach(category => templateFragments.push(TodoX.getCategoryTemplate(category)));
        this.categoryListElement.innerHTML = templateFragments.join('');
        templateFragments = TodoX.completeCategoryList();
        this.categoryListElement.innerHTML += templateFragments.join('');
        this.refreshCategoriesModal();
        this.initDeleteCategoryHandler();
        this.initCreateCategoryHandler();
        this.initCategorySwitchHandler();
    }

    private refreshCategoriesModal(): void {
        this.categoryListModalElement.innerHTML = `<option readonly="readonly">Please choose a category</option>`;
        let templateFragments: string[] = [];
        this.categoryList.forEach(category => templateFragments.push(TodoX.getCategoryTemplateOnModal(category)));
        this.categoryListModalElement.innerHTML += templateFragments.join('');
    }

    private static getCategoryTemplate(category: Category): string {
        return `<a id="category-${category.name}" class="dropdown-item" href="#">${category.name}</a>`;
    }

    private static getCategoryTemplateOnModal(category: Category): string {
        return `<option value="${category.name}">${category.name}</option>`
    }

    private static completeCategoryList(): string[] {
        return [`<hr class="dropdown-divider"/>
                    <a id="category-All" class="dropdown-item" href="#">All<a>
                        <hr class="dropdown-divider"/>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#addNewCategoryModal">Add
                                    new category</a>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#deleteCategoryModal">Delete
                                    category</a>`];
    }

    private initCreateTodoHandler(): void {
        const saveTodoBtn = document.querySelector('#save-todo-btn');
        if (TodoX.editTodo) {
            saveTodoBtn.addEventListener('click', this.onSaveEditedTodo.bind(this, saveTodoBtn));
        } else {
            saveTodoBtn.addEventListener('click', this.onAddNewTodo.bind(this, saveTodoBtn));
        }
    }

    private onAddNewTodo(): void {
        this.loadTodoListsFromLocalStorage();
        let inputFields: HTMLInputElement[] = TodoX.getInputFields();
        if (TodoX.isInputValid(inputFields)) {
            this.putToLocalStorage(inputFields);
            Utils.displayAlert('alert-success', 'Todo successfully created!');
        } else {
            Utils.displayAlert('alert-danger', 'There was something wrong with the inputs, todo not saved!');
        }
        inputFields.forEach(input => input.value = '');
        this.refreshTodoList();
    }

    private putToLocalStorage(inputFields: HTMLInputElement[]) {
        const newTodoObj: Todo = this.createTodoObjectFromInput(inputFields);
        this.todoList.unshift(newTodoObj);
        Utils.deleteFromLocalStorage('todoList');
        Utils.saveInLocalStorage('todoList', this.todoList);
    }

    private static getInputFields(): HTMLInputElement[] {
        const newTodoTitle: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-title");
        const newTodoCategory: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-category");
        const newTodoLinkName: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-link-name");
        const newTodoUrl: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-url");
        const newTodoDescription: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-desc");
        const newTodoTime: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-time");
        return [newTodoTitle, newTodoCategory, newTodoLinkName, newTodoUrl, newTodoDescription, newTodoTime];
    }

    private static isInputValid(inputFields: HTMLInputElement[]): boolean {
        let isValid = false;
        inputFields.forEach(input => {
            if (input.name == 'time') {
                let regexp = new RegExp(/\d{2}:\d{2}/g);
                isValid = regexp.test(input.value);
            }
            if (input.value == '') {
                isValid = false;
            }
        });
        return isValid;
    }

    private createTodoObjectFromInput(inputFields: HTMLInputElement[]): Todo {
        let todoObj = {
            id: this.getNewTodoId(),
            finished: false,
            cssClasses: {cardBackground: 'todo-white'}
        };
        inputFields.forEach(input => {
            TodoX.fillTodoValuesWithInputValues(input, todoObj);
        });
        return <Todo>todoObj;
    }

    private static fillTodoValuesWithInputValues(input, todoObj: { id: number; finished: boolean; cssClasses: { cardBackground: string } }) {
        const youtubeEmbedRegexp = new RegExp(/https:\/\/www.youtube.com\/embed\/.{11}\?rel=0/g);
        if (input.name == 'category') {
            todoObj['category'] = {name: input.value};
        } else if (input.name == 'url' && !youtubeEmbedRegexp.test(input.value)) {
            const embedLinkPrefix: string = 'https://www.youtube.com/embed/';
            const embedLinkPostFix: string = '?rel=0';
            let linkCode = input.value.split('=')[1];
            todoObj[input.name] = `${embedLinkPrefix}${linkCode}${embedLinkPostFix}`
        } else {
            todoObj[input.name] = input.value;
        }
    }

    private getNewTodoId(): number {
        let largestIdInTodoList = 0;
        this.todoList.forEach(todo => {
            largestIdInTodoList = todo.id > largestIdInTodoList ? todo.id : largestIdInTodoList;
        });
        this.finishedTodoList.forEach(todo => {
            largestIdInTodoList = todo.id > largestIdInTodoList ? todo.id : largestIdInTodoList;
        });
        return ++largestIdInTodoList;
    }

    private initEditTodoHandler(): void {
        this.todoList.forEach(todo => {
            const editBtn = document.querySelector(`#edit-${todo.id}`);
            editBtn.addEventListener('click', this.onEditTodo.bind(this, editBtn));
        });
        this.finishedTodoList.forEach(todo => {
            const editBtn = document.querySelector(`#edit-${todo.id}`);
            editBtn.addEventListener('click', this.onEditTodo.bind(this, editBtn));
        });
    }

    private onEditTodo(editBtn: Element): void {
        TodoX.editTodo = true;
        this.initCreateTodoHandler();
        const todoToEditId: number = +editBtn.id.split('-')[1];
        const todoToEdit: Todo = this.findTodoById(todoToEditId);
        const inputFields: HTMLInputElement[] = TodoX.getInputFields();
        const modalLabel: HTMLElement = <HTMLElement>document.querySelector('#addNewTodoModalLabel');
        modalLabel.innerText = 'Edit todo';
        inputFields.forEach(input => {
            if (input.name == 'category') {
                input.value = todoToEdit.category.name;
            } else {
                input.value = todoToEdit[input.name];
            }
        });
        const modalShowBtn: HTMLElement = <HTMLElement>document.querySelector('#addTodoModal');
        modalShowBtn.click();
    }

    private onSaveEditedTodo() : void {

    }
    private initModalCancelBtn(): void {
        const cancelBtn: HTMLElement = <HTMLElement>document.querySelector('#modal-cancel-btn');
        cancelBtn.addEventListener('click', TodoX.onCancelBtn.bind(this, cancelBtn));
    }

    private static onCancelBtn(): void {
        const inputFields: HTMLInputElement[] = TodoX.getInputFields();
        inputFields.forEach(input => input.value = '');
    }

    private initDeleteTodoHandler(): void {
        this.todoList.forEach(todo => {
            const deleteTodoBtn: HTMLElement = <HTMLElement>document.querySelector(`#delete-${todo.id}`);
            deleteTodoBtn.addEventListener('click', this.onDeleteTodo.bind(this, deleteTodoBtn));
        });
        this.finishedTodoList.forEach(todo => {
            const deleteTodoBtn: HTMLElement = <HTMLElement>document.querySelector(`#delete-${todo.id}`);
            deleteTodoBtn.addEventListener('click', this.onDeleteTodo.bind(this, deleteTodoBtn));
        });
    }

    private onDeleteTodo(deleteTodoBtn: Element): void {
        const todoToDeleteId: number = +deleteTodoBtn.id.split('-')[1];
        let todoToDelete: Todo = this.findInTodoListById(todoToDeleteId);
        if (todoToDelete != null && todoToDelete != undefined) {
            this.todoList.splice(this.todoList.indexOf(todoToDelete), 1);
            Utils.deleteFromLocalStorage('todoList');
            Utils.saveInLocalStorage('todoList', this.todoList);
        } else {
            this.finishedTodoList.splice(this.finishedTodoList.indexOf(todoToDelete), 1);
            Utils.deleteFromLocalStorage('finishedTodoList');
            Utils.saveInLocalStorage('finishedTodoList', this.finishedTodoList);
        }
        this.refreshTodoList();
        Utils.displayAlert('alert-success', 'Todo successfully deleted!');
    }

    private findInTodoListById(id: number): Todo {
        return this.todoList.find(todo => todo.id == id);
    }

    private findInFinishedTodoListById(id: number): Todo {
        return this.finishedTodoList.find(todo => todo.id == id);
    }

    private findTodoById(id: number): Todo {
        let tempTodo = this.findInTodoListById(id);
        let tempFinTodo = this.findInFinishedTodoListById(id);
        if (tempTodo != null) {
            return tempTodo;
        } else {
            return tempFinTodo;
        }
    }

    private initFinishTodoHandler(): void {
        this.todoList.forEach(todo => {
            const todoCheckBox: HTMLInputElement = <HTMLInputElement>document.querySelector(`#checkbox-${todo.id}`);
            todoCheckBox.addEventListener('change', this.onFinishEventChange.bind(this, todoCheckBox));
        });
        this.finishedTodoList.forEach(todo => {
            const todoCheckBox: HTMLInputElement = <HTMLInputElement>document.querySelector(`#checkbox-${todo.id}`);
            todoCheckBox.addEventListener('change', this.onFinishEventChange.bind(this, todoCheckBox));
        });
    }

    private onFinishEventChange(todoCheckBox: HTMLInputElement): void {
        const todoToMoveId: number = +todoCheckBox.id.split('-')[1];
        this.loadTodoListsFromLocalStorage();
        let todoToMove: Todo = this.findInTodoListById(todoToMoveId);
        if (todoToMove == undefined) {
            todoToMove = this.findInFinishedTodoListById(todoToMoveId);
        }
        if (todoToMove != null && todoCheckBox.checked) {
            this.todoList.splice(this.todoList.indexOf(todoToMove), 1);
            todoToMove.cssClasses.cardBackground = 'todo-green';
            todoToMove.finished = true;
            this.finishedTodoList.unshift(todoToMove);
            Utils.displayAlert('alert-success', 'Well Done!!! You finished a todo. Todo moved to finished todos!');
        } else if (!todoCheckBox.checked) {
            this.finishedTodoList.splice(this.todoList.indexOf(todoToMove), 1);
            todoToMove.cssClasses.cardBackground = 'todo-white';
            todoToMove.finished = false;
            this.todoList.unshift(todoToMove);
            Utils.displayAlert('alert-warning', 'Oops !!! Looks like you remove a todo from finished todos. Todo moved to todo list!');
        }
        Utils.deleteFromLocalStorage('todoList');
        Utils.deleteFromLocalStorage('finishedTodoList');
        Utils.saveInLocalStorage('todoList', this.todoList);
        Utils.saveInLocalStorage('finishedTodoList', this.finishedTodoList);
        this.refreshTodoList();
    }

    private initCreateCategoryHandler(): void {
        const saveCategoryBtn = document.querySelector('#save-category-btn');
        saveCategoryBtn.addEventListener('click', this.onAddNewCategory.bind(this, saveCategoryBtn));
    }

    private onAddNewCategory(): void {
        let inputField: HTMLInputElement = <HTMLInputElement>document.querySelector("#category-name");
        if (inputField.value != '') {
            const newCategoryObj: Category = {name: inputField.value};
            this.categoryList.unshift(newCategoryObj);
            inputField.value = '';
            Utils.deleteFromLocalStorage('categoryList');
            Utils.saveInLocalStorage('categoryList', this.categoryList);
            this.refreshCategories();
            Utils.displayAlert('alert-success', 'Category successfully created!')
        } else {
            Utils.displayAlert('alert-danger', 'You must give a name to add new category!');
        }
    }

    private initDeleteCategoryHandler(): void {
        const deleteCategoryBtn = document.querySelector("#delete-category-btn");
        deleteCategoryBtn.addEventListener('click', this.onDeleteCategory.bind(this, deleteCategoryBtn));
    }

    private onDeleteCategory(): void {
        let inputField: HTMLInputElement = <HTMLInputElement>document.querySelector("#delete-category-name");
        let index: number = this.categoryList.findIndex(category => category.name == inputField.value);
        if (inputField.value != '' && index > -1) {
            if (this.isCategoryNotUsed(inputField.value)) {
                this.categoryList.splice(index, 1);
                Utils.deleteFromLocalStorage('categoryList');
                Utils.saveInLocalStorage('categoryList', this.categoryList);
                this.refreshCategories();
                Utils.displayAlert('alert-success', 'Category successfully deleted!');
            } else {
                Utils.displayAlert('alert-danger', 'Can\'t delete category while you use it on an existed todo');
            }
        } else {
            Utils.displayAlert('alert-danger', 'Category not exists!');
        }
        inputField.value = '';
    }

    private isCategoryNotUsed(categoryName: string): boolean {
        let tempTodoList = this.todoList.filter(todo => todo.category.name == categoryName);
        let tempFinishedTodoList = this.finishedTodoList.filter(todo => todo.category.name == categoryName);
        return tempTodoList.length == 0 && tempFinishedTodoList.length == 0;
    }

    private initCategorySwitchHandler(): void {
        this.categoryList.forEach(category => {
            const categoryBtn: HTMLElement = <HTMLElement>document.querySelector(`#category-${category.name}`);
            categoryBtn.addEventListener('click', this.onSwitchCategory.bind(this, categoryBtn));
        });
        const categoryAllBtn: HTMLElement = <HTMLElement>document.querySelector('#category-All');
        categoryAllBtn.addEventListener('click', this.onSwitchCategory.bind(this, categoryAllBtn));
    }

    private onSwitchCategory(categoryBtn: HTMLElement): void {
        this.loadTodoListsFromLocalStorage();
        let categoryName: string = categoryBtn.id.split('-')[1];
        if (categoryName != 'All') {
            this.todoList = this.todoList.filter(todo => todo.category.name == categoryName);
            this.finishedTodoList = this.finishedTodoList.filter(todo => todo.category.name == categoryName);
        } else {
            this.loadTodoListsFromLocalStorage();
        }
        this.refreshCategories();
        this.refreshTodoList();
        Utils.displayAlert('alert-success', `Category switched to ${categoryName}!`);
    }

    private attachSearchListener(): void {
        const searchInputElement: HTMLInputElement = <HTMLInputElement>document.querySelector('#search');
        let source = Observable.fromEvent(searchInputElement, 'keyup').map((i: any) => i.currentTarget.value).debounceTime(500);
        source.subscribe(keyword => this.filterTodosWithKeyWord(keyword));
    }

    private filterTodosWithKeyWord(keyword: string) {
        keyword = keyword.toLowerCase();
        this.loadTodoListsFromLocalStorage();
        this.filterTodoListWithKeyword(keyword);
        this.filterFinishedTodoListWithKeyword(keyword);
        this.refreshTodoList();
    }

    private filterTodoListWithKeyword(keyWord: string): void {
        let resultTodoList: Todo[] = [];
        this.todoList.filter(todo => {
            if (todo.title.toLowerCase().includes(keyWord)
                || todo.description.toLowerCase().includes(keyWord)
                || todo.category.name.toLowerCase().includes(keyWord)) {
                resultTodoList.push(todo);
            }
        });
        this.todoList = resultTodoList;
    }

    private filterFinishedTodoListWithKeyword(keyWord: string): void {
        let resultFinishedTodoList: Todo[] = [];
        this.finishedTodoList.filter(todo => {
            if (todo.title.toLowerCase().includes(keyWord)
                || todo.description.toLowerCase().includes(keyWord)
                || todo.category.name.toLowerCase().includes(keyWord)) {
                resultFinishedTodoList.push(todo);
            }
        });
        this.finishedTodoList = resultFinishedTodoList;
    }

    private loadTodoListsFromLocalStorage(): void {
        this.todoList = Utils.loadFromLocalStorage('todoList');
        this.finishedTodoList = Utils.loadFromLocalStorage('finishedTodoList');
    }
}
new TodoX();
