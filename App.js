import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput , TouchableOpacity,SafeAreaView,ScrollView} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function App() {
  const [view, setView] = useState('lista');
  const[recipes,setRecipes]=useState([]);
  const[title,setTitle]=useState("");
  const[igredients,setIgredients]=useState("");
 useEffect(()=>{
  const loadRecepies=async()=>{
    try{
      if (storedRecipes !== null){
        setRecipes(JSON.parse(storedRecipes));
      }
    }catch (e){
      console.error("Falha ao carregar receitas.",e);
    }
  };
  loadRecepies();
 },[]);
 if(!title){
  return;
 }
 const newRecipe ={
  id: Date.now().toString(),
  igredients:igredients,
 };
 setRecipes(currentRecipes=>[...currentRecipes ,newRecipe]);
 setTitle("");
 setIgredients("");
 setView('Lista');

const handleDeleteRecipe =(id)=>{
  setRecipes(currentRecipes=>currentRecipes.filter(recipe=>recipe.id!==id));
};
return(
    <SafeAreaView>
     <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>meu livro de receitas </Text>
      {view === 'lista'?(
        <View>
          <TouchableOpacity style={styles.addButton} onPress={()=>setView('formulario')}>
            <Text style ={styles.buttonText}>Adicionar nova receita </Text>
          </TouchableOpacity>
        </View>
      ): (
        <View></View>
      )}
     </ScrollView>
    </SafeAreaView>
  );

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
