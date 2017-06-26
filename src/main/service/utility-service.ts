import { Observable } from 'rxjs';
import { Todo } from '../domain/todo-interface';
/**
 * Created by bodansky-apertus on 2017.06.23..
 */

export class UtilityService {

    static fadeIn(element: HTMLElement) {
        element.style.opacity = '0';
        const tick = (): void => {
            element.style.opacity = `${+element.style.opacity + 0.02}`;
            if (+element.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 4)
            }
        };
        tick();
    }

    static fadeOut(element: HTMLElement) {
        element.style.opacity = '1';
        const tick = (): void => {
            element.style.opacity = `${+element.style.opacity - 0.02}`;
            if (+element.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 4))
            }
        };
        tick();
    }

    static filterListWithKeyword(keyWord: string, list: Todo[]): Todo[] {
        let resultList: Todo[] = [];
        list.filter(todo => {
            if (todo.title.toLowerCase().includes(keyWord)
                || todo.description.toLowerCase().includes(keyWord)
                || todo.category.toLowerCase().includes(keyWord)) {
                resultList.push(todo);
            }
        });
        return resultList;
    }

    static displayAlert(className: string, message: string): void {
        const alert: HTMLElement = <HTMLElement>document.querySelector('#alert');
        alert.className = `alert ${className}`;
        alert.innerHTML = `<strong>${message}</strong>`;
        UtilityService.fadeIn(alert);
        setTimeout(function () {
            UtilityService.fadeOut(alert);
        }, 5000);
    }

    static attachBrandLogoColorChangeHandler() {
        const brandNameElement: HTMLElement = <HTMLElement>document.querySelector('.navbar-brand');
        const brandLogoElement: HTMLImageElement = <HTMLImageElement>document.querySelector('#todo-logo-g');
        Observable.fromEvent(brandNameElement, 'mouseover').subscribe(() => {
            brandLogoElement.src = 'src/resources/img/todo-logo-white.png';
        });
        Observable.fromEvent(brandNameElement, 'mouseleave').subscribe(() => {
            brandLogoElement.src = 'src/resources/img/todo-logo.png';
        });
    }

    static attachSearchBtnChangeHandler() {
        const searchBtn: HTMLElement = <HTMLElement>document.querySelector('#search-btn');
        const searchInputElement: HTMLInputElement = <HTMLInputElement>document.querySelector('#search');
        Observable.fromEvent(searchInputElement, 'focusin').subscribe(() => {
            searchBtn.className = 'btn btn-success my-2 my-sm-0';
            searchBtn.textContent = 'Searching...'
        });
        Observable.fromEvent(searchInputElement, 'focusout').subscribe(() => {
            searchBtn.className = 'btn btn-outline-success my-2 my-sm-0';
            searchBtn.textContent = 'Search'
        });
    }

    static attachShowVideoBtnHandler() {
        const showVideoButtons: HTMLCollection = <HTMLCollection>document.querySelectorAll('.show-video-btn');
        let todoVideoElement: HTMLElement;
        Observable.fromEvent(showVideoButtons, 'click').subscribe((e: Event) => {
            const showVideoBtn: HTMLElement = <HTMLElement>e.srcElement;
            if (showVideoBtn.innerText == 'Show video') {
                const todoId: number = +showVideoBtn.dataset.id;
                todoVideoElement = <HTMLElement>document.querySelector(`#video-embed-${todoId}`);
                todoVideoElement.className = 'embed-responsive embed-responsive-4by3';
                showVideoBtn.innerText = 'Hide video';
                showVideoBtn.className = 'btn btn-outline-primary show-video-btn'
            } else {
                const todoId: number = +showVideoBtn.dataset.id;
                todoVideoElement = <HTMLElement>document.querySelector(`#video-embed-${todoId}`);
                todoVideoElement.className += ' display-none';
                showVideoBtn.innerText = 'Show video';
                showVideoBtn.className = 'btn btn-primary show-video-btn'
            }
        });
    }

    static attachShowMoreTodoBtnHandler() {
        const showMoreTodoBtn: HTMLElement = <HTMLElement>document.querySelector('#show-more-todo');
        const todoListDiv: HTMLElement = <HTMLElement>document.querySelector('#todo-list-div');
        Observable.fromEvent(showMoreTodoBtn, 'click').subscribe(() => {
            if (showMoreTodoBtn.innerText == 'Show more') {
                todoListDiv.className = 'row todo-list';
                showMoreTodoBtn.innerText = 'Show less';
                showMoreTodoBtn.className = 'btn btn-outline-primary';
            } else {
                todoListDiv.className = 'row todo-list list-max-height';
                showMoreTodoBtn.innerText = 'Show more';
                showMoreTodoBtn.className = 'btn btn-primary';
            }
        });
    }

    static attachShowMoreFinishedTodoBtnHandler() {
        const showMoreTodoBtn: HTMLElement = <HTMLElement>document.querySelector('#show-more-finished-todo');
        const todoListDiv: HTMLElement = <HTMLElement>document.querySelector('#finished-todo-list-div');
        Observable.fromEvent(showMoreTodoBtn, 'click').subscribe(() => {
            if (showMoreTodoBtn.innerText == 'Show more') {
                todoListDiv.className = 'row finished-todo-list';
                showMoreTodoBtn.innerText = 'Show less';
                showMoreTodoBtn.className = 'btn btn-outline-primary';
            } else {
                todoListDiv.className = 'row finished-todo-list list-max-height';
                showMoreTodoBtn.innerText = 'Show more';
                showMoreTodoBtn.className = 'btn btn-primary';
            }
        });
    }
}
