<template>
    <v-btn flat :color="color" :disabled="!canExecute"  @click.stop="execute">
        {{text}}
    </v-btn>
</template>

<script>
import mixin from 'neutronium-vue-command-mixin'

const props = {
    text:{
        type: String,
        required: true
    },
    color:{
        type: String,
        default: 'blue'
    }
}

export default {
    mixins: [mixin],
    props
}
</script>

<<style>

</style>
