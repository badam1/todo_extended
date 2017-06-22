import { Todo } from './todo';
import { Category } from './category';
/**
 * Created by bodansky-apertus on 2017.06.22..
 */

class TodoX {

    private static counter = 4;

    private todoList: Todo[];
    private finishedTodoList: Todo[];
    private categoryList: Category[];
    private categoryListElement: HTMLElement;
    private categoryListModalElement: HTMLElement;
    private todoListElement: HTMLElement;
    private finishedTodoListElement: HTMLElement;

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
        this.loadMockTodos();
        this.loadMockFinishedTodos();
        this.loadMockCategories();
        this.initCreateTodoHandler();
        this.refreshTodoList();
        this.refreshCategories();
        this.refreshCategoriesModal();
    }

    private loadMockTodos(): void {
        this.todoList = [
            {
                id: 1,
                title: 'Can\'t fight this feeling',
                url: '//www.youtube.com/embed/zpOULjyy-n8?rel=0',
                linkName: 'Reo Speedwagon Can\'t fight this feeling',
                description: 'Listen this song...',
                time: '01:30:00',
                finished: false,
                cssClasses: {
                    cardBackground: 'todo-white'
                },
                category: {
                    name: 'Rock'
                }
            },
            {
                id: 2,
                title: 'Gangnam style',
                url: 'https://www.youtube.com/embed/9bZkp7q19f0?rel=0',
                linkName: 'PSY Gangnam style',
                description: 'Listen this song...',
                time: '10:30:00',
                finished: false,
                cssClasses: {
                    cardBackground: 'todo-white'
                },
                category: {
                    name: 'Idiot'
                }
            }
        ];
    }

    private loadMockFinishedTodos(): void {
        this.finishedTodoList = [
            {
                id: 3,
                title: 'Winds of changes',
                url: 'https://www.youtube.com/embed/n4RjJKxsamQ?rel=0',
                linkName: 'Scorpion winds of changes',
                description: 'Listen this song...',
                time: '09:30:00',
                finished: true,
                cssClasses: {
                    cardBackground: 'todo-green'
                },
                category: {
                    name: 'Rock'
                }
            },
            {
                id: 2,
                title: 'Get hurts',
                url: 'https://www.youtube.com/embed/QV9uGjhx5vw?rel=0',
                linkName: 'Gaslight anthem Get hurts',
                description: 'Listen this song...',
                time: '07:30:00',
                finished: true,
                cssClasses: {
                    cardBackground: 'todo-green'
                },
                category: {
                    name: 'Rock'
                }
            }
        ];
    }

    private loadMockCategories(): void {
        this.categoryList = [{
            name: 'Rock'
        },
            {
                name: 'Idiot'
            },
            {
                name: 'Hip-hop'
            }];
    }

    private refreshTodoList(): void {
        let templateFragments: string[] = [];
        this.todoList.forEach(todoItem => templateFragments.push(TodoX.getTodoTemplate(todoItem)));
        this.todoListElement.innerHTML = templateFragments.join('');
        templateFragments = [];
        this.finishedTodoList.forEach(finishedTodoItem => templateFragments.push(TodoX.getTodoTemplate(finishedTodoItem)));
        this.finishedTodoListElement.innerHTML = templateFragments.join('');
    }

    private static getTodoTemplate(todoItem): string {
        return `<div class="container">
                        <div class="card w-100 ${todoItem.cssClasses.cardBackground}">
                            <div class="card-block">
                                <h3 class="card-title">${todoItem.title}</h3>
                                <h6 class="card-header">${todoItem.category.name}</h6>
                                <br/>
                                <p class="card-text">${todoItem.description}</p>
                                <p class="card-text">Link: <a target="_blank" href="${todoItem.url}">${todoItem.linkName}</a></p>
                                <div class="embed-responsive embed-responsive-4by3">
                                    <iframe width="420" height="315" class="embed-responsive-item" src="${todoItem.url}" allowfullscreen="allowfullscreen"></iframe>
                                </div>
                                <br/>
                                <div class="checkbox">
                                    <input hidden="hidden" id="todo1" type="checkbox" ${todoItem.finished ? 'checked=checked' : ''}>
                                    <label for="todo1">&nbsp;&nbsp;Finished?</label>
                                </div>
                                <p class="card-text bottom-right-corner">${todoItem.time}</p>
                                <i class="fa fa-close top-right-corner"></i>
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
    }

    private refreshCategoriesModal(): void {
        let templateFragments: string[] = [];
        this.categoryList.forEach(category => templateFragments.push(TodoX.getCategoryTemplateOnModal(category)));
        this.categoryListModalElement.innerHTML += templateFragments.join('');
    }

    private static getCategoryTemplate(category: Category): string {
        return `<a class="dropdown-item" href="#">${category.name}</a>`;
    }

    private static getCategoryTemplateOnModal(category: Category): string {
        return `<option value="${category.name}">${category.name}</option>`
    }

    private static completeCategoryList(): string[] {
        return [`<hr class="dropdown-divider"/>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#addNewCategoryModal">Add
                                    new category</a>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#deleteCategoryModal">Delete
                                    category</a>`];
    }

    private initCreateTodoHandler(): void {
        const saveTodoBtn = <HTMLInputElement> document.querySelector('#save-todo-btn');
        saveTodoBtn.addEventListener('click', this.onAddNewTodo.bind(this, saveTodoBtn));
    }

    private onAddNewTodo(): void {
        const newTodoTitle: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-title");
        const newTodoCategory: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-category");
        const newTodoLinkName: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-link-name");
        const newTodoUrl: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-url");
        const newTodoDescription: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-desc");
        const newTodoTime: HTMLInputElement = <HTMLInputElement> document.querySelector("#todo-time");
        let inputFields: HTMLInputElement[] = [newTodoTitle, newTodoCategory, newTodoLinkName, newTodoUrl, newTodoDescription, newTodoTime];
        const newTodoObj: Todo = TodoX.createTodoObjectFromInput(inputFields);
        this.todoList.unshift(newTodoObj);
        inputFields.forEach(input => input.value = '');
        this.refreshTodoList();
    }

    private static createTodoObjectFromInput(inputFields: HTMLInputElement[]): Todo {
        let todoObj = {
            id: TodoX.counter++,
            finished: false,
            cssClasses: {cardBackground: 'todo-white'}
        };
        inputFields.forEach(input => {
            if (input.name == 'category') {
                todoObj['category'] = {name: input.value};
            } else {
                todoObj[input.name] = input.value;
            }
        });
        return <Todo>todoObj;
    }

    private displayAlert(type): void {

    }
}
new TodoX();