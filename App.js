import React from 'react';
import { WebView } from 'react-native-webview';
import OneSignal from 'react-native-onesignal';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.webview = null
    this.onMessage = this.onMessage.bind(this)
    this.loadOneSignal = this.loadOneSignal.bind(this)
  }

  loadOneSignal(info) {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("559ca145-81b0-425f-b327-249c49c809d9");
    
    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("Prompt response:", response);
    });
    OneSignal.setExternalUserId(info)
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData
      console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });
    
    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
      if (notification.notification.launchURL) {
        const route = notification.notification.launchURL
        console.log(`launchURL: ${route}`)
        this.webview.postMessage(`push came route ${route}`)
      }
      
    });
  }

  onMessage(event) {
    console.log(event.nativeEvent.data)
    if (event.nativeEvent.data === 'MOBILEWEB_DEBUG false') {
      this.webview.postMessage('MOBILEWEB_DEBUG true')
      return
    }
    if (event.nativeEvent.data.includes('init push')) {
      console.log('init push')
      const phone = event.nativeEvent.data.replace('init push ', '')
      console.log(phone)
      this.loadOneSignal(phone)
      return
    }
    
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