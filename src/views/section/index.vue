<template>
    <el-card shadow="never">
        <a-row :gutter="16">
            <a-col v-for="(item, index) in sectionList" :key="index" class="gutter-row" :span="6">
                <el-card shadow="hover" style="cursor: pointer;">
                    <a :href="'/section/' + item.sectionId">
                    <div style="text-align: center;">
                        <span style="font-size: 20px">{{ item.sectionName }}</span>
                    </div>
                </a>
                </el-card>
            </a-col>
        </a-row>
    </el-card>
</template>

<script>
import { getSectionList } from '@/api/section';


export default {
    name: "Section",
    components: {},
    props: {},
    data() {
        return {
            sectionList: []
        };
    },
    watch: {},
    computed: {},
    methods: {
        fetchSectionList() {
            getSectionList().then(rep => {
                this.sectionList = rep.data
            })
        }
    },
    created() { },
    mounted() {
        this.fetchSectionList()
     }
};
</script>
<style scoped>
</style>