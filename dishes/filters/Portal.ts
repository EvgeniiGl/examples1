import React from 'react';
import ReactDOM from "react-dom";
import {sourceDocumentInitSortable} from "@react/dishes/bus";
import {observer} from "mobx-react-lite";

interface IProps {
    children: React.ReactNode
}

export const Portal = observer(({children}: IProps) => {
    const container = document.createElement('div')

    React.useEffect(() => {
        // рендерим в таб "Фильтры" на странице блюда
        const subscription = sourceDocumentInitSortable.subscribe((_: any) => {
            document.querySelectorAll('.tabPage').forEach(el => {
                if (el.getAttribute("name") === 'Фильтры') {
                    el.appendChild(container)
                }
            })
        });
        return () => {
            subscription.unsubscribe();
        }
    }, [])

    return ReactDOM.createPortal(children, container)
})

