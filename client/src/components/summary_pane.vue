<template>
    <button @click="get_filtered">test</button>
</template>



<script>
export default {
    name: 'summary_tab',
    data() { return {
        events: [],
    }},

    methods: {
        async get_filtered () {
            let data= await this.$http.post(
                '/filter_tr', {
                    kwargs: JSON.stringify({
                        recency: 180*86400,
                        filters: ['completed'],
                        extractors: ['credits'],
                    })
                }
            )
            console.log('got', data)
            return data
        }
    }
}
//<div class="key">{{d['key']}}</div>
//            <div class="value">{{d['value']}}</div>
</script>



<style scoped>

</style>
