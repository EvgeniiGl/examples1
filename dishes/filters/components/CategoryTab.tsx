import React from 'react';
import {DishFilter} from "@react/dishes/filters/DishFilterStore";
import {Checkbox} from "@react/dishes/filters/components/Checkbox";
import {observer} from "mobx-react-lite";

interface IProps {
    items: DishFilter[]
    title: string
    saveFilter: (filterId: number, value: boolean) => void
}

export const CategoryTab = observer(({items, title, saveFilter}: IProps) => {

    const list = [...items.map(item => <Checkbox saveFilter={saveFilter} key={item.id} item={item}/>)]
    return (
        <div className="mx-1 d-flex flex-column align-items-center">
            <h5>{title}</h5>
            <ul className='list-group mb-1'>
                {list}
            </ul>
        </div>
    );
});
