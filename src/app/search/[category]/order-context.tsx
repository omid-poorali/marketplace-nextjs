'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";
import { OrderDialog } from "./OrderDialog";
import { Routes } from "@/constants";
import * as Models from "@/models";
import * as APIs from "@/apis";


const initialDialogState = {
    open: false,
    defaultValues: {}
}

type OrderDialog = {
    open: boolean;
    defaultValues: Partial<Models.NewOrder>;
}

type OrderContext = {
    createOrder: (newOrder: Models.NewOrder["product"]) => void;
};

const orderContext = createContext({} as OrderContext);

type PropsType = {
    children: any;
}

export const OrderProvider = (props: PropsType) => {

    const { children } = props;

    const router = useRouter();

    const [dialog, setDialog] = useState<OrderDialog>(initialDialogState);

    const createOrder: OrderContext["createOrder"] = product => {
        setDialog(() => ({
            open: true,
            defaultValues: {
                product
            }
        }))
    };

    const handleClose = () => {
        setDialog(() => initialDialogState)
    }

    const handleSubmit = (data: Models.NewOrder) => {
        APIs.orders.createOrder(data).then(() => {
            setDialog(() => initialDialogState);
            router.replace(Routes.ORDERS)
        });
    }

    return (

        <orderContext.Provider
            value={{
                createOrder
            }}>

            {children}
            {dialog.defaultValues.product && (
                <OrderDialog
                    open={dialog.open}
                    defaultValues={dialog.defaultValues}
                    onClose={handleClose}
                    onSubmit={handleSubmit} />
            )}
        </orderContext.Provider>

    );
};

/**
 * A react hook that enables you to have access to order context.
 * @returns Object that contains order information and methods to change them.
 */
export const useOrder = () => {
    const context = useContext(orderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within a OrderProvider');
    }
    return context;
};
