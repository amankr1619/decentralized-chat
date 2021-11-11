

const app = Vue.createApp({
    data() {
      return {
        name: 'Aman',
      }
    },
    methods: {
      async connectMetamask() {
        const aleph = require('aleph-js')
        console.log(aleph.ethereum)
        let account = null
        if (window.aleph.ethereum) {
          try {
            // Request account access if needed
            await window.aleph.ethereum.enable()
            account = await aleph.ethereum.from_provider(
              window['ethereum'] || window.web3.currentProvider
            )
          } catch (error) {
              console.log(error)
          }
          console.log(account)
        }
      }
    }

})
app.mount('#app')