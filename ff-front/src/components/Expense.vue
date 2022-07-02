<template>
    <v-dialog
        v-model="show"
        max-width="500"
    >
        <v-card>
            <v-card-title>
                Lançamento
            </v-card-title>
            <v-card-text>
                <v-select
                    :items="repoList"
                    item-text="name"
                    item-value="name"
                    v-model="repo"
                    label="Repositório"
                ></v-select>
                <v-text-field
                    v-model="dt"
                    label="Data"
                ></v-text-field>
                <v-select
                    :items="catList"
                    v-model="cat"
                    label="Categoria"
                ></v-select>
                <v-text-field
                    v-model="desc"
                    label="Descrição"
                ></v-text-field>
                <v-text-field
                    v-model="expenseValue"
                    label="Valor"
                ></v-text-field>
                <v-checkbox
                    v-model="positive"
                    label="Crédito"
                ></v-checkbox>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    outlined
                    small
                    @click="show = false"
                >Fechar</v-btn>
                <v-btn
                    v-if="$store.getters.selectedExpense.index !== -1"
                    outlined
                    small
                    color="error"
                    @click="save(true)"
                >Excluir</v-btn>
                <v-btn
                    outlined
                    small
                    color="primary"
                    @click="save(false)"
                >Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import { setMonth, updateSums } from '../common';

export default {
    name: 'Expense',
    props: ['value'],
    computed: {
        show: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('change', value);
                this.$emit('input', value);
            }
        },
        repoList() {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            return month ? month.repos : [];
        },
        catList() {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            const list = [];
            if (month) {
                for (let i = 0; i < month.budget.length; i++) {
                    list.push(...month.budget[i].forecast);
                }
            }
            return list.map(item => item.cat);
        },
        repo: {
            get() {
                return this.$store.getters.selectedExpense.repo;
            },
            set(value) {
                this.$store.commit('expenseRepo', value);
            }
        },
        dt: {
            get() {
                return this.$store.getters.selectedExpense.dt;
            },
            set(value) {
                this.$store.commit('expenseDt', value);
            }
        },
        cat: {
            get() {
                return this.$store.getters.selectedExpense.cat;
            },
            set(value) {
                this.$store.commit('expenseCat', value);
            }
        },
        desc: {
            get() {
                return this.$store.getters.selectedExpense.desc;
            },
            set(value) {
                this.$store.commit('expenseDesc', value);
            }
        },
        expenseValue: {
            get() {
                return this.$store.getters.selectedExpense.value;
            },
            set(value) {
                this.$store.commit('expenseValue', value);
            }
        },
        positive: {
            get() {
                return this.$store.getters.selectedExpense.positive;
            },
            set(value) {
                this.$store.commit('expensePositive', value);
            }
        }
    },
    methods: {
        save(isDelete) {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            const index = this.$store.getters.selectedExpense.index;

            if (isDelete) {
                month.balance.splice(index, 1);
            }
            else {
                if (index === -1) {
                    month.balance.push({ repo: this.repo, dt: this.dt, cat: this.cat, desc: this.desc, value: parseFloat(this.expenseValue), positive: this.positive });
                }
                else {
                    month.balance[index].repo = this.repo;
                    month.balance[index].dt = this.dt;
                    month.balance[index].cat = this.cat;
                    month.balance[index].desc = this.desc;
                    month.balance[index].value = parseFloat(this.expenseValue);
                    month.balance[index].positive = this.positive;
                }
            }

            updateSums(month);

            setMonth(this.$route.params.key, month).then(data => {
                this.$store.commit('updateMonth', data);
                this.show = false;
            }).catch(err => console.log(err));
        },
    }
}

</script>
