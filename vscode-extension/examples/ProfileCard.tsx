import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export const ProfileCard = () => {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: 327,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/60' }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30
          }}
        />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#000000'
          }}>
            John Doe
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666666',
            marginTop: 4
          }}>
            Product Designer
          </Text>
        </View>
      </View>
      
      <Text style={{
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
        marginBottom: 20
      }}>
        Passionate about creating beautiful and functional user experiences. 
        Love to explore new design trends.
      </Text>
      
      <TouchableOpacity style={{
        backgroundColor: '#667eea',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center'
      }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600'
        }}>
          View Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};
