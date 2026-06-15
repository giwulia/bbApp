import DefaultAvatar from "@/components/DefaultAvatar";
import { searchUsers, addPlayer} from "@/src/api/client";
import { User, Player } from "@/src/api/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddPlayerScreen() {
  const router = useRouter();
  const { gameId, position, players: playersJSON} = useLocalSearchParams<{ gameId: string; position: string, players:string }>();

  const existingPlayers: Player[] = JSON.parse(playersJSON ?? "[]");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);

  async function handleSearch(text: string) {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }
    const users = await searchUsers(text);
    setResults(users);
  }

  async function handleConfirm() {
    if (!selected) return;
    await addPlayer(gameId, selected.username, position || "open");
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#27253F" />
        </Pressable>
        <Text style={styles.headerTitle}>Add a player</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={query}
          onChangeText={handleSearch}
          autoFocus
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const inGame = existingPlayers.some((p) => p.user_id === item.id);
          return (
          <Pressable
            style={[
              styles.userRow,
              selected?.id === item.id && styles.userRowSelected,
              inGame && styles.userRowDisabled,
            ]}
            onPress={() => !inGame && setSelected(selected?.id === item.id ? null : item)}
          >
            {item.image ? (
                <Image source={{ uri: item.image }} style={[styles.avatar, inGame && styles.avatarDisabled]} />
            ) : (
              <DefaultAvatar name={item.name} size={42} fontSize={14} />
            )}
            <View style={styles.userInfo}>
              <Text style={[styles.userName, inGame && styles.textDisabled]}>{item.name}</Text>
              <Text style={styles.userUsername}>
                {inGame ? "Already in game" : `@${item.username}`}
                </Text>
            </View>
            {selected?.id === item.id && <Ionicons name="checkmark" size={20} color="#27253F" />}
          </Pressable>
        )}}
        ListEmptyComponent={
          query.length > 0 ? <Text style={styles.emptyText}>No users found</Text> : null
        }
      />

      {selected && (
        <View style={styles.footer}>
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Add {selected.name.split(" ")[0]}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27253F",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#27253F",
  },
  list: {
    paddingHorizontal: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 12,
  },
  userRowSelected: {
    backgroundColor: "#f0f0f8",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  userRowDisabled: {
    opacity: 0.4,
  },
  avatarDisabled: {
    opacity: 0.5,
  },
  textDisabled: {
    color: "gray",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#27253F",
  },
  userUsername: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 32,
    fontSize: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  confirmButton: {
    backgroundColor: "#D81159",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
