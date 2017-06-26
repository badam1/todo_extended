import { Templates } from '../templates/templates';
import { DomElements } from '../domelements/dom-elements';
import { Observable } from 'rxjs/Observable';
import { StorageService } from './storage-service';
import { UtilityService } from './utility-service';
import { TodoService } from './todo-service';


export class CategoryService {

    private static categoryList: string[] = [];
    private todoService:TodoService;

    constructor(todoService:TodoService) {
        this.todoService = todoService;
        this.onInit();
    }

    private onInit() {
        CategoryService.loadCategories();
        this.refreshCategories();
    }

    private static loadCategories() {
        CategoryService.categoryList = StorageService.loadFromLocalStorage('categoryList');
        if (CategoryService.categoryList == null) {
            CategoryService.categoryList = [];
        }
    }

    private refreshCategories(): void {
        let templateFragments: string[] = [];
        CategoryService.categoryList.forEach(category => templateFragments.push(Templates.getCategoryTemplate(category)));
        DomElements.categoryListElement.innerHTML = templateFragments.join('');
        templateFragments = Templates.completeCategoryList();
        DomElements.categoryListElement.innerHTML += templateFragments.join('');
        this.refreshCategoriesModal();
        this.initDeleteCategoryHandler();
        this.initCreateCategoryHandler();
        this.initCategorySwitchHandler();
    }

    private refreshCategoriesModal(): void {
        DomElements.categoryListModalElement.innerHTML = `<option readonly="readonly">Please choose a category</option>`;
        let templateFragments: string[] = [];
        CategoryService.categoryList.forEach(category => templateFragments.push(Templates.getCategoryTemplateOnModal(category)));
        DomElements.categoryListModalElement.innerHTML += templateFragments.join('');
    }

    private initCreateCategoryHandler(): void {
        let source = Observable.fromEvent(DomElements.saveCategoryBtn, 'click');
        source.subscribe(() => this.onAddNewCategory());
    }

    private onAddNewCategory(): void {
        let inputField: HTMLInputElement = DomElements.inputField;
        if (inputField.value != '') {
            const newCategory: string = inputField.value;
            CategoryService.categoryList.unshift(newCategory);
            inputField.value = '';
            StorageService.deleteFromLocalStorage('categoryList');
            StorageService.saveInLocalStorage('categoryList', CategoryService.categoryList);
            this.refreshCategories();
            UtilityService.displayAlert('alert-success', 'Category successfully created!')
        } else {
            UtilityService.displayAlert('alert-danger', 'You must give a name to add new category!');
        }
    }

    private initDeleteCategoryHandler(): void {
        let source = Observable.fromEvent(DomElements.deleteCategoryBtn, 'click');
        source.subscribe(() => this.onDeleteCategory());
    }

    private onDeleteCategory(): void {
        let inputField: HTMLInputElement = DomElements.deleteCategoryNameInput;
        let index: number = CategoryService.categoryList.findIndex(category => category == inputField.value);
        if (inputField.value != '' && index > -1) {
            if (this.isCategoryNotUsed(inputField.value)) {
                CategoryService.categoryList.splice(index, 1);
                StorageService.deleteFromLocalStorage('categoryList');
                StorageService.saveInLocalStorage('categoryList', CategoryService.categoryList);
                this.refreshCategories();
                UtilityService.displayAlert('alert-success', 'Category successfully deleted!');
            } else {
                UtilityService.displayAlert('alert-danger', 'Can\'t delete category while you use it on an existed todo');
            }
        } else {
            UtilityService.displayAlert('alert-danger', 'Category not exists!');
        }
        inputField.value = '';
    }

    private isCategoryNotUsed(categoryName: string): boolean {
        let tempTodoList = TodoService.todoList.filter(todo => todo.category == categoryName);
        let tempFinishedTodoList = TodoService.finishedTodoList.filter(todo => todo.category == categoryName);
        return tempTodoList.length == 0 && tempFinishedTodoList.length == 0;
    }

    private initCategorySwitchHandler(): void {
        CategoryService.categoryList.forEach(category => {
            const categoryBtn: HTMLElement = <HTMLElement>document.querySelector(`#category-${category}`);
            let source = Observable.fromEvent(categoryBtn, 'click');
            source.subscribe(() => this.onSwitchCategory(categoryBtn));
        });
        const categoryAllBtn: HTMLElement = <HTMLElement>document.querySelector('#category-all');
        let source = Observable.fromEvent(categoryAllBtn, 'click');
        source.subscribe(() => this.onSwitchCategory(categoryAllBtn));
    }

    private onSwitchCategory(categoryBtn: HTMLElement): void {
        TodoService.loadTodoListsFromLocalStorage();
        let categoryName: string = categoryBtn.id.split('-')[1];
        if (categoryName != 'all') {
            TodoService.todoList = TodoService.todoList.filter(todo => todo.category == categoryName);
            TodoService.finishedTodoList = TodoService.finishedTodoList.filter(todo => todo.category == categoryName);
        }
        this.todoService.refreshTodoList();
        this.refreshCategories();
        UtilityService.displayAlert('alert-success', `Category switched to ${categoryName}!`);
    }
}
