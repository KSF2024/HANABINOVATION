import React, { createContext, ReactNode } from 'react';
import { useModal, ModalWrapperProps } from 'react-hooks-use-modal';

type ModalData = {
    Modal: React.FC<ModalWrapperProps<Record<string, unknown>>>,
    openModal: () => void,
    closeModal: () => void,
}

const initialData: ModalData = {
    Modal: {} as any,
    openModal: () => {},
    closeModal: () => {}
};

export const ModalContext = createContext<ModalData>(initialData);

export function ModalProvider({children}: {children: ReactNode}){
    const [Modal, openModal, closeModal, isOpenModal] = useModal('modal-root', {
        preventScroll: true,
        focusTrapOptions : { 
            clickOutsideDeactivates : false
        }
    });

    return (
        <ModalContext.Provider value={{Modal, openModal, closeModal}}>
            {children}
        </ModalContext.Provider>
    );
}
