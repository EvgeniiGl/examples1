import React, {useEffect} from 'react';
import {API} from "@core/services/api/api";
import {observer} from "mobx-react-lite"
import {useStore} from "@react/hooks/useStore";
import {BtnFormEditFilters} from "@react/dishes/filters/components/BtnFormEditFilters";
import {FormEditFilters} from "@react/dishes/filters/components/FormEditFilters";
import {IType} from "@react/dishes/filters/FiltersStore";
import {ICategory} from "@react/dishes/interfaces";

export const Filters = observer(() => {

    const {
        isOpen,
        toggleModal,
        filters,
        setFilters,
        toggleLoad,
        isLoad,
        changeInputCategory,
        valueCategoty,
        currentFilters,
        changeInputFilter,
        valueFilter,
        setCurrentCategory,
    } = useStore('filtersStore');

    async function loadFilters() {
        toggleLoad(true)
        const filters = await API.get<ICategory[]>('dishes', `filters`);
        if (filters.ok) {
            setFilters(filters.data)
        }
        toggleLoad(false)
    }

    async function addCategory() {
        toggleLoad(true)
        const filters = await API.post<ICategory[]>('dishes', `addCategoryFilter`, {name: valueCategoty});
        if (filters.ok) {
            setFilters(filters.data)
        }
        toggleLoad(false)
    }

    async function deleteItem(id: number, type: IType) {
        toggleLoad(true)
        const action = type === 'filter' ? 'deleteFilter' : 'deleteCategoryFilter'
        const filters = await API.delete<ICategory[]>(`dishes`, `${action}/${id}`);
        if (filters.ok) {
            setFilters(filters.data)
        }
        toggleLoad(false)
    }

    async function addFilter() {
        toggleLoad(true)
        const params = {
            name: valueFilter,
            category_id: currentFilters.id,
        }
        const filters = await API.post<ICategory[]>('dishes', `addFilter`, params);
        if (filters.ok) {
            setFilters(filters.data)
        }
        toggleLoad(false)
    }

    useEffect(() => {
        if (filters.length <= 0) {
            loadFilters()
        }
    }, [isOpen])

    return (
        <div>
            {filters.length > 0 && <FormEditFilters isOpen={isOpen}
                                                    toggleModal={toggleModal}
                                                    isLoad={isLoad}
                                                    filters={filters}
                                                    addCategory={addCategory}
                                                    changeInputCategory={changeInputCategory}
                                                    valueCategoty={valueCategoty}
                                                    currentFilters={currentFilters}
                                                    addFilter={addFilter}
                                                    changeInputFilter={changeInputFilter}
                                                    valueFilter={valueFilter}
                                                    setCurrentCategory={setCurrentCategory}
                                                    deleteItem={deleteItem}
            />}
            <BtnFormEditFilters toggleModal={toggleModal}/>
        </div>
    )
});
