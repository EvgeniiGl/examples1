import React from 'react';
import {observer} from "mobx-react-lite";
import {CategoryTab} from "@react/dishes/filters/components/CategoryTab";
import {IDishCategory} from "@react/dishes/interfaces";

interface IProps {
    dishFilters: IDishCategory[]
    saveFilter: (filterId: number, value: boolean) => void
}

export const ListCategoryTab = observer(({dishFilters, saveFilter}: IProps) => {

    const list = [...dishFilters.map(category => <CategoryTab key={category.id}
                                                              items={category.filters}
                                                              title={category.name}
                                                              saveFilter={saveFilter}
    />)];

    return (
        <div className="d-flex mt-3">
            {list}
        </div>
    );
})
