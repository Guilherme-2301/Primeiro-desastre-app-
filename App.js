// App.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Recipes from './Recipes';

export default function App() {
  const [screen, setScreen] = useState('menu');

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'menu' ? (
        <View style={styles.menuContainer}>
          <Text style={styles.header}>📖 Meu Livro de Receitas</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setScreen('receitas')}
          >
            <Text style={styles.buttonText}>Receitas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Recipes onBack={() => setScreen('menu')} />
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#e67e22',
  },
  menuButton: {
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

// Recipes.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recipes({ onBack }) {
  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparation, setPreparation] = useState('');
  const [editId, setEditId] = useState(null);

  // Carregar receitas
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('@recipes');
        if (storedRecipes !== null) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e) {
        console.error('Falha ao carregar receitas.', e);
      }
    };
    loadRecipes();
  }, []);

  // Salvar receitas
  useEffect(() => {
    AsyncStorage.setItem('@recipes', JSON.stringify(recipes));
  }, [recipes]);

  // Adicionar ou Editar Receita
  const handleSaveRecipe = () => {
    if (!title) return;

    if (editId) {
      setRecipes((current) =>
        current.map((r) =>
          r.id === editId
            ? { ...r, title, ingredients, preparation }
            : r
        )
      );
      setEditId(null);
    } else {
      const newRecipe = {
        id: Date.now().toString(),
        title,
        ingredients,
        preparation,
      };
      setRecipes((current) => [...current, newRecipe]);
    }

    setTitle('');
    setIngredients('');
    setPreparation('');
    setView('lista');
  };

  // Editar
  const handleEditRecipe = (recipe) => {
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setPreparation(recipe.preparation);
    setEditId(recipe.id);
    setView('formulario');
  };

  // Deletar
  const handleDeleteRecipe = (id) => {
    Alert.alert(
      'Confirmação',
      'Deseja deletar essa receita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () =>
            setRecipes((current) =>
              current.filter((r) => r.id !== id)
            ),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Minhas Receitas</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {view === 'lista' ? (
        <View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setView('formulario')}
          >
            <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
          </TouchableOpacity>

          {recipes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
          ) : (
            recipes.map((item) => (
              <View key={item.id} style={styles.recipeItem}>
                <View style={styles.recipeTextContainer}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                  <Text style={styles.recipePreparation}>{item.preparation}</Text>
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditRecipe(item)}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRecipe(item.id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formHeader}>
            {editId ? 'Editar Receita' : 'Adicionar Receita'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Título da Receita"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingredientes"
            value={ingredients}
            onChangeText={setIngredients}
            multiline={true}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Modo de Preparo"
            value={preparation}
            onChangeText={setPreparation}
            multiline={true}
          />

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setView('lista');
                setEditId(null);
                setTitle('');
                setIngredients('');
                setPreparation('');
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formButton, styles.saveButton]}
              onPress={handleSaveRecipe}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            {/* Botão IA (quinto desafio futuro) */}
            <TouchableOpacity
              style={[styles.formButton, styles.iaButton]}
              onPress={() => alert('Integração IA aqui futuramente')}
            >
              <Text style={styles.buttonText}>Adicionar com IA</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  recipeTextContainer: {
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recipePreparation: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  formButton: {
    padding: 12,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  iaButton: {
    backgroundColor: '#8e44ad',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
});