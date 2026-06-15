import DefaultAvatar from "@/components/DefaultAvatar";
import GameCard from "@/components/GameCard";
import { getUser, getUserGames } from "@/src/api/client";
import { GameResponse, User } from "@/src/api/types";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sortGamesByDateAsc = (games: GameResponse[]) =>
  [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const sortGamesByDateDesc = (games: GameResponse[]) =>
  [...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [pastGames, setPastGames] = useState<GameResponse[]>([]);
  const [incomingGames, setIncomingGames] = useState<GameResponse[]>([]);
  const [myGames, setMyGames] = useState<GameResponse[]>([]);
  const [gamesView, setGamesView] = useState<"upcoming" | "past" | "myGames">("upcoming");

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!authUser) return;
      getUser(authUser.id).then(setUser);
      getUserGames("upcoming", authUser.id).then((games) => setIncomingGames(sortGamesByDateAsc(games)));
      getUserGames("past", authUser.id).then((games) => setPastGames(sortGamesByDateDesc(games)));
      getUserGames("myGames", authUser.id).then((games) => setMyGames(sortGamesByDateDesc(games)));
    }, [authUser]),
  );

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.topSection}>
        <View style={styles.settingsRow}>
          <Text style={styles.userName}>{user.username}</Text>
          <Pressable style={styles.addButton} onPress={() => router.push("/createFlow/createGame")}>
            <Ionicons name="add" size={28} color="#27253F" />
          </Pressable>
          <Pressable
            style={styles.settingsButton}
            onPress={() =>
              router.push({
                pathname: "/profile/settings",
                params: { user: JSON.stringify(user) },
              })
            }
          >
            <Ionicons name="settings" size={26} color="#27253F" />
          </Pressable>
        </View>
        <View style={styles.divider} />
        <View style={styles.profileDetailsContainer}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.profilePicture} />
          ) : (
            <DefaultAvatar name={user.name} size={86} fontSize={26} />
          )}
          <View style={styles.profileDetailsColumn}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.profileStat}>
              Volleyball{user.main_role ? ` · ${user.main_role.charAt(0).toUpperCase() + user.main_role.slice(1)}` : ""}
            </Text>
          </View>
        </View>
        <View style={styles.gamesHeaderRow}>
          <Pressable
            style={[styles.gamesButton, gamesView === "upcoming" && styles.gamesButtonActive]}
            onPress={() => setGamesView("upcoming")}
          >
            <Text style={[styles.gamesButtonText, gamesView === "upcoming" && styles.gamesButtonTextActive]}>
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            style={[styles.gamesButton, gamesView === "past" && styles.gamesButtonActive]}
            onPress={() => setGamesView("past")}
          >
            <Text style={[styles.gamesButtonText, gamesView === "past" && styles.gamesButtonTextActive]}>Past</Text>
          </Pressable>
          <Pressable
            style={[styles.gamesButton, gamesView === "myGames" && styles.gamesButtonActive]}
            onPress={() => setGamesView("myGames")}
          >
            <Text style={[styles.gamesButtonText, gamesView === "myGames" && styles.gamesButtonTextActive]}>
              My Games
            </Text>
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {gamesView === "upcoming" ? (
          incomingGames.length > 0 ? (
            incomingGames.map((item) => (
              <GameCard
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/search/[id]",
                    params: { id: item.id },
                  })
                }
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming games</Text>
          )
        ) : gamesView === "past" ? (
          pastGames.length > 0 ? (
            pastGames.map((item) => (
              <GameCard
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/search/[id]",
                    params: { id: item.id },
                  })
                }
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No past games</Text>
          )
        ) : myGames.length > 0 ? (
          myGames.map((item) => (
            <GameCard
              key={item.id}
              item={item}
              dimmed={new Date(item.date) < new Date()}
              onPress={() =>
                router.push({
                  pathname: "/search/[id]",
                  params: { id: item.id },
                })
              }
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No games yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: "white",
  },
  settingsRow: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  addButton: {
    position: "absolute",
    left: 20,
  },
  settingsButton: {
    position: "absolute",
    right: 20,
  },
  profileDetailsContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 15,
    alignItems: "center",
  },
  profilePicture: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  profileDetailsColumn: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
  },
  gamesHeaderRow: {
    flexDirection: "row",
  },
  gamesButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  gamesButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#27253F",
  },
  gamesButtonText: {
    fontSize: 14,
    color: "gray",
  },
  gamesButtonTextActive: {
    color: "#27253F",
    fontWeight: "600",
  },
  profileStat: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 32,
  },
});
