import React from 'react';
import { WebView } from 'react-native-webview';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.webview = null
    this.onMessage = this.onMessage.bind(this)
  }

  onMessage(event) {
    // alert(`onMessage props: , ${event.nativeEvent.data}`)
    const webDebug = !!event.nativeEvent.data
    this.webview.postMessage(webDebug)
  }

  render() {
    return (
      <WebView
      ref={webview => this.webview = webview}
      source={{ uri: 'http://10.66.81.209:8001/cabinet#auth' }}
      onMessage={this.onMessage}
      />
    )
  }  
}

export default App;
 // const url = 'http://10.0.2.2:8001/cabinet#auth'
  // const url = 'http://10.66.81.209:8001/cabinet#auth'
  // const url = 'http://10.66.81.209:8081/cabinet#auth'
  // const url = 'http://127.0.0.1:8001/cabinet#auth'
  // const url = 'http://localhost:8001/cabinet#auth'
  // const url = 'http://91.191.250.154:8001/cabinet#auth'
  // 10.66.81.209

  // const injectScript = `(function () {
  //   setTimeout(() => {
  //     const _GLOBALFLAG=888
  //     console.log('injectScript')
  //   // alert(_GLOBALFLAG)
  //   const MOBILEWEB_DEBUG = false
  //   }, 2000)
  //   true;
  // })()`;