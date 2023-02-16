import {makeAutoObservable} from "mobx";
import {ICategory} from "@react/dishes/interfaces";

export type IType = 'filter' | 'category'

export class Filters {

    constructor() {
        makeAutoObservable(this)
    }

    isOpen: boolean = false
    isLoad: boolean = false
    currentCategoryId: number = 1
    filters: ICategory[] = []
    valueCategoty: string = ''
    valueFilter: string = ''

    toggleModal = (isOpen?: boolean) => {
        this.isOpen = isOpen === undefined ? !this.isOpen : isOpen;
    }

    setCurrentCategory = (categorId: number) => {
        this.currentCategoryId = categorId
    }

    setFilters = (filters: ICategory[]) => {
        this.filters = filters
    }

    toggleLoad = (isLoad?: boolean) => {
        this.isLoad = isLoad === undefined ? !this.isLoad : isLoad;
    }

    changeInputCategory = (value: string) => {
        this.valueCategoty = value;
    }

    changeInputFilter = (value: string) => {
        this.valueFilter = value;
    }

    get currentFilters() {
        return this.filters.filter(filter => filter.id === this.currentCategoryId)[0]
    }

}

export const FiltersStore = new Filters();
