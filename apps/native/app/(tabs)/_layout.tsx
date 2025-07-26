import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Gamepad, Book, Heart, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF90",
        tabBarStyle: {
          backgroundColor: "#015055",
          borderTopWidth: 0,
          height: 100,
          paddingBottom: 35,
          paddingTop: 25,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: "absolute",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Urbanist_600SemiBold",
          marginTop: 4,
        },
        headerShown: false,
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-3 rounded-2xl ${focused ? "bg-white/20" : ""}`}>
              <Home
                size={30}
                color={color}
                fill={focused ? color : "transparent"}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-3 rounded-2xl ${focused ? "bg-white/20" : ""}`}>
              <Gamepad
                size={30}
                color={color}
                fill={focused ? color : "transparent"}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lectures"
        options={{
          title: "Stories",
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-3 rounded-2xl ${focused ? "bg-white/20" : ""}`}>
              <Book
                size={30}
                color={color}
                fill={focused ? color : "transparent"}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-3 rounded-2xl ${focused ? "bg-white/20" : ""}`}>
              <Heart
                size={30}
                color={color}
                fill={focused ? color : "transparent"}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View className={`p-3 rounded-2xl ${focused ? "bg-white/20" : ""}`}>
              <User
                size={30}
                color={color}
                fill={focused ? color : "transparent"}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}