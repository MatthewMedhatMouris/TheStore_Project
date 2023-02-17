import ProductDetails from "./productDetails";


type OrderDetails = {
    order_id?: string;
    d_date: Date;
    n_total_price: number;
    s_user_name: string;
    b_status: boolean;
    productDetails: ProductDetails[];
};

export default OrderDetails;