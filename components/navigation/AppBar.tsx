import { router } from "expo-router";
import { Appbar, useTheme } from "react-native-paper";

const AppBar = (props: any) => {
    const theme = useTheme();
    return <Appbar.Header
        style={{
            backgroundColor: theme.colors.secondary,
        }}
    >
        {
            props.back ? <Appbar.BackAction onPress={() => router.back()} /> : null
        }
        <Appbar.Content titleStyle={{ color: 'white' }} {...props} />
        <Appbar.Action
            color={props.iconColor || 'white'}
            {...props}
        />
    </Appbar.Header>
}

export default AppBar;