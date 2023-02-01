import { Post, UserInterface } from "interfaces";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const userAtom = atomWithStorage<UserInterface | undefined>('authUser',undefined)
export const myPostsAtom = atom<Post[] | undefined>(undefined);