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

const { width, heigth } = Dimensions.get("screen");

export default function App() {
	const [users, setUsers] = useState(usersArray);

	const swipe = useRef(new Animated.ValueXY()).current;
	const titlSign = useRef(new Animated.Value(1)).current;

	const panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: () => true,

		onPanResponderMove: (_, { dx, dy, y0 }) => {
			swipe.setValue({ x: dx, y: dy });
			titlSign.setValue(y0 > (heigth * 0.9) / 2 ? 1 : -1);
		},

		onPanResponderRelease: (_, { dx, dy }) => {
			const direction = Math.sign(dx);
			const isActionActive = Math.abs(dx) > 100;

			if (isActionActive) {
				Animated.timing(swipe, {
					// durasi untuk animasi swipe foto nya
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

	// remove the top card from the users array
	const removeTopCard = useCallback(() => {
		setUsers((prevState) => prevState.slice(1));
		swipe.setValue({ x: 0, y: 0 });
	},[swipe]);

	// handle user choice (left or right)
	const handleChoice = useCallback((direction) => {
		Animated.timing(swipe.x,{
			toValue: direction * 500,
			duration:400,
			useNativeDriver: true
		}).start(removeTopCard)
	}, [removeTopCard,swipe.x])

	useEffect(() => {
		if (!users.length) {
			setUsers(usersArray);
		}
	}, [users.length]);

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				backgroundColor: "white",
			}}
		>
			<StatusBar hidden={true} />
			{users
				.map(
					({ name, image, location, distance, age }, index) => {
						const isFirst = index === 0;
						console.log(isFirst);
						const dragHandlers = isFirst
							? panResponder.panHandlers
							: {};
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
								titlSign={titlSign}
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
