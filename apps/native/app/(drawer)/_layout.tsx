import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity, Alert } from "react-native";

import { HeaderButton } from "@/components/header-button";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth-context";

const DrawerLayout = () => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut
        },
      ]
    );
  };

  return (
    <AuthGuard>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: "DeenQuest",
            drawerLabel: "Home",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerTitle: "DeenQuest",
            drawerLabel: "Learning",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleSignOut} className="mr-4">
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              </TouchableOpacity>
            ),
          }}
        />
      </Drawer>
    </AuthGuard>
  );
};

export default DrawerLayout;
