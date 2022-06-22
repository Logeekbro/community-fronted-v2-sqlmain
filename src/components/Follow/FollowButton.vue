<template>
    <div v-if="userId != authorId">
        <button v-if="hasFollow" class="button is-success button-center is-fullwidth" @click="handleUnFollow">
            已关注
        </button>

        <button v-else class="button is-link button-center is-fullwidth" @click="handleFollow">
            关注
        </button>
    </div>

</template>

<script>
import { follow, hasFollow, unFollow } from '@/api/follow'
import store from '@/store'

export default {
    name: "FollowButton",
    data() {
        return {
            hasFollow: false,
            userId: store.getters.user.userId
        }
    },
    props: {
        authorId: {
            required: true,
            type: Number
        }
    },
    mounted() {
        this.fetchInfo()
    },
    methods: {
        fetchInfo() {
            if (this.authorId != this.userId) {
                hasFollow(this.authorId).then(value => {
                    const { data } = value
                    this.hasFollow = data.hasFollow
                })
            }
        },
        handleFollow: function () {
            follow(this.authorId).then(response => {
                this.msg.success("已关注", 700)
                this.hasFollow = !this.hasFollow
                this.$emit("addFollower")
            })

        },
        handleUnFollow: function () {
            unFollow(this.authorId).then(response => {
                this.msg.success("已取关", 700)
                this.hasFollow = !this.hasFollow
                this.$emit("reduceFollower")
            })
        }
    }

}
</script>