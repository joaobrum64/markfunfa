import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './navigation/StackNavigator';


export default function ModalScreen() {
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    
    <View style={styles.container}>
    
      <Text style={styles.titulo}>This is a modal</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Registrar')}

        style={styles.botaoHome}
      >
        
        <Text style={styles.botaoHomeText}>Home</Text>
      
      </TouchableOpacity>
    
    </View>
  
  );
}


const styles = StyleSheet.create({

  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20},

  titulo: {fontSize: 24, fontWeight: 'bold'},

  botaoHome: {marginTop: 15, paddingVertical: 15},

  botaoHomeText: {color: 'blue', fontSize: 16},
  
});
