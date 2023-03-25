import { FavoriteData } from "@/Interface/favorite";
import { Post, UserInterface } from "@/Interface/interfaces";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const userAtom = atomWithStorage<UserInterface | undefined>('authUser',undefined)
export const myPostsAtom = atom<Post[] | undefined>(undefined);
export const ryokanAtom = atom<string | undefined>(undefined);
export const descriptionAtom = atom<string | undefined>(undefined);
export const filesAtom = atom<File[]>([]);
// export const filesAtom = atom<FileList[] | undefined>(undefined);

export const selectedPlaceAtom = atom<string>('');

export const myFavoritesAtom = atom<FavoriteData[]>([]);