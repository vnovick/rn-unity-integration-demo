import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {UnityView} from './components/UnityView';
import ColorPicker from 'react-native-wheel-color-picker';

interface IMessage {
  gameObject: string;
  methodName: string;
  message: string;
}

const Unity = () => {
  const [msgFromUnity, setMsgFromUnity] = useState('');
  const [renderColorPicker, setRenderColorPicker] = useState(false);
  const [msgToUnity, setMsgToUnity] = useState('');
  const [isAREnabled, setIsAREnabled] = useState(false);
  const [isARStarted, setIsARStarted] = useState(false);
  const [currentColor, setCurentColor] = useState('#36ffff');
  const [isLit, setisLit] = useState(false);
  const [started, setStarted] = useState(false);
  const unityRef = useRef<UnityView>();
  const message = useMemo<IMessage>(
    () => ({
      gameObject: 'RNInterop',
      methodName: 'MessageFromRN',
      message: JSON.stringify({
        message: msgToUnity,
        colorHex: currentColor,
      }),
    }),
    [currentColor, msgToUnity],
  );

  useEffect(() => {
    if (unityRef && unityRef.current) {
      // @ts-ignore
      unityRef.current.postMessage(
        message.gameObject,
        message.methodName,
        message.message,
      );
    }
  }, [message]);

  const lightitUp = useCallback(() => {
    if (unityRef && unityRef.current) {
      Keyboard.dismiss();
      unityRef.current.postMessage(
        message.gameObject,
        'EnhanceUnityFromRN',
        '',
      );
      setisLit(!isLit);
    }
  }, [isLit, message.gameObject]);

  const level = useMemo(
    () => (started ? 'SampleScene' : 'Playground'),
    [started],
  );

  useEffect(() => {
    if (started) {
      setIsAREnabled(true);
    }
  }, [started]);

  const toggleGame = useCallback(() => {
    if (unityRef && unityRef.current) {
      unityRef.current.postMessage(message.gameObject, 'LoadLevel', level);
      setisLit(false);
      setMsgFromUnity('');
      setStarted(!started);
    }
  }, [message.gameObject, level, started]);

  const toggleAR = useCallback(() => {
    if (unityRef && unityRef.current) {
      unityRef.current.postMessage(
        message.gameObject,
        'LoadLevel',
        isARStarted ? 'SampleScene' : 'AROcclusion',
      );
      setisLit(false);
      setMsgFromUnity('');
      setIsARStarted(!isARStarted);
    }
  }, [message.gameObject, isARStarted]);

  const onColorChange = (value: any) => setCurentColor(value);

  useEffect(() => {
    setTimeout(() => {
      setRenderColorPicker(true);
    }, 500);
  }, []);

  return (
    <View style={styles.flexOne}>
      <UnityView
        // @ts-ignore
        ref={unityRef}
        style={styles.flexOne}
        onUnityMessage={(result: any) =>
          setMsgFromUnity(msgFromUnity + result.nativeEvent.message)
        }
      />
      <KeyboardAvoidingView
        style={!started ? styles.rnView : {}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{borderBottomWidth: 1, backgroundColor: 'yellow'}}>
          <Text>React Native View</Text>
        </View>

        <ScrollView contentContainerStyle={{padding: 20}}>
          {!started ? (
            <>
              <View>
                <Text>{msgFromUnity}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  value={msgToUnity}
                  onChangeText={setMsgToUnity}
                  style={styles.input}
                />
                <Button
                  onPress={() => {
                    setMsgFromUnity('');
                    setMsgToUnity('');
                    Keyboard.dismiss();
                  }}
                  title="Clear"
                />
              </View>
              {renderColorPicker ? (
                <ColorPicker
                  color={currentColor ?? '#ffffff'}
                  onColorChange={onColorChange}
                  thumbSize={40}
                  sliderSize={40}
                  noSnap={true}
                  row={true}
                />
              ) : null}
            </>
          ) : null}

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {!started ? (
              <Button
                onPress={lightitUp}
                title={!isLit ? 'Light it up' : 'Dim it down'}
              />
            ) : null}
            {isLit || (started && !isAREnabled) ? (
              <Button
                onPress={toggleGame}
                title={started ? 'Back' : 'Open Game'}
              />
            ) : null}
            {isAREnabled ? (
              <Button
                onPress={toggleAR}
                title={isARStarted ? 'Back' : 'Open AR'}
              />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  rnView: {
    flex: 1,
    top: 0,
    bottom: 0,
    zIndex: 999,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    flex: 1,
  },
});

export default Unity;
