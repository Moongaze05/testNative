import React from 'react';
import { WebView } from 'react-native-webview';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen'

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
    if (event.nativeEvent.data === 'MOBILEWEB_APP false') {
      this.webview.postMessage('MOBILEWEB_APP true')
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

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    return (
      <WebView
      ref={webview => this.webview = webview}
      source={{ uri: 'http://10.66.81.209:8001/cabinet#auth' }}
      onMessage={this.onMessage}
      onLoadStart={() => {console.log('onLoadStart'); SplashScreen.show()}}
      onLoadEnd={() => {console.log('onLoadEnd'); SplashScreen.hide()}}
      showsVerticalScrollIndicator={false}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
      />
    )
  }  
}

export default App;