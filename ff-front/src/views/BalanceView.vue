<template>
    <v-container>

        <v-card
            class="mb-6"
            outlined
        >
            <v-card-title>
                {{ month.name }}
            </v-card-title>
            <v-card-text>
                <div class="d-flex flex-wrap">
                    <v-card
                        v-for="(repo, i) of month.repos"
                        :key="i"
                        min-width="200"
                        class="ma-3 pa-2"
                    >
                        <div class="subtitle-1 text-center">{{ repo.name }}</div>
                        <div v-if="!repo.isCredit">
                            <div>Saldo inicial: {{ repo.value.init }}</div>
                            <div>Saldo final: {{ repo.value.end }}</div>
                        </div>
                        <div v-else>
                            <div>Valor fatura: {{ sumRepo(repo.name) | money }}</div>
                            <div>&nbsp;</div>
                        </div>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>

        <v-row>
            <v-col class="subtitle-2">Repo.</v-col>
            <v-col class="subtitle-2">Data</v-col>
            <v-col class="subtitle-2">Categoria</v-col>
            <v-col class="subtitle-2">Descrição</v-col>
            <v-col class="subtitle-2 text-right">Valor</v-col>
        </v-row>
        <v-row
            v-for="(item, i) of month.balance"
            :key="i"
        >
            <v-col class="body-2">{{ item.repo }}</v-col>
            <v-col class="body-2">{{ item.dt | date }}</v-col>
            <v-col class="body-2">{{ item.cat }}</v-col>
            <v-col class="body-2">{{ item.desc }}</v-col>
            <v-col class="body-2 text-right"><span v-if="item.positive">(+)</span> {{ item.value | money }}</v-col>
        </v-row>

    </v-container>
</template>

<script>

export default {
    name: 'Balance',
    data: () => ({

    }),
    computed: {
        month() {
            return this.$store.getters.months.filter(v => v.key === this.$route.params.key)[0];
        }
    },
    methods: {
        sumRepo(name) {
            return this.month.balance.reduce((pre, curr, i, arr) => {
                const value = curr.positive ? curr.value * -1 : curr.value;
                return curr.repo === name ? pre + value : pre;
            }, 0);
        }
    }
}
</script>
