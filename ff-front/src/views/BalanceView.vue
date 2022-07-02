<template>
    <v-container>

        <Budget v-model="budgetDialog"></Budget>
        <Forecast v-model="forecastDialog"></Forecast>
        <Repository v-model="repoDialog"></Repository>
        <Expense v-model="expenseDialog"></Expense>

        <v-card outlined>
            <v-card-title>
                <v-btn
                    small
                    icon
                    class="mr-3"
                >
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                {{ month.name }}
                <v-spacer></v-spacer>
                <v-btn
                    small
                    icon
                    outlined
                    class="mx-1"
                    @click="newBudget()"
                >
                    <v-icon small>mdi-cash-plus</v-icon>
                </v-btn>
                <v-btn
                    small
                    icon
                    outlined
                    class="mx-1"
                    @click="newForecast()"
                >
                    <v-icon small>mdi-bank-plus</v-icon>
                </v-btn>
                <v-btn
                    small
                    icon
                    outlined
                    class="mx-1"
                    @click="newRepo()"
                >
                    <v-icon small>mdi-wallet-plus-outline</v-icon>
                </v-btn>
                <v-btn
                    small
                    icon
                    outlined
                    class="mx-1"
                    @click="newExpense()"
                >
                    <v-icon small>mdi-basket-plus-outline</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <div class="d-flex flex-wrap">
                    <v-card
                        v-for="(repo, i) of month.repos"
                        :key="i"
                        min-width="200"
                        class="ma-3 pa-2"
                        link
                        @click="editRepo(repo, i)"
                    >
                        <div class="subtitle-1 text-center">{{ repo.name }}</div>
                        <div v-if="!repo.isCredit">
                            <div>Saldo inicial: {{ repo.value.init | money }}</div>
                            <div>Saldo final: {{ repo.value.end | money }}</div>
                        </div>
                        <div v-else>
                            <div>Valor fatura: {{ repo.value.end | money }}</div>
                            <div>&nbsp;</div>
                        </div>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>

        <v-card class="mt-3">
            <v-tabs
                fixed-tabs
                background-color="teal darken-3"
                dark
                v-model="tabs"
            >
                <v-tab>Resumo</v-tab>
                <v-tab>Extrato</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tabs">
                <v-tab-item class="pa-3">

                    <v-card
                        width="400"
                        class="ma-2 pa-2"
                        flat
                    >
                        <v-row>
                            <v-col>&nbsp;</v-col>
                            <v-col class="title text-right">Previsto</v-col>
                            <v-col class="title text-right">Realizado</v-col>
                        </v-row>
                        <div
                            v-for="(budget, i) of month.budget"
                            :key="'bdg-'+ i"
                            class="mb-4"
                        >
                            <v-card
                                flat
                                link
                                class="subtitle-2 mb-2"
                                @click="editBudget(budget, i)"
                            >
                                {{ budget.name }}
                            </v-card>
                            <v-card
                                flat
                                link
                                v-for="(forecast, j) of budget.forecast"
                                :key="'bdg-'+ i +'-item'+ j"
                                @click="editForecast(forecast, j, i)"
                            >
                                <v-row dense>
                                    <v-col class="body-2">
                                        {{ forecast.cat }}
                                    </v-col>
                                    <v-col class="body-2 text-right">{{ forecast.value | money }}</v-col>
                                    <v-col class="body-2 text-right">{{ forecast.accomplished | money }}</v-col>
                                </v-row>
                            </v-card>
                            <v-row dense>
                                <v-col class="subtitle-2">
                                    Total
                                </v-col>
                                <v-col class="subtitle-2 text-right">{{ budget.total | money }}</v-col>
                                <v-col class="subtitle-2 text-right">{{ budget.totalAccomplished | money }}</v-col>
                            </v-row>

                            <v-divider></v-divider>

                        </div>

                    </v-card>

                </v-tab-item>
                <v-tab-item class="pa-3">
                    <v-row>
                        <v-col class="subtitle-2">Repo.</v-col>
                        <v-col class="subtitle-2">Data</v-col>
                        <v-col class="subtitle-2">Categoria</v-col>
                        <v-col class="subtitle-2">Descrição</v-col>
                        <v-col class="subtitle-2 text-right">Valor</v-col>
                    </v-row>

                    <v-card
                        v-for="(item, i) of month.balance"
                        :key="i"
                        class="pa-1"
                        flat
                        link
                        @click="editExpense(item, i)"
                    >
                        <v-row>
                            <v-col class="body-2">{{ item.repo }}</v-col>
                            <v-col class="body-2">{{ item.dt | date }}</v-col>
                            <v-col class="body-2">{{ item.cat }}</v-col>
                            <v-col class="body-2">{{ item.desc }}</v-col>
                            <v-col class="body-2 text-right"><span v-if="item.positive">(+)</span> {{ item.value | money }}</v-col>
                        </v-row>
                        <v-divider></v-divider>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>

    </v-container>
</template>

<script>

import { getMonth } from '../common';

import Budget from '../components/Budget.vue';
import Forecast from '../components/Forecast.vue';
import Repository from '../components/Repository.vue';
import Expense from '../components/Expense.vue';

export default {
    name: 'Balance',
    components: { Budget, Forecast, Repository, Expense },
    data: () => ({
        tabs: 0,
        budgetDialog: false,
        forecastDialog: false,
        repoDialog: false,
        expenseDialog: false
    }),
    computed: {
        month() {
            const filteredMonths = this.$store.getters.months.filter(v => v.key === this.$route.params.key);
            return filteredMonths.length > 0 ? filteredMonths[0] : this.$store.getters.emptyMonth;
        }
    },
    mounted() {
        if (this.month.key == '0000-00') {
            getMonth(this.$route.params.key).then(data => this.$store.commit('pushMonth', data)).catch(err => console.log(err));
        }
    },
    methods: {
        newBudget() {
            this.$store.commit('budgetIndex', -1);
            this.$store.commit('budgetName', '');
            this.budgetDialog = true;
        },
        editBudget(budget, index) {
            this.$store.commit('budgetIndex', index);
            this.$store.commit('budgetName', budget.name);
            this.budgetDialog = true;
        },
        newForecast() {
            this.$store.commit('forecastIndex', -1);
            this.$store.commit('forecastIndexBudget', -1);
            this.$store.commit('forecastCat', '');
            this.$store.commit('forecastValue', 0);
            this.$store.commit('forecastNotes', '');
            this.forecastDialog = true;
        },
        editForecast(forecast, indexForecast, indexBudget) {
            this.$store.commit('forecastIndex', indexForecast);
            this.$store.commit('forecastIndexBudget', indexBudget);
            this.$store.commit('forecastCat', forecast.cat);
            this.$store.commit('forecastValue', forecast.value);
            this.$store.commit('forecastNotes', forecast.notes);
            this.forecastDialog = true;
        },
        newRepo() {
            this.$store.commit('repoIndex', -1);
            this.$store.commit('repoName', '');
            this.$store.commit('repoInit', 0);
            this.$store.commit('repoEnd', null);
            this.$store.commit('repoIsCredit', false);
            this.repoDialog = true;
        },
        editRepo(repo, index) {
            this.$store.commit('repoIndex', index);
            this.$store.commit('repoName', repo.name);
            this.$store.commit('repoInit', repo.value.init);
            this.$store.commit('repoEnd', repo.value.end);
            this.$store.commit('repoIsCredit', repo.isCredit);
            this.repoDialog = true;
        },
        newExpense() {
            this.$store.commit('expenseIndex', -1);
            this.$store.commit('expenseRepo', '');
            this.$store.commit('expenseDt', '');
            this.$store.commit('expenseCat', '');
            this.$store.commit('expenseDesc', '');
            this.$store.commit('expenseValue', '');
            this.$store.commit('expensePositive', false);
            this.expenseDialog = true;
        },
        editExpense(expense, index) {
            this.$store.commit('expenseIndex', index);
            this.$store.commit('expenseRepo', expense.repo);
            this.$store.commit('expenseDt', expense.dt);
            this.$store.commit('expenseCat', expense.cat);
            this.$store.commit('expenseDesc', expense.desc);
            this.$store.commit('expenseValue', expense.value);
            this.$store.commit('expensePositive', expense.positive);
            this.expenseDialog = true;
        }
    }
}
</script>
