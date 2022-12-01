import * as React from 'react';
import {Button, View, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

const Main = ({navigation}: NativeStackScreenProps<any>) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Unity Screen</Text>
      <Button
        title="Go to Unity"
        onPress={() => navigation.navigate('Unity')}
      />
    </View>
  );
};

export default Main;
