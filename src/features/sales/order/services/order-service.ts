import { MOCK_ORDERS } from "../mocks/order-mocks";
import { Order } from "../models/order";

export class OrderService {
    static async getOrderById(id: string): Promise<Order | undefined> {
        // Simulating API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_ORDERS.find(o => o.id === id));
            }, 500);
        });
    }

    static async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_ORDERS.filter(o => o.customerId === customerId));
            }, 500);
        });
    }
}
