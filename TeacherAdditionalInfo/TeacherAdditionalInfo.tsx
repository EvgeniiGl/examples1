import {useEffect} from 'react';
import {MdOutlineArrowDropDown, MdOutlineArrowDropUp} from 'react-icons/md';
import {ListDoc} from "@components/List/ListDoc/ListDoc";
import {Select} from "@components/Form/CustomSelect/Select";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducers} from 'resources/js/app/redux/rootReducers'
import css from './TeacherAdditionalInfo.module.css'
import {Input} from "@components/Form/Input/Input";
import {
    changeCategory,
    changeEducation,
    changeExperience,
    loadRewards,
    toggleInfo,
} from "@components/TeacherAdditionalInfo/TeacherAdditionalInfoSlice";
import {IOption} from "@app/interfaces";

interface IProps {
    teacher_id: number
}

export const TeacherAdditionalInfo = ({teacher_id}: IProps) => {

    const info = useSelector((state: IRootReducers) => state.teacherAdditionalInfo)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadRewards());
    }, [])

    const handleExperience = (option: IOption) => {
        dispatch(changeExperience({option}))
    }

    return (
        <div className={css.container}>
            <h3 className={css.header}>Дополнительная информация</h3>
            <div onClick={_ => dispatch(toggleInfo())} className={css.toggle}>
                <span>показать/скрыть</span>
                <MdOutlineArrowDropUp className={css.arrow_toggle_up}/>
                <MdOutlineArrowDropDown className={css.arrow_toggle_down}/>
            </div>
            {info.show && <div className={'d-flex mb-3'}>
                <div>
                    <h5>Награды</h5>
                    <div className={css.rewards}>
                        <ListDoc files={info.rewards} action={`/teacher/file/${teacher_id}`} type='rewards'/>
                    </div>
                </div>
                <div className={css.info}>
                    <div>
                        <Input value={info.education}
                               name={'education'}
                               onChange={text => dispatch(changeEducation({text: text}))}
                               placeholder={'Образование...'}/>
                    </div>
                    <div>
                        <Select options={info.categoryOptions}
                                value={info.category}
                                handleChange={option => dispatch(changeCategory({option}))}
                                placeholder={"Выберите категорию..."}/>
                    </div>
                    <div className='d-flex align-items-center'>
                        <h5 className='me-3'>Стаж</h5>
                        <Select options={info.experienceOptions}
                                value={info.experience}
                                handleChange={handleExperience}
                                placeholder={"Выберите стаж..."}/>
                    </div>
                </div>
            </div>}
        </div>
    )
}
