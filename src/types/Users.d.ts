export interface User {
  _id?: string;
  name: string;
  email: string;
  contact: string;
  profileImage: string;
  address: {
    address: string;
    district: string;
    state: string;
    pincode: string;
  };
  password: string;
  role: "admin" | "farmer" | "user" | "delivery";
  isApproved: boolean;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  stock: number;
  category: string;
  price: number;
  imageUrl: string;
  ownerId?: string; // Refers to the Farmer (User)
  status: "pending" | "approved" | "rejected";
  isOrganic?: boolean;
  unit?: string;
}

export interface Order {
  _id?: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}
