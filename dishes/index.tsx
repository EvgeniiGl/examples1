import * as React from 'react';
import {Steps} from "@react/dishes/steps/Steps";
import {Filters} from "@react/dishes/filters/Filters";
import {stores, StoresProvider} from "@react/stores";
import './interfaces.ts';
import {DishFilters} from "@react/dishes/filters/DishFilters";
import {Portal} from "@react/dishes/filters/Portal";

export const Dishes = () => (
    <StoresProvider value={stores}>
        <Steps/>
        <Filters/>
        <Portal>
            <DishFilters/>
        </Portal>
    </StoresProvider>
)
