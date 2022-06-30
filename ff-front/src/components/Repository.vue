<template>
    <v-dialog
        v-model="show"
        max-width="500"
    >
        <v-card>
            <v-card-title>
                Repositório
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="name"
                    label="Nome"
                    :disabled="$store.getters.selectedRepo.index !== -1"
                ></v-text-field>
                <v-text-field
                    v-model="init"
                    label="Valor Inicial"
                    :disabled="isCredit"
                ></v-text-field>
                <v-checkbox
                    v-model="isCredit"
                    label="Cartão de Crédito"
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
                    v-if="$store.getters.selectedRepo.index !== -1"
                    outlined
                    small
                    color="error"
                    @click="remove()"
                >Excluir</v-btn>
                <v-btn
                    outlined
                    small
                    color="primary"
                    @click="save()"
                >Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

import axios from 'axios';

export default {
    name: 'Repository',
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
                return this.$store.getters.selectedRepo.name;
            },
            set(value) {
                this.$store.commit('repoName', value);
            }
        },
        init: {
            get() {
                return this.$store.getters.selectedRepo.value.init;
            },
            set(value) {
                this.$store.commit('repoInit', value);
            }
        },
        isCredit: {
            get() {
                return this.$store.getters.selectedRepo.isCredit;
            },
            set(value) {
                this.$store.commit('repoIsCredit', value);
            }
        }
    },
    methods: {
        save() {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            const index = this.$store.getters.selectedRepo.index;

            if (index === -1) {
                month.repos.push({ name: this.name, value: { init: this.init, end: null }, isCredit: this.isCredit });
            }
            else {
                month.repos[index].value.init = this.init;
                month.repos[index].isCredit = this.isCredit;
            }

            axios({
                method: 'post',
                url: `http://localhost:3000/${this.$route.params.key
                    }`,
                data: month
            }).then(res => {
                this.$store.commit('updateMonth', res.data);
                this.show = false;
            }).catch(err => console.log(err));
        },
        remove() {
            const month = this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
            const index = this.$store.getters.selectedRepo.index;

            month.repos.splice(index, 1);

            axios({
                method: 'post',
                url: `http://localhost:3000/${this.$route.params.key}`,
                data: month
            }).then(res => {
                this.$store.commit('updateMonth', res.data);
                this.show = false;
            }).catch(err => console.log(err));
        }
    }
}

</script>
