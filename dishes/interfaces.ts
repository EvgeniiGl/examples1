import {DishFilter} from "@react/dishes/filters/DishFilterStore";

export interface IFilter {
    id: number;
    name: string;
    categoryId: number;
}

export interface ICategory {
    id: number;
    name: string;
    filters: IFilter[]

}

export interface IDishCategory {
    id: number;
    name: string;
    filters: DishFilter[]
}



