// This service encapsulates all API calls to the backend
// Pattern: Session cookie + token endpoint (no JWT in localStorage)

const API_BASE_URL = '/api';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
}

export interface EnrichedOrder extends Order {
  unitPrice: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  email: string;
}

export interface UserInfoResponse {
  email: string;
  message: string;
}

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ===== Session Authentication Service =====
export const authService = {
  // Login with session cookie
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/session/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  // Logout and clear session
  logout: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/session/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  // Get current user info
  me: async (): Promise<UserInfoResponse> => {
    const response = await fetch(`${API_BASE_URL}/session/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  // Get access token for a specific audience
  getAccessToken: async (audience: string = 'new-ui'): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/session/token?aud=${audience}`, {
      method: 'POST',
      credentials: 'include'
    });

    if (response.status === 401) {
      clearTokenCache();
      throw new Error('Not authenticated');
    }

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    return response.json();
  }
};

// ===== Token Cache (in-memory only, no localStorage) =====
interface CachedToken {
  token: string;
  expiresAt: number;
}

const tokenCache: Record<string, CachedToken> = {};

// Helper to check if token is expired or expiring soon (5 minutes buffer)
const isTokenExpired = (expiresAt: number): boolean => {
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minutes
  return now >= expiresAt - bufferMs;
};

// Get or refresh access token
export const getAccessToken = async (audience: string = 'new-ui'): Promise<string> => {
  const cached = tokenCache[audience];

  // Return cached token if still valid
  if (cached && !isTokenExpired(cached.expiresAt)) {
    return cached.token;
  }

  // Fetch new token
  const response = await authService.getAccessToken(audience);
  const expiresAt = Date.now() + response.expiresIn * 1000;

  tokenCache[audience] = {
    token: response.accessToken,
    expiresAt
  };

  return response.accessToken;
};

// Clear token cache (e.g., on logout)
export const clearTokenCache = (): void => {
  Object.keys(tokenCache).forEach(key => delete tokenCache[key]);
};

// ===== Orders Service =====
export const ordersService = {
  getOrders: async (): Promise<Order[]> => {
    const token = await getAccessToken('new-ui');

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.status === 401) {
      clearTokenCache();
      throw new Error('Not authenticated');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  getEnrichedOrders: async (): Promise<EnrichedOrder[]> => {
    const token = await getAccessToken('new-ui');

    const response = await fetch(`${API_BASE_URL}/orders/enrich`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.status === 401) {
      clearTokenCache();
      throw new Error('Not authenticated');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch enriched orders');
    }

    return response.json();
  }
};

// ===== Error Handling Utility =====
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

