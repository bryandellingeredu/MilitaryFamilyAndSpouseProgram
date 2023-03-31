import { createContext, useContext} from "react";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";

interface Store{
    modalStore: ModalStore
    commonStore: CommonStore
}

export const store: Store = {
    modalStore: new ModalStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}