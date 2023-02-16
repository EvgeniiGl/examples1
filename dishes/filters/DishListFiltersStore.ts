import {makeAutoObservable} from "mobx";
import {IDishCategory} from "@react/dishes/interfaces";

export class DishListFilters {

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true})
    }

    dishFilters: IDishCategory[] = []
    dishId: number | null = null
    isLoad: boolean = false

    toggleLoad = (isLoad?: boolean) => {
        this.isLoad = isLoad === undefined ? !this.isLoad : isLoad;
    }

    setDishFilters = (dishFilters: IDishCategory[]) => {
        this.dishFilters = dishFilters
    }

    setDishId = (dishId: number) => {
        this.dishId = dishId
    }

    toggleFilter = (filterId: number, value: boolean) => {
        this.dishFilters = this.dishFilters.map(category => {
            category.filters = category.filters.map(filter => {
                if (filter.id === filterId) {
                    filter.checked = value
                }
                return filter
            })
            return category
        })
    }

}

export const DishListFiltersStore = new DishListFilters();
