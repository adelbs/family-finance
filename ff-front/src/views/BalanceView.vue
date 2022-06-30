<template>
    <v-container>

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
                            <div>Valor fatura: {{ sumRepo(repo.name) | money }}</div>
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
                <v-tab>Planejamento</v-tab>
                <v-tab>Extrato</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tabs">
                <v-tab-item class="pa-3">
                    <div class="d-flex justify-center">

                        <v-card flat>
                            <v-card-title>&nbsp;</v-card-title>
                            <v-card-text>
                                <div v-for="(item, i) of month.forecasts" :key="i">
                                    <v-divider v-if="i > 0" class="mt-5 mb-5"></v-divider>
                                    <v-row dense>
                                        <v-col class="subtitle-2">{{ item.name }}</v-col>
                                    </v-row>
                                    <v-row v-for="(subItem, j) of item.forecast" :key="'sub-'+ j" dense>
                                        <v-col>{{ subItem.cat }}</v-col>
                                    </v-row>
                                </div>
                            </v-card-text>
                        </v-card>

                        <v-card
                            width="140"
                            outlined
                            class="mr-1"
                        >
                            <v-card-title>Previsto</v-card-title>
                            <v-card-text>
                                <div v-for="(item, i) of month.forecasts" :key="i">
                                    <v-divider v-if="i > 0" class="mt-5 mb-5"></v-divider>
                                    <v-row dense>
                                        <v-col class="subtitle-2">&nbsp;</v-col>
                                    </v-row>
                                    <v-row v-for="(subItem, j) of item.forecast" :key="'sub-'+ j" dense>
                                        <v-col class="text-right">{{ subItem.value | money }}</v-col>
                                    </v-row>
                                </div>
                            </v-card-text>
                        </v-card>

                        <v-card
                            width="140"
                            outlined
                        >
                            <v-card-title>Realizado</v-card-title>
                            <v-card-text>
                                <v-row dense>
                                    <v-col>&nbsp;</v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col class="text-right">R$ 10,00</v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col class="text-right">R$ 10,00</v-col>
                                </v-row>
                                <v-divider class="mt-5 mb-5"></v-divider>
                                <v-row dense>
                                    <v-col>&nbsp;</v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col class="text-right">R$ 10,00</v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col class="text-right">R$ 10,00</v-col>
                                </v-row>

                            </v-card-text>
                        </v-card>
                    </div>
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

import axios from 'axios';

import Repository from '../components/Repository.vue';
import Expense from '../components/Expense.vue';

export default {
    name: 'Balance',
    components: { Repository, Expense },
    data: () => ({
        tabs: 0,
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
            axios({
                method: 'get',
                url: `http://localhost:3000/${this.$route.params.key}`
            }).then(res => {
                this.$store.commit('pushMonth', res.data);
            }).catch(err => console.log(err));
        }
    },
    methods: {
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
        sumRepo(name) {
            return this.month.balance.reduce((pre, curr, i, arr) => {
                const value = curr.positive ? curr.value * -1 : curr.value;
                return curr.repo === name ? pre + value : pre;
            }, 0);
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
