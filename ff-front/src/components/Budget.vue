<template>
    <v-dialog
        v-model="show"
        max-width="500"
    >
        <v-card>
            <v-card-title>
                Orçamento
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="name"
                    label="Nome"
                    :disabled="$store.getters.selectedBudget.index !== -1"
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
                    v-if="$store.getters.selectedBudget.index !== -1"
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
    name: 'Budget',
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
        name: {
            get() {
                return this.$store.getters.selectedBudget.name;
            },
            set(value) {
                this.$store.commit('budgetName', value);
            }
        },
    },
    methods: {
        save(isDelete) {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            const index = this.$store.getters.selectedBudget.index;

            if (isDelete) {
                month.budget.splice(index, 1);
            }
            else {
                if (index === -1) {
                    month.budget.push({ name: this.name, forecast: [], total: 0, totalAccomplished: 0 });
                }
                else {
                    // there is nothing to update
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
