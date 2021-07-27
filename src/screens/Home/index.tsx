import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useActions } from "../../hooks/actions";

import { SearchBar } from "../../components/SearchBar";
import { LoginDataItem } from "../../components/LoginDataItem";

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage,
} from "./styles";
import { Button } from "../../components/Form/Button";
import { View } from "react-native";

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const { getLogins, resetLogins } = useActions();
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const logins = await getLogins();

    if (logins) {
      setSearchListData(logins);
      setData(logins);
    }
    // Get asyncStorage data, use setSearchListData and setData
  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function handleResetLogins() {
    await resetLogins();

    setSearchListData([]);
    setData([]);
  }

  function handleFilterLoginData(search: string) {
    if (search) {
      const filteredData = data.filter((item) => item.title.includes(search));

      if (filteredData) {
        setSearchListData(filteredData);
      }
    }

    // Filter results inside data, save with setSearchListData
  }

  return (
    <Container>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SearchBar
          placeholder="Pesquise pelo nome do serviço"
          onChangeText={(value) => handleFilterLoginData(value)}
          style={{ width: "79%" }}
        />

        <Button
          style={{ marginTop: 46, marginLeft: 6, paddingHorizontal: 5 }}
          title="Limpar"
          onPress={handleResetLogins}
        />
      </View>

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        }
        renderItem={({ item: loginData }) => {
          return (
            <LoginDataItem
              title={loginData.title}
              email={loginData.email}
              password={loginData.password}
            />
          );
        }}
      />
    </Container>
  );
}
