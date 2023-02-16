import React, {useEffect} from 'react';
import {sourceDocumentClick, sourceDocumentInitSortable} from '../bus'
import {filter} from 'rxjs/operators';
import {IngredientStepForm} from "./components/IngredientStepForm";
import {API} from "@core/services/api/api";
import {observer} from "mobx-react-lite"
import {IDish} from "./StepsStore";
import {useStore} from "@react/hooks/useStore";

export const Steps = observer(() => {

    const stepsStore = useStore('stepsStore');

    useEffect(() => {
        const subscription = sourceDocumentInitSortable.subscribe((_: any) => {
            renderLinksIngredients()
        });
        // get step data
        const observableClickBtnStepIngredients = sourceDocumentClick.pipe(filter(event => (event.target as HTMLDivElement).classList.contains('btn-step-ingredients')));
        const subscriptionClick = observableClickBtnStepIngredients.subscribe(async (e: Event) => {
            const stepId = Number((e.target as HTMLLinkElement).dataset.step)
            if (stepId) {
                stepsStore.setStep(stepId)
                stepsStore.toggleModal(true)
            }
        });
        return () => {
            subscription.unsubscribe();
            subscriptionClick.unsubscribe();
        }
    }, [])

    async function renderLinksIngredients() {
        const dishId = +window.location.hash.substring(1)
        if (!dishId) {
            return;
        }
        const result = await API.get<IDish>('dishes', `dish/${dishId}`)
        stepsStore.setDish(result.data)
        // TODO переписать на react portal
        const table = document.getElementById(`dishes_steps_${dishId}`)
        const steps = stepsStore.dish?.steps
        const links = document.querySelectorAll('.btn-step-ingredients').forEach(e => e.remove())

        if (steps && table) {
            steps.forEach((step) => {
                const stepId = step.id
                const tr = table.querySelector(`tr[data-id='${stepId}']`)
                const contentTd = tr?.querySelector("td[data-key='content']")
                const tagLink = document.createElement("a");
                const tagDiv = document.createElement("div");
                let linkText = document.createTextNode('Добавить ингредиенты')
                if (step.ingredients.length > 0) {
                    let text = '';
                    step.ingredients.map(ingredient => {
                        if (ingredient.name) {
                            text += `${ingredient.name}: ${ingredient.count || ''} ${ingredient.unit_short || ''}. `;
                        }
                    })
                    linkText = document.createTextNode(text)
                }
                tagLink.appendChild(linkText);
                tagLink.dataset.step = `${stepId}`
                tagLink.classList.add("btn", "btn-link", "btn-step-ingredients", "text-start");
                tagDiv.appendChild(tagLink)
                contentTd?.appendChild(tagDiv)
            })
        }
    }


    const submitForm = async () => {
        stepsStore.toggleLoad(true)
        const ingredients = stepsStore.stepIngredients?.map(ingredient => {
            return {
                step_id: stepsStore.stepId,
                ingredient_id: ingredient.id,
                count: ingredient.countStep,
            }
        }).filter(Boolean)
        const result = await API.post<IDish>('dishes', `saveStepIngredients/${stepsStore.dish?.id}`, ingredients)
        if (result.ok) {
            renderLinksIngredients()
            stepsStore.toggleModal(false)
        }
        stepsStore.toggleLoad(false)
    }

    return <div>
        <IngredientStepForm changeStepIngredientCount={stepsStore.changeStepIngredientCount}
                            isLoad={stepsStore.isLoad}
                            isOpen={stepsStore.isOpen}
                            stepIngredients={stepsStore.stepIngredients}
                            submitForm={submitForm}
                            toggleModal={stepsStore.toggleModal}
        />
    </div>
})
