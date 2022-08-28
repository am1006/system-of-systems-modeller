import { createContext } from "react";

export interface UserProps {
  uri: string;
  username: string;
  password: string;
}

interface UserContextProps {
  user: UserProps;
  setUser: (user: UserProps) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: {
    uri: "",
    username: "",
    password: "",
  },
  setUser: (_: UserProps) => {},
});
