import { UtilityService } from './main/service/utility-service';
import { TodoService } from './main/service/todo-service';
import { CategoryService } from './main/service/category-service';
/**
 * Created by bodansky-apertus on 2017.06.22..
 */

export class App {

    private todoService: TodoService;
    private categoryService: CategoryService;

    constructor() {
        this.todoService = new TodoService();
        this.categoryService = new CategoryService(this.todoService);
        this.onInit();
    }

    private onInit(): void {
        UtilityService.attachBrandLogoColorChangeHandler();
        UtilityService.attachSearchBtnChangeHandler();
    }
}
new App();
