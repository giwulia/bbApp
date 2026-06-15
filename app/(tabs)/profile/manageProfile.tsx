import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, PlayerPositions, SkillLevel, PlayerGender } from "@/src/api/types";
import { useState } from "react";
import { updateUser } from "@/src/api/client";
import * as ImagePicker from 'expo-image-picker';
import DefaultAvatar from "@/components/DefaultAvatar";
import Dropdown from "@/components/Dropdown";

const positions: PlayerPositions[] = ["setter", "outside", "middle", "opposite", "libero"];
const skillLevels: SkillLevel[] = ["beginner", "intermediate", "advanced", "competitive"];
const genders: PlayerGender[] = ["male", "female"];

export default function ManageProfile() {
    const router = useRouter();
    const { user: userJSON } = useLocalSearchParams<{ user: string }>();
    const user: User = JSON.parse(userJSON);

    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [mainRole, setMainRole] = useState<PlayerPositions | null>(user.main_role);
    const [offRole, setOffRole] = useState<PlayerPositions | null>(user.off_role);
    const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skill_level);
    const [gender, setGender] = useState<PlayerGender>(user.gender);
    const [image, setImage] = useState<string | null>(user.image);
    const [saving, setSaving] = useState(false);

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    }

    async function handleSave() {
        if (saving) return;
        setSaving(true);
        try {
            await updateUser({ name, username, main_role: mainRole, off_role: offRole, skill_level: skillLevel, gender, image });
            router.back();
        } finally {
            setSaving(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#27253F" />
                </Pressable>
                <Text style={styles.headerTitle}>Manage Profile</Text>
                <Pressable onPress={handleSave} disabled={saving}>
                    <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
                        {saving ? 'Saving...' : 'Save'}
                    </Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <Pressable onPress={pickImage} style={styles.avatarWrapper}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatar} />
                        ) : (
                            <DefaultAvatar name={name || user.name} size={90} fontSize={30} />
                        )}
                        <View style={styles.avatarEditBadge}>
                            <Ionicons name="camera" size={14} color="white" />
                        </View>
                    </Pressable>
                </View>

                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Full name"
                    placeholderTextColor="silver"
                />

                <Text style={styles.fieldLabel}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor="silver"
                    autoCapitalize="none"
                />

                <Text style={styles.fieldLabel}>Main Position</Text>
                <Dropdown options={positions} selected={mainRole} onSelect={setMainRole} placeholder="Select position" />

                <Text style={styles.fieldLabel}>Off Position</Text>
                <Dropdown options={positions} selected={offRole} onSelect={setOffRole} placeholder="Select position" />

                <Text style={styles.fieldLabel}>Skill Level</Text>
                <Dropdown options={skillLevels} selected={skillLevel} onSelect={setSkillLevel} placeholder="Select level" />

                <Text style={styles.fieldLabel}>Gender</Text>
                <Dropdown options={genders} selected={gender} onSelect={setGender} placeholder="Select gender" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27253F',
    },
    saveButton: {
        fontSize: 15,
        fontWeight: '600',
        color: '#D81159',
    },
    saveButtonDisabled: {
        color: 'silver',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarWrapper: {
        width: 90,
        height: 90,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#D81159',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#27253F',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        marginTop: 24,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#27253F',
    },
    dropdownTrigger: {
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownValue: {
        fontSize: 14,
        color: '#27253F',
    },
    dropdownPlaceholder: {
        color: 'silver',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dropdownMenu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownOptionSelected: {
        backgroundColor: 'transparent',
    },
    dropdownOptionText: {
        fontSize: 15,
        color: '#27253F',
    },
    dropdownOptionTextSelected: {
        color: '#D81159',
        fontWeight: '600',
    },
});
