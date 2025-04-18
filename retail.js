// retail.js
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

// Place new order
export async function placeOrder(orderData) {
  const orderRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return orderRef.id;
}

// Get order history for current user
export async function getOrderHistory(userId) {
  const q = query(collection(db, "orders"), where("customerId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get delivery status for orders
export async function getDeliveryStatus(orderIds) {
  const q = query(collection(db, "deliveries"), where("orderId", "in", orderIds));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get payment history for current user
export async function getPaymentHistory(userId) {
  const orders = await getOrderHistory(userId);
  const orderIds = orders.map(order => order.id);
  
  if (orderIds.length === 0) return [];
  
  const q = query(collection(db, "payments"), where("orderId", "in", orderIds));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}