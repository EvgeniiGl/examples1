import {makeAutoObservable} from "mobx";

export interface IDish {
    id: number
    name: string
    steps: IStep[]
    ingredients: IIngredient[]
}

export interface IStep {
    id: number
    ingredients: IIngredient[]
}

export interface IIngredient {
    id: number
    name: string
    unit_short: string | null
    count: number
    countStep: number | null
}

export class Steps {
    dish: IDish | null = null
    stepId: number | null = null
    isOpen: boolean = false
    isLoad: boolean = false
    stepIngredients: IIngredient[] | null = null

    constructor() {
        // makeObservable(this, {
        //     dish: observable,
        //     stepId: observable,
        //     isOpen: observable,
        //     stepIngredients: observable,
        //     setDish: action,
        //     setStep: action,
        //     changeStepIngredientCount: action,
        //     toggleModal: action,
        // })
        makeAutoObservable(this)
    }

    setDish = (dish: IDish) => {
        this.dish = dish
        this.stepIngredients = dish.ingredients
    }

    setStep = (stepId: number) => {
        this.stepId = stepId
        const currentStep = this.dish?.steps.filter(step => stepId === step.id)[0]
        if (this.stepIngredients) {
            this.stepIngredients = this.stepIngredients.map(ingredient => {
                const currentIngredient: IIngredient | undefined = currentStep?.ingredients.filter(currentStepIngredient => ingredient.id === currentStepIngredient.id)[0]
                ingredient.countStep = 0;
                if (currentIngredient) {
                    ingredient.countStep = currentIngredient.count
                }
                return ingredient
            })
        }
    }

    changeStepIngredientCount = (ingredientId: number, count: number) => {
        if (this.stepIngredients) {
            this.stepIngredients = this.stepIngredients.map(ingredient => {
                if (+ingredient.id === ingredientId && count <= ingredient.count && count >= 0) {
                    ingredient.countStep = count
                }
                return ingredient
            })
        }
    }

    toggleModal = (isOpen?: boolean) => {
        this.isOpen = isOpen === undefined ? !this.isOpen : isOpen;
    };

    toggleLoad = (isLoad?: boolean) => {
        this.isLoad = isLoad === undefined ? !this.isLoad : isLoad;
    }
}

export const StepsStore = new Steps();
