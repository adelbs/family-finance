import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        months: [
            {
                key: '2022-06',
                name: 'Junho/2022',
                forecasts: [
                    {
                        name: 'Custo de Vida',
                        forecast: [
                            { cat: 'Alimentação', value: 0, notes: '' },
                            { cat: 'Transporte', value: 0, notes: '' },
                        ]
                    },
                    {
                        name: 'Gastos Mensais',
                        forecast: [
                            { cat: 'Pet', value: 0, notes: '' },
                            { cat: 'Diversão', value: 0, notes: '' },
                        ]
                    },
                    {
                        name: 'Investimentos',
                        forecast: [
                            { cat: 'Poupança', value: 0, notes: '' },
                        ]
                    },
                    {
                        name: 'Ganhos',
                        forecast: [
                            { cat: 'Salário', value: 0, notes: '' },
                        ]
                    },
                ],
                repos: [
                    { name: 'CC Itau', value: { init: null, end: null }, isCredit: false },
                    { name: 'VR', value: { init: null, end: null }, isCredit: false },
                    { name: 'VA', value: { init: null, end: null }, isCredit: false },
                    { name: 'Master', value: { init: null, end: null }, isCredit: true },
                    { name: 'Nu Bank', value: { init: null, end: null }, isCredit: true },
                ],
                balance: [
                    { repo: 'CC Itau', dt: '2022-06-01', cat: 'Alimentação', desc: 'Padaria Anadia', value: 42.8, positive: false },
                    { repo: 'Master', dt: '2022-06-01', cat: 'Transporte', desc: 'Posto via 200', value: 242.1, positive: false },
                    { repo: 'Nu Bank', dt: '2022-06-01', cat: 'Pet', desc: 'Laicao', value: 100, positive: false },
                    { repo: 'Nu Bank', dt: '2022-06-01', cat: 'Diversão', desc: 'Petiskin', value: 52.87, positive: false },
                    { repo: 'Master', dt: '2022-06-01', cat: 'Outros Ganhos', desc: 'Créd. IOF', value: 0.1, positive: true },
                ]
            }
        ]
    },
    getters: {
        months(state) {
            return state.months;
        }
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    }
})
