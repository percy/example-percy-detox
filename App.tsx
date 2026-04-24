import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Greeting = '' | 'Hello!!!' | 'World!!!' | 'Goodbye, World!!!';

export default function App(): JSX.Element {
  const [greeting, setGreeting] = useState<Greeting>('');

  if (greeting) {
    return (
      <SafeAreaView style={styles.root} testID="greeting_screen">
        <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Percy × Detox</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.greeting}>{greeting}</Text>
          <TouchableOpacity
            testID="back_button"
            style={styles.btn}
            onPress={() => setGreeting('')}>
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} testID="welcome">
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Percy × Detox</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.welcome}>Welcome</Text>
        <TouchableOpacity
          testID="hello_button"
          style={styles.btn}
          onPress={() => setGreeting('Hello!!!')}>
          <Text style={styles.btnText}>Say Hello</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="world_button"
          style={styles.btnWorld}
          onPress={() => setGreeting('World!!!')}>
          <Text style={styles.btnText}>Say World</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="goodbye_button"
          style={styles.btnGoodbye}
          onPress={() => setGreeting('Goodbye, World!!!')}>
          <Text style={styles.btnText}>Say Goodbye</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#f8fafc'},
  header: {backgroundColor: '#4f46e5', padding: 16},
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: '700'},
  body: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  welcome: {fontSize: 32, marginBottom: 40, color: '#0f172a', fontWeight: '700'},
  greeting: {fontSize: 28, marginBottom: 40, color: '#0f172a', fontWeight: '600'},
  btn: {backgroundColor: '#4f46e5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 16, minWidth: 200, alignItems: 'center'},
  btnWorld: {backgroundColor: '#22c55e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 16, minWidth: 200, alignItems: 'center'},
  btnGoodbye: {backgroundColor: '#ef4444', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, minWidth: 200, alignItems: 'center'},
  btnText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
