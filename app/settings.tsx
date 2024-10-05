import { TopBar, Grid, RadioGroup, Radio, Button } from '../components';
import { useEffect, useState } from "react";
import { useSession } from "./ctx";
import { Text } from 'react-native-paper';

export default function SettingsScreen() {
    const { changeTheme, theme, } = useSession();
    const [valueChecked, setValueChecked] = useState('1');

    useEffect(() => {
        changeTheme(valueChecked)
    }, [valueChecked]);

    useEffect(() => {
        // @ts-ignore
        setValueChecked(theme === null ? "auto" : theme);
    }, []);

    useEffect(() => {
        console.log("Tema atualizado:", theme);
    }, [theme]);

    return <Grid>
        <TopBar
            title="Settings"
            back={true}
            menu={false} />
        <Grid style={{
            height: '100%',
            marginTop: 30,
        }}>
            <Text style={{
                fontSize: 20,
                color: '#6C48C5',
                fontWeight: 'bold'
            }}>Escolha o tema de sua preferência: </Text>
            <Grid>
                <RadioGroup>
                    <Radio
                        valueChecked={valueChecked}
                        setValueChecked={setValueChecked}
                        radios={[
                            { value: "auto", label: "Automático" },
                            { value: "light", label: "Light" },
                            { value: "dark", label: "Dark" },
                        ]} />
                </RadioGroup>
            </Grid>
        </Grid>
    </Grid>
}