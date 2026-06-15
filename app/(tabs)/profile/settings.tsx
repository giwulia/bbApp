import DefaultAvatar from "@/components/DefaultAvatar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "@/src/api/types";
import { getUser, updateUser } from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";
import * as ImagePicker from 'expo-image-picker';

export default function Settings() {
    const router = useRouter();
    const { user: authUser, logout } = useAuth();

    const { user: userJSON } = useLocalSearchParams<{ user: string }>();
    const [user, setUser] = useState<User>(JSON.parse(userJSON));

    useFocusEffect(useCallback(() => {
        if (!authUser) return;
        getUser(authUser.id).then(u => { if (u) setUser(u); });
    }, [authUser?.id]));

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setUser(u => ({ ...u, image: uri }));
            await updateUser({ image: uri });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#27253F" />
                </Pressable>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <View style={styles.profileInfo}>
                <Pressable onPress={pickImage} style={styles.avatarWrapper}>
                    {user.image ? (
                        <Image source={{ uri: user.image }} style={styles.profilePicture} />
                    ) : (
                        <DefaultAvatar name={user.name} size={90} fontSize={26}/>
                    )}
                    <View style={styles.editPicButton}>
                        <Ionicons name="camera" size={14} color="white" />
                    </View>
                </Pressable>
                <Text style={{fontWeight:'500'}}>{user.username}</Text>
            </View>
            <View style={styles.layout}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.sectionContainer}>
                    <Pressable style={styles.settingRow} onPress={() => router.push({ pathname: '/profile/manageProfile', params: { user: JSON.stringify(user) } })}>
                        <Ionicons name="person-outline" size={18} color="#27253F" />
                        <Text style={styles.settingText}>Manage Profile</Text>
                        <Ionicons name="chevron-forward" size={16} color="gray" style={styles.settingArrow} />
                    </Pressable>
                    <View style={styles.divider}/>
                    <Pressable style={styles.settingRow} onPress={() => router.push('/profile/passwordSecurity')}>
                        <Ionicons name="lock-closed-outline" size={18} color="#27253F" />
                        <Text style={styles.settingText}>Password & Security</Text>
                        <Ionicons name="chevron-forward" size={16} color="gray" style={styles.settingArrow} />
                    </Pressable>
                </View>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.sectionContainer}>
                    <Pressable style={styles.settingRow}>
                        <Ionicons name="language-outline" size={18} color="#27253F" />
                        <Text style={styles.settingText}>Language</Text>
                        <Ionicons name="chevron-forward" size={16} color="gray" style={styles.settingArrow} />
                    </Pressable>
                    <View style={styles.divider}/>
                    <Pressable style={styles.settingRow}>
                        <Ionicons name="notifications-outline" size={18} color="#27253F" />
                        <Text style={styles.settingText}>Notifications</Text>
                        <Ionicons name="chevron-forward" size={16} color="gray" style={styles.settingArrow} />
                    </Pressable>
                </View>
            </View>
            <Pressable style={styles.logOutRow} onPress={logout}>
                <Ionicons name="log-out-outline" size={18} color="#D81159" />
                <Text style={styles.logOutText}>Log out</Text>
            </Pressable>
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
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27253F',
    },
    layout:{
        padding:20
    },
    avatarWrapper: {
        width: 90,
        height: 90,
    },
    profileInfo:{
        flexDirection:'column',
        alignItems:'center',
        paddingVertical: 17,
    },
    profilePicture: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    sectionTitle:{
        fontSize: 20,
        fontWeight: '500',
        color: '#27253F',
        marginBottom:15
    },
    editPicButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D81159',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer:{
        backgroundColor:'#f7f7f9',
        borderRadius:14,
        padding:20,
        marginBottom:30
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingArrow: {
        marginLeft: 'auto',
    },
    settingText:{
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical:15
    },
    defaultAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    defaultAvatarText: {
        fontSize: 30,
        fontWeight: '300',
        color: '#57547a',
    },
    logOutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 'auto',
        paddingBottom: 20,
    },
    logOutText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#D81159',
    },
});
