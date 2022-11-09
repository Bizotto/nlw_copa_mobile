import { Heading, useToast, VStack } from 'native-base';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useState } from 'react';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export function Find() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: 'Código invalido',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post('/pools/join', { code });
      navigate('pools');

      toast.show({
        title: 'Voce entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === 'Pool not found.') {
        toast.show({
          title: 'Bolão nao encontrado.',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      if (
        error.response?.data?.message === 'You have already joined this pool.'
      ) {
        toast.show({
          title: 'Você já está participando desse bolão.',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      toast.show({
        title: 'Algo deu errado, tente novamente.',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily={'heading'}
          color="white"
          fontSize="xl"
          textAlign="center"
          mb={8}
        >
          Encontre um bolão através de seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão"
          autoCapitalize="characters"
          onChangeText={setCode}
          clearButtonMode="always"
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
