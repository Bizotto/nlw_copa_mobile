import { Button as ButtonNativeBase, Text } from 'native-base';

interface Props {
  title: string;
}

export function Button({ title }: Props) {
  return (
    <ButtonNativeBase>
      <Text>{title}</Text>
    </ButtonNativeBase>
  );
}
