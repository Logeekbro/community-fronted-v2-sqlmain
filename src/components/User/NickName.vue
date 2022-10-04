<template>
    <span>{{ name ? name : "[用户不存在]" }}</span>
</template>

<script>

import { getNickNameByUserId } from '@/api/user'

export default {
    name: "UserNickName",
    components: {},
    props: {
        userId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            name: "-"
        };
    },
    watch: {
        userId: function(n, o) {

        }
    },
    computed: {},
    methods: {
        getNickName(userId) {
            getNickNameByUserId(userId).then(rep => {
                this.name = rep.data.value
            })
        }
    },
    created() { },
    mounted() { 
        if(this.userId) this.getNickName(this.userId)
    }
};
</script>
<style scoped>

</style>