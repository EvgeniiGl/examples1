import {makeAutoObservable} from "mobx";
import {IFilter} from "../interfaces";


export class DishFilter implements IFilter {

    constructor(id: number, name: string, categoryId: number, checked: boolean) {
        makeAutoObservable(this, {}, {autoBind: true})
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.checked = checked
    }

    id: number;
    name: string;
    categoryId: number;
    checked: boolean;

}
