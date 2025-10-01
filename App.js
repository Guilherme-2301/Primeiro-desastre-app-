import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [receitas, setReceitas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editando, setEditando] = useState(null);

  // Adicionar ou Editar Receita
  const adicionarOuEditar = () => {
    if (!titulo || !descricao) return;

    if (editando !== null) {
      const novas = [...receitas];
      novas[editando] = { titulo, descricao };
      setReceitas(novas);
      setEditando(null);
    } else {
      setReceitas([...receitas, { titulo, descricao }]);
    }

    setTitulo("");
    setDescricao("");
  };

  // Editar Receita
  const editarReceita = (index) => {
    setTitulo(receitas[index].titulo);
    setDescricao(receitas[index].descricao);
    setEditando(index);
  };

  // Excluir Receita (corrigido ✅)
  const excluirReceita = (index) => {
    setReceitas((atual) => atual.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📖 App de Receitas</Text>

      <TextInput
        style={styles.input}
        placeholder="Título da receita"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição da receita"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button
        title={editando !== null ? "Salvar Edição" : "Adicionar Receita"}
        onPress={adicionarOuEditar}
      />

      <FlatList
        data={receitas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              <Text>{item.descricao}</Text>
            </View>

            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => editarReceita(index)}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirReceita(index)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitulo: { fontSize: 18, fontWeight: "bold" },
  botoes: { flexDirection: "row", marginLeft: 10 },
  botaoEditar: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  botaoExcluir: { backgroundColor: "#f44336", padding: 8, borderRadius: 5 },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});
