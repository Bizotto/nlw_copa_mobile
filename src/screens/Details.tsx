import { HStack, useToast, VStack } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading';
import { api } from '../services/api';
import { poolCardProps } from '../../components/PoolCard';
import { PoolHeader } from '../../components/PoolHeader';
import { EmptyMyPoolList } from '../../components/EmptyMyPoolList';
import { Guesses } from '../../components/Guesses';
import { Option } from '../../components/Option';
import { Share } from 'react-native';

interface RouteParams {
  id: string;
}

export function Details() {
  const [isSelected, setIsSelected] = useState<'guess' | 'ranking'>('guess');
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<poolCardProps>(
    {} as poolCardProps
  );
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleCodeShare() {
    await Share.share({
      message: `Olha o código do meu bolão: ${poolDetails.code}`,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="guess"
              isSelected={isSelected === 'guess'}
              onPress={() => setIsSelected('guess')}
            />
            <Option
              title="ranking"
              isSelected={isSelected === 'ranking'}
              onPress={() => setIsSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
