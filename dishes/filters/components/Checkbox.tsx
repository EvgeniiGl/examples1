import React from 'react';
import {observer} from "mobx-react-lite";
import {DishFilter} from "@react/dishes/filters/DishFilterStore";

interface IProps {
    item: DishFilter
    saveFilter: (filterId: number, value: boolean) => void
}

export const Checkbox = observer(({item, saveFilter}: IProps) => {

    const save = (e: React.ChangeEvent<HTMLInputElement>) => {
        saveFilter(item.id, e.target.checked)
    }

    return <li className="list-group-item">
        <input className="form-check-input me-1" type="checkbox" checked={item.checked} onChange={save}/>
        {item.name}
    </li>
});
