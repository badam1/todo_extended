export class Templates {

    static getTodoTemplate(todoItem): string {
        return `<div class="container">
                        <div class="card w-100 ${todoItem.finished ? 'todo-green' : 'todo-white'}">
                            <div class="card-block ${todoItem.finished ? 'todo-green' : 'todo-white'}">
                                <h3 class="card-title">${todoItem.title}</h3>
                                <h6 class="card-header">${todoItem.category}</h6>
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

     static getCategoryTemplate(category: string): string {
        return `<a id="category-${category}" class="dropdown-item" href="#">${category}</a>`;
    }

     static getCategoryTemplateOnModal(category: string): string {
        return `<option value="${category}">${category}</option>`
    }

    static completeCategoryList(): string[] {
        return [`<hr class="dropdown-divider"/>
                    <a id="category-all" class="dropdown-item" href="#">All<a>
                        <hr class="dropdown-divider"/>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#addNewCategoryModal">Add
                                    new category</a>
                                <a href="" class="dropdown-item" data-toggle="modal" data-target="#deleteCategoryModal">Delete
                                    category</a>`];
    }
}