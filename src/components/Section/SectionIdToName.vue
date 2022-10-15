<template>
    <span>{{ name }}</span>
</template>

<script>
import { getSectionNameBySectionId } from '@/api/section'

export default {
    components: {},
    props: {
        sectionId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            name: '-'
        };
    },
    watch: {
        sectionId: function (n, o) {
            this.setSctionName(n)
        }
    },
    computed: {},
    methods: {
        setSctionName(sectionId) {
            getSectionNameBySectionId(sectionId).then(rep => {
                this.name = rep.data.value
            })
        }
    },
    created() { },
    mounted() {
        if (this.sectionId) {
            this.setSctionName(this.sectionId)
        }
    }
};
</script>
<style scoped>

</style>