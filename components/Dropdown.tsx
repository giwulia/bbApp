import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props<T extends string> = {
    options: T[];
    selected: T | null;
    onSelect: (v: T) => void;
    placeholder?: string;
};

export default function Dropdown<T extends string>({ options, selected, onSelect, placeholder }: Props<T>) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
                <Text style={[styles.value, !selected && styles.placeholder]}>
                    {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : placeholder ?? 'Select...'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="gray" />
            </Pressable>
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
                <View style={styles.menu}>
                    {options.map(opt => (
                        <Pressable
                            key={opt}
                            style={styles.option}
                            onPress={() => { onSelect(opt); setOpen(false); }}
                        >
                            <Text style={[styles.optionText, selected === opt && styles.optionTextSelected]}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </Text>
                            {selected === opt && <Ionicons name="checkmark" size={16} color="#D81159" />}
                        </Pressable>
                    ))}
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
        paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    value: { fontSize: 14, color: '#27253F' },
    placeholder: { color: 'silver' },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    menu: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16,
        paddingVertical: 12, paddingHorizontal: 20,
    },
    option: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    },
    optionText: { fontSize: 15, color: '#27253F' },
    optionTextSelected: { color: '#D81159', fontWeight: '600' },
});
