<template>
    <div v-if="clickable">
        <router-link :to="{ name: 'user', params: { username: userId } }">
            <a-avatar :shape="shape" :size="size" :src="avatar" />
        </router-link>
    </div>
    <div v-else>
        <a-avatar :shape="shape" :size="size" :src="avatar" />
    </div>
</template>

<script>
import store from '@/store'
import { getAvatar } from '@/api/user'

export default {
    name: "UserAvatar",
    props: {
        userId: {
            type: Number,
            default: 0
        },
        shape: {
            type: String,
            default: "circle"
        },
        size: {
            type: Number,
            default: 42
        },
        clickable: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            avatarTS: store.getters.avatarTS,
            avatar: null,
            user: store.getters.user,
        };
    },
    watch: {
        userId: function(n, o) {
            this.getSrc(n)
        }
    },
    computed: {
    },
    methods: {
        getSrc(userId) {
            if (userId == this.user.userId) {
                this.avatar = this.user.avatar + '?' + this.avatarTS
            }
            else {
                getAvatar(userId).then(rep => {
                    this.avatar = rep.data.value + '?' + this.avatarTS
                })
            }
        }
    },
    created() {

    },
    mounted() {
        this.getSrc(this.userId)
    }
}
</script>
<style scoped>
</style>