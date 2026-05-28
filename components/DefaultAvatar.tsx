import { StyleSheet, Text, View } from "react-native";

const PALETTE = [
    { bg: '#FFD6E0', text: '#A8003B' },  // rose
    { bg: '#D6EAFF', text: '#0057A8' },  // blue
    { bg: '#D6F5E3', text: '#006B35' },  // green
    { bg: '#FFE9CC', text: '#A85000' },  // orange
    { bg: '#E8D6FF', text: '#5B00A8' },  // purple
    { bg: '#D6F5F5', text: '#006B6B' },  // teal
    { bg: '#FFF0CC', text: '#A87000' },  // amber
    { bg: '#FFD6F0', text: '#A8005B' },  // pink
];

function getColor(name: string) {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return PALETTE[hash % PALETTE.length];
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
