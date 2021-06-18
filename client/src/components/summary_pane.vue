<template>
    <div>
        <div class="title"></div>
        <div class="content">
            <div class="line" v-for="d in 19" :key="d">
                {{d}}
            </div>
        </div>
    </div>
</template>



<script>
export default {
    name: 'summary_tab',
    data() { return {
        ds: [
            [1,11],
            [2,22],
            [3,33],
        ]
    }}
}
//<div class="key">{{d['key']}}</div>
//            <div class="value">{{d['value']}}</div>
</script>



<style scoped>

</style>
