Sure, here is the README in English:

---

# Tinder Card Slider

This project is an implementation of a "Card Slider" similar to Tinder, built using React Native Expo. Users can swipe cards left or right to indicate interest or disinterest, with animations managed by React Native Animated.

## Features

- Smooth card swipe animations.
- Cards return to the initial position if not swiped far enough.
- Animations to remove cards from the screen when swiped.
- Cards are reshuffled when all cards are swiped.

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/tsaqiffatih/Tinder-Card-Slider.git
   ```

2. Navigate to the project directory:
   ```sh
   cd Tinder-Card-Slider
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

4. Run the project:
   ```sh
   npx expo start
   ```

## Directory Structure

```
|-- assets            # image assets for dummy data user card
|
|-- components
|   |-- Button.js
|   |-- Card.js       # Component for individual cards
|   |-- Choice.js
|   |-- Footer.js     # Component for footer with action buttons
|-- utils
|   |-- data.js       # Dummy data for user cards
|-- App.js            # Main file that renders the app
```

## Main Code

```javascript
import { StatusBar } from "expo-status-bar";
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { users as usersArray } from "./utils/data";
import { useCallback, useEffect, useRef, useState } from "react";
import Card from "./components/Card";
import Footer from "./components/Footer";

const { width, height } = Dimensions.get("screen");

export default function App() {
    const [users, setUsers] = useState(usersArray);

    const swipe = useRef(new Animated.ValueXY()).current;
    const tiltSign = useRef(new Animated.Value(1)).current;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: (_, { dx, dy, y0 }) => {
            swipe.setValue({ x: dx, y: dy });
            tiltSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
        },

        onPanResponderRelease: (_, { dx, dy }) => {
            const direction = Math.sign(dx);
            const isActionActive = Math.abs(dx) > 100;

            if (isActionActive) {
                Animated.timing(swipe, {
                    duration: 100,
                    toValue: {
                        x: direction * 500,
                        y: dy,
                    },
                    useNativeDriver: true,
                }).start(removeTopCard);
            } else {
                Animated.spring(swipe, {
                    toValue: {
                        x: 0,
                        y: 0,
                    },
                    useNativeDriver: true,
                    friction: 5,
                }).start();
            }
        },
    });

    const removeTopCard = useCallback(() => {
        setUsers((prevState) => prevState.slice(1));
        swipe.setValue({ x: 0, y: 0 });
    }, [swipe]);

    const handleChoice = useCallback((direction) => {
        Animated.timing(swipe.x, {
            toValue: direction * 500,
            duration: 400,
            useNativeDriver: true,
        }).start(removeTopCard);
    }, [removeTopCard, swipe.x]);

    useEffect(() => {
        if (!users.length) {
            setUsers(usersArray);
        }
    }, [users.length]);

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            {users
                .map(
                    ({ name, image, location, distance, age }, index) => {
                        const isFirst = index === 0;
                        const dragHandlers = isFirst ? panResponder.panHandlers : {};
                        return (
                            <Card
                                key={name}
                                name={name}
                                location={location}
                                distance={distance}
                                age={age}
                                image={image}
                                isFirst={isFirst}
                                swipe={swipe}
                                tiltSign={tiltSign}
                                {...dragHandlers}
                            />
                        );
                    }
                )
                .reverse()}
            <Footer handleChoice={handleChoice} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },
});
```

## Contributors

- tsaqiffatih

## License

This project is licensed under the [MIT License](LICENSE).

---
