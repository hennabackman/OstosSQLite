import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Keyboard } from 'react-native';
import database from './firebase';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log('useEffect');
    const itemsRef = ref(database, '/items');
    onValue(itemsRef, snapshot => {
      const data = snapshot.val();
      const products = data ? Object.keys(data).map(key => ({ key, ...data[key]}))
      : [];
      setItems(products);
      console.log(products.length, 'items read');
    });
  }, []);

  const SaveItem = () => {
    console.log('saveItem', { product, amount})
    push(ref(database, '/items'), { 'product': product, 'amount': amount});
    setProduct('');
    setAmount('');
    Keyboard.dismiss();
  }

  const deleteItem = (key) => {
    console.log('deleteItem', key, items.find(item => item.key === key));
    remove(ref(database, 'items/' + key));
  };
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={{marginTop: 5, marginBottom: 5, fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Add to List" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping List</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <View style={styles.listcontainer}>
            <Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
            <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Bought</Text>
          </View>
        } 
        data={shoppingList} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
      
