import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        selectedBudget: {
            index: -1,
            name: ''
        },
        selectedForecast: {
            indexBudget: -1,
            index: -1,
            cat: '',
            value: 0,
            notes: ''
        },
        selectedRepo: {
            index: -1,
            name: '',
            value: {
                init: 0,
                end: null
            },
            isCredit: false
        },
        selectedExpense: {
            index: -1,
            repo: '',
            dt: '',
            cat: '',
            desc: '',
            value: 0,
            positive: false
        },

        emptyMonth: {
            key: '0000-00',
            name: 'Not Found',
            budget: [],
            repos: [],
            balance: []
        },
        months: []
    },
    getters: {
        selectedBudget(state) {
            return state.selectedBudget;
        },
        selectedForecast(state) {
            return state.selectedForecast;
        },
        selectedRepo(state) {
            return state.selectedRepo;
        },
        selectedExpense(state) {
            return state.selectedExpense;
        },
        months(state) {
            return state.months;
        },
        emptyMonth(state) {
            return state.emptyMonth;
        }
    },
    mutations: {

        //Forecast
        forecastIndex(state, value) {
            state.selectedForecast.index = value;
        },
        forecastIndexBudget(state, value) {
            state.selectedForecast.indexBudget = value;
        },
        forecastCat(state, value) {
            state.selectedForecast.cat = value;
        },
        forecastValue(state, value) {
            state.selectedForecast.value = value;
        },
        forecastNotes(state, value) {
            state.selectedForecast.notes = value;
        },
        
        //Budget
        budgetIndex(state, value) {
            state.selectedBudget.index = value;
        },
        budgetName(state, value) {
            state.selectedBudget.name = value;
        },

        // Repo
        repoIndex(state, value) {
            state.selectedRepo.index = value;
        },
        repoName(state, value) {
            state.selectedRepo.name = value;
        },
        repoInit(state, value) {
            state.selectedRepo.value.init = value;
        },
        repoEnd(state, value) {
            state.selectedRepo.value.end = value;
        },
        repoIsCredit(state, value) {
            state.selectedRepo.isCredit = value;
        },
        
        months(state, value) {
            state.months = value;
        },
        pushMonth(state, value) {
            state.months.push(value);
        },
        updateMonth(state, value) {
            let i = 0;
            let found = false;
            for (; i < state.months.length; i++) {
                if (state.months[i].key == value.key) {
                    found = true;
                    break;
                }
            }

            if (found) {
                state.months.splice(i, 1);
                state.months.push(value);
            }
        },

        //Expense
        expenseIndex(state, value) {
            state.selectedExpense.index = value;
        },
        expenseRepo(state, value) {
            state.selectedExpense.repo = value;
        },
        expenseDt(state, value) {
            state.selectedExpense.dt = value;
        },
        expenseCat(state, value) {
            state.selectedExpense.cat = value;
        },
        expenseDesc(state, value) {
            state.selectedExpense.desc = value;
        },
        expenseValue(state, value) {
            state.selectedExpense.value = value;
        },
        expensePositive(state, value) {
            state.selectedExpense.positive = value;
        }

    },
    actions: {
    },
    modules: {
    }
});
