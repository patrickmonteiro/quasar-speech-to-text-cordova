<template>
  <q-page class="container">
    <div class="row justify-center q-col-gutter-sm">
      <img class="col-xs-8 col-md-4" alt="Quasar logo" src="~assets/quasar-logo-full.svg">
      <q-input class="col-10" outlined disable v-model="name" label="Name" />
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 58]">
      <q-btn round color="primary" icon="keyboard_voice" size="xl" @click="captureSpeechToText()" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      name: ''
    }
  },
  methods: {
    captureSpeechToText () {
      this.$speechTalk('Hello! Im talking about a Quasar app in cordova mode.')
        .then(() => {
          this.secondStage()
        })
    },
    secondStage () {
      this.$speechTalk('Please say your name after the sign.')
        .then(() => {
          this.record(this.setName, this.finalStep)
        })
    },
    finalStep () {
      this.$speechTalk(`Thank you for using Quasar ${this.name}`)
    },
    setName (name) {
      this.name = name
    },
    record (step, callback = null) {
      this.$speechToText()
        .then((suc) => {
          step(suc)
          if (callback) {
            callback()
          }
        })
    }
  }
}
</script>
