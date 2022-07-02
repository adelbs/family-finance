<template>
    <v-dialog
        v-model="show"
        max-width="500"
    >
        <v-card>
            <v-card-title>
                Previsão
            </v-card-title>
            <v-card-text>
                <v-select
                    :items="budgetList"
                    v-model="budget"
                    item-text="text"
                    item-value="value"
                    label="Orçamento"
                    :disabled="$store.getters.selectedForecast.index !== -1"
                ></v-select>
                <v-text-field
                    v-model="cat"
                    label="Categoria"
                    :disabled="$store.getters.selectedForecast.index !== -1"
                ></v-text-field>
                <v-text-field
                    v-model="forecastValue"
                    label="Valor"
                ></v-text-field>
                <v-text-field
                    v-model="notes"
                    label="Notas"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    outlined
                    small
                    @click="show = false"
                >Fechar</v-btn>
                <v-btn
                    v-if="$store.getters.selectedForecast.index !== -1"
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
    name: 'Forecast',
    props: ['value'],
    data: () => ({}),
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
        budgetList() {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            return month ? month.budget.map((item, i) => ({ text: item.name, value: i })) : [];
        },
        budget: {
            get() {
                return this.$store.getters.selectedForecast.indexBudget;
            },
            set(value) {
                this.$store.commit('forecastIndexBudget', value);
            }
        },
        cat: {
            get() {
                return this.$store.getters.selectedForecast.cat;
            },
            set(value) {
                this.$store.commit('forecastCat', value);
            }
        },
        forecastValue: {
            get() {
                return this.$store.getters.selectedForecast.value;
            },
            set(value) {
                this.$store.commit('forecastValue', value);
            }
        },
        notes: {
            get() {
                return this.$store.getters.selectedForecast.notes;
            },
            set(value) {
                this.$store.commit('forecastNotes', value);
            }
        }
    },
    methods: {
        save(isDelete) {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            const index = this.$store.getters.selectedForecast.index;
            const indexBudget = this.$store.getters.selectedForecast.indexBudget;

            if (isDelete) {
                month.budget[indexBudget].forecast.splice(index, 1);
            }
            else {
                if (index === -1) {
                    month.budget[indexBudget].forecast.push({ cat: this.cat, value: parseFloat(this.forecastValue), accomplished: 0, notes: this.notes });
                }
                else {
                    month.budget[indexBudget].forecast[index].cat = this.cat;
                    month.budget[indexBudget].forecast[index].value = parseFloat(this.forecastValue);
                    month.budget[indexBudget].forecast[index].notes = this.notes;
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
