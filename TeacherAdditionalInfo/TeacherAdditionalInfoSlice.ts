import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IOption} from "@app/interfaces";
import {IDoc} from "@components/Form/FileForm/FileForm";
import {API} from "@app/service/api/api";
import notification from "@utils/notification";

export interface IState {
    show: boolean;
    rewards: IDoc[];
    experienceOptions: IOption[]
    categoryOptions: IOption[]
    education: string
    category?: IOption
    experience?: IOption
}

const initialState: IState = {
    show: false,
    rewards: [],
    experienceOptions: Array.from({length: 40}, (_, i) => i + 1).map(num => {
        const lastDigit = num % 10;

        if (lastDigit === 1 && num !== 11) {
            return {
                label: num + ' год',
                value: `${num}`,
            };
        }

        if (lastDigit > 1 && lastDigit < 5 && (num < 12 || num > 14)) {
            return {
                label: num + ' года',
                value: `${num}`,
            };
        }

        return {
            label: num + ' лет',
            value: `${num}`,
        };

    }),
    categoryOptions: [
        {
            label: 'Специалист',
            value: 'specialist',
        },
        {
            label: 'Первая',
            value: `first`,
        },
        {
            label: 'Высшая',
            value: 'higher',
        },
    ],
    education: '',
    category: undefined,
    experience: undefined,
};

export const loadRewards = createAsyncThunk('teacherAdditionalInfo/loadRewards', async function () {
    const rewards = await API.get(`teacher/files?type=rewards`);
    if (!rewards.ok) {
        notification({
            type: "error",
            title: "",
            message: "Ошибка. Не удалось загрузить список наград!",
        });
        return;
    }

    return rewards.data
})

const slice = createSlice({
    name: 'teacherAdditionalInfo',
    initialState: initialState,
    reducers: {
        toggleInfo(state) {
            state.show = !state.show
        },
        addReward(state, action: PayloadAction<IDoc>) {
            state.rewards.push(action.payload)
        },
        reset: () => initialState,
        changeEducation: (state, action: PayloadAction<{ text: string }>) => {
            state.education = action.payload.text
        },
        changeCategory: (state, action: PayloadAction<{ option: IOption }>) => {
            state.category = action.payload.option
        },
        changeExperience: (state, action: PayloadAction<{ option: IOption }>) => {
            console.log('log--', '\n',
                'action--', action, '\n',
            )
            state.experience = action.payload.option
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadRewards.fulfilled, (state: IState, action: PayloadAction<IDoc[]>) => {
            state.rewards = action.payload
        })
    },
})

export const {addReward, reset, changeEducation, changeCategory, changeExperience, toggleInfo} = slice.actions

export default slice.reducer
