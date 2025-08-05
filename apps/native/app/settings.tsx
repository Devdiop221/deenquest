import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Sun, Monitor, Type, Palette, Download } from 'lucide-react-native';
import { useTheme } from '../lib/theme-context';
import { useThemeColors } from '../lib/use-theme-colors';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const colors = useThemeColors();

  // Force hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const fontSizeOptions = [
    { value: 14, label: 'Small' },
    { value: 16, label: 'Medium' },
    { value: 18, label: 'Large' },
    { value: 20, label: 'Extra Large' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Custom Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
erRadius: 20,
              backgroundColor: colors.cardBackground,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color={colors.text} strokeWidth={2.5} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontFamily: 'SpaceGrotesk_600SemiBold',
              color: colors.text,
            }}
          >
            Settings
          </Text>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: 24 }}>
          {/* Appearance Section */}
          <View style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Palette size={24} color={colors.primary} />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'SpaceGrotesk_600SemiBold',
                  color: colors.text,
                  marginLeft: 12,
                }}
              >
                Appearance
              </Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Urbanist_500Medium',
                color: colors.text,
                marginBottom: 12,
              }}
            >
              Theme
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = theme === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setTheme(option.value as any)}
                    style={{
                      flex: 1,
                      marginRight: option.value !== 'system' ? 8 : 0,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      alignItems: 'center',
                    }}
                  >
                    <IconComponent
                      size={20}
                      color={isSelected ? '#ffffff' : colors.text}
                      strokeWidth={2}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Urbanist_500Medium',
                        color: isSelected ? '#ffffff' : colors.text,
                        marginTop: 4,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Urbanist_500Medium',
                color: colors.text,
                marginBottom: 12,
              }}
            >
              Font Size
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {fontSizeOptions.map((option) => {
                const isSelected = fontSize === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setFontSize(option.value)}
                    style={{
                      width: '48%',
                      marginRight: option.value === 14 || option.value === 18 ? '4%' : 0,
                      marginBottom: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      alignItems: 'center',
                    }}
                  >
                    <Type
                      size={option.value}
                      color={isSelected ? '#ffffff' : colors.text}
                      strokeWidth={2}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Urbanist_500Medium',
                        color: isSelected ? '#ffffff' : colors.text,
                        marginTop: 4,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Offline Section */}
          <View style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Download size={24} color={colors.primary} />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'SpaceGrotesk_600SemiBold',
                  color: colors.text,
                  marginLeft: 12,
                }}
              >
                Offline Access
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Urbanist_500Medium',
                    color: colors.text,
                  }}
                >
                  Download Content
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Urbanist_400Regular',
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  Access quizzes and stories offline
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Urbanist_600SemiBold',
                    color: '#ffffff',
                  }}
                >
                  Sync Now
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
            }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Urbanist_400Regular',
                  color: colors.textSecondary,
                }}
              >
                Last synced: Never • Status: Online
              </Text>
            </View>
          </View>

          {/* Preview Section */}
          <View style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'SpaceGrotesk_600SemiBold',
                color: colors.text,
                marginBottom: 16,
              }}
            >
              Preview
            </Text>

            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
            }}>
              <Text
                style={{
                  fontSize: fontSize,
                  fontFamily: 'SpaceGrotesk_600SemiBold',
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Sample Quiz Question
              </Text>
              <Text
                style={{
                  fontSize: fontSize - 2,
                  fontFamily: 'Urbanist_400Regular',
                  color: colors.textSecondary,
                  lineHeight: (fontSize - 2) * 1.5,
                }}
              >
                This is how text will appear with your current settings. The font size and theme will be applied throughout the app.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}