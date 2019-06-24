<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">脚本: </span>
                <span class="expand-value">{{ row.script_name }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">输入用户: </span>
                <span class="expand-value">{{ row.username }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">执行参数: </span>
                <span class="expand-value">{{ row.options }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <span class="expand-key">ip: </span>
                <span class="expand-value" style="word-wrap:break-word;">{{ row.ip_param }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>
