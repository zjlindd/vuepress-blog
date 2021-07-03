<template>
    <div>
        <el-divider></el-divider>
        <div class="content">
            <p>赞赏是就是最好的支持, 如果对你有帮助那就支持一下吧!</p>
        </div>
        <div class="flex">
            <div class="pay">
                <el-image style="width: 200px; height: 200px"  src="https://cdn.nlark.com/yuque/0/2021/png/2899468/1625321653753-3e12bf38-5124-4c55-9e12-eccf6ce85db8.png" referrerpolicy="no-referrer"></el-image>
                <p class="text">微信扫一扫打赏</p>
            </div>
            <div class="weixin">
                <el-image style="width: 200px; height: 200px"  src="https://cdn.nlark.com/yuque/0/2021/jpeg/2899468/1625321738092-94c2af78-e42e-405e-afce-01f303c04034.jpeg" referrerpolicy="no-referrer"></el-image>
                <p class="text">支付宝扫一扫打赏</p>
            </div>
        </div>
    </div>
    
</template>

<script>
    export default {
        name: "my-demo"
    }
</script>

<style scoped type="text/scss">
    .content {
        text-align: center;
        color: darkred;
        font-weight: bold;
    }
    .flex {
        display: flex;
        justify-content: center;
    }
    .pay,.weixin {
        text-align: center;
        margin: 0 6rem;
    }
    .text {
        color: #0f80c7;
    }

</style>