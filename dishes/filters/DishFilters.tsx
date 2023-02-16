import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {API} from "@core/services/api/api";
import {IFilter} from "@react/dishes/interfaces";
import {DishFilter} from "@react/dishes/filters/DishFilterStore";
import {sourceDocumentInitSortable} from "@react/dishes/bus";
import {useStores} from "@react/hooks/useStores";
import {ListCategoryTab} from "@react/dishes/filters/components/ListCategoryTab";

export const DishFilters = observer(() => {

    const {dishListFiltersStore: DLFStore, filtersStore: FStore} = useStores();

    const loadDishFilters = async () => {
        const dishId = +window.location.hash.substring(1)
        if (!dishId) {
            return;
        }
        DLFStore.toggleLoad(true)
        DLFStore.setDishId(dishId)
        // TODO сделать через promise all и загружать только
        const loadDishFilters = await API.get<IFilter[]>('dishes', `dishFilters/${dishId}`);

        if (loadDishFilters.ok && FStore.filters.length > 0) {
            DLFStore.setDishFilters(FStore.filters.map(category => {
                return {
                    ...category,
                    filters: category.filters.map(filter => {
                        let checked = false
                        loadDishFilters.data.forEach(dishFilter => {
                            if (filter.id === dishFilter.id) {
                                checked = true
                            }
                        })
                        return new DishFilter(filter.id, filter.name, filter.categoryId, checked)
                    })
                }
            }))
        }
        DLFStore.toggleLoad(false)
    }

    useEffect(() => {
        const subscription = sourceDocumentInitSortable.subscribe(async (_: any) => {
            loadDishFilters();
        });
        return () => {
            subscription.unsubscribe();
        }
    }, [])

    async function saveFilter(filterId: number, value: boolean) {
        DLFStore.toggleLoad(true)
        const params = {
            dishId: DLFStore.dishId,
            filterId: filterId,
            value: value,
        }
        const response = await API.post('dishes', `setFilter`, params);
        if (response.ok) {
            DLFStore.toggleFilter(filterId, value)
        }
        DLFStore.toggleLoad(false)
    }

    const list = [...DLFStore.dishFilters]

    return <div className="position-relative">
        {DLFStore.isLoad && <div className='load-container'>
            <div className="spinner-border position-absolute top-50 start-50" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>}
        <ListCategoryTab dishFilters={list} saveFilter={saveFilter}/>
        {!list.length && <div className="tabCol col ">Недоступно до сохранения документа!</div>}
    </div>
})

