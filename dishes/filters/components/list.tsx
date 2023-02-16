import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {IType} from "@react/dishes/filters/FiltersStore";

interface IItem {
    id: number
    name: string
}

interface IProps {
    items: IItem[]
    deleteItem: (id: number, type: IType) => void
    type: IType
}

export const List = ({items, deleteItem, type}: IProps) => {

    const deleteRow = (e: React.MouseEvent<HTMLElement>) => {
        if (type === 'filter' || confirm('При удалении категории, фильтры из этой категории тоже будут удалены. Все равно удалить?')) {
            const id = (e.currentTarget as HTMLSpanElement).dataset.id
            if (id) {
                deleteItem(+id, type)
            }
        }
    }

    return (
        <ul className='list-group mb-1'>
            {items.map(item => <li key={item.id} className='list-group-item py-0'>{item.name}
                <div className='btn btn-sm float-end'
                     onClick={deleteRow}
                     data-id={item.id}
                >
                    <DeleteOutlineIcon className='color-red'/>
                </div>
            </li>)}
        </ul>
    );
}
