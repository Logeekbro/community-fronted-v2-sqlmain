<template>
    <!-- <a-card :bordered="false" style="width: 300px; margin-left: 30%;">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </a-card> -->
    <el-card shadow="never" style="height: 400px; width: 600px;margin-left: 20%">
        <div>
            <ul>
                <li><strong style="font-size: 22px">新消息提醒:</strong></li>
                <li>
                    <br />
                    <strong>是否开启：</strong>
                    <a-switch size="small" v-model="openMessageFetch" />
                </li>
                <li>
                    <strong>输入轮询时间间隔(单位：秒, 范围: 2-999):</strong>
                    <div style="width: 70px; display:inline-block; margin-left: 25px;">
                        <vs-input-number :min="2" :max="999" v-model="messageCycleTime" />
                    </div>
                </li>
                <li>
                    <a-button>
                        <strong @click="save">保存</strong>
                    </a-button>
                </li>
            </ul>
        </div>

    </el-card>
</template>

<script>
export default {
    name: "Custom",
    components: {},
    props: {},
    data() {
        return {
            openMessageFetch: true,
            messageCycleTime: 10
        };
    },
    watch: {
        messageCycleTime: function (n, o) {
            if (!n || n > 999 || n < 2) {
                this.messageCycleTime = o
            }
        },
    },

    computed: {},
    methods: {
        useMessageCycleFetch(checked) {
            this.openMessageFetch = checked
        },
        save() {
            localStorage.setItem('messageCycleTime', this.messageCycleTime)
            localStorage.setItem('openMessageFetch', this.openMessageFetch ? "true" : "")
            this.msg.success("已保存")
            location.reload()
        }
    },
    created() { },
    mounted() {
        this.openMessageFetch =
            localStorage.getItem('openMessageFetch') == null ? true : Boolean(localStorage.getItem('openMessageFetch'))
        this.messageCycleTime =
            localStorage.getItem('messageCycleTime') == null ? 10 : localStorage.getItem('messageCycleTime')
    }
};
</script>
<style scoped>
</style>