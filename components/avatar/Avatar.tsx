import * as React from 'react';
import { Avatar as Av } from "react-native-paper";

//@ts-ignore
const Avatar = (props: AvatarProps) => {
    //@ts-ignore
    return props.source ? 
    <Av.Image style={{ ...props.style, backgroundColor: props.bgcolor }} {...props} /> : 
    <Av.Text style={{ ...props.style, backgroundColor: props.bgcolor }} {...props} />;
};

Avatar.defaultProps = {
    source: null,
    label: ':)',
    bgcolor: 'transparent'
}

export default Avatar;