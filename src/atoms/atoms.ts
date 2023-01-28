import { UserInterface } from "interfaces";
import { atom } from "jotai";

export const userAtom = atom<UserInterface | undefined>(undefined)