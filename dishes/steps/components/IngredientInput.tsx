import React from 'react';
import {observer} from "mobx-react-lite";

interface IProps {
    id: number
    name: string
    unit_short: string
    count: number
    countStep: number
    change: (ingredientId: number, count: number) => void
}

export const IngredientInput = observer((props: IProps) => {

    function changeCount(e: React.ChangeEvent<HTMLInputElement>) {
        props.change(props.id, +e.target.value);
    }

    return <div className="input-group mb-2">
        <label className="form-label me-2">{props.name}:</label>
        <input type="number"
               className="form-control form-control-sm input-width-80 me-auto"
               data-id={props.id}
               value={props.countStep ? props.countStep : ''}
               onChange={changeCount}
        />
        <span className="float-end">Всего: {props.count}</span>
        <span className="ms-1">{props.unit_short}.</span>
    </div>
});
