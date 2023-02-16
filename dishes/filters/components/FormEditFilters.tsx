import React from 'react';
import {Modal} from "@core/components/modal/Modal";
import {observer} from "mobx-react-lite";
import {IType} from "@react/dishes/filters/FiltersStore";
import {List} from "@react/dishes/filters/components/list";
import {ICategory} from "@react/dishes/interfaces";
import {FieldAdd} from "@core/components/form/FieldAdd";

interface IProps {
    isOpen: boolean
    toggleModal: () => void
    filters: ICategory[]
    isLoad: boolean
    changeInputCategory: (value: string) => void
    setCurrentCategory: (value: number) => void
    deleteItem: (id: number, type: IType) => void
    addCategory: () => void
    valueCategoty: string
    currentFilters: ICategory
    changeInputFilter: (value: string) => void
    addFilter: () => void
    valueFilter: string
}

export const FormEditFilters: React.FC<IProps> = observer((props) => {
    const {
        isOpen,
        toggleModal,
        filters,
        changeInputCategory,
        addCategory,
        valueCategoty,
        currentFilters,
        changeInputFilter,
        addFilter,
        valueFilter,
        setCurrentCategory,
        deleteItem,
        isLoad,
    } = props

    const selectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentCategory(+e.target.value);
    }

    return (
        <Modal toggleModal={toggleModal}
               title="Редактировать фильтры"
               isOpen={isOpen}
        >
            <div className="position-relative">
                {isLoad && <div className='load-container'>
                    <div className="spinner-border position-absolute top-50 start-50" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>}
                <h5 className="mt-2">Категории</h5>
                <List items={filters} deleteItem={deleteItem} type={'category'}/>
                <FieldAdd change={changeInputCategory} save={addCategory} value={valueCategoty}/>
                <h5 className="mt-2">Фильтры</h5>
                <select className='mb-2' onChange={selectCategory} value={currentFilters.id}>
                    {filters.map(filter => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
                </select>
                <List items={currentFilters.filters} deleteItem={deleteItem} type={'filter'}/>
                <FieldAdd change={changeInputFilter} save={addFilter} value={valueFilter}/>
            </div>
        </Modal>
    );
})
