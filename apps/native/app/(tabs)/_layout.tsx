import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Home, Gamepad, Book, Heart, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF60",
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 30,
          paddingTop: 15,
          paddingHorizontal: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          elevation: 25,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.3,
          shadowRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Urbanist_600SemiBold",
          marginTop: 6,
          letterSpacing: 0.5,
        },
        headerShown: false,
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              overflow: 'hidden',
            }}
          >
            {/* Base background */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: '#015055',
              }}
            />
            {/* Gradient overlay */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            />
            {/* Top highlight */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center justify-center" style={{ transform: [{ scale: focused ? 1.1 : 1 }] }}>
              <View className={`p-2.5 rounded-xl transition-all duration-200 ${focused ? "bg-white/15" : ""}`}>
                <Home
                  size={22}
                  color={focused ? "#FFFFFF" : "#FFFFFF90"}
                  fill={focused ? "rgba(255,255,255,0.15)" : "transparent"}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 opacity-90" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center justify-center" style={{ transform: [{ scale: focused ? 1.1 : 1 }] }}>
              <View className={`p-2.5 rounded-xl transition-all duration-200 ${focused ? "bg-white/15" : ""}`}>
                <Gamepad
                  size={22}
                  color={focused ? "#FFFFFF" : "#FFFFFF90"}
                  fill={focused ? "rgba(255,255,255,0.15)" : "transparent"}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 opacity-90" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lectures"
        options={{
          title: "Stories",
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center justify-center" style={{ transform: [{ scale: focused ? 1.1 : 1 }] }}>
              <View className={`p-2.5 rounded-xl transition-all duration-200 ${focused ? "bg-white/15" : ""}`}>
                <Book
                  size={22}
                  color={focused ? "#FFFFFF" : "#FFFFFF90"}
                  fill={focused ? "rgba(255,255,255,0.15)" : "transparent"}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 opacity-90" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center justify-center" style={{ transform: [{ scale: focused ? 1.1 : 1 }] }}>
              <View className={`p-2.5 rounded-xl transition-all duration-200 ${focused ? "bg-white/15" : ""}`}>
                <Heart
                  size={22}
                  color={focused ? "#ef4444" : "#FFFFFF90"}
                  fill={focused ? "#ef4444" : "transparent"}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 opacity-90" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center justify-center" style={{ transform: [{ scale: focused ? 1.1 : 1 }] }}>
              <View className={`p-2.5 rounded-xl transition-all duration-200 ${focused ? "bg-white/15" : ""}`}>
                <User
                  size={22}
                  color={focused ? "#FFFFFF" : "#FFFFFF90"}
                  fill={focused ? "rgba(255,255,255,0.15)" : "transparent"}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
              {focused && (
                <View className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 opacity-90" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}