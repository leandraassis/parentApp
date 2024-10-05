import * as React from 'react';
import { Switch as Sw} from 'react-native-paper';

const Switch = (props: any) => {
  return <Sw value={props.value} onValueChange={props.onValueChange} />;
};

Switch.defaultProps = {
  value: false,
  onValueChange: () => {},
};

export default Switch;
