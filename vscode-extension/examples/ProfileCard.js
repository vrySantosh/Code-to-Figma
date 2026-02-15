"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileCard = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProfileCard = () => {
    return (<react_native_1.View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            width: 327,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12
        }}>
      <react_native_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16
        }}>
        <react_native_1.Image source={{ uri: 'https://via.placeholder.com/60' }} style={{
            width: 60,
            height: 60,
            borderRadius: 30
        }}/>
        <react_native_1.View style={{ marginLeft: 16, flex: 1 }}>
          <react_native_1.Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#000000'
        }}>
            John Doe
          </react_native_1.Text>
          <react_native_1.Text style={{
            fontSize: 14,
            color: '#666666',
            marginTop: 4
        }}>
            Product Designer
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
      
      <react_native_1.Text style={{
            fontSize: 14,
            color: '#333333',
            lineHeight: 20,
            marginBottom: 20
        }}>
        Passionate about creating beautiful and functional user experiences. 
        Love to explore new design trends.
      </react_native_1.Text>
      
      <react_native_1.TouchableOpacity style={{
            backgroundColor: '#667eea',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center'
        }}>
        <react_native_1.Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600'
        }}>
          View Profile
        </react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
};
exports.ProfileCard = ProfileCard;
//# sourceMappingURL=ProfileCard.js.map