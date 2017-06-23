import { Observable } from 'rxjs';
/**
 * Created by bodansky-apertus on 2017.06.23..
 */

export class Utils {

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

    static saveInLocalStorage(key: string, value: any): void {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    static loadFromLocalStorage(key: string): any {
        return JSON.parse(window.localStorage.getItem(key));
    }

    static deleteFromLocalStorage(key: string): void {
        window.localStorage.removeItem(key);
    }

    static displayAlert(className: string, message: string): void {
        const alert: HTMLElement = <HTMLElement>document.querySelector('#alert');
        alert.className = `alert ${className}`;
        alert.innerHTML = `<strong>${message}</strong>`;
        Utils.fadeIn(alert);
        setTimeout(function () {
            Utils.fadeOut(alert);
        }, 3000);
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
}
