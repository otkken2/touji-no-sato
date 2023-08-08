import { FavoriteData } from "@/Interface/favorite";
import { Post, PreviewFilesInterface, UserInterface } from "@/Interface/interfaces";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const userAtom = atomWithStorage<UserInterface | undefined>('authUser',undefined)
export const myPostsAtom = atom<Post[] | undefined>(undefined);
export const descriptionAtom = atomWithStorage<string | undefined>('description',undefined);
export const selectedPlaceAtom = atomWithStorage<string>('ryokan','');

export const filesAtom = atom<File[]>([]);
export const previewsAtom = atomWithStorage<PreviewFilesInterface[]>('newSelectedPreviews',[]);
export const newSelectedFileSizeMBAtom = atom<number>(0);
// export const existingFilesSizeMBAtom = atomWithStorage<number>('existingFileSizeMBAtom',0);
export const existingFilesSizeMBAtom = atom<number>(0);

export const latAtom = atom<number>(0);
export const lngAtom = atom<number>(0);


export const myFavoritesAtom = atom<FavoriteData[]>([]);

export const showReplyFormAtom = atom<boolean>(false);

// export const bathingDayAtom = atomWithStorage<string | undefined>('bathingDay',undefined);
export const bathingDayAtom = atom<string | undefined>(undefined);

export const infoBalloonAtom = atom<string>('');
export const isErrorAtom = atom<boolean>(false);
export const timelimitAtom = atom<number>(3000);