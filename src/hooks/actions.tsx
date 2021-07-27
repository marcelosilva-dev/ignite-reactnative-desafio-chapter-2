// DESCULPEM PELOS TIPO ANY, FIZ COM PRESSA ;(

import React, { ReactNode, useContext, useState, useEffect } from "react";
import { createContext } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

interface ActionsProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  getLogins(): Promise<any>;
  saveLogins(userLogged: any): Promise<any>;
  resetLogins(): Promise<any>;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

const ActionsContext = createContext({} as AuthContextData);

function ActionsProvider({ children }: ActionsProviderProps) {
  async function saveLogins(newLoginData: any): Promise<any> {
    const dataKey = `@passmanager:logins`;

    const data = await AsyncStorage.getItem(dataKey);
    const currentData = data ? JSON.parse(data) : [];

    const dataFormatted = [...currentData, newLoginData];

    try {
      if (dataFormatted) {
        await AsyncStorage.setItem(
          "@passmanager:logins",
          JSON.stringify(dataFormatted)
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLogins(): Promise<any> {
    try {
      const dataKey = `@passmanager:logins`;
      const response = await AsyncStorage.getItem(dataKey);
      const logins = response ? JSON.parse(response) : [];

      if (logins.length > 0) {
        const loginsFormatted: LoginDataProps[] = logins.map(
          (item: LoginDataProps) => {
            return {
              id: item.id,
              title: item.title,
              email: item.email,
              password: item.password,
            };
          }
        );

        if (loginsFormatted) {
          return loginsFormatted;
        }
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function resetLogins() {
    await AsyncStorage.removeItem("@passmanager:logins");
  }

  return (
    <ActionsContext.Provider
      value={{
        getLogins,
        saveLogins,
        resetLogins,
      }}
    >
      {children}
    </ActionsContext.Provider>
  );
}

function useActions() {
  const context = useContext(ActionsContext);

  return context;
}

export { ActionsProvider, useActions };
