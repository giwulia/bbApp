import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteGame, editGame, getGame } from "../../../src/api/client";
import type { Category, GameResponse } from "../../../src/api/types";

function parseTimeString(hms: string): Date {
  const [h, m, s] = hms.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, s ?? 0, 0);
  return d;
}

export default function EditGame() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const [game, setGame] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [location, setLocation] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [pricePerSpot, setPricePerSpot] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [preset, setPreset] = useState("None");
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  const presetOptions = ["None", "5:1"];
  const presetConfig: Record<string, Category[]> = {
    "5:1": [
      { position: "setter", slots: 2 },
      { position: "outside", slots: 4 },
      { position: "libero", slots: 2 },
      { position: "opposite", slots: 2 },
      { position: "middle", slots: 2 },
    ],
  };
  const spotsSelected = categories.reduce((t, c) => t + c.slots, 0);
  const totalSpotsVerified = spotsSelected === Number(totalSpots);

  useEffect(() => {
    (async () => {
      const data = await getGame(id);
      if (!data) return;
      setGame(data);
      setImage(data.img ?? null);
      setTitle(data.title);
      setDescription(data.description ?? '');
      setDate(new Date(data.date));
      setStartTime(parseTimeString(data.start_time));
      setEndTime(parseTimeString(data.end_time));
      setLocation(data.location);
      setLocationUrl(data.location_url ?? "");
      setPricePerSpot(String(data.price_per_spot));
      setTotalSpots(String(data.total_spots));
      if (data.position_slots) {
        setCategories(
          Object.entries(data.position_slots).map(([position, slots]) => ({ position, slots: slots ?? 0 })),
        );
        setPreset("5:1");
      }
      setLoading(false);
    })();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!game || !date || !startTime || !endTime) return;
    setSaving(true);
    try {
      editGame(id, {
        title,
        description,
        date: date.toISOString().split("T")[0],
        start_time: startTime.toTimeString().split(" ")[0],
        end_time: endTime.toTimeString().split(" ")[0],
        location,
        location_url: locationUrl,
        price_per_spot: Number(pricePerSpot),
        total_spots: Number(totalSpots),
        type: game.type,
        level_required: game.level_required,
        gender: game.gender,
        position_slots:
          categories.length > 0
            ? categories.reduce<Record<string, number>>(
                (acc, c) => ({ ...acc, [c.position.toLowerCase()]: c.slots }),
                {},
              )
            : null,
        reserved_spots: game.reserved_spots,
        template_id: null,
        img: image ?? undefined,
      });
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert("Cancel Game", "This will cancel the game for all players. Are you sure?", [
      { text: "Keep Game", style: "cancel" },
      {
        text: "Cancel Game",
        style: "destructive",
        onPress: () => {
          deleteGame(id);
          router.replace("/search");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="lightblue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Cover photo */}
      <Pressable style={styles.coverPhoto} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <Text style={styles.coverPhotoLabel}>TAP TO UPLOAD COVER PHOTO</Text>
        )}
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={16} color="white" />
        </View>
      </Pressable>

      {/* Back button */}
      <Pressable style={[styles.backButton, { top: top + 8 }]} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="white" />
      </Pressable>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>GAME TITLE</Text>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputText}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter name"
            placeholderTextColor="silver"
          />
        </View>

        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.inputBar, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your session"
          placeholderTextColor="silver"
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>DATE</Text>
        <Pressable style={styles.inputBar} onPress={() => setShowDatePicker(!showDatePicker)}>
          <Text style={[styles.inputText, { color: date ? "#444" : "silver" }]}>
            {date ? date.toLocaleDateString("en-GB") : "DD/MM/YYYY"}
          </Text>
        </Pressable>
        {showDatePicker && (
          <View style={{ marginBottom: 18 }}>
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              onChange={(_, selected) => {
                setShowDatePicker(false);
                if (selected) setDate(selected);
              }}
            />
          </View>
        )}

        <Text style={styles.label}>START & END TIME</Text>
        <View style={styles.row}>
          <Pressable style={[styles.inputBar, { flex: 1 }]} onPress={() => setShowStartPicker(!showStartPicker)}>
            <Text style={[styles.inputText, { color: startTime ? "#444" : "silver" }]}>
              {startTime ? startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "HH:MM"}
            </Text>
          </Pressable>
          <View style={{ width: 10 }} />
          <Pressable style={[styles.inputBar, { flex: 1 }]} onPress={() => setShowEndPicker(!showEndPicker)}>
            <Text style={[styles.inputText, { color: endTime ? "#444" : "silver" }]}>
              {endTime ? endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "HH:MM"}
            </Text>
          </Pressable>
        </View>
        {showStartPicker && (
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Pressable onPress={() => setShowStartPicker(false)}>
                <Text style={styles.timePickerCancel}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => setShowStartPicker(false)}>
                <Text style={styles.timePickerDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={startTime ?? new Date()}
              mode="time"
              display="spinner"
              onChange={(event, selected) => {
                if (Platform.OS === "android") {
                  setShowStartPicker(false);
                  if (event.type === "set" && selected) setStartTime(selected);
                } else {
                  if (selected) setStartTime(selected);
                }
              }}
            />
          </View>
        )}
        {showEndPicker && (
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Pressable onPress={() => setShowEndPicker(false)}>
                <Text style={styles.timePickerCancel}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => setShowEndPicker(false)}>
                <Text style={styles.timePickerDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={endTime ?? new Date()}
              mode="time"
              display="spinner"
              onChange={(event, selected) => {
                if (Platform.OS === "android") {
                  setShowEndPicker(false);
                  if (event.type === "set" && selected) setEndTime(selected);
                } else {
                  if (selected) setEndTime(selected);
                }
              }}
            />
          </View>
        )}

        <Text style={styles.label}>LOCATION</Text>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputText}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter Venue"
            placeholderTextColor="silver"
          />
        </View>

        <Text style={styles.label}>GOOGLE MAPS URL</Text>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputText}
            value={locationUrl}
            onChangeText={setLocationUrl}
            placeholder="https://"
            placeholderTextColor="silver"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>PRICE PER SPOT (£)</Text>
            <View style={styles.inputBar}>
              <TextInput
                style={styles.inputText}
                value={pricePerSpot}
                onChangeText={setPricePerSpot}
                keyboardType="numeric"
                placeholder="£00.00"
                placeholderTextColor="silver"
              />
            </View>
          </View>
          <View style={{ width: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>TOTAL SPOTS</Text>
            <View style={styles.inputBar}>
              <TextInput
                style={styles.inputText}
                value={totalSpots}
                onChangeText={setTotalSpots}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="silver"
              />
            </View>
          </View>
        </View>

        <Text style={styles.label}>PRESET</Text>
        <Pressable style={styles.inputBar} onPress={() => setShowPresetDropdown(!showPresetDropdown)}>
          <Text style={[styles.inputText, { flex: 1 }]}>{preset}</Text>
          <Ionicons name={showPresetDropdown ? "chevron-up" : "chevron-down"} size={16} color="silver" />
        </Pressable>
        {showPresetDropdown && (
          <View style={styles.dropdown}>
            {presetOptions.map((option) => (
              <Pressable
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  setPreset(option);
                  setShowPresetDropdown(false);
                  if (option === "None") {
                    setCategories([]);
                  } else {
                    setCategories(presetConfig[option].map((c) => ({ ...c })));
                  }
                }}
              >
                <Text style={[styles.inputText, { flex: 1 }]}>{option}</Text>
                {preset === option && <Ionicons name="checkmark" size={16} color="#D81159" />}
              </Pressable>
            ))}
          </View>
        )}

        {categories.length > 0 && (
          <View style={styles.categoryBox}>
            {categories.map((cat, i) => (
              <View key={i}>
                {i > 0 && <View style={styles.categoryDivider} />}
                <View style={styles.categoryRow}>
                  <Text style={styles.categoryPosition}>
                    {cat.position.charAt(0).toUpperCase() + cat.position.slice(1)}
                  </Text>
                  <View style={styles.slotControl}>
                    <Ionicons name="person" size={14} color="gray" />
                    <View style={styles.slotBox}>
                      <Pressable
                        style={styles.slotButton}
                        onPress={() =>
                          setCategories((prev) =>
                            prev.map((c, idx) => (idx === i ? { ...c, slots: Math.max(0, c.slots - 1) } : c)),
                          )
                        }
                        disabled={cat.slots === 0}
                      >
                        <Ionicons
                          name="remove"
                          size={16}
                          color="#444"
                          style={{ opacity: cat.slots === 0 ? 0.3 : 1 }}
                        />
                      </Pressable>
                      <Text style={styles.slotCount}>{cat.slots}</Text>
                      <Pressable
                        style={styles.slotButton}
                        onPress={() =>
                          setCategories((prev) => prev.map((c, idx) => (idx === i ? { ...c, slots: c.slots + 1 } : c)))
                        }
                      >
                        <Ionicons name="add" size={16} color="#444" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <Text style={[styles.spotsHint, totalSpotsVerified ? { color: "green" } : { color: "#EA580C" }]}>
              {`Positions selected ${spotsSelected}/${totalSpots}`}
            </Text>
          </View>
        )}

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel Game</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  coverPhoto: {
    width: "100%",
    height: 220,
    backgroundColor: "rgb(117,117,118)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverPhotoLabel: {
    color: "white",
    fontWeight: "500",
    fontSize: 15,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 16,
    padding: 6,
  },
  backButton: {
    position: "absolute",
    left: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#A8A8B8",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8ED",
    paddingHorizontal: 0,
    marginBottom: 22,
  },
  inputText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "400",
    flex: 1,
  },
  multiline: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
  },
  timePickerContainer: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 18,
    overflow: "hidden",
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  timePickerCancel: {
    fontSize: 14,
    color: "dimgray",
  },
  timePickerDone: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D81159",
  },
  saveButton: {
    backgroundColor: "#D81159",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#D81159",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdown: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryBox: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    marginBottom: 18,
  },
  categoryDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryPosition: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
    flex: 1,
  },
  slotControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slotBox: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    width: 90,
    height: 30,
    paddingHorizontal: 4,
    backgroundColor: "#f7f7f7",
  },
  slotButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slotCount: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  spotsHint: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "right",
  },
});
