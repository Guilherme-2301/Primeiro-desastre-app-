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
  const [preparo, setPreparo] = useState("");
  const [editando, setEditando] = useState(null);

  const [tela, setTela] = useState("lista"); // lista | formulario | confirmacaoExclusao
  const [indexSelecionado, setIndexSelecionado] = useState(null);

  // Salvar ou atualizar receita
  const salvarReceita = () => {
    if (!titulo || !descricao || !preparo) return;

    if (editando !== null) {
      const novas = [...receitas];
      novas[editando] = { titulo, descricao, preparo };
      setReceitas(novas);
    } else {
      setReceitas([...receitas, { titulo, descricao, preparo }]);
    }

    setTitulo("");
    setDescricao("");
    setPreparo("");
    setEditando(null);
    setTela("lista");
  };

  // Excluir receita com tela de confirmação
  const confirmarExclusao = (index) => {
    setIndexSelecionado(index);
    setTela("confirmacaoExclusao");
  };

  const excluirReceita = () => {
    if (indexSelecionado !== null) {
      setReceitas((atual) => atual.filter((_, i) => i !== indexSelecionado));
    }
    setIndexSelecionado(null);
    setTela("lista");
  };

  // Editar receita direto
  const editarReceita = (index) => {
    const r = receitas[index];
    setTitulo(r.titulo);
    setDescricao(r.descricao);
    setPreparo(r.preparo);
    setEditando(index);
    setTela("formulario");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📖 App de Receitas</Text>

      {tela === "lista" && (
        <>
          <Button title="Adicionar Receita" onPress={() => setTela("formulario")} />

          <FlatList
            data={receitas}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitulo}>{item.titulo}</Text>
                  <Text style={styles.cardSub}>Descrição:</Text>
                  <Text>{item.descricao}</Text>
                  <Text style={styles.cardSub}>Modo de Preparo:</Text>
                  <Text>{item.preparo}</Text>
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
                    onPress={() => confirmarExclusao(index)}
                  >
                    <Text style={styles.textoBotao}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      {tela === "formulario" && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Título da receita"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Modo de preparo"
            value={preparo}
            onChangeText={setPreparo}
            multiline
          />

          <Button
            title={editando !== null ? "Salvar Edição" : "Adicionar Receita"}
            onPress={salvarReceita}
          />
          <Button title="Cancelar" onPress={() => setTela("lista")} />
        </View>
      )}

      {tela === "confirmacaoExclusao" && (
        <View style={styles.confirmacao}>
          <Text style={styles.confirmacaoTexto}>
            Você realmente deseja excluir esta receita?
          </Text>
          <View style={styles.botoesConfirmacao}>
            <Button title="Cancelar" onPress={() => setTela("lista")} />
            <Button title="Excluir" color="red" onPress={excluirReceita} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
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
  },
  cardTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardSub: { fontWeight: "bold", marginTop: 8 },
  botoes: { flexDirection: "row", marginTop: 10 },
  botaoEditar: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  botaoExcluir: { backgroundColor: "#f44336", padding: 8, borderRadius: 5 },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  confirmacao: { flex: 1, justifyContent: "center", alignItems: "center" },
  confirmacaoTexto: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  botoesConfirmacao: { flexDirection: "row", gap: 15 },
});
