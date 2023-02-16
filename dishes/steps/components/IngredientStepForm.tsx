import React from 'react';
import {observer} from "mobx-react-lite";
import {Modal} from "@core/components/modal/Modal";
import {IngredientInput} from "@react/dishes/steps/components/IngredientInput";
import {IIngredient} from "@react/dishes/steps/StepsStore";

interface IProps {
    toggleModal: () => void
    changeStepIngredientCount: (ingredientId: number, count: number) => void
    submitForm: () => void
    isOpen: boolean
    isLoad: boolean
    stepIngredients: IIngredient[] | null
}

export const IngredientStepForm = observer((props: IProps) => {

    return (
        <Modal toggleModal={props.toggleModal}
               title="Добавить ингредиенты"
               isOpen={props.isOpen}
        >
            <div className="modal-body">
                {props.stepIngredients && props.stepIngredients.map(ingredient => {
                    return <IngredientInput key={ingredient.id}
                                            id={ingredient.id}
                                            count={ingredient.count}
                                            countStep={ingredient.countStep || 0}
                                            name={ingredient.name}
                                            unit_short={ingredient.unit_short || ''}
                                            change={props.changeStepIngredientCount}
                    />
                })}
                <button type="button"
                        className={`btn btn-xs btn-primary mt-3 ${props.isLoad ? 'disabled' : ''}`}
                        onClick={props.submitForm}
                >Сохранить
                    {props.isLoad && <div className="spinner-grow spinner-grow-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                </button>
            </div>
        </Modal>
    );
})
