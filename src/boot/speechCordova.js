import { Loading, QSpinnerAudio, QSpinnerBars, Platform } from 'quasar'
export default async ({ Vue }) => {
  const lang = 'en-US'
  Vue.prototype.$speechTalk = (text) => {
    return new Promise((resolve, reject) => {
      if (Platform.is.cordova) {
        cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
          if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            Loading.show({
              delay: 0,
              spinner: QSpinnerAudio, // ms,
              backgroundColor: 'primary'
            })
            window.TTS.speak({
              text: text,
              locale: lang,
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
      } else {
        let speech = new SpeechSynthesisUtterance()
        // Set the text and voice attributes.
        speech.lang = lang
        speech.text = text
        speech.volume = 1
        speech.rate = 1
        speech.pitch = 1
        setTimeout(() => {
          window.speechSynthesis.speak(speech)
        }, 300)

        speech.addEventListener('end', () => {
          Loading.hide()
          resolve(true)
        })
      }
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
          message: 'Awaiting Audio',
          messageColor: 'white'
        })
        recognition.lang = lang // this.voiceSelect
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
