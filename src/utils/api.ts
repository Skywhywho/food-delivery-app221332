const API_BASE_URL = 'http://localhost/food-delivery-app/api';

export interface LoginData {
  phone?: string;
  email?: string;
}

export interface RegisterData {
  full_name: string;
  phone: string;
  email?: string;
}

export interface Client {
  client_id: number;
  full_name: string;
  phone: string;
  email?: string;
  address?: Address;
}

export interface Address {
  address_id: number;
  street: string;
  house_number: string;
  apartment?: string;
  entrance?: string;
  floor?: number;
}

export interface Courier {
  courier_id: number;
  full_name: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive' | 'busy';
}

export const api = {
  async login(data: LoginData) {
    const response = await fetch(`${API_BASE_URL}/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },

  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  },

  async getStreets(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/addresses.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch streets');
    }
    
    const data = await response.json();
    return data.addresses.map((addr: { street: string }) => addr.street);
  },

  async getAddressesByStreet(street: string): Promise<Address[]> {
    const response = await fetch(`${API_BASE_URL}/addresses.php?street=${encodeURIComponent(street)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }
    
    const data = await response.json();
    return data.addresses;
  },

  async updateClientAddress(clientId: number, addressId: number) {
    const response = await fetch(`${API_BASE_URL}/addresses.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        address_id: addressId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update address');
    }
    
    return response.json();
  },

  async getCouriers(): Promise<Courier[]> {
    const response = await fetch(`${API_BASE_URL}/couriers.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch couriers');
    }
    
    const data = await response.json();
    return data.couriers;
  },
}; 