import React, {useEffect, useState} from 'react';
import {sourceDocumentInitSortable} from "@react/dishes/bus";

interface IProps {
    toggleModal: (isOpen?: boolean) => void
}

export const BtnFormEditFilters: React.FC<IProps> = ({toggleModal}) => {

    // показываем только на странице списка категорий блюд
    const [show, toggleShow] = useState(false)
    useEffect(() => {
        const subscription = sourceDocumentInitSortable.subscribe((_: any) => {
            if (['/dishes', 'dishes#'].includes(window.location.href.slice(-7))) {
                toggleShow(true)
            } else {
                toggleShow(false)
            }
        })
        return () => {
            subscription.unsubscribe();
        }
    }, [window.location.href])

    const openForm = () => {
        toggleModal(true)
    }

    if (!show) {
        return null;
    }

    return (
        <button className={'btn btn-outline-primary mx-4 my-2'} onClick={openForm}>
            Редактировать фильтры
        </button>
    );
};
