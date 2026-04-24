import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

export default function App(): JSX.Element {
  const [items, setItems] = useState<Todo[]>([
    { id: '1', title: 'Write Percy Detox SDK', done: true },
    { id: '2', title: 'Run a baseline build', done: true },
    { id: '3', title: 'Approve the diff', done: false }
  ]);
  const [draft, setDraft] = useState('');

  const addItem = () => {
    const title = draft.trim();
    if (!title) return;
    setItems((prev) => [
      ...prev,
      { id: String(prev.length + 1), title, done: false }
    ]);
    setDraft('');
  };

  const toggle = (id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <SafeAreaView style={styles.root} testID="home-screen">
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <View style={styles.header} testID="home-header">
        <Text style={styles.headerTitle}>Percy × Detox Todo</Text>
      </View>

      <View style={styles.composer} testID="todo-composer">
        <TextInput
          testID="todo-input"
          style={styles.input}
          placeholder="What needs doing?"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addItem}
        />
        <TouchableOpacity testID="todo-add-btn" style={styles.addBtn} onPress={addItem}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        testID="todo-list"
        data={items}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`todo-item-${item.id}`}
            style={styles.row}
            onPress={() => toggle(item.id)}
          >
            <View style={[styles.check, item.done && styles.checkDone]} />
            <Text style={[styles.rowText, item.done && styles.rowTextDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty} testID="todo-empty">
            No todos yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#4f46e5', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  composer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  addBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginRight: 12
  },
  checkDone: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  rowText: { color: '#0f172a', fontSize: 16 },
  rowTextDone: { color: '#94a3b8', textDecorationLine: 'line-through' },
  empty: { textAlign: 'center', padding: 20, color: '#94a3b8' }
});
