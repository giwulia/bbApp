import DefaultAvatar from "@/components/DefaultAvatar";
import { changePosition, getGame, leaveGame, joinGame } from "@/src/api/client";
import type { Player } from "@/src/api/types";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function PlayerSlot({ player, onPress }: { player?: any; onPress: () => void }) {
  return (
    <View style={styles.teamPositionProfileSet}>
      <Pressable onPress={onPress} style={styles.teamPositionProfile}>
        {player ? (
          player.image ? (
            <Image source={{ uri: player.image }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <DefaultAvatar name={player.name} />
          )
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptySlotPlus}>+</Text>
          </View>
        )}
      </Pressable>
      <Text style={styles.teamPositionName}>{player?.name?.split(" ")[0] ?? ""}</Text>
    </View>
  );
}

function TeamPositionRow({
  label,
  players,
  slots,
  onPlayerPress,
  onEmptyPress,
}: {
  label: string;
  players: any[];
  slots: number;
  onPlayerPress: (player: any) => void;
  onEmptyPress: () => void;
}) {
  return (
    <View style={styles.teamPositionCard}>
      <Text style={styles.positionLabel}>{label}</Text>
      <View style={styles.teamPositionRow}>
        {Array.from({ length: slots }, (_, i) => {
          const player = players[i];
          return (
            <PlayerSlot
              key={player?.user_id ?? `empty-${label}-${i}`}
              player={player}
              onPress={() => (player ? onPlayerPress(player) : onEmptyPress())}
            />
          );
        })}
      </View>
    </View>
  );
}

const positions = [
  { key: "setter", label: "SETTERS" },
  { key: "outside", label: "OUTSIDES" },
  { key: "middle", label: "MIDDLES" },
  { key: "opposite", label: "OPPOSITES" },
  { key: "libero", label: "LIBEROS" },
];

export default function TeamSheet() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const {
    id,
    gameTitle,
    organizer,
    price,
    image,
    total_spots,
    players: playersJSON,
    positionSlots: slotsJSON,
  } = useLocalSearchParams<{
    id: string;
    organizer: string;
    gameTitle: string;
    price: string;
    image: string;
    total_spots: string;
    players: string;
    positionSlots: string;
  }>();

  const [players, setPlayers] = useState<Player[]>(JSON.parse(playersJSON ?? "[]"));
  const [message, setMessage] = useState("");
  const [pendingPosition, setPendingPosition] = useState<{position: string, step: 'move'|'choice' |'self' | 'friend'} | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const positionSlots: Record<string, number> = JSON.parse(slotsJSON || "{}");
  const alreadyJoined = !!authUser && players.some((p) => p.user_id === authUser.id);
  const isGameHost = !!authUser && organizer === authUser.id;

  useFocusEffect(
    useCallback(() => {
      getGame(id).then((game) => {
        if (game) setPlayers([...game.players]);
      });
    }, [id]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#27253F" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {gameTitle}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {slotsJSON !== "" ? (
          <>
            <Text style={styles.subtitle}>Select your position</Text>
            {positions.map(({ key, label }) => {
              const slots = positionSlots[key] ?? 0;
              if (slots === 0) return null;
              const playersInPosition = players.filter((p) => p.position === key);
              return (
                <TeamPositionRow
                  key={key}
                  label={label}
                  players={playersInPosition}
                  slots={slots}
                  onPlayerPress={(player) => router.push({ pathname: "./profile", params: { id: player.user_id } })}
                  onEmptyPress={() => {
                      if (playersInPosition.length < slots) {
                        if (isGameHost){
                            setPendingPosition({position : key, step:'choice'})
                        }
                          else {router.push({
                              pathname: "./checkout",
                              params: { gameId: id, position: key, gameTitle, price, image },
                            })} ;
                      } else if (alreadyJoined && !isGameHost){
                        const currentPosition = players.find((p) => p.user_id === authUser?.id)?.position;
                        if (key === currentPosition) return;
                        setPendingPosition({position : key, step:'move'});
                      }
                  }}
                />
              );
            })}
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Open drill — join any spot</Text>
            {Array.from({ length: Math.ceil(Number(total_spots) / 3) }, (_, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={{ flexDirection: "row", justifyContent: "center", marginBottom: 12 }}
              >
                {Array.from({ length: 3 }, (_, colIndex) => {
                  const slotIndex = rowIndex * 3 + colIndex;
                  const player = players[slotIndex];
                  if (slotIndex >= Number(total_spots)) return null;
                  return (
                    <PlayerSlot
                      key={`open-${slotIndex}`}
                      player={player}
                      onPress={() => {
                        if (player) {
                          router.push({ pathname: "./profile", params: { id: player.user_id } });
                        } else if (isGameHost) {
                          setPendingPosition({ position: "open", step: "choice" });
                        } else if (!alreadyJoined) {
                          router.push({ pathname: "./checkout", params: { gameId: id, position: "open", gameTitle, price, image } });
                        }
                      }}
                    />
                  );
                })}
              </View>
            ))}
          </>
        )}
        {alreadyJoined && (
          <View style={styles.cancelFooter}>
            <Pressable style={styles.cancelButton} onPress={() => setShowCancelConfirm(true)}>
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <Modal visible={message !== ""} transparent animationType="fade" onRequestClose={() => setMessage("")}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalMessage}>{message}</Text>
            <Pressable onPress={() => setMessage("")} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={pendingPosition !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingPosition(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {pendingPosition?.step === "choice" && (
              <>
                <Text style={styles.modalMessage}>Add a player?</Text>
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setPendingPosition(null)} style={styles.modalClose}>
                    <Text style={styles.modalCloseText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                      style={styles.modalClose}
                      onPress={() =>{
                        setPendingPosition(null)
                        router.push({pathname:"./addPlayer", params:{ gameId:id, players: JSON.stringify(players), position: pendingPosition.position}})
                      }}
                    >
                      <Text style={styles.modalPrimaryText}>Add a friend</Text>
                    </Pressable>
                  {!alreadyJoined && (
                    <Pressable
                      style={styles.modalClose}
                      onPress={() => setPendingPosition({ position: pendingPosition.position, step: "self" })}
                    >
                      <Text style={styles.modalPrimaryText}>Add yourself</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
            {pendingPosition?.step === "self" && (
              <>
                <Text style={styles.modalMessage}>Add yourself to the game?</Text>
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setPendingPosition(null)} style={styles.modalClose}>
                    <Text style={styles.modalCloseText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalClose}
                    onPress={async () => {
                      const pos = pendingPosition.position;
                      setPendingPosition(null);
                      try {
                        await joinGame(id, pos, true);
                        const updated = await getGame(id);
                        if (updated) setPlayers([...updated.players]);
                        setMessage("You've been added to the game!");
                      } catch (e: any) {
                        setMessage(e.message ?? "Something went wrong");
                      }
                    }}
                  >
                    <Text style={styles.modalConfirmText}>Confirm</Text>
                  </Pressable>
                </View>
              </>
            )}
            {pendingPosition?.step === "move" && (
              <>
                <Text style={styles.modalMessage}>Move to {pendingPosition.position}?</Text>
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setPendingPosition(null)} style={styles.modalClose}>
                    <Text style={styles.modalCloseText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalClose}
                    onPress={async () => {
                      const pos = pendingPosition.position;
                      setPendingPosition(null);
                      try {
                        await changePosition(id, pos);
                        const updated = await getGame(id);
                        if (updated) setPlayers([...updated.players]);
                        setMessage("Position updated");
                      } catch (e: any) {
                        setMessage(e.message ?? "Something went wrong");
                      }
                    }}
                  >
                    <Text style={styles.modalConfirmText}>Confirm</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={showCancelConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelConfirm(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalMessage}>Leave the game?</Text>
            {!isGameHost &&(
              <Text style={styles.modalSubMessage}>Refunds are processed within 3–5 business days.</Text>
            )}
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowCancelConfirm(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>Stay</Text>
              </Pressable>
              <Pressable
                style={styles.modalClose}
                onPress={async () => {
                  setShowCancelConfirm(false);
                  try {
                    await leaveGame(id);
                    const updated = await getGame(id);
                    if (updated) setPlayers([...updated.players]);
                    setMessage( isGameHost? 'Spot cancelled.':"Booking cancelled. Your refund will be processed within 3–5 business days.");
                  } catch (e: any) {
                    setMessage(e.message ?? "Something went wrong");
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "gray",
    marginBottom: 30,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  teamPositionCard: {
    marginBottom: 15,
  },
  positionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#27253F",
    marginBottom: 12,
  },
  teamPositionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  teamPositionProfileSet: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 9,
    marginRight: 12,
  },
  teamPositionProfile: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: "#ecf1f5",
    borderColor: "#ecf1f5",
    borderWidth: 1,
    marginBottom: 4,
    overflow: "hidden",
  },
  teamPositionName: {
    fontSize: 13,
    color: "#27253F",
  },
  emptySlot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySlotPlus: {
    fontSize: 22,
    color: "#9ca3af",
    fontWeight: "300",
  },
  cancelFooter: {
    marginTop: 24,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#D81159",
    textDecorationLine: "underline",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxWidth: 400,
    width: "100%",
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27253F",
  },
  modalSubMessage: {
    fontSize: 13,
    color: "gray",
    marginTop: 8,
  },
  modalClose: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  modalCloseText: {
    color: "gray",
    fontWeight: "600",
  },
  modalConfirmText: {
    color: "#D81159",
    fontWeight: "600",
  },
  modalPrimaryText: {
    color: "#D81159",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 20,
  },
});
