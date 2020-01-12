import { Loading, QSpinnerAudio, QSpinnerBars } from 'quasar'
export default async ({ Vue }) => {
  Vue.prototype.$speechTalk = (text) => {
    console.log('Status microfone', cordova.plugins.diagnostic.permissionStatus.GRANTED)
    return new Promise((resolve, reject) => {
      cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
        if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
          Loading.show({
            delay: 0,
            spinner: QSpinnerAudio, // ms,
            backgroundColor: 'primary'
          })
          window.TTS.speak({
            text: text,
            locale: 'en-US',
            rate: 0.60
          }, () => {
            Loading.hide()
            setTimeout(() => {
              resolve(true)
            }, 400)
          }, (reason) => {
            reject(reason)
          })
        }
      }, function (error) {
        reject(error)
        console.error(error)
      })
    })
  }
  Vue.prototype.$speechToText = () => {
    return new Promise((resolve, reject) => {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      let recognition = SpeechRecognition ? new SpeechRecognition() : false
      let text = ''

      setTimeout(() => {
        Loading.show({
          spinner: QSpinnerBars, // ms,
          backgroundColor: 'primary',
          message: 'Aguardando áudio',
          messageColor: 'white'
        })
        recognition.lang = 'en-US' // this.voiceSelect
        recognition.start()
      }, 400)

      recognition.onresult = (event) => {
        let current = event.resultIndex
        // Get a transcript of what was said.
        let transcript = event.results[current][0].transcript
        // Add the current transcript to the contents of our Note.
        // var noteContent += transcript
        text += transcript
        resolve(text)
      }
      recognition.onend = () => {
        text = ''
        Loading.hide()
      }
    })
  }
}
