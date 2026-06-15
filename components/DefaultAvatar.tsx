import { StyleSheet, Text, View } from "react-native";

const AVATAR_COLOR = { bg: '#C8D8E8', text: '#27253F' };

function getColor(_name: string) {
    return AVATAR_COLOR;
}

export default function DefaultAvatar({ name, size, fontSize }: {
    name: string;
    size?: number;
    fontSize?: number;
}) {
    const safeName = name?.trim() || '?';
    const parts = safeName.split(" ");
    const initials = (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0]).toUpperCase();
    const color = getColor(safeName);

    return (
        <View style={[
            styles.defaultAvatar,
            { backgroundColor: color.bg },
            size ? { width: size, height: size, borderRadius: size / 2 } : null,
        ]}>
            <Text style={[styles.defaultAvatarText, { color: color.text }, fontSize ? { fontSize } : null]}>
                {initials}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    defaultAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    defaultAvatarText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
