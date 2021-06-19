<template>
    <div>
        <div class="title"></div>
        <div class="content">
            <div v-for="(e,i) in events" :key="i">
                {{e}}
            </div>
        </div>
    </div>
</template>



<script>
export default {
    name: 'summary_tab',
    data() { console.log('data');return {
        events: [],
    }},

    created() {
        this.events= [1,2,3]
        console.log("Starting connection.", this)
        this.connection = new WebSocket("ws://localhost:8202/test")

        this.connection.onmessage = function(msg) {
            this.events= JSON.parse(msg.data)
            console.log('Got message.', this, this.events)
        }.bind(this)

        this.connection.onopen = function(msg) {
              console.log(msg)
              console.log("Connected.")
        }
    },
}
//<div class="key">{{d['key']}}</div>
//            <div class="value">{{d['value']}}</div>
</script>



<style scoped>

</style>
