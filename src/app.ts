import { Todo } from './todo';
import { Category } from './category';
/**
 * Created by bodansky-apertus on 2017.06.22..
 */

class TodoX {

    private todoList: Todo[];
    private finishedTodoList: Todo[];
    private categoryList: Category[];
    private categoryListElement: HTMLElement;
    private todoListElement: HTMLElement;
    private finishedTodoListElement: HTMLElement;

    constructor() {
        this.todoList = [];
        this.categoryList = [];
        this.categoryListElement = <HTMLElement>document.querySelector('#category-list');
        this.todoListElement = <HTMLElement>document.querySelector('.todo-list');
        this.finishedTodoListElement = <HTMLElement>document.querySelector('.finished-todo-list');
        this.onInit();
    }

    private onInit(): void {
        this.loadMockTodos();
        this.loadMockFinishedTodos();
        this.loadMockCategories();
        this.refreshTodoList();
        this.refreshCategories();
    }

    private loadMockTodos(): void {
        this.todoList = [
            {
                id: 1,
                title: 'Todo 1',
                url: 'dummyurl1.com',
                linkName: 'link1 name',
                description: 'Todo description 1',
                time: '01:30:00',
                finished: false,
                cssClasses: {
                    cardBackground: 'todo-white'
                },
                category: {
                    name: 'Todo category1'
                }
            },
            {
                id: 2,
                title: 'Todo 2',
                url: 'dummyurl2.com',
                linkName: 'link2 name',
                description: 'Todo description 2',
                time: '10:30:00',
                finished: false,
                cssClasses: {
                    cardBackground: 'todo-white'
                },
                category: {
                    name: 'Todo category2'
                }
            }
        ];
    }

    private loadMockFinishedTodos(): void {
        this.finishedTodoList = [
            {
                id: 3,
                title: 'Todo 3',
                url: 'dummyurl3.com',
                linkName: 'link3 name',
                description: 'Todo description 3',
                time: '09:30:00',
                finished: true,
                cssClasses: {
                    cardBackground: 'todo-green'
                },
                category: {
                    name: 'Todo category3'
                }
            },
            {
                id: 2,
                title: 'Todo 4',
                url: 'dummyurl4.com',
                linkName: 'link4 name',
                description: 'Todo description 4',
                time: '07:30:00',
                finished: true,
                cssClasses: {
                    cardBackground: 'todo-green'
                },
                category: {
                    name: 'Todo category2'
                }
            }
        ];
    }

    private loadMockCategories(): void {
        this.categoryList = [{
            name: 'Category 1'
        },
            {
                name: 'Category 2'
            },
            {
                name: 'Category 3'
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

    private static getCategoryTemplate(category): string {
        return `<a class="dropdown-item" href="#">${category.name}</a>`;
    }

    private static completeCategoryList() {
        return [`<hr class="dropdown-divider"/>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#addNewCategoryModal">Add
                                    new category</a>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#deleteCategoryModal">Delete
                                    category</a>`];
    }
}
new TodoX();